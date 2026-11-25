"use strict";

const LEVELS = ["A1","A2","B1","B2","C1","C2"];
const normalize = value => String(value || "").trim().toLowerCase();
function dateMillis(value) {
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.seconds === "number") return value.seconds * 1000;
  if (typeof value === "number") return value;
  return Date.parse(value || "");
}

// Secondary grants are independent of German tuition. Legacy unmanaged
// placements retain their existing access; explicit grants fail closed.
function resolveSwahiliAccess(profile, level, now = Date.now(), policy = {}) {
  if (!profile || profile.accountType === "exam_only" || policy.examOnly === true ||
      ["archived","deleted","inactive","withdrawn"].includes(normalize(profile.status))) return { allowed:false };
  const primary = normalize(profile.program) || "german";
  const secondary = primary !== "swahili" && normalize(profile.secondaryProgram) === "swahili";
  if (primary !== "swahili" && !secondary) return { allowed:false };
  const placement = secondary ? profile.coursePlacements?.swahili : profile;
  if (!placement || normalize(placement.institutionVerification) === "pending" ||
      ["pending","invitation_pending"].includes(normalize(placement.accessType))) return { allowed:false };
  const assigned = String(placement.level || placement.levelId || "").trim().toUpperCase();
  const wanted = String(level || "").toUpperCase();
  if (!LEVELS.includes(wanted) || LEVELS.indexOf(assigned) < LEVELS.indexOf(wanted)) return { allowed:false };
  const managed = secondary && normalize(placement.accessType) === "complimentary";
  const hasEnd = placement.contractEnd !== null && placement.contractEnd !== undefined && placement.contractEnd !== "";
  const end = dateMillis(placement.contractEnd);
  const start = dateMillis(placement.contractStart);
  if (Number.isFinite(start) && start > now) return {allowed:false};
  if ((managed || hasEnd) && (!Number.isFinite(end) || end <= now)) return { allowed:false };
  return { allowed:true, expiresAtMs: Number.isFinite(end) ? end : null };
}

async function readSwahiliAccess(db, uid, level, transaction = null, now = Date.now()) {
  if (!uid || typeof uid !== "string" || uid.includes("/")) return {allowed:false};
  const get = ref => transaction ? transaction.get(ref) : ref.get();
  const students = db.collection("students");
  // Resolve by authenticated UID, not a client-provided document ID or email.
  const [matches, policy, deletion] = await Promise.all([
    get(students.where("uid","==",uid).limit(2)),
    get(db.collection("courseAccountAccess").doc(uid)),
    get(db.collection("accountDeletionRequests").doc(uid))
  ]);
  if (matches.size !== 1 || ["pending","processing","completed"].includes(deletion.data()?.status)) return {allowed:false};
  const profile = matches.docs[0].data();
  if (profile.uid !== uid) return {allowed:false};
  const access = resolveSwahiliAccess(profile,level,now,policy.data() || {});
  if(access.allowed){const {enrollmentRows,blockedEnrollmentLevels}=require("./levelEnrollmentAccess");if(blockedEnrollmentLevels(await enrollmentRows(matches.docs[0].ref,transaction),"swahili",now).includes(String(level).toUpperCase()))return {allowed:false};}
  return {...access, profile};
}

async function loadSwahiliAccess(uid, level, now = Date.now()) {
  const admin = require("firebase-admin");
  return readSwahiliAccess(admin.firestore(),uid,level,null,now);
}

module.exports = { dateMillis, resolveSwahiliAccess, readSwahiliAccess, loadSwahiliAccess };
