"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {MOCK_IDS,ANSWER_KEYS,attemptContract,VERSION}=require("../a2KombiMockContract");
const {buildVerifiedA2MockScore,buildA2MockCompletionArtifacts,READING_ANSWER_KEY,LISTENING_ANSWER_KEY}=require("../a2MockCompletionSync");
const {mockTaskPrompt,mockTaskVersion}=require("../assessmentTaskContext");
const tasks=require("../a2KombiTaskSets");
const receipts=(schreiben=25,sprechen=25)=>({schreiben:{score:schreiben,verified:true},sprechen:{score:sprechen,verified:true}});
test("five independent source papers, each with 20 private answers",()=>{
 assert.deepEqual(MOCK_IDS,["a2-mock-04","a2-mock-05","a2-mock-06","a2-mock-07","a2-mock-08"]);
 for(const id of MOCK_IDS){
  const entries=Object.entries(ANSWER_KEYS[id]);
  assert.equal(entries.length,20);
  for(const [key,answer] of entries){const n=Number(key.split("-")[1]);assert.equal(key,`t${n<=5?1:n<=10?2:n<=15?3:4}-${n}`);
    assert.ok(n<16?["a","b","c"].includes(answer):["a","b","c","d","e","f","x"].includes(answer));}
  assert.equal(tasks[id].writing.teil1.points.length,3);
  assert.equal(tasks[id].writing.teil2.points.length,3);
  assert.equal(tasks[id].speaking.teil2.questions.length,4);
  assert.equal(tasks[id].speaking.teil3.points.length,3);
  assert.equal(mockTaskVersion("A2","writing",id),`${id}-writing-v1`);
  assert.equal(mockTaskVersion("A2","speaking",id),`${id}-speaking-v1`);
  assert.ok(mockTaskPrompt("A2","writing",undefined,id).includes(tasks[id].writing.teil1.situation));
 }
});
for(const id of MOCK_IDS){
 test(`${id} verified /75 scoring excludes Hören and tampered browser totals`,()=>{
  const state={mockId:id,assessmentVersion:VERSION,lesenAnswers:ANSWER_KEYS[id],
    hoerenAnswers:{"t1-1":"wrong"},sectionScores:{lesen:0,hoeren:25,schreiben:25,sprechen:25},
    overall:{score:999}};
  const grade=buildVerifiedA2MockScore({mockId:id,state,verifiedSections:receipts(20,15)});
  assert.deepEqual(grade.sectionScores,{lesen:25,schreiben:20,sprechen:15});
  assert.equal(grade.overall.points,60);assert.equal(grade.overall.maxPoints,75);
  assert.equal(grade.overall.score,80);assert.equal(grade.overall.passed,true);
  assert.equal(grade.objective.hoeren,undefined);
  const doc=buildA2MockCompletionArtifacts({authedUser:{uid:"student-a2",email:"student@example.invalid"},
    attemptId:"test-attempt",mockId:id,attemptNumber:1,firstAttempt:true,
    overall:grade.overall,sectionScores:grade.sectionScores,now:new Date("2026-10-25T12:00:00Z")});
  assert.equal(doc.scoreDocument.maxPoints,75);
  assert.equal(doc.scoreDocument.assessmentVersion,VERSION);
  assert.equal(doc.scoreDocument.scoreBreakdown.length,3);
  assert.deepEqual(doc.scoreDocument.scoredModules,["lesen","schreiben","sprechen"]);
  assert.equal(doc.scoreDocument.link,`/campus/course/a2-mock-${Number(id.slice(-2))}`);
  assert.equal(doc.notificationDocument.data.hoeren,undefined);
 });
 test(`${id} missing verified AI receipt and version changes fail closed`,()=>{
  const state={mockId:id,assessmentVersion:VERSION,lesenAnswers:ANSWER_KEYS[id]};
  assert.throws(()=>buildVerifiedA2MockScore({mockId:id,state,verifiedSections:{}}),/Server-verified schreiben/);
  assert.throws(()=>buildVerifiedA2MockScore({mockId:id,state,verifiedSections:{schreiben:receipts().schreiben}}),/Server-verified sprechen/);
  assert.throws(()=>buildVerifiedA2MockScore({mockId:id,state:{...state,mockId:"a2-mock-01"},verifiedSections:receipts()}),/another mock/);
  assert.throws(()=>buildVerifiedA2MockScore({mockId:id,state:{...state,assessmentVersion:"four-module-v2"},verifiedSections:receipts()}),/version mismatch/);
  const contract=attemptContract(id);
  assert.deepEqual(contract.sections,["lesen","schreiben","sprechen"]);assert.equal(contract.maxPoints,75);
  assert.throws(()=>attemptContract(id,"four-module-v2"),/version mismatch/);
 });
}
test("historical A2 Mock 1 remains a four-module /100 exam",()=>{
 const result=buildVerifiedA2MockScore({mockId:"a2-mock-01",
  state:{lesenAnswers:READING_ANSWER_KEY,hoerenAnswers:LISTENING_ANSWER_KEY},
  verifiedSections:receipts()});
 assert.deepEqual(Object.keys(result.sectionScores),["lesen","hoeren","schreiben","sprechen"]);
 assert.equal(result.overall.maxScore,100);
});
