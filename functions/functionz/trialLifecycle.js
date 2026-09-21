const TRIAL_ACTIVE_STATUS = "trial_active";
const TRIAL_EXPIRED_STATUS = "trial_expired";
const TRIAL_RETENTION_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;
const TRIAL_RETENTION_MS = TRIAL_RETENTION_DAYS * DAY_MS;

const toMillis = (value) => {
  if (!value) return Number.NaN;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.toDate === "function") return value.toDate().getTime();
  if (typeof value?.seconds === "number") return value.seconds * 1000;
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return Number.isFinite(value) ? value : Number.NaN;
  const parsed = Date.parse(String(value));
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

const normalize = (value) => String(value || "").trim().toLowerCase();

const paidAmount = (student = {}) => {
  const candidates = [
    student.initialPaymentAmount,
    student.paidAmount,
    student.paid,
    student.amountPaid,
  ];
  for (const value of candidates) {
    const numeric = Number(value);
    if (Number.isFinite(numeric) && numeric > 0) return numeric;
  }
  return 0;
};

const hasStudentMadePayment = (student = {}) => {
  const paymentStatus = normalize(student.paymentStatus);
  if (["paid", "partial", "complete", "completed", "settled"].includes(paymentStatus)) {
    return true;
  }
  return paidAmount(student) > 0;
};

const isTrialStudent = (student = {}) => {
  if (normalize(student.enrollmentType) === "trial") return true;
  return [
    student.trialStartedAt,
    student.trialEndsAt,
    student.trialUsedAt,
    student.trialPurgeAt,
  ].some((value) => Number.isFinite(toMillis(value)));
};

const getTrialLifecycle = (student = {}, now = new Date()) => {
  if (!isTrialStudent(student)) {
    return {
      isTrial: false,
      state: "not_trial",
      isActive: false,
      isRetained: false,
      shouldPurge: false,
      isConverted: false,
      trialEnd: null,
      purgeAt: null,
    };
  }

  const trialEndMs = toMillis(student.trialEndsAt);
  if (!Number.isFinite(trialEndMs)) {
    return {
      isTrial: true,
      state: "invalid",
      isActive: false,
      isRetained: false,
      shouldPurge: false,
      isConverted: hasStudentMadePayment(student),
      trialEnd: null,
      purgeAt: null,
    };
  }

  const explicitPurgeMs = toMillis(student.trialPurgeAt);
  const purgeAtMs = Number.isFinite(explicitPurgeMs)
    ? explicitPurgeMs
    : trialEndMs + TRIAL_RETENTION_MS;
  const nowMs = toMillis(now);
  const converted = hasStudentMadePayment(student);

  let state = "active";
  if (converted) state = "converted";
  else if (nowMs >= purgeAtMs) state = "purge_due";
  else if (nowMs >= trialEndMs) state = "retained";

  return {
    isTrial: true,
    state,
    isActive: state === "active",
    isRetained: state === "retained",
    shouldPurge: state === "purge_due",
    isConverted: state === "converted",
    trialEnd: new Date(trialEndMs),
    purgeAt: new Date(purgeAtMs),
  };
};

module.exports = {
  DAY_MS,
  TRIAL_ACTIVE_STATUS,
  TRIAL_EXPIRED_STATUS,
  TRIAL_RETENTION_DAYS,
  TRIAL_RETENTION_MS,
  getTrialLifecycle,
  hasStudentMadePayment,
  isTrialStudent,
  toMillis,
};
