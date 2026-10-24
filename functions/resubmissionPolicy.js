const PASS_THRESHOLD_SCORE = 60;
const MAX_RESUBMISSION_TRIES = 2;
const MAX_TOTAL_SUBMISSION_ATTEMPTS = 1 + MAX_RESUBMISSION_TRIES;

const toPolicyScore = (value) => {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const match = String(value).match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
};

const evaluateResubmissionPolicy = ({ score, attempts }) => {
  const reviewedScore = toPolicyScore(score);
  const totalAttempts = Math.max(0, Number(attempts) || 0);

  if (reviewedScore === null) return { allowed: false, reason: "awaiting_review" };
  if (reviewedScore >= PASS_THRESHOLD_SCORE) return { allowed: false, reason: "passed" };
  if (totalAttempts >= MAX_TOTAL_SUBMISSION_ATTEMPTS) {
    return { allowed: false, reason: "attempt_limit" };
  }

  return {
    allowed: true,
    reason: "failed",
    nextAttempt: totalAttempts + 1,
    remainingResubmissions: MAX_TOTAL_SUBMISSION_ATTEMPTS - totalAttempts,
  };
};

module.exports = {
  PASS_THRESHOLD_SCORE,
  MAX_RESUBMISSION_TRIES,
  MAX_TOTAL_SUBMISSION_ATTEMPTS,
  evaluateResubmissionPolicy,
};
