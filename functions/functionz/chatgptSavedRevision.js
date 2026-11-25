"use strict";
const crypto=require("crypto");
const {revisionAccess,permitted,pairsFromVocabulary,loadDictionary}=require("./chatgptPersonalRevision");
const {enrollmentRows}=require("./levelEnrollmentAccess");
const {examTool}=require("./chatgptMockReview");
const {getAssignmentSummary}=require("./routes/scoresSummaryCoursePlan");
const TOOLS=new Set(["get_my_falowen_assignment_correction","get_my_falowen_vocabulary_review","save_my_falowen_vocabulary_review","get_my_falowen_exam_recommendations"]);
const LEVELS=["A1","A2","B1","B2","C1","C2"];
const text=(v,max=500)=>typeof v==="string"?v.trim().slice(0,max):"";
const hash=v=>crypto.createHash("sha256").update(v).digest("hex");
const deny=message=>({available:false,message});
const DAY=86400000, MAX_ITEMS=100;
const keyFor=(term,meaning)=>hash(JSON.stringify([term,meaning])).slice(0,32);
const score=v=>typeof v==="number"&&Number.isFinite(v)&&v>=0&&v<=100;
function germanCorrection(rows,level,assignmentId,dual){
  const lessons=getAssignmentSummary(level).lessons.filter(l=>l.submissionRequired&&l.assignmentId);
  const canonical=new Map(lessons.map(l=>[String(l.assignmentId).toUpperCase(),l]));
  const results=(Array.isArray(rows)?rows:[]).filter(r=>{
    const program=text(r.program).toLowerCase(),id=text(r.assignment_id||r.assignmentId).toUpperCase();
    return text(r.level).toUpperCase()===level&&canonical.has(id)&&
      (program==="german"||(!program&&!dual))&&r.scoreRecorded===true&&score(r.score)&&
      (!assignmentId||id===assignmentId);
  }).map(r=>({assignmentId:text(r.assignment_id||r.assignmentId).toUpperCase(),score:r.score,feedback:text(r.comments,3000),date:text(r.date,50)}));
  // Do not guess which attempt is current when dates cannot be ordered.
  return results.slice(-5).reverse().map(r=>({...r,day:canonical.get(r.assignmentId).dayNumber,title:canonical.get(r.assignmentId).title}));
}
function swahiliCorrection(work,review,uid){
  if(work?.status!=="submitted"||!review||review.studentId!==uid)return null;
  const submitted=work.submittedAt;
  if(review.submissionVersion){
    if(!submitted||review.submissionVersion!==submitted.seconds+":"+submitted.nanoseconds)return null;
  }else{
    const a=submitted?.toMillis?.(),b=review.reviewedAt?.toMillis?.();
    if(!Number.isFinite(a)||!Number.isFinite(b)||b<a)return null;
  }
  if(!text(review.feedback)&&!score(review.score))return null;
  return {feedback:text(review.feedback,3000),score:score(review.score)?review.score:null};
}
function applyReview(state,entries,requestId,now){
  const items=Object.fromEntries(Object.entries(state?.items||{}).filter(([k,v])=>/^[a-f0-9]{32}$/.test(k)&&v&&Number.isFinite(v.lastReviewedAt)&&v.lastReviewedAt>now-180*DAY));
  const requests=(state?.requests||[]).filter(r=>r&&typeof r.id==="string").slice(-20);
  const digest=hash(JSON.stringify(entries));
  const previous=requests.find(r=>r.id===requestId);
  if(previous)return previous.digest===digest?{duplicate:true}:{error:"Request ID already used for different review results."};
  for(const e of entries){
    const key=keyFor(e.term,e.meaning),p=items[key];
    const streak=e.outcome==="remembered"?Math.min(5,(p?.streak||0)+1):0;
    const interval=e.outcome==="again"?0:e.outcome==="hard"?1:[0,1,3,7,14,30][streak];
    items[key]={term:e.term,meaning:e.meaning,day:e.day??null,streak,lastReviewedAt:now,dueAt:now+interval*DAY,outcome:e.outcome};
  }
  const trimmed=Object.entries(items).sort((a,b)=>b[1].lastReviewedAt-a[1].lastReviewedAt).slice(0,MAX_ITEMS);
  return {items:Object.fromEntries(trimmed),requests:[...requests,{id:requestId,digest}].slice(-20)};
}
function dueReview(state,now,limit,dayOnly){
  const items=Object.values(state?.items||{}).filter(v=>v&&Number.isFinite(v.lastReviewedAt)&&v.lastReviewedAt>now-180*DAY&&(!dayOnly||v.day===dayOnly));
  return {dueCount:items.filter(v=>v.dueAt<=now).length,total:items.length,
    items:items.filter(v=>v.dueAt<=now).sort((a,b)=>a.dueAt-b.dueAt).slice(0,limit).map(v=>({term:v.term,meaning:v.meaning,day:v.day,outcome:v.outcome,dueAt:new Date(v.dueAt).toISOString()}))};
}
function recommendations(attempt,minutes){
  const skills={lesen:"Lesen",hoeren:"Hören",schreiben:"Schreiben",sprechen:"Sprechen"};
  const rows=Object.entries(attempt?.sectionScores||{}).filter(([k,v])=>skills[k]&&typeof v==="number"&&v>=0&&v<=25).sort((a,b)=>a[1]-b[1]);
  if(!rows.length)return {basis:"No selected verified result",priorities:[],plan:[{minutes,activity:"Choose a published practice paper and establish a baseline; select a verified result for personalised recommendations."}]};
  const focus=rows.slice(0,2),first=focus.length===1?minutes:Math.ceil(minutes*0.6);
  const tasks={lesen:"Repeat reading questions and justify each answer from the passage.",hoeren:"Replay the official recording in Campus and review missed questions.",schreiben:"Write an original response and use recorded feedback to revise it.",sprechen:"Practise an oral task with the interactive examiner and retry weak responses."};
  return {basis:"Selected verified mock result",priorities:rows.map(([k,v])=>({skill:skills[k],points:v,maxPoints:25})),plan:focus.map(([k],i)=>({skill:skills[k],minutes:i===0?first:minutes-first,activity:tasks[k]}))};
}
async function coachTool({name,args={},student,admin,uid,snapshot,loadScores,dual=false,canWrite=false}){
  if(student?.data?.uid&&student.data.uid!==uid)return deny("Identity could not be verified.");
  if(name==="get_my_falowen_exam_recommendations"){
    const minutes=args.minutes??30;
    if(!Number.isInteger(minutes)||minutes<15||minutes>120)return deny("Choose 15–120 minutes.");
    const exam=await examTool({name:"get_my_falowen_exam_mocks",args:{},student,admin,uid});
    if(!exam.available)return exam;
    if(Boolean(args.mockId)!==Boolean(args.attemptId))return deny("Choose both the mock and verified attempt ID.");
    const review=args.mockId?await examTool({name:"get_my_falowen_mock_review",args:{mockId:args.mockId,attemptId:args.attemptId},student,admin,uid}):null;
    if(review&&!review.available)return review;
    return {available:true,level:exam.level,...recommendations(review?.attempt,minutes),attemptId:review?.attempt?.id||null,
      practiceUrl:review?.practiceUrl||null,availableMocks:exam.mocks.map(m=>({mockId:m.mockId,title:m.title,practiceUrl:m.practiceUrl,skills:m.chatGPTPracticeSkills})),
      guidance:"Use verified results only. Missing skills are not zero. Do not predict a pass, change grades, or reveal answers to an active timed examination. Ask the learner to choose their verified attempt if none is selected."};
  }
  const db=admin.firestore();
  const [rows,policy]=await Promise.all([enrollmentRows(db.collection("students").doc(student.id)),db.collection("courseAccountAccess").doc(uid).get()]);
  const access=revisionAccess(student.data,rows,policy.data()||{});
  const program=args.program;
  if(!["german","swahili"].includes(program))return deny("Choose German or Kiswahili.");
  const grant=access[program],level=args.level||grant?.current;
  if(!grant||!LEVELS.includes(level)||!grant.full.includes(level))return deny("Full authorised course access is required for saved revision or assignment feedback.");
  if(name==="get_my_falowen_assignment_correction"){
    let records=[];
    if(program==="german"){
      if(!["A1","A2","B1"].includes(level))return deny("This self-study level has no tutor-marked assignment export.");
      if(args.assignmentId!==undefined&&!/^[A-Z0-9._-]{3,48}$/i.test(args.assignmentId))return deny("Invalid assignment ID.");
      try{records=germanCorrection(await loadScores(),level,text(args.assignmentId).toUpperCase(),dual);}
      catch{return deny("Recorded tutor feedback is temporarily unavailable.");}
    }else{
      if(level!=="A1"||!Number.isInteger(args.day)||args.day<1||args.day>20)return deny("Choose a Kiswahili A1 workbook day.");
      const [work,review]=await Promise.all([db.collection("users").doc(uid).collection("swahiliLessons").doc("day-"+args.day).get(),db.collection("swahiliTeacherReviews").doc(uid+"_day-"+args.day).get()]);
      const result=swahiliCorrection(work.data(),review.data(),uid);
      if(result)records=[{day:args.day,...result}];
    }
    return {available:records.length>0,program,level,records,source:"Recorded tutor feedback",
      guidance:"Explain the recorded feedback without inventing the learner's original response. Ask the learner to share their own sentence, then provide a correction, explanation, and a similar original retry exercise. Do not replace recorded marks, claim a resubmission, or infer an unrecorded grade.",
      campusUrl:"https://www.falowen.app/campus/results"};
  }
  const ref=db.collection("users").doc(uid).collection("chatgptVocabularyRevision").doc(program+"-"+level);
  if(name==="get_my_falowen_vocabulary_review"){
    const result=dueReview((await ref.get()).data(),Date.now(),Math.min(20,Math.max(1,Number.isInteger(args.limit)?args.limit:10)));
    return {available:true,program,level,...result,guidance:"Quiz one saved word at a time without revealing its meaning. After the learner attempts it, optionally save their agreed self-reported outcome. No official marks."};
  }
  if(name!=="save_my_falowen_vocabulary_review")return deny("Unsupported tool.");
  if(!canWrite||args.confirmed!==true)return deny("Explicit practice-write permission and confirmation of the displayed outcomes are required. Nothing saved.");
  if(!/^[A-Za-z0-9_-]{8,80}$/.test(args.requestId||"")||!Array.isArray(args.items)||args.items.length<1||args.items.length>10)return deny("Provide a unique request ID and 1–10 reviewed words.");
  const days=program==="german"?snapshot?.levels?.[level]:snapshot?.programs?.swahili?.[level];
  let dictionary=null;const entries=[];
  for(const item of args.items){
    const term=text(item?.term,180),meaning=text(item?.meaning,300),day=item?.day;
    if(!term||!meaning||!["again","hard","remembered"].includes(item?.outcome))return deny("Invalid vocabulary outcome.");
    let candidates;
    if(day!==undefined&&day!==null){
      if(!Number.isInteger(day)||!permitted(access,program,level,day)||!days?.[String(day)])return deny("Vocabulary lesson is not authorised.");
      candidates=pairsFromVocabulary(days[String(day)].vocabulary);
    }else{
      if(program!=="german")return deny("Kiswahili vocabulary needs its lesson day.");
      try{dictionary=dictionary||await loadDictionary(snapshot?.vocabularySourceUrl);}
      catch{return deny("Vocabulary dictionary unavailable; no outcomes saved.");}
      candidates=dictionary.filter(x=>x.level===level||x.level==="ALL");
    }
    if(!candidates.some(x=>x.term===term&&x.meaning===meaning))return deny("A word does not match the authorised Falowen vocabulary source.");
    entries.push({term,meaning,day:day??null,outcome:item.outcome});
  }
  if(new Set(entries.map(e=>keyFor(e.term,e.meaning))).size!==entries.length)return deny("Review each distinct word only once per batch.");
  return db.runTransaction(async tx=>{
    const deletion=await tx.get(db.collection("accountDeletionRequests").doc(uid));
    if(["pending","processing","completed"].includes(deletion.data()?.status))return deny("Account deletion is in progress.");
    const now=Date.now(),prior=await tx.get(ref),next=applyReview(prior.data(),entries,args.requestId,now);
    if(next.error)return deny(next.error);
    if(next.duplicate)return {available:true,saved:true,alreadyProcessed:true};
    tx.set(ref,{...next,program,level,updatedAt:new Date(now),officialGrade:false});
    return {available:true,saved:true,reviewed:entries.length,...dueReview(next,now,0),clarification:"Saved optional self-reported practice only. At most 100 recently reviewed words per level are retained in the active review list; entries older than 180 days are ignored."};
  });
}
module.exports={TOOLS,germanCorrection,swahiliCorrection,applyReview,dueReview,recommendations,coachTool};
