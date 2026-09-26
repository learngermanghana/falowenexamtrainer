const PREFIX = "falowen:payment-attempt";

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
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

export const clearPaymentAttempt = (studentProfile = {}) => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(paymentAttemptKey(studentProfile));
};
