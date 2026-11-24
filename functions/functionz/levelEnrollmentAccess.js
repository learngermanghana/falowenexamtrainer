"use strict";
function enrollmentDecision(rows,program,now=Date.now()){
 const today=new Date(now).toISOString().slice(0,10);
 const language=String(program||"german").toLowerCase().replace(/^kiswahili$/,"swahili");
 const validDate=d=>typeof d==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(Date.parse(d))&&new Date(d).toISOString().slice(0,10)===d;
 const validMoney=n=>typeof n==="number"&&Number.isFinite(n)&&n>=0;
 const blocked=[],granted=[],managed=[],versions={};
 for(const r of Array.isArray(rows)?rows:[]){
  if(!r||r.program!==language||!["A1","A2","B1","B2","C1","C2"].includes(r.level))continue;
  managed.push(r.level);versions[r.level]=Number(r.sheetVersion||1);
  if(["cancelled","expired"].includes(r.status)){blocked.push(r.level);continue;}
  if(!["active","completed"].includes(r.status))continue;
  if((validDate(r.contractStart)&&r.contractStart>today)||(validDate(r.contractEnd)&&r.contractEnd<today)||(validMoney(r.balanceDue)&&r.balanceDue>0&&validDate(r.paymentDeadline)&&r.paymentDeadline<today)){blocked.push(r.level);continue;}
  if(validDate(r.contractStart)&&validDate(r.contractEnd)&&r.contractStart<=today&&r.contractEnd>=today&&validMoney(r.tuitionFee)&&validMoney(r.paid)&&validMoney(r.balanceDue)&&Math.abs(r.paid+r.balanceDue-r.tuitionFee)<.011&&(r.balanceDue===0||(r.status==="active"&&validDate(r.paymentDeadline)&&r.paymentDeadline>=today)))granted.push(r.level);
 }
 return {blocked:[...new Set(blocked)],granted:[...new Set(granted)].filter(l=>!blocked.includes(l)),managed:[...new Set(managed)],versions};
}
function blockedEnrollmentLevels(rows,program,now){return enrollmentDecision(rows,program,now).blocked;}
async function enrollmentRows(ref,transaction=null){if(!ref)return [];const query=ref.collection("levelEnrollments");const snap=await (transaction?transaction.get(query):query.get());return snap.docs.map(d=>d.data());}
function ownsEnrollmentProfile(match,identity){const profile=match?.data||match?.snap?.data();return !!profile&&!!identity?.uid&&(profile.uid===identity.uid||(!profile.uid&&match.snap?.id===identity.uid));}
function practiceLevel(req,profile){const path=String(req.path||"");const direct=path.match(/(?:^|[\/-])([abc][12])(?=[\/-]|$)/i)?.[1];const body=req.body||{},query=req.query||{};const explicit=[body.assignmentKey,body.assignmentId,query.assignmentKey,query.assignmentId,body.mockId,query.mockId,body.level,query.level].map(v=>String(v||"").match(/^([abc][12])(?=[\s-]|$)/i)?.[1]).filter(Boolean);return [...new Set([direct,...explicit].filter(Boolean).map(v=>v.toUpperCase()).concat(!direct&&!explicit.length?[String(profile.level||"").toUpperCase()]:[]))];}
function practiceBlocked(req,profile,rows,now=Date.now()){if(req.method==="GET"&&req.path==="/exam-room/results")return false;const blocked=blockedEnrollmentLevels(rows,"german",now);return practiceLevel(req,profile).some(level=>blocked.includes(level));}
module.exports={enrollmentDecision,blockedEnrollmentLevels,enrollmentRows,ownsEnrollmentProfile,practiceBlocked};
