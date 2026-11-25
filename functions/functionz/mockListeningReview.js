"use strict";
const normalize = value => String(value ?? "").trim().toLowerCase();
// Only called with the stored state of a successfully completed, authenticated attempt.
function buildListeningReview(answers = {}, key = {}) {
  return Object.entries(key).map(([id, expected]) => {
    const match = /^t(\d+)-(\d+)$/.exec(id);
    const number = Number(match ? match[2] : id);
    const submitted = normalize(answers[id]);
    const correct = normalize(expected);
    return { number, part: match ? Number(match[1]) : null, submitted: submitted || null, expected: correct,
      status: !submitted ? "unanswered" : submitted === correct ? "correct" : "incorrect" };
  }).sort((a,b) => a.number - b.number);
}
module.exports = { buildListeningReview };
