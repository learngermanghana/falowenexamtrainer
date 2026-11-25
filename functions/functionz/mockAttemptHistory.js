"use strict";
const {buildListeningReview}=require("./mockListeningReview");
const providers={
  a1:require("./a1MockCompletionSync").getPracticeObjectiveKeys,
  a2:require("./a2MockCompletionSync").getPracticeObjectiveKeys,
  b1:require("./b1MockCompletionSync").getPracticeObjectiveKeys,
};
const validMockId=id=>typeof id==="string"&&/^(?:(?:a1|a2)-mock-0[1-8]|b1-mock-0[1-4])$/.test(id);
const validDocId=id=>typeof id==="string"&&/^[\w-]{1,150}$/.test(id);
const SKILLS=["lesen","hoeren","schreiben","sprechen"];
const PAGE_SIZE=20;
const timestamp=value=>{
  const ms=typeof value?.toMillis==="function"?value.toMillis():value instanceof Date?value.getTime():typeof value==="number"?value:Date.parse(value||"");
  return Number.isFinite(ms)&&ms>0?ms:null;
};
const finite=(v,min,max)=>typeof v==="number"&&Number.isFinite(v)&&v>=min&&v<=max;
const owned=(data,uid,mockId)=>data&&data.mockId===mockId&&(!data.uid||data.uid===uid);
function summarizeAttempt(id,data){
  const overall=data.verifiedOverall;
  const sections=Object.fromEntries(SKILLS.filter(k=>finite(data.verifiedSectionScores?.[k],0,25)).map(k=>[k,data.verifiedSectionScores[k]]));
  const verified=data.status==="completed"&&data.completionSync?.ok===true&&finite(overall?.score,0,100)&&Object.keys(sections).length>=3;
  const status=verified?"verified":data.status==="completed"||data.section==="result"?"pending":"in_progress";
  const maxPoints=Object.keys(sections).length===3?75:100;
  return {id,attemptNumber:finite(data.attemptNumber,1,Number.MAX_SAFE_INTEGER)?data.attemptNumber:null,status,
    startedAt:timestamp(data.startedAt),completedAt:timestamp(data.completedAt),
    score:verified?overall.score:null,passed:verified&&typeof overall.passed==="boolean"?overall.passed:null,
    points:verified&&finite(overall.points,0,maxPoints)?overall.points:null,maxPoints:verified?maxPoints:null,
    sectionScores:verified?sections:{},assessmentVersion:verified?(overall.assessmentVersion||data.assessmentVersion||null):null};
}
const compareAttempts=(a,b)=>(b.attemptNumber||0)-(a.attemptNumber||0)||(b.startedAt||0)-(a.startedAt||0)||a.id.localeCompare(b.id);
function collection(db,uid,mockId){
  return db.collection(mockId.slice(0,2)+"MockExamUsers").doc(uid).collection("attempts");
}
async function listMockHistory({db,uid,mockId,cursor,documentId}){
  if(!validMockId(mockId)||cursor&&!validDocId(cursor))throw Object.assign(new Error("Invalid paper or history cursor."),{status:400});
  // Equality + document ID ordering uses the existing single-field index.
  // Never read full answer payloads for the history list.
  let query=collection(db,uid,mockId).where("mockId","==",mockId).orderBy(documentId);
  if(cursor)query=query.startAfter(cursor);
  const result=await query.select("uid","mockId","attemptNumber","status","section","startedAt","completedAt","assessmentVersion","verifiedOverall","verifiedSectionScores","completionSync.ok").limit(PAGE_SIZE+1).get();
  const page=result.docs.slice(0,PAGE_SIZE);
  const attempts=page.filter(doc=>owned(doc.data(),uid,mockId)).map(doc=>summarizeAttempt(doc.id,doc.data())).sort(compareAttempts);
  return {attempts,nextCursor:result.docs.length>PAGE_SIZE?page[page.length-1].id:null};
}
function historicalReview(data,summary){
  if(summary.status!=="verified")return null;
  const keys=providers[data.mockId.slice(0,2)](data.mockId);
  const objective={};
  for(const section of ["lesen","hoeren"]){
    if(!Object.prototype.hasOwnProperty.call(summary.sectionScores,section))continue;
    const answers=data.state?.[section+"Answers"],key=keys[section];
    if(!answers||typeof answers!=="object"||!key||!Object.keys(key).length){objective[section]={rows:[],reason:"Saved answers are unavailable."};continue;}
    const rows=buildListeningReview(answers,key);
    const correct=rows.filter(row=>row.status==="correct").length;
    const stored=data.objectiveVerification?.[section];
    // Do not present a reconstructed historical review if it contradicts
    // the original recorded score or count.
    const consistent=Number((correct/rows.length*25).toFixed(1))===summary.sectionScores[section]&&(!stored||(stored.correct===correct&&stored.total===rows.length));
    objective[section]=consistent?{rows}:{rows:[],reason:"The original answer key could not be verified against this saved score."};
  }
  const clip=value=>typeof value==="string"?value.slice(0,4000):"";
  const feedbackFor=result=>{
    if(!result||typeof result!=="object")return [];
    const entries=[];
    if(clip(result.overall_feedback_en))entries.push({label:"Overall feedback",text:clip(result.overall_feedback_en)});
    const parts=result.parts|| (result.letter?{letter:result.letter}: {});
    for(const [id,part] of Object.entries(parts).slice(0,8)){
      if(!part||typeof part!=="object")continue;
      const text=clip(part.feedback_en||part.feedback);
      const corrections=Array.isArray(part.corrections)?part.corrections.slice(0,15).map(c=>typeof c==="string"?{text:clip(c)}:{original:clip(c?.original||c?.incorrect),corrected:clip(c?.corrected||c?.correction),text:clip(c?.explanation||c?.reason)}).filter(c=>c.text||c.original||c.corrected):[];
      if(text||corrections.length)entries.push({label:String(id).slice(0,40),text,corrections});
    }
    return entries;
  };
  return {objective,feedback:{schreiben:feedbackFor(data.state?.schreibenResult||data.state?.writingResult),sprechen:feedbackFor(data.state?.speakingResult)}};
}
async function getMockHistoryReview({db,uid,mockId,attemptId}){
  if(!validMockId(mockId)||!validDocId(attemptId))throw Object.assign(new Error("Invalid paper or attempt."),{status:400});
  const doc=await collection(db,uid,mockId).doc(attemptId).get();
  const data=doc.data();
  if(!doc.exists||!owned(data,uid,mockId))throw Object.assign(new Error("Attempt not found."),{status:404});
  const attempt=summarizeAttempt(doc.id,data);
  if(attempt.status!=="verified")throw Object.assign(new Error("Corrections are available only after result verification."),{status:409});
  return {attempt,...historicalReview(data,attempt)};
}
module.exports={validMockId,summarizeAttempt,historicalReview,listMockHistory,getMockHistoryReview,compareAttempts};
