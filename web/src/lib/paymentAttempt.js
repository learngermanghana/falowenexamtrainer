const PREFIX = "falowen:payment-attempt";
const MAX_ATTEMPT_AGE_MS = 24 * 60 * 60 * 1000;

const identityFor = (studentProfile = {}) =>
  studentProfile?.studentCode ||
  studentProfile?.studentcode ||
  studentProfile?.id ||
  studentProfile?.email ||
  "student";

export const paymentAttemptKey = (studentProfile = {}) =>
  `${PREFIX}:${identityFor(studentProfile)}`;

export const savePaymentAttempt = (studentProfile = {}, attempt = {}) => {
  if (typeof window === "undefined") return;
  const payload = {
    amount: Number(attempt.amount) || 0,
    startedAt: attempt.startedAt || new Date().toISOString(),
    status: "pending",
  };
  window.localStorage.setItem(paymentAttemptKey(studentProfile), JSON.stringify(payload));
};

export const getPaymentAttempt = (studentProfile = {}) => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(paymentAttemptKey(studentProfile));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const startedAtMs = new Date(parsed.startedAt || "").getTime();
    if (Number.isFinite(startedAtMs) && Date.now() - startedAtMs > MAX_ATTEMPT_AGE_MS) {
      window.localStorage.removeItem(paymentAttemptKey(studentProfile));
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const clearPaymentAttempt = (studentProfile = {}) => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(paymentAttemptKey(studentProfile));
};
