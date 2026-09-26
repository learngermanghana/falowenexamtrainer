import { toDateMs } from "./dateUtils";

export const TRIAL_LENGTH_MS = 7 * 24 * 60 * 60 * 1000;

export const getTrialAccessState = (studentProfile = {}, nowMs = Date.now()) => {
  const explicitEndMs = toDateMs(studentProfile?.trialEndsAt);
  if (Number.isFinite(explicitEndMs)) {
    return {
      active: explicitEndMs > nowMs,
      endsAtMs: explicitEndMs,
      source: "explicit",
      daysRemaining: Math.max(0, Math.ceil((explicitEndMs - nowMs) / (24 * 60 * 60 * 1000))),
    };
  }

  const trialStatus = String(studentProfile?.trialStatus || "").trim().toLowerCase();
  if (trialStatus !== "active") {
    return { active: false, endsAtMs: Number.NaN, source: "none", daysRemaining: 0 };
  }

  const startedAtMs = toDateMs(studentProfile?.trialStartedAt);
  const joinedAtMs = toDateMs(studentProfile?.joined_at || studentProfile?.joinedAt);
  const fallbackStartMs = Number.isFinite(startedAtMs)
    ? startedAtMs
    : Number.isFinite(joinedAtMs)
      ? joinedAtMs
      : Number.NaN;

  if (!Number.isFinite(fallbackStartMs)) {
    return { active: false, endsAtMs: Number.NaN, source: "missing-start", daysRemaining: 0 };
  }

  const fallbackEndMs = fallbackStartMs + TRIAL_LENGTH_MS;
  return {
    active: fallbackEndMs > nowMs,
    endsAtMs: fallbackEndMs,
    source: "derived",
    daysRemaining: Math.max(0, Math.ceil((fallbackEndMs - nowMs) / (24 * 60 * 60 * 1000))),
  };
};
