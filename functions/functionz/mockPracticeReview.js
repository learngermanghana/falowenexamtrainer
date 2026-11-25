"use strict";
const {buildListeningReview} = require("./mockListeningReview");
const keyProviders = {
  a1: require("./a1MockCompletionSync").getPracticeObjectiveKeys,
  a2: require("./a2MockCompletionSync").getPracticeObjectiveKeys,
  b1: require("./b1MockCompletionSync").getPracticeObjectiveKeys,
};
function scoreMockPractice(mockId, section, answers) {
  if (!/^(a1|a2)-mock-0[1-8]$|^b1-mock-0[1-4]$/.test(mockId) || !["lesen","hoeren"].includes(section)) throw new Error("Unsupported practice paper or module.");
  const key = keyProviders[mockId.slice(0,2)](mockId)[section];
  if (!key || !Object.keys(key).length) throw new Error("This module is not published.");
  if (!answers || typeof answers !== "object" || Array.isArray(answers) || Object.keys(answers).length > 40) throw new Error("Invalid answers.");
  if (Object.entries(answers).some(([id,value])=>!Object.prototype.hasOwnProperty.call(key,id) || typeof value !== "string" || value.length > 40)) throw new Error("Invalid question or answer.");
  if (!Object.values(answers).some(value=>value.trim())) throw new Error("Answer at least one question before checking.");
  return buildListeningReview(answers,key);
}
module.exports = {scoreMockPractice};
