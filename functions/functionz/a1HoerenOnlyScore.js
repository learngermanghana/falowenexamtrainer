"use strict";

const keys = {
  ...require("./a1Mock4ListeningKeys"),
  ...require("./a1Mock5ListeningKeys"),
  ...require("./a1Mock6ListeningKeys"),
  ...require("./a1Mock7ListeningKeys"),
  ...require("./a1Mock8ListeningKeys"),
};

function gradeA1HoerenOnly({ mockId, answers } = {}) {
  if (!Object.hasOwn(keys, mockId)) throw new Error("Unknown A1 Hören sample.");
  const key = keys[mockId];
  if (!answers || typeof answers !== "object" || Array.isArray(answers) ||
      Object.keys(answers).length !== Object.keys(key).length) {
    throw new Error("Answer all 15 Hören questions before submitting.");
  }
  const partScores = { teil1: 0, teil2: 0, teil3: 0 };
  let correct = 0;
  for (const [id, expected] of Object.entries(key)) {
    const choices = id.startsWith("t2-") ? ["richtig", "falsch"] : ["a", "b", "c"];
    if (!choices.includes(answers[id])) throw new Error("Invalid or missing Hören answer.");
    if (answers[id] === expected) {
      correct++;
      partScores[`teil${id[1]}`]++;
    }
  }
  const total = Object.keys(key).length;
  return { correct, total, percent: Math.round(correct * 100 / total), partScores };
}
module.exports = { gradeA1HoerenOnly };
