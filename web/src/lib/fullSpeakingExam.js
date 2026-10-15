// Same existing Speaking Exam Room UI; this models multi-Teil progression.
// No extra voice sessions are created here: each section still uses the
// existing authenticated, quota-limited Live Speak routes.
export const examPartCount = level => ["B2","C1","C2"].includes(String(level||"").toUpperCase()) ? 2 : 3;
export const fullExamStorageKey = uid => "falowen.speaking.fullExam.v1:"+String(uid||"anonymous");
export function newFullSpeakingExam(level) {
  const clean=String(level||"A1").toUpperCase();
  if (!["A1","A2","B1","B2","C1","C2"].includes(clean)) return null;
  return {version:1,level:clean,currentTeil:"1",status:"in_progress",parts:[],startedAt:new Date().toISOString()};
}
export function finishFullSpeakingPart(fullExam,{level,teil,taskId,topic="",feedback="",assessment=null}={}) {
  if (!fullExam || fullExam.status!=="in_progress" || level!==fullExam.level) return fullExam;
  const number=String(teil||"").match(/\d+/)?.[0];
  if (!number || number!==fullExam.currentTeil || !String(feedback).trim() || !taskId) return fullExam;
  if (fullExam.parts.some(item=>item.teil===number)) return fullExam;
  const part={teil:number,taskId,topic:String(topic).slice(0,160),
    feedback:String(feedback).slice(0,2500),
    score:Number.isInteger(assessment?.score) ? assessment.score : null,
    maxScore:Number.isInteger(assessment?.maxScore) ? assessment.maxScore : null,
    percent:Number.isInteger(assessment?.percent) ? assessment.percent : null,
    completedAt:new Date().toISOString()};
  const parts=[...fullExam.parts,part];
  const max=examPartCount(fullExam.level);
  return {...fullExam,parts,currentTeil:number===String(max)?number:String(Number(number)+1),
    status:number===String(max) ? "complete" : "in_progress",
    ...(number===String(max)?{completedAt:new Date().toISOString()}:{} )};
}
export function fullExamSummary(fullExam) {
  const parts=fullExam?.parts||[];
  const max=examPartCount(fullExam?.level);
  const complete=fullExam?.status==="complete" && parts.length===max;
  const scored=complete && parts.every(item=>Number.isInteger(item.percent) && item.percent>=0 && item.percent<=100);
  return {complete,parts,maxParts:max,percent:scored?Math.round(parts.reduce((sum,item)=>sum+item.percent,0)/max):null};
}
export function validStoredFullExam(candidate,level="") {
  if (!candidate || candidate.version!==1 || !["in_progress","complete"].includes(candidate.status)) return null;
  if (!["A1","A2","B1","B2","C1","C2"].includes(candidate.level)) return null;
  if (level && candidate.level!==level) return null;
  if (!Array.isArray(candidate.parts) || candidate.parts.length>examPartCount(candidate.level)) return null;
  const next=String(candidate.currentTeil||"");
  if (!/^[123]$/.test(next) || Number(next)>examPartCount(candidate.level)) return null;
  return candidate;
}
