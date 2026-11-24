export const COURSE_PROGRAMS = ["german", "swahili"];
const normalizeProgram = value => String(value || "").trim().toLowerCase();
const primaryCourse = profile => normalizeProgram(profile?.program) || "german";

// Only server-issued programme enrollment grants access. A locally stored
// preference or an admissions interest request never creates an enrollment.
export function secondaryAccessExpiry(profile) {
  const secondary = normalizeProgram(profile?.secondaryProgram);
  if (!COURSE_PROGRAMS.includes(secondary) || primaryCourse(profile) === secondary) return null;
  const placement = profile?.coursePlacements?.[secondary];
  if (["pending","invitation_pending"].includes(placement?.accessType)) return 0;
  if (placement?.accessType !== "complimentary" && !placement?.contractEnd) return null;
  const value = placement.contractEnd;
  const end = typeof value?.toMillis === "function" ? value.toMillis() : typeof value?.seconds === "number" ? value.seconds * 1000 : Date.parse(value || "");
  return Number.isFinite(end) ? end : 0;
}

export function enrolledCourses(profile, now = Date.now()) {
  if (!profile) return ["german"];
  const primary = primaryCourse(profile);
  const secondary = normalizeProgram(profile?.secondaryProgram);
  if (!COURSE_PROGRAMS.includes(primary)) return [];
  const expiry = secondaryAccessExpiry(profile);
  return secondary !== primary && COURSE_PROGRAMS.includes(secondary) && (expiry === null || expiry > now) ? [primary, secondary] : [primary];
}

export const COURSE_PLACEMENT_FIELDS = [
  "classId", "classRecordId", "assignedClassId", "groupId", "cohortId",
  "className", "classname", "class", "group", "groupName", "cohort", "cohortName",
  "level", "levelId", "learningMode", "teacherId", "instructorName",
];
export const COURSE_BILLING_FIELDS = [
  "tuitionFee", "paid", "initialPaymentAmount", "balanceDue", "balance",
  "paymentStatus", "paymentIntentAmount", "paystackLink", "paymentAttempt",
  "trialStatus", "trialStartedAt", "trialUsedAt", "trialEndsAt", "trialPurgeAt",
  "contractStart", "contractEnd", "contractTermMonths",
];
const COURSE_ACCESS_FIELDS = [
  "institutionId", "institutionName", "institutionVerification", "cohortId",
  "instructorName", "registrationSource", "universityInvitationCode", "accessType",
  "courseCompletion", "courseProgress", "completedDays", "score", "progress",
];
export const COURSE_SCOPED_FIELDS = [...new Set([
  ...COURSE_PLACEMENT_FIELDS, ...COURSE_BILLING_FIELDS, ...COURSE_ACCESS_FIELDS,
])];

// Secondary programmes cannot inherit a different programme's class, grade,
// payment, trial or complimentary institutional access. Missing secondary
// placements deliberately remain unassigned rather than inventing A1 access.
export function courseProfile(profile, requested) {
  const program = normalizeProgram(requested);
  if (!profile || program === primaryCourse(profile) || !enrolledCourses(profile).includes(program)) return profile;
  const placement = profile.coursePlacements?.[program] || {};
  const view = { ...profile, program };
  for (const field of COURSE_SCOPED_FIELDS) {
    delete view[field];
    if (Object.prototype.hasOwnProperty.call(placement, field)) view[field] = placement[field];
  }
  view.level = placement.level || "";
  view.className = placement.className || "";
  view.primaryProgram = primaryCourse(profile);
  view.isSecondaryCourse = true;
  view.coursePlacementPending = !placement.level;
  return view;
}

const coursePreferenceKey = (uid) => `falowen:course:${uid}`;

// Interface language is stored separately. Course preferences are per Firebase
// user and validated against the student's current enrolled programmes.
export function readCoursePreference(uid, allowed = []) {
  if (!uid || typeof window === "undefined") return null;
  const key = coursePreferenceKey(uid);
  try {
    const selected = window.localStorage.getItem(key) || window.sessionStorage.getItem(key);
    return allowed.includes(selected) ? selected : null;
  } catch {
    return null;
  }
}

export function saveCoursePreference(uid, course, allowed = []) {
  if (!uid || !allowed.includes(course) || typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(coursePreferenceKey(uid), course);
    window.sessionStorage.removeItem(coursePreferenceKey(uid));
    return true;
  } catch {
    return false;
  }
}
