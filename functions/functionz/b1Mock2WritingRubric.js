"use strict";

// Private server-side validation of the teacher's B1 Mock 2 Schreiben Teil 3
// 20-point rubric. Falowen's four-module score assigns 5 points to this task.
const RUBRIC_MAXIMA=Object.freeze({
  task_fulfilment:4,cohesion:4,vocabulary:6,grammar:6,
});
const invalidRubric=()=>Object.assign(
  new Error("Incomplete B1 Mock 2 Teil 3 writing rubric."),
  {code:"INVALID_MOCK_ASSESSMENT"}
);
const validateB1Mock2Teil3Rubric=(assessment)=>{
  const scores=assessment?.parts?.teil3?.rubric_scores;
  if (!scores || typeof scores!=="object" || Array.isArray(scores) ||
      Object.entries(RUBRIC_MAXIMA).some(([name,max])=>
        typeof scores[name]!=="number" || !Number.isFinite(scores[name]) ||
        scores[name]<0 || scores[name]>max)) throw invalidRubric();
  return scores;
};
const normalizedB1Mock2Teil3Score=(scores)=>{
  const valid=validateB1Mock2Teil3Rubric({parts:{teil3:{rubric_scores:scores}}});
  const total=Object.keys(RUBRIC_MAXIMA).reduce((sum,name)=>sum+valid[name],0);
  return Number((total/4).toFixed(1));
};
module.exports={RUBRIC_MAXIMA,validateB1Mock2Teil3Rubric,normalizedB1Mock2Teil3Score};
