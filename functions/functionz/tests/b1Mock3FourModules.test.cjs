"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { QUESTIONS } = require("../b1Mock3Hoeren");
const { B1_MOCK3_READING_KEY, B1_MOCK3_HOEREN_KEY } = require("../b1Mock3AnswerKeys");
const { B1_MOCK2_READING_KEY } = require("../b1Mock2ReadingKey");
const { buildVerifiedB1MockScore, buildB1MockCompletionArtifacts } = require("../b1MockCompletionSync");
const verifiedSections={schreiben:{verified:true,score:21},sprechen:{verified:true,score:19}};
test("Mock 3 has 30 distinct source-based server objective answers per module", () => {
  assert.equal(Object.keys(B1_MOCK3_READING_KEY).length,30);
  assert.equal(Object.keys(B1_MOCK3_HOEREN_KEY).length,30);
  assert.equal(QUESTIONS.length,30);
  for(const q of QUESTIONS) assert.equal(B1_MOCK3_HOEREN_KEY[`t${q.part}-${q.number}`],q.answer);
  assert.equal(B1_MOCK3_READING_KEY["t3-14"],"0");
  assert.equal(B1_MOCK3_READING_KEY["t4-21"],"nein");
  assert.notDeepEqual(B1_MOCK3_READING_KEY,B1_MOCK2_READING_KEY);
});
test("Mock 3 recomputes /100 completion solely from own keys and receipts",()=>{
  const full=buildVerifiedB1MockScore({mockId:"b1-mock-03",
    state:{lesenAnswers:B1_MOCK3_READING_KEY,hoerenAnswers:B1_MOCK3_HOEREN_KEY},
    verifiedSections});
  assert.deepEqual(full.sectionScores,{lesen:25,hoeren:25,schreiben:21,sprechen:19});
  assert.deepEqual(full.overall,{score:90,maxScore:100,passed:true});
  assert.throws(()=>buildVerifiedB1MockScore({mockId:"b1-mock-03",
    state:{lesenAnswers:B1_MOCK3_READING_KEY,hoerenAnswers:B1_MOCK3_HOEREN_KEY,
      sectionScores:{schreiben:25,sprechen:25}},verifiedSections:{}}),/Server-verified schreiben/);
  const wrong=buildVerifiedB1MockScore({mockId:"b1-mock-03",
    state:{lesenAnswers:B1_MOCK2_READING_KEY,hoerenAnswers:{}},verifiedSections});
  assert.ok(wrong.sectionScores.lesen<25);
  assert.equal(wrong.sectionScores.hoeren,0);
});
test("Mock 3 result records use separate ID, route and source",()=>{
  const a=buildB1MockCompletionArtifacts({authedUser:{uid:"sample",email:"student@example.com"},
    attemptId:"attempt3",attemptNumber:1,firstAttempt:true,overall:{score:90,passed:true},
    sectionScores:{lesen:25,hoeren:25,schreiben:21,sprechen:19},mockId:"b1-mock-03"});
  assert.equal(a.scoreDocument.assignmentId,"B1-MOCK-03-ATTEMPT-1");
  assert.equal(a.scoreDocument.link,"/campus/course/b1-mock-3");
  assert.equal(a.scoreDocument.source,"b1_mock_03");
  assert.ok(a.scoreDocId.includes("b1-mock-03"));
  assert.equal(a.notificationDocument.title,"Your B1 Mock 3 result is ready");
});
