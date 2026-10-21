"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const {scoreA2ExaminerSnapshots} = require("../a2MockExaminerScore");

const attemptId="a2-attempt-owner";
const uid="student-owner";
const receipts = (overrides={}) => Object.fromEntries(["1","2","3"].map(part=>[
  `session-${part}`, {
    uid,sessionId:`session-${part}`,mockAttemptId:attemptId,level:"A2",
    teil:`Teil ${part}`,source:"exam-speaking-practice",completed:true,
    task:{id:`a2-mock-01-speaking-teil-${part}`,teil:`Teil ${part}`},
    assessment:{score:8,maxScore:10},feedback:"Verified German-speaking examiner.",
    ...overrides[part],
  },
]));
const fakeDb = records => ({
  collection: name => {
    assert.equal(name,"liveSpeakExamResults");
    return {doc:id=>({get:async()=>({data:()=>records[id]})})};
  },
});
const score = (records,sessionIds=["session-1","session-2","session-3"],args={}) =>
  scoreA2ExaminerSnapshots({db:fakeDb(records),uid,attemptId,sessionIds,...args});

test("three owner-bound examiner snapshots become a 25-point verified score",async()=>{
  const result=await score(receipts());
  assert.equal(result.score,20);
  assert.equal(result.maxScore,25);
  assert.equal(result.assessmentIdentity,"a2-mock-01-examiner-verified");
  assert.equal(result.parts.teil2.feedback_en,"Verified German-speaking examiner.");
});
test("missing Teil receives zero, not a fabricated answer",async()=>{
  const result=await score(receipts(),["session-1",null,"session-3"]);
  assert.ok(result.score<20);
  assert.equal(result.parts.teil2.score,0);
});
test("reject forged ownership, wrong mock attempt, incomplete and wrong task receipts",async()=>{
  for(const changed of [
    {uid:"different-student"}, {mockAttemptId:"different-attempt"},
    {completed:false}, {source:"standalone"},
    {task:{id:"a2-mock-02-speaking-teil-1"}},
    {assessment:{score:8,maxScore:0}},
  ]){
    await assert.rejects(score(receipts({"1":changed})),/no verified examiner result/);
  }
});
test("duplicate sessions and malformed attempts never count twice",async()=>{
  await assert.rejects(score(receipts(),["session-1","session-1","session-3"]),/cannot count for multiple parts/);
  await assert.rejects(score(receipts(),["session-1","session-2"]),/exactly three/);
  await assert.rejects(score(receipts(),[null,null,null],{attemptId:""}),/attempt ID is required/);
});
