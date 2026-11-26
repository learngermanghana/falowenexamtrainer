"use strict";
const {hasExamLedgerProtection} = require("../enrollmentCleanupProtection");
const DAY = 86400000;
const text = value => String(value ?? "").trim();
const norm = value => text(value).toLowerCase();
const validDate = value => {
  if (typeof value === "number" && Number.isFinite(value) && value > 30000 && value < 100000)
    return (value-25569)*DAY;
  if (!/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(text(value))) return NaN;
  return Date.parse(text(value));
};
const rowIdentity = row => ({
  code:text(row.StudentCode),uid:text(row.UID),email:norm(row.Email),
});
const identityValues = row => [row.code,row.uid,row.email].map(norm).filter(Boolean);
const overlaps = (a,b) => identityValues(a).some(value=>identityValues(b).includes(value));
const identityKey = row => JSON.stringify([row.code,row.uid,row.email]);
function dueTrial(row,now) {
  const identity = rowIdentity(row);
  const end = validDate(row.TrialEndsAt), purge = validDate(row.TrialPurgeAt);
  return norm(row.Status)==="trial_expired" &&
    (row.Paid===0 || /^0(?:\.0+)?$/.test(text(row.Paid))) &&
    !text(row.TrialConvertedAt) && identity.code && identity.uid &&
    ![identity.code,identity.uid].some(value=>value.includes("/")) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity.email) &&
    Number.isFinite(end) && Number.isFinite(purge) && purge>=end+30*DAY && now>=purge;
}
function eligibleRows(rows,now) {
  return rows.filter(row=>{
    if(!dueTrial(row,now))return false;
    const identity=rowIdentity(row);
    return rows.filter(other=>overlaps(identity,rowIdentity(other))).length===1;
  }).map(row=>({...rowIdentity(row),rowNumber:row.rowNumber}));
}
function protectedBySheet(candidate,rows) {
  return rows.some(row=>overlaps(candidate,{
    code:row["Student Code"],uid:row["Student ID"],email:row.Email||row.email,
  }));
}
async function absentAuth(auth,method,value) {
  try {await auth[method](value); return false;}
  catch(error){if(error?.code==="auth/user-not-found")return true;throw error;}
}
async function noBackendAccount({db,auth,candidate,examProtection=hasExamLedgerProtection}) {
  const {code,uid,email}=candidate;
  const students=db.collection("students");
  const ids=[...new Set([code,uid])];
  const codeVariants=[...new Set([code,code.toLowerCase(),code.toUpperCase()])];
  const queries=[
    ...ids.map(id=>students.doc(id).get()),
    ...["studentCode","studentcode"].map(field=>students.where(field,"in",codeVariants).limit(1).get()),
    students.where("uid","==",uid).limit(1).get(),
    ...["email","authEmail","emailIdentity"].map(field=>students.where(field,"==",email).limit(1).get()),
  ];
  if((await Promise.all(queries)).some(snap=>snap.exists===true||snap.empty===false))return false;
  if(!(await absentAuth(auth,"getUser",uid))||!(await absentAuth(auth,"getUserByEmail",email)))return false;
  for(const id of ids) {
    const ref=students.doc(id);
    if(!(await ref.collection("levelEnrollments").limit(1).get()).empty)return false;
    if(await examProtection(ref,{uid,email}))return false;
    if((await db.collection("courseAccountAccess").doc(id).get()).exists)return false;
  }
  // Conservatively retain ANY payment/checkout history, even if it is pending.
  for(const collection of ["payments","paystackInitRequests"]) {
    for(const [field,value] of [["studentId",code],["studentId",uid],["uid",uid],["studentCode",code],["email",email]]) {
      if(!(await db.collection(collection).where(field,"==",value).limit(1).get()).empty)return false;
    }
  }
  return true;
}
async function recoverExpiredTrialSheetRows({db,auth,now=Date.now(),readStudents,readProtected,deleteRows,verify=noBackendAccount,batchLimit=25}) {
  const candidates=eligibleRows(await readStudents(),now).slice(0,batchLimit);
  if(!candidates.length)return {candidates:0,removed:0,protected:0};
  const protectedRows=await readProtected();
  const verified=[];
  for(const candidate of candidates){
    if(!protectedBySheet(candidate,protectedRows)&&await verify({db,auth,candidate}))verified.push(candidate);
  }
  if(!verified.length)return {candidates:candidates.length,removed:0,protected:candidates.length};
  // Re-resolve row positions after network lookups; never use a stale row index.
  // If any identity or payment evidence changes, leave that row alone.
  const currentProtection=await readProtected();
  const current=eligibleRows(await readStudents(),now);
  const approvedKeys=new Set(verified.filter(candidate=>!protectedBySheet(candidate,currentProtection)).map(identityKey));
  const approved=[];
  for(const candidate of current){
    if(approvedKeys.has(identityKey(candidate))&&await verify({db,auth,candidate}))approved.push(candidate);
  }
  // Last lightweight sheet recheck before deletion. This deliberately deletes
  // only sheet-only rows; never deletes Firebase users, scores, or paid ledgers.
  const lastRows=eligibleRows(await readStudents(),now);
  const lastKeys=new Set(approved.map(identityKey));
  const rowNumbers=lastRows.filter(candidate=>lastKeys.has(identityKey(candidate))).map(candidate=>candidate.rowNumber);
  const removed=rowNumbers.length?await deleteRows(rowNumbers):0;
  return {candidates:candidates.length,removed,protected:candidates.length-removed};
}
module.exports={dueTrial,eligibleRows,protectedBySheet,noBackendAccount,recoverExpiredTrialSheetRows};
