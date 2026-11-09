"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const {ANSWERS,gradeB1Mock4Lesen}=require("../b1Mock4Lesen");
const parts=[[1,6],[7,12],[13,19],[20,26],[27,30]];
test("Mock 04 Lesen has 30 private answer keys with the amended Teil 2 question 9",()=>{
  assert.equal(Object.keys(ANSWERS).length,30);
  assert.equal(ANSWERS["2"],"richtig");
  assert.equal(ANSWERS["9"],"c");
  assert.equal(ANSWERS["14"],"0");
  assert.equal(ANSWERS["21"],"nein");
  assert.equal(ANSWERS["27"],"c");
});
test("The five reading sections score 6/6/7/7/4 from server values",()=>{
  const answers={...ANSWERS};
  const result=gradeB1Mock4Lesen(answers);
  assert.equal(result.correct,30);
  assert.equal(result.percentage,100);
  assert.deepEqual(result.perPart.map(p=>[p.total,p.correct]),[[6,6],[6,6],[7,7],[7,7],[4,4]]);
  assert.equal(result.practiceOnly,true);
  const wrong={...answers,9:"b",21:"ja"};
  const downgraded=gradeB1Mock4Lesen(wrong);
  assert.equal(downgraded.correct,28);
  assert.deepEqual(downgraded.perPart.map(p=>p.correct),[6,5,7,6,4]);
});
test("Reject incomplete/invalid options and reused classified ads",()=>{
  assert.throws(()=>gradeB1Mock4Lesen({1:"richtig"}),/30/);
  assert.throws(()=>gradeB1Mock4Lesen({...ANSWERS,1:"c"}),/Invalid/);
  assert.throws(()=>gradeB1Mock4Lesen({...ANSWERS,13:"i"}),/Invalid/);
  assert.throws(()=>gradeB1Mock4Lesen({...ANSWERS,14:"d"}),/only once/);
});
