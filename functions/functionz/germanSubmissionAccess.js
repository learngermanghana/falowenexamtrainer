"use strict";
const { getLessonsByLevel } = require("../data/lessonCatalog");
const { courseExpiry } = require("./entitlementService");
const { dateMillis } = require("./swahiliAccess");
const LEVELS = ["A1","A2","B1","B2","C1","C2"];
const PAID = ["paid","active","partial","partially paid","partially_paid","part paid","part-paid"];
const text = value => String(value || "").trim().toLowerCase();
const ACCESS_FIELDS = ["accountType","program","secondaryProgram","coursePlacements","level","status","role","isTutor","paymentStatus","paid","paidAmount","balanceDue","balance","accessType","institutionVerification","contractEnd","trialStatus","trialStartedAt","trialUsedAt","trialEndsAt","joined_at","joinedAt"];
function accessFingerprint(profile) {
  return Object.fromEntries(ACCESS_FIELDS.map(key=>[key,profile[key] ?? null]));
}
function germanPlacement(profile) {
  if (text(profile.program || "german") === "german") return profile;
  if (text(profile.secondaryProgram) !== "german") return null;
  return profile.coursePlacements?.german || null;
}
function germanSubmissionAccess(profile, now = Date.now(), authCreatedAt = null) {
  if (!profile || profile.accountType === "exam_only" || ["archived","inactive","deleted","withdrawn","suspended"].includes(text(profile.status))) return null;
  const placement = germanPlacement(profile);
  if (!placement || ["pending","invitation_pending"].includes(text(placement.accessType))) return null;
  const startAt = dateMillis(placement.contractStart);
  if (Number.isFinite(startAt) && startAt > now) return null;
  const level = String(placement.level || "").trim().toUpperCase();
  if (!LEVELS.includes(level)) return null;
  const balance = placement.balanceDue ?? placement.balance;
  const paid = PAID.includes(text(placement.paymentStatus)) ||
    Number(placement.paid ?? placement.paidAmount) > 0 ||
    (balance !== null && balance !== undefined && String(balance).trim() !== "" && Number.isFinite(Number(balance)) && Number(balance) <= 0);
  const complimentary = text(placement.accessType) === "complimentary" && text(placement.institutionVerification) !== "pending";
  const explicitEnd = placement.contractEnd != null && placement.contractEnd !== "";
  const contractEnd = dateMillis(placement.contractEnd);
  if (paid || complimentary) {
    if ((explicitEnd || complimentary) && (!Number.isFinite(contractEnd) || contractEnd <= now)) return null;
    return {mode:"full",level,levels:LEVELS.slice(0,LEVELS.indexOf(level)+1),endsAtMs:Number.isFinite(contractEnd)?contractEnd:null,day1Keys:[]};
  }
  if (text(placement.trialStatus) === "expired" || text(placement.trialStatus) === "used" || text(placement.trialStatus) === "ended") return null;
  // Never extend an unpaid registration beyond its original seven-day Auth window.
  // Admin-issued explicit paid/complimentary access follows its own contract.
  const end = courseExpiry({...placement,program:"german",role:"student",isTutor:false});
  const start = dateMillis(placement.trialStartedAt || placement.trialUsedAt || placement.joined_at || placement.joinedAt);
  const created = dateMillis(authCreatedAt);
  const expires = Math.min(end ?? 0,Number.isFinite(start)?start+7*86400000:0,Number.isFinite(created)?created+7*86400000:0);
  if (!Number.isFinite(expires) || expires <= now) return null;
  const day1Keys = getLessonsByLevel(level).filter(item=>item.day===1 && item.submissionRequired !== false).map(item=>item.assignmentId);
  if (!day1Keys.length) return null;
  return {mode:"trial",level,levels:[level],endsAtMs:expires,day1Keys};
}
function assignmentAllowed(access,level,key) {
  return Boolean(access && access.levels.includes(String(level || "").toUpperCase()) &&
    (access.mode === "full" || access.day1Keys.includes(String(key || "").toUpperCase())));
}
async function verifyGermanSubmissionAccess(db,auth,identity,now=Date.now()) {
  if (!identity?.uid) return null;
  const uid=identity.uid;
  const students=db.collection("students");
  const [matches,account,partner,deletion,policy]=await Promise.all([
    students.where("uid","==",uid).limit(2).get(),
    auth.getUser(uid),
    db.collection("organisationPartnerMembers").doc(uid).get(),
    db.collection("accountDeletionRequests").doc(uid).get(),
    db.collection("courseAccountAccess").doc(uid).get()
  ]);
  if (account.disabled || matches.size !== 1 || (policy.exists ? policy.data()?.examOnly === true : identity.examOnly === true) ||
      (partner.exists && partner.data()?.courseAccessAllowed !== true) ||
      ["pending","processing","completed"].includes(deletion.data()?.status)) return null;
  const record=matches.docs[0];
  const profile=record.data();
  if (profile.uid!==uid) return null;
  const access=germanSubmissionAccess(profile,now,account.metadata?.creationTime);
  if(!access)return null;
  const {enrollmentRows,blockedEnrollmentLevels}=require("./levelEnrollmentAccess");
  const blocked=blockedEnrollmentLevels(await enrollmentRows(record.ref),"german",now);
  const levels=access.levels.filter(level=>!blocked.includes(level));
  return levels.length ? {...access,levels,level:levels.includes(access.level)?access.level:levels[levels.length-1],profileId:record.id,profileFields:accessFingerprint(profile)} : null;
}
function registerGermanSubmissionAccessRoute(app,{admin,getAuthedUser}) {
  app.post("/course/submission-access",async(req,res)=>{
    res.set("Cache-Control","private, no-store");
    try {
      const identity=await getAuthedUser(req);
      if(!identity) return res.status(401).json({error:"Sign in again."});
      const db=admin.firestore();
      const now=Date.now();
      const access=await verifyGermanSubmissionAccess(db,admin.auth(),identity,now);
      const ref=db.collection("courseSubmissionAccess").doc(identity.uid);
      if(!access) {
        await ref.delete();
        return res.status(403).json({error:"Active Full Course access is required to submit assignments."});
      }
      const expiresAtMs=Math.min(now+5*60*1000,access.endsAtMs ?? Infinity);
      if(expiresAtMs<=now) return res.status(403).json({error:"Your course access has expired."});
      await ref.set({...access,expiresAtMs,uid:identity.uid});
      return res.json({ok:true,mode:access.mode,level:access.level,expiresAtMs});
    } catch(error) {
      console.error("German submission access failed",error?.code||error?.name);
      return res.status(503).json({error:"Could not verify your course access. Please retry."});
    }
  });
}
module.exports={germanSubmissionAccess,assignmentAllowed,verifyGermanSubmissionAccess,registerGermanSubmissionAccessRoute,ACCESS_FIELDS};
