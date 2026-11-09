"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const {B1_MOCK4_READING_KEY,B1_MOCK4_HOEREN_KEY}=require("../b1Mock4AnswerKeys");
const {ANSWERS}=require("../b1Mock4Lesen");
const {QUESTIONS}=require("../b1Mock4Hoeren");
const {B1_MOCK3_READING_KEY}=require("../b1Mock3AnswerKeys");
const {buildVerifiedB1MockScore,buildB1MockCompletionArtifacts}=require("../b1MockCompletionSync");
const verifiedSections={schreiben:{verified:true,score:21},sprechen:{verified:true,score:19}};
test("B1 Mock 04 uses 30 correct source reading and listening private keys",()=>{
  assert.equal(Object.keys(B1_MOCK4_READING_KEY).length,30);
  assert.equal(Object.keys(B1_MOCK4_HOEREN_KEY).length,30);
  assert.equal(QUESTIONS.length,30);
  assert.equal(B1_MOCK4_READING_KEY["t2-9"],"c");
  for(const [n,a] of Object.entries(ANSWERS)){
    const i=Number(n);const part=i<=6?1:i<=12?2:i<=19?3:i<=26?4:5;
    assert.equal(B1_MOCK4_READING_KEY[`t${part}-${n}`],a);
  }
  for(const q of QUESTIONS)assert.equal(B1_MOCK4_HOEREN_KEY[`t${q.part}-${q.number}`],q.answer);
  assert.notDeepEqual(B1_MOCK4_READING_KEY,B1_MOCK3_READING_KEY);
});
test("Mock 04 final /100 is independently recalculated by server",()=>{
  const grade=buildVerifiedB1MockScore({
    mockId:"b1-mock-04",
    state:{lesenAnswers:{...B1_MOCK4_READING_KEY},hoerenAnswers:{...B1_MOCK4_HOEREN_KEY}},
    verifiedSections
  });
  assert.deepEqual(grade.sectionScores,{lesen:25,hoeren:25,schreiben:21,sprechen:19});
  assert.deepEqual(grade.overall,{score:90,maxScore:100,passed:true});
  assert.throws(()=>buildVerifiedB1MockScore({
    mockId:"b1-mock-04",state:{lesenAnswers:B1_MOCK4_READING_KEY,hoerenAnswers:B1_MOCK4_HOEREN_KEY,
      overall:{score:100},sectionScores:{schreiben:25,sprechen:25}},
    verifiedSections:{sprechen:verifiedSections.sprechen}
  }),/Server-verified schreiben/);
});
test("Mock 04 result namespace and notifications are separate from Mocks 1–3",()=>{
  const args={authedUser:{uid:"student123",email:"student@example.com"},
    attemptId:"mock04attempt",attemptNumber:1,firstAttempt:true,
    overall:{score:90,passed:true},
    sectionScores:{lesen:25,hoeren:25,schreiben:21,sprechen:19}};
  const current=buildB1MockCompletionArtifacts({...args,mockId:"b1-mock-04"});
  const previous=buildB1MockCompletionArtifacts({...args,mockId:"b1-mock-03"});
  assert.equal(current.scoreDocument.assignmentId,"B1-MOCK-04-ATTEMPT-1");
  assert.equal(current.scoreDocument.link,"/campus/course/b1-mock-4");
  assert.equal(current.scoreDocument.source,"b1_mock_04");
  assert.equal(current.notificationDocument.title,"Your B1 Mock 4 result is ready");
  assert.equal(current.notificationDocument.route,"/campus/course/b1-mock-4");
  assert.ok(current.scoreDocId.includes("b1-mock-04"));
  assert.notEqual(current.scoreDocId,previous.scoreDocId);
});
