import { toDateMs } from "./dateUtils";

const PARTIAL_PAYMENT_STATUSES = new Set([
  "partial",
  "partially paid",
  "partially_paid",
  "part paid",
  "part-paid",
]);

export const normalizePaymentStatus = (status) => {
  const normalized = String(status || "pending").trim().toLowerCase();
  if (normalized === "active") return "paid";
  if (PARTIAL_PAYMENT_STATUSES.has(normalized)) return "partial";
  return normalized;
};

export const hasClearedBalance = (balanceDue) => {
  if (balanceDue === null || balanceDue === undefined) return false;
  const numeric = Number(balanceDue);
  if (!Number.isFinite(numeric)) return false;
  return numeric <= 0;
};

export const getPartialPaymentAccessEndMs = (studentProfile = {}) => {
  if (normalizePaymentStatus(studentProfile?.paymentStatus) !== "partial") return Number.NaN;
  const paidAmount = Number(
    studentProfile?.paid ??
    studentProfile?.paidAmount ??
    studentProfile?.initialPaymentAmount ??
    0
  ) || 0;
  if (paidAmount <= 0) return Number.NaN;

  const paidAtMs = toDateMs(
    studentProfile?.lastPaymentAt ??
    studentProfile?.trialConvertedAt ??
    studentProfile?.contractStart
  );
  if (!Number.isFinite(paidAtMs)) return Number.NaN;

  const paidAt = new Date(paidAtMs);
  const end = new Date(paidAtMs);
  end.setUTCMonth(end.getUTCMonth() + 1);
  // Preserve end-of-month behavior (for example 31 Jan -> 28/29 Feb).
  if (end.getUTCDate() !== paidAt.getUTCDate()) {
    end.setUTCDate(0);
  }
  return end.getTime();
};
