"use strict";
function blockedEnrollmentLevels(rows,program,now=Date.now()){
 const today=new Date(now).toISOString().slice(0,10);
 const language=String(program||"german").toLowerCase().replace(/^kiswahili$/,"swahili");
 const validDate=d=>typeof d==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(Date.parse(d))&&new Date(d).toISOString().slice(0,10)===d;
 return [...new Set((Array.isArray(rows)?rows:[]).filter(r=>{
  if(!r||r.program!==language||!["A1","A2","B1","B2","C1","C2"].includes(r.level)||!["active","expired","completed"].includes(r.status))return false;
  if(validDate(r.contractEnd)&&r.contractEnd<today)return true;
  return r.status!=="completed"&&typeof r.balanceDue==="number"&&Number.isFinite(r.balanceDue)&&r.balanceDue>0&&validDate(r.paymentDeadline)&&r.paymentDeadline<today;
 }).map(r=>r.level))];
}
async function enrollmentRows(ref,transaction=null){if(!ref)return [];const query=ref.collection("levelEnrollments");const snap=await (transaction?transaction.get(query):query.get());return snap.docs.map(d=>d.data());}
function ownsEnrollmentProfile(match,identity){const profile=match?.data||match?.snap?.data();return !!profile&&!!identity?.uid&&(profile.uid===identity.uid||(!profile.uid&&match.snap?.id===identity.uid));}
function practiceLevel(req,profile){const path=String(req.path||"");const direct=path.match(/(?:^|[\/-])([abc][12])(?=[\/-]|$)/i)?.[1];const body=req.body||{},query=req.query||{};const explicit=[body.assignmentKey,body.assignmentId,query.assignmentKey,query.assignmentId,body.mockId,query.mockId,body.level,query.level].map(v=>String(v||"").match(/^([abc][12])(?=[\s-]|$)/i)?.[1]).filter(Boolean);return [...new Set([direct,...explicit].filter(Boolean).map(v=>v.toUpperCase()).concat(!direct&&!explicit.length?[String(profile.level||"").toUpperCase()]:[]))];}
function practiceBlocked(req,profile,rows,now=Date.now()){if(req.method==="GET"&&req.path==="/exam-room/results")return false;const blocked=blockedEnrollmentLevels(rows,profile.program||"german",now);return practiceLevel(req,profile).some(level=>blocked.includes(level));}
module.exports={blockedEnrollmentLevels,enrollmentRows,ownsEnrollmentProfile,practiceBlocked};
