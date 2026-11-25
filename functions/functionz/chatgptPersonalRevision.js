"use strict";
const {germanEnrollment}=require("./chatgptAssignmentSubmission");
const {enrollmentDecision,enrollmentRows}=require("./levelEnrollmentAccess");
const {resolveEntitlements}=require("./entitlementService");
const {resolveSwahiliAccess}=require("./swahiliAccess");
const {examTool}=require("./chatgptMockReview");
const LEVELS=["A1","A2","B1","B2","C1","C2"];
const TOOLS=new Set(["get_my_falowen_revision_levels","get_my_falowen_revision_lesson","get_my_falowen_personal_plan","get_my_falowen_revision_vocabulary"]);
const deny=message=>({available:false,message,campusUrl:"https://www.falowen.app/campus/account"});
const text=(v,max=300)=>typeof v==="string"?v.trim().slice(0,max):"";

function revisionAccess(profile,rows,policy={},now=Date.now()){
  if(!profile||profile.accountType==="exam_only"||policy.examOnly===true)return {};
  const german=germanEnrollment({data:profile});
  const result={};
  if(german.enrolledInGerman&&german.germanLevel){
    const current=german.germanLevel;
    const decision=enrollmentDecision(rows,"german",now);
    const managed=decision.granted.filter(l=>LEVELS.indexOf(l)<=LEVELS.indexOf(current)&&!decision.blocked.includes(l));
    // Only a verified ledger can grant previous-level material. Legacy current
    // access can use the existing paid-course policy, not a guessed prior level.
    const entitlement=resolveEntitlements({profile,now});
    const legacyCurrent=german.primaryProgram==="german"&&!decision.managed.includes(current)&&!decision.blocked.includes(current);
    const full=[...new Set([...managed,...(legacyCurrent&&entitlement.course.day2Plus===true?[current]:[])])];
    const trial=legacyCurrent&&entitlement.course.trial&&!full.includes(current)?current:null;
    if(full.length||trial)result.german={current,full,trial};
  }
  if(resolveSwahiliAccess(profile,"A1",now,policy).allowed&&!enrollmentDecision(rows,"swahili",now).blocked.includes("A1"))
    result.swahili={current:"A1",full:["A1"],trial:null};
  return result;
}
function permitted(access,program,level,day){
  const grant=access[program];
  return Boolean(grant&&(grant.full.includes(level)||(grant.trial===level&&day===1)));
}
function lessonDays(snapshot,program,level){
  return program==="german"?snapshot?.levels?.[level]||{}:snapshot?.programs?.swahili?.[level]||{};
}
function pairsFromVocabulary(v){
  const raw=Array.isArray(v)?v:[...(v?.terms||[]),...(v?.phrases||[]),...(v?.collocations||[])];
  return raw.map(x=>typeof x==="object"&&x?{term:text(x.term||x.expression||x.german,180),meaning:text(x.meaning||x.english,300)}:null)
    .filter(x=>x?.term&&x.meaning);
}
function parseDictionary(csv){
  const rows=[];let row=[],cell="",quoted=false;
  for(let i=0;i<csv.length;i++){
    const c=csv[i];
    if(c==='"'){if(quoted&&csv[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}
    else if(c===","&&!quoted){row.push(cell);cell="";}
    else if((c==="\n"||c==="\r")&&!quoted){if(c==="\r"&&csv[i+1]==="\n")i++;row.push(cell);rows.push(row);row=[];cell="";}
    else cell+=c;
  }
  if(quoted)throw Error("Invalid dictionary CSV");
  if(cell||row.length)rows.push([...row,cell]);
  const header=(rows.shift()||[]).map(v=>v.replace(/^\uFEFF/,"").trim().toLowerCase().replace(/[\s_()-]+/g,""));
  const find=names=>header.findIndex(h=>names.includes(h));
  const level=find(["level","cefr","lvl"]),de=find(["german","deutsch","wort","word"]),en=find(["english","englisch","meaning","translation"]);
  if([level,de,en].includes(-1))throw Error("Dictionary headers unavailable");
  return rows.map(r=>({level:text(r[level],5).toUpperCase()||"ALL",term:text(r[de],180),meaning:text(r[en],300)}))
    .filter(r=>[...LEVELS,"ALL"].includes(r.level)&&r.term&&r.meaning);
}
let cache=null,inflight=null;
async function loadDictionary(source,fetcher=fetch){
  // Only the build-time, existing Campus published sheet; never fetch a user URL.
  if(typeof source!=="string"||!/^https:\/\/docs\.google\.com\/spreadsheets\/d\/e\/[A-Za-z0-9_-]+\/pubhtml$/.test(source))throw Error("Dictionary source unavailable");
  if(cache?.source===source&&cache.expires>Date.now())return cache.items;
  if(inflight?.source===source)return inflight.promise;
  const promise=(async()=>{
    const response=await fetcher(source.replace(/\/pubhtml$/,"/pub?output=csv"),{signal:AbortSignal.timeout(7000)});
    if(!response.ok)throw Error("Dictionary unavailable");
    // Bound the response before parsing, including chunked responses.
    const reader=response.body?.getReader();
    if(!reader)throw Error("Dictionary response unavailable");
    const decoder=new TextDecoder();let csv="",bytes=0;
    try{for(;;){const chunk=await reader.read();if(chunk.done)break;bytes+=chunk.value.byteLength;if(bytes>2_000_000)throw Error("Dictionary too large");csv+=decoder.decode(chunk.value,{stream:true});}csv+=decoder.decode();}
    finally{await reader.cancel().catch(()=>{});}
    const items=parseDictionary(csv);
    cache={source,items,expires:Date.now()+300000};return items;
  })();
  inflight={source,promise};
  try{return await promise;}finally{if(inflight?.promise===promise)inflight=null;}
}
function selectPairs(items,query,limit){
  const q=text(query,100).toLowerCase();const seen=new Set();
  return items.filter(x=>{const k=x.term.toLowerCase();if(seen.has(k)||q&&!((x.term+" "+x.meaning).toLowerCase().includes(q)))return false;seen.add(k);return true;}).slice(0,limit);
}
function buildPlan({minutes,lesson,day,level,program,weakness,mockReview,examDate}){
  const labels={lesen:"reading",hoeren:"listening",schreiben:"writing",sprechen:"speaking"};
  const skills=Object.entries(mockReview?.attempt?.sectionScores||{}).filter(([k,v])=>labels[k]&&typeof v==="number"&&Number.isFinite(v)&&v>=0&&v<=25).sort((a,b)=>a[1]-b[1]);
  const activities=[];
  const first=Math.floor(minutes/3),second=Math.floor(minutes/3);
  const priority=skills[0]?labels[skills[0][0]]:null;
  if(priority)activities.push({minutes:first,activity:"Review the lowest recorded mock section",skill:priority,practiceUrl:mockReview.practiceUrl});
  else activities.push({minutes:first,activity:"Review the selected lesson vocabulary or grammar",skill:"vocabulary",day});
  activities.push({minutes:second,activity:"Attempt one original available lesson exercise; wait for your answer before corrections",skill:lesson.reading?"reading":lesson.writing?"writing":lesson.grammar?"grammar":"review",day});
  activities.push({minutes:minutes-first-second,activity:"Recall new expressions and produce original spoken or written sentences; revisit mistakes",skill:"review",day});
  return {available:true,program,level,day,title:lesson.title,minutes,activities,
    ...(examDate?{examDate,examDateSource:"learner supplied"}:{}),
    ...(weakness?{recordedAssignment:{assignmentId:weakness.assignmentId,score:weakness.bestRecordedScore}}:{}),
    ...(skills.length?{verifiedMock:{attemptId:mockReview.attempt.id,sectionScores:mockReview.attempt.sectionScores}}:{}),
    basis:skills.length?"Selected verified mock attempt":weakness?"Recorded tutor assignment": "Selected published lesson; completion not verified",
    guidance:"This is a suggested plan, not a verified deadline or readiness prediction. Repeat in chat; official grades, enrolments and submissions are unchanged."};
}
async function revisionTool({name,args={},student,admin,uid,snapshot,lessonContentResponse,swahiliLessonResponse,loadWeakness}){
  const db=admin.firestore();
  if(student?.data?.uid&&student.data.uid!==uid)return deny("Identity could not be verified.");
  const [rows,p]=await Promise.all([enrollmentRows(db.collection("students").doc(student.id)),db.collection("courseAccountAccess").doc(uid).get()]);
  const access=revisionAccess(student.data,rows,p.data()||{});
  if(name==="get_my_falowen_revision_levels")return {available:Object.keys(access).length>0,programs:access,clarification:"Full lists include authorised revision material only. Trial means Day 1 only. Earlier levels do not grant submission rights."};
  const program=args.program;
  if(!["german","swahili"].includes(program))return deny("Choose the programme.");
  const level=args.level||access[program]?.current;
  const grant=access[program];
  if(!grant||!LEVELS.includes(level)||(!grant.full.includes(level)&&grant.trial!==level))return deny("This level is not included in your verified course access.");
  const days=lessonDays(snapshot,program,level);
  if(name==="get_my_falowen_revision_lesson"){
    if(!Number.isInteger(args.day)||!permitted(access,program,level,args.day)||!days[String(args.day)])return deny("This lesson is not authorised or exported.");
    const result=program==="german"?lessonContentResponse(level,args.day,args.section||"overview"):swahiliLessonResponse(student,args.day,args.section||"overview");
    return {...result,program,revisionOnly:true,officialSubmission:false};
  }
  if(name==="get_my_falowen_revision_vocabulary"){
    const limit=Number.isInteger(args.limit)?Math.max(1,Math.min(20,args.limit)):10;
    let items,source;
    if(args.day!==undefined){
      if(!Number.isInteger(args.day)||!permitted(access,program,level,args.day)||!days[String(args.day)])return deny("This lesson is not authorised or exported.");
      items=pairsFromVocabulary(days[String(args.day)].vocabulary);source="Canonical Course Book lesson";
      if(!items.length)return {available:false,message:"No bilingual vocabulary list is exported for this lesson. For German full-course access, request the Campus dictionary without a day.",campusUrl:"https://www.falowen.app/campus/course"};
    }else{
      if(program!=="german"||!grant.full.includes(level))return deny("The full German Campus dictionary requires full-course access; select an authorised lesson for vocabulary.");
      try{items=(await loadDictionary(snapshot.vocabularySourceUrl)).filter(x=>x.level===level||x.level==="ALL");}catch{return deny("The existing Campus vocabulary sheet is temporarily unavailable.");}
      source="Falowen Campus vocabulary sheet";
    }
    const selected=selectPairs(items,args.query,limit);
    return {available:selected.length>0,program,level,source,items:selected,practiceOnly:true,
      guidance:"Quiz one item at a time in either translation direction. Wait for the learner's response before revealing the meaning. Repeat missed words after several other items and again in a later chat; progress is not stored."};
  }
  if(name==="get_my_falowen_personal_plan"){
    const minutes=args.minutes===undefined?30:args.minutes;
    if(!Number.isInteger(minutes)||minutes<15||minutes>120)return deny("Choose 15–120 minutes.");
    let day=args.day,weakness=null,mockReview=null;
    if(day!==undefined&&(!Number.isInteger(day)||!permitted(access,program,level,day)||!days[String(day)]))return deny("This lesson is not authorised or exported.");
    // Only fetch score sheet for a current, single-program German tutor-marked course.
    if(day===undefined&&program==="german"&&level===grant.current&&grant.full.includes(level)&&["A1","A2","B1"].includes(level)){
      try{const evidence=await loadWeakness();weakness=evidence.revisionPriorities?.find(x=>days[String(x.day)]&&permitted(access,program,level,Number(x.day)))||null;}catch{/* No grade is inferred. */}
      if(weakness)day=Number(weakness.day);
    }
    if(day===undefined)day=Object.keys(days).map(Number).filter(d=>permitted(access,program,level,d)).sort((a,b)=>a-b)[0];
    if(!days[String(day)])return deny("No authorised lesson export found.");
    if(args.mockId||args.attemptId){
      if(program!=="german"||level!==grant.current||!args.mockId||!args.attemptId)return deny("Select both the mock ID and verified attempt ID for the current German level.");
      mockReview=await examTool({name:"get_my_falowen_mock_review",args:{mockId:args.mockId,attemptId:args.attemptId},student,admin,uid});
      if(!mockReview.available)return deny("Selected verified mock result is unavailable.");
    }
    const examDate=args.examDate;
    if(examDate!==undefined&&(!/^\d{4}-\d{2}-\d{2}$/.test(examDate)||!Number.isFinite(Date.parse(examDate))||new Date(examDate).toISOString().slice(0,10)!==examDate))return deny("Use a valid exam date (YYYY-MM-DD).");
    const plan=buildPlan({minutes,lesson:days[String(day)],day,level,program,weakness,mockReview,examDate});
    return {...plan,lessonUrl:program==="german"?"https://www.falowen.app/campus/course/lesson/"+level+"/"+day:"https://www.falowen.app/campus/course/swahili/day-"+day};
  }
  return deny("Unsupported revision tool.");
}
module.exports={TOOLS,revisionAccess,permitted,pairsFromVocabulary,parseDictionary,selectPairs,buildPlan,revisionTool};
