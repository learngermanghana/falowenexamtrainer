import { toDateMs } from "./dateUtils";
import { hasClearedBalance, normalizePaymentStatus } from "./paymentStatus";

const DAY_MS = 24 * 60 * 60 * 1000;

export const TRIAL_LENGTH_MS = 7 * DAY_MS;
export const TRIAL_RETENTION_MS = 30 * DAY_MS;
export const TRIAL_ENDING_SOON_MS = 2 * DAY_MS;
export const TRIAL_RETENTION_ENDING_SOON_MS = 3 * DAY_MS;

const resolveTrialStartMs = (studentProfile = {}) => {
  const startedAtMs = toDateMs(studentProfile?.trialStartedAt);
  if (Number.isFinite(startedAtMs)) return startedAtMs;

  const usedAtMs = toDateMs(studentProfile?.trialUsedAt);
  if (Number.isFinite(usedAtMs)) return usedAtMs;

  const joinedAtMs = toDateMs(studentProfile?.joined_at || studentProfile?.joinedAt);
  return Number.isFinite(joinedAtMs) ? joinedAtMs : Number.NaN;
};

const resolveTrialEndMs = (studentProfile = {}) => {
  const explicitEndMs = toDateMs(studentProfile?.trialEndsAt);
  if (Number.isFinite(explicitEndMs)) return { value: explicitEndMs, source: "explicit" };

  const status = String(studentProfile?.trialStatus || "").trim().toLowerCase();
  if (status !== "active") return { value: Number.NaN, source: "none" };

  const startedAtMs = resolveTrialStartMs(studentProfile);
  if (!Number.isFinite(startedAtMs)) return { value: Number.NaN, source: "missing-start" };

  return { value: startedAtMs + TRIAL_LENGTH_MS, source: "derived" };
};

const resolveTrialPurgeMs = (studentProfile = {}, trialEndMs = Number.NaN) => {
  const explicitPurgeMs = toDateMs(studentProfile?.trialPurgeAt);
  if (Number.isFinite(explicitPurgeMs)) return { value: explicitPurgeMs, source: "explicit" };
  if (!Number.isFinite(trialEndMs)) return { value: Number.NaN, source: "none" };
  return { value: trialEndMs + TRIAL_RETENTION_MS, source: "derived" };
};

const hasConfirmedPayment = (studentProfile = {}) => {
  const paymentStatus = normalizePaymentStatus(studentProfile?.paymentStatus);
  const balance = studentProfile?.balanceDue ?? studentProfile?.balance;
  const confirmedPaidAmount = Number(
    studentProfile?.paid ??
    studentProfile?.paidAmount ??
    0
  ) || 0;

  return ["paid", "partial"].includes(paymentStatus) || hasClearedBalance(balance) || confirmedPaidAmount > 0;
};

export const getTrialLifecycleState = (studentProfile = {}, nowMs = Date.now()) => {
  if (hasConfirmedPayment(studentProfile)) {
    return {
      key: "converted",
      paid: true,
      active: false,
      daysRemaining: 0,
      retentionDaysRemaining: 0,
      endsAtMs: Number.NaN,
      purgeAtMs: Number.NaN,
      source: "payment",
    };
  }

  const trialEnd = resolveTrialEndMs(studentProfile);
  const endsAtMs = trialEnd.value;
  const purgeAt = resolveTrialPurgeMs(studentProfile, endsAtMs);
  const purgeAtMs = purgeAt.value;
  const trialStatus = String(studentProfile?.trialStatus || "").trim().toLowerCase();
  const usedAtMs = toDateMs(studentProfile?.trialUsedAt);
  const startedAtMs = resolveTrialStartMs(studentProfile);
  const wasUsed =
    Number.isFinite(startedAtMs) ||
    Number.isFinite(usedAtMs) ||
    Number.isFinite(endsAtMs) ||
    ["expired", "used", "ended"].includes(trialStatus);

  if (!wasUsed && !Number.isFinite(endsAtMs)) {
    return {
      key: "unused",
      paid: false,
      active: false,
      daysRemaining: 0,
      retentionDaysRemaining: 0,
      endsAtMs: Number.NaN,
      purgeAtMs: Number.NaN,
      source: trialEnd.source,
    };
  }

  if (Number.isFinite(endsAtMs) && nowMs < endsAtMs) {
    const remainingMs = endsAtMs - nowMs;
    return {
      key: remainingMs <= TRIAL_ENDING_SOON_MS ? "ending_soon" : "active",
      paid: false,
      active: true,
      daysRemaining: Math.max(1, Math.ceil(remainingMs / DAY_MS)),
      retentionDaysRemaining: 0,
      endsAtMs,
      purgeAtMs,
      source: trialEnd.source,
    };
  }

  if (Number.isFinite(purgeAtMs) && nowMs < purgeAtMs) {
    const retentionRemainingMs = purgeAtMs - nowMs;
    return {
      key: retentionRemainingMs <= TRIAL_RETENTION_ENDING_SOON_MS ? "retention_ending_soon" : "expired_retained",
      paid: false,
      active: false,
      daysRemaining: 0,
      retentionDaysRemaining: Math.max(1, Math.ceil(retentionRemainingMs / DAY_MS)),
      endsAtMs,
      purgeAtMs,
      source: purgeAt.source,
    };
  }

  return {
    key: "purge_due",
    paid: false,
    active: false,
    daysRemaining: 0,
    retentionDaysRemaining: 0,
    endsAtMs,
    purgeAtMs,
    source: purgeAt.source,
  };
};

export const getTrialAccessState = (studentProfile = {}, nowMs = Date.now()) => {
  const lifecycle = getTrialLifecycleState(studentProfile, nowMs);
  return {
    active: lifecycle.active,
    endsAtMs: lifecycle.endsAtMs,
    purgeAtMs: lifecycle.purgeAtMs,
    source: lifecycle.source,
    daysRemaining: lifecycle.daysRemaining,
    retentionDaysRemaining: lifecycle.retentionDaysRemaining,
    key: lifecycle.key,
  };
};
