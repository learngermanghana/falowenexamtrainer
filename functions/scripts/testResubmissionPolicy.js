const assert = require("node:assert/strict");
const {
  MAX_RESUBMISSION_TRIES,
  MAX_TOTAL_SUBMISSION_ATTEMPTS,
  PASS_THRESHOLD_SCORE,
  evaluateResubmissionPolicy,
} = require("../resubmissionPolicy");

for (const level of ["A1", "A2", "B1"]) {
  assert.deepEqual(
    evaluateResubmissionPolicy({ score: 49, attempts: 1 }),
    { allowed: true, reason: "failed", nextAttempt: 2, remainingResubmissions: 2 },
    `${level} should allow the first resubmission after a score below 50`
  );
  assert.deepEqual(
    evaluateResubmissionPolicy({ score: 49, attempts: 2 }),
    { allowed: true, reason: "failed", nextAttempt: 3, remainingResubmissions: 1 },
    `${level} should allow the second resubmission after a score below 50`
  );
  assert.deepEqual(
    evaluateResubmissionPolicy({ score: 49, attempts: 3 }),
    { allowed: false, reason: "attempt_limit" },
    `${level} should block a fourth total submission`
  );
}

assert.equal(MAX_RESUBMISSION_TRIES, 2);
assert.equal(MAX_TOTAL_SUBMISSION_ATTEMPTS, 3);
assert.deepEqual(
  evaluateResubmissionPolicy({ score: null, attempts: 1 }),
  { allowed: false, reason: "awaiting_review" }
);
assert.deepEqual(
  evaluateResubmissionPolicy({ score: PASS_THRESHOLD_SCORE, attempts: 1 }),
  { allowed: false, reason: "passed" }
);

console.log("A1-B1 resubmission policy contract passed.");
