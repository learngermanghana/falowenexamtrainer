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
  if (courseResource) return { level: profile.level, course: !examOnly && ends > Date.now() };
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

module.exports = { courseExpiry, trialRestriction, paidExamGrants };
