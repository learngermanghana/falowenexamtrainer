"use strict";

const { getA1MockSet } = require("./a1MockSets");

const A1_HOEREN_PRACTICE_MOCK_IDS = Object.freeze([
  "a1-mock-04", "a1-mock-05", "a1-mock-06", "a1-mock-07", "a1-mock-08",
]);
const PART_SIZES = Object.freeze([6, 4, 5]);
const ANSWER_IDS = Object.freeze(PART_SIZES.flatMap((size, index) =>
  Array.from({ length: size }, (_, number) => `t${index + 1}-${number + 1}`)));

function scoreA1HoerenPractice({ mockId, answers } = {}) {
  if (!A1_HOEREN_PRACTICE_MOCK_IDS.includes(mockId)) {
    throw Object.assign(new Error("A1 Hören sample not found."), { status: 400 });
  }
  if (!answers || typeof answers !== "object" || Array.isArray(answers)
      || Object.keys(answers).length !== ANSWER_IDS.length) {
    throw Object.assign(new Error("Answer all 15 Hören questions before submitting."), { status: 400 });
  }
  const answerKey = getA1MockSet(mockId)?.listeningAnswerKey;
  if (!answerKey || ANSWER_IDS.some(id => !Object.prototype.hasOwnProperty.call(answerKey, id))) {
    throw Object.assign(new Error("A1 Hören answer key is unavailable."), { status: 503 });
  }

  const selected = {};
  for (const id of ANSWER_IDS) {
    const value = answers[id];
    const choices = id.startsWith("t2-") ? ["richtig", "falsch"] : ["a", "b", "c"];
    if (typeof value !== "string" || !choices.includes(value)) {
      throw Object.assign(new Error("Select one valid answer for every question."), { status: 400 });
    }
    selected[id] = value;
  }

  const sectionScores = Object.fromEntries(PART_SIZES.map((size, index) => {
    const prefix = `t${index + 1}-`;
    const correct = ANSWER_IDS.filter(id => id.startsWith(prefix) && selected[id] === answerKey[id]).length;
    return [`teil${index + 1}`, correct];
  }));
  const correct = Object.values(sectionScores).reduce((sum, count) => sum + count, 0);
  const total = ANSWER_IDS.length;
  const percent = Math.round((correct / total) * 100);
  return {
    mockId, correct, total, percent, passed: percent >= 60,
    sectionScores,
    // These are returned only by the authenticated POST scoring route, after submission.
    correctAnswers: Object.fromEntries(ANSWER_IDS.map(id => [id, answerKey[id]])),
  };
}

module.exports = { A1_HOEREN_PRACTICE_MOCK_IDS, PART_SIZES, ANSWER_IDS, scoreA1HoerenPractice };
