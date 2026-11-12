"use strict";

// Reviewed answers in the same order as the four parts of B2 Mock 03.
const key = [["falsch", "richtig", "falsch", "richtig", "richtig"], ["b", "a", "c", "a", "b", "b"], ["a", "b", "c", "a", "b", "c"], ["a", "b", "c", "a", "b", "b", "a", "c"]];
function gradeB2Mock03(answers) {
  if (!answers || typeof answers !== "object" || Array.isArray(answers) || Object.keys(answers).length !== 25) {
    throw new Error("Answer all 25 listening questions.");
  }
  let number = 0;
  let correct = 0;
  const partScores = {};
  key.forEach((part, index) => {
    let score = 0;
    for (const expected of part) {
      const selected = answers[++number];
      const choices = index === 0 ? ["richtig", "falsch"] : ["a", "b", "c"];
      if (!choices.includes(selected)) throw new Error("Choose a valid answer for every question.");
      if (selected === expected) score++;
    }
    partScores["teil" + (index + 1)] = score;
    correct += score;
  });
  return { correct, total: 25, percent: correct * 4, partScores };
}
module.exports = { gradeB2Mock03 };
