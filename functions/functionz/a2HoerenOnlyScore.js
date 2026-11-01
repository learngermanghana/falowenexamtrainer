"use strict";
// Keep Hören-only grading independent of complete four-module attempts.
// Reuse the exact server-owned answer keys; never ship them to web clients.
const {scoreObjectiveAnswers}=require("./verifiedFourSkillMockScore");
const keys=Object.freeze({
  "mock-04":require("./a2Mock04HoerenKeys"),
  "mock-05":require("./a2Mock05HoerenKeys"),
  "mock-06":require("./a2Mock06HoerenKeys"),
  "mock-07":require("./a2Mock07HoerenKeys"),
});
function gradeA2HoerenOnly({mockId,answers}={}){
  const key=keys[mockId];
  if(!key)throw new Error("Unknown or unavailable A2 Hören mock.");
  if(!answers||Array.isArray(answers)||typeof answers!=="object")throw new Error("Hören answers must be supplied.");
  const expected=Object.keys(key);
  const supplied=Object.keys(answers);
  if(expected.length!==20 || supplied.length!==20 || supplied.some(id=>!Object.hasOwn(key,id))) {
    throw new Error("Answer all 20 Hören questions before submitting.");
  }
  if(supplied.some(id=>typeof answers[id]!=="string"||!["a","b","c","d","e","richtig","falsch"].includes(answers[id].trim().toLowerCase()))) {
    throw new Error("Invalid answer choice.");
  }
  const verified=scoreObjectiveAnswers(answers,key,20);
  const partScores=Object.fromEntries([0,1,2,3].map(i=>[
    `teil${i+1}`,Object.keys(key).filter(id=>Number(id)>i*5&&Number(id)<=(i+1)*5)
      .filter(id=>answers[id].trim().toLowerCase()===key[id].trim().toLowerCase()).length
  ]));
  return {mockId,correct:verified.correct,total:verified.total,
    percent:Number((verified.correct/verified.total*100).toFixed(1)),partScores};
}
module.exports={gradeA2HoerenOnly};
