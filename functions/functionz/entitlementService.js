"use strict";

// Server-owned entitlement calculations. They receive verified profiles and
// subscription records; no payment or student state is changed here.
const exams = require("./trialExams.json");

function courseExpiry(profile) {
  if (profile.program === "swahili" || !exams[profile.level] || profile.isTutor ||
      ["tutor", "admin"].includes(profile.role)) return null;
  const balance = profile.balanceDue ?? profile.balance;
  if (["paid", "active", "partial", "partially paid", "partially_paid", "part paid", "part-paid"].includes(String(profile.paymentStatus).toLowerCase()) ||
      Number(profile.paid ?? profile.paidAmount) > 0 || (balance != null && Number(balance) <= 0)) return null;
  const millis = value => value?.toMillis?.() ?? new Date(value || "").getTime();
  const end = millis(profile.trialEndsAt);
  if (Number.isFinite(end)) return end;
  if (profile.trialStatus !== "active") return null;
  const start = millis(profile.trialStartedAt || profile.trialUsedAt || profile.joined_at || profile.joinedAt);
  return Number.isFinite(start) ? start + 7 * 86400000 : 0;
}

async function trialRestriction(db, identity, profile, courseResource = false) {
  const { activeSubscriptionsFor } = require("./mockCommerce");
  const examOnly = profile.accountType === "exam_only" || (!profile.accountType && identity.examOnly === true);
  const ends = courseExpiry(profile);
  if (!examOnly && ends === null) return null;
  if (courseResource) return examOnly ? { level: profile.level, course: false, preview: true } : { level: profile.level, course: ends > Date.now() };
  const grants = await activeSubscriptionsFor(db, identity.uid);
  if (grants.some(row => row.scope !== "trial" && (examOnly || row.level === profile.level))) return null;
  const trial = grants.find(row => row.scope === "trial");
  return { level: examOnly ? trial?.level : ends > Date.now() ? profile.level : null, course: !examOnly && ends > Date.now() };
}

// Preserve the legacy guard's paid-grant semantics while making the split
// between trial and paid grants available from one server-owned policy.
function paidExamGrants(grants) {
  return (grants || []).filter(row => row.scope !== "trial");
}

// A single snapshot used by the student catalog and server-side guards.
// Inputs must come from the verified student record and active server grants.
function resolveEntitlements({ profile = {}, identity = {}, grants = [], now = Date.now() } = {}) {
  const examOnly = profile.accountType === "exam_only" || (!profile.accountType && identity.examOnly === true);
  const level = String(profile.level || "").trim().toUpperCase();
  const endsAtMs = examOnly ? null : courseExpiry(profile);
  const courseTrialActive = !examOnly && endsAtMs !== null && endsAtMs > now;
  // A missing trial date alone does not prove tuition was paid. Existing
  // legacy and institutional access is handled by the established account
  // policy until its authoritative status is available here.
  const balance = profile.balanceDue ?? profile.balance;
  const paymentStatus = String(profile.paymentStatus || "").toLowerCase();
  const paidCourse = ["paid", "active", "partial", "partially paid", "partially_paid", "part paid", "part-paid"].includes(paymentStatus) ||
    Number(profile.paid ?? profile.paidAmount) > 0 || (balance != null && Number(balance) <= 0);
  const courseAvailable = !examOnly && endsAtMs === null && paidCourse;
  const courseUnknown = !examOnly && endsAtMs === null && !paidCourse;
  const validGrants = grants.filter(grant => grant && grant.status === "active" && Number(grant.expiresAtMs) > now);
  const eligible = validGrants.filter(grant => profile.courseEnrollmentPreserved === true || grant.level === level);
  const paidLevels = [...new Set(paidExamGrants(eligible).map(grant => grant.level))];
  const examTrial = eligible.find(grant => grant.scope === "trial");
  const trialLevel = examTrial?.level || (courseTrialActive ? level : "");
  const trialExam = exams[trialLevel];
  return {
    version: 1, accountType: examOnly ? "exam_only" : "course", level,
    home: true, account: true,
    campus: true, examsRoom: true,
    course: { day1Preview: examOnly && Boolean(exams[level]), liveClasses: courseUnknown ? null : (courseAvailable || courseTrialActive),
      day1Submission: courseUnknown ? null : (courseAvailable || courseTrialActive),
      day2PlusSubmission: courseUnknown ? null : courseAvailable,
      day1: courseUnknown ? null : (courseAvailable || courseTrialActive),
      day2Plus: courseUnknown ? null : courseAvailable, trial: courseTrialActive, endsAtMs },
    exam: { paidLevels, trial: trialExam ? { level: trialLevel, catalogId: trialExam.catalogId,
      expiresAtMs: examTrial ? Number(examTrial.expiresAtMs) : endsAtMs } : null },
  };
}

module.exports = { courseExpiry, trialRestriction, paidExamGrants, resolveEntitlements };
