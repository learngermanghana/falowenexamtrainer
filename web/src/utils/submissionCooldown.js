export const SUBMISSION_COOLDOWN_MS = 10 * 60 * 1000;

// A future server timestamp (or a slow device clock) must not add extra time.
// Cache the first deadline for that attempt so repeated renders cannot restart it.
export const resolveSubmissionCooldownDeadline = ({
  submittedAtMs,
  assignmentKey,
  deadlines,
  now = Date.now(),
}) => {
  if (!Number.isFinite(submittedAtMs) || submittedAtMs <= 0) return null;
  const key = `${assignmentKey}:${submittedAtMs}`;
  if (!deadlines.has(key)) {
    deadlines.set(key, Math.min(submittedAtMs, now) + SUBMISSION_COOLDOWN_MS);
  }
  return deadlines.get(key);
};
