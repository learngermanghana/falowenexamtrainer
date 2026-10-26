"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {getA1MockSet}=require("../a1MockSets");
const {validateA1MockAudioKey}=require("../r2CourseAudio");
const {buildVerifiedA1MockScore,buildA1MockCompletionArtifacts}=require("../a1MockCompletionSync");
const keys=require("../a1Mock5ListeningKeys")["a1-mock-05"];
const id="a1-mock-05",mockSet=getA1MockSet(id);
const receipts={schreiben:{verified:true,score:20},sprechen:{verified:true,score:15}};
const basic={mockId:id,lesenAnswers:mockSet.readingAnswerKey};
test("all three canonical private Mock 05 recordings are accepted and unrelated requests blocked",()=>{
 for(const i of [1,2,3]){
  const key=`a1/mock-hoeren/mock-05/teil-${i}.mp3`;
  assert.equal(validateA1MockAudioKey({mockId:"mock-05",part:`teil-${i}`,key})?.key,key);
  assert.equal(validateA1MockAudioKey({mockId:"mock-04",part:`teil-${i}`,key}),null);
 }
 assert.equal(validateA1MockAudioKey({mockId:"mock-04",part:"teil-1",key:"a1/mock-hoeren/mock-05/private/answers.json"}),null);
});
test("the 15 server-only solution entries have exact question identities",()=>{
 const ids=[...Array.from({length:6},(_,i)=>`t1-${i+1}`),
 ...Array.from({length:4},(_,i)=>`t2-${i+1}`),
 ...Array.from({length:5},(_,i)=>`t3-${i+1}`)];
 assert.deepEqual(Object.keys(keys),ids);
 assert.deepEqual(mockSet.listeningAnswerKey,keys);
 for(const [key,value] of Object.entries(keys))
  assert.ok(key.startsWith("t2-")?["richtig","falsch"].includes(value):["a","b","c"].includes(value));
});
test("historical Mock 05 /75 results remain three skill and immutable by scoring version",()=>{
 const old=buildVerifiedA1MockScore({mockId:id,state:{...basic,assessmentVersion:"three-module-v1",hoerenAnswers:keys},verifiedSections:receipts});
 assert.deepEqual(Object.keys(old.sectionScores),["lesen","schreiben","sprechen"]);
 assert.equal(old.overall.maxPoints,75);
 assert.equal(old.overall.assessmentVersion,"three-module-v1");
 const doc=buildA1MockCompletionArtifacts({mockId:id,authedUser:{uid:"test-learner"},attemptId:"historical-attempt",overall:old.overall,sectionScores:old.sectionScores});
 assert.equal(doc.scoreDocument.maxPoints,75);
 assert.equal(doc.notificationDocument.data.hoeren,undefined);
});
test("new Mock 05 /100 results include 15 Hören answers, verified AI and all four scores",()=>{
 const result=buildVerifiedA1MockScore({mockId:id,state:{...basic,assessmentVersion:"four-module-v2",hoerenAnswers:keys,sectionScores:{hoeren:25},overall:{score:999}},verifiedSections:receipts});
 assert.equal(result.objective.lesen.correct,15);
 assert.equal(result.objective.hoeren.correct,15);
 assert.deepEqual(Object.keys(result.sectionScores),["lesen","hoeren","schreiben","sprechen"]);
 assert.equal(result.overall.maxPoints,100);
 assert.equal(result.overall.points,85);
 assert.equal(result.overall.score,85);
 const doc=buildA1MockCompletionArtifacts({mockId:id,authedUser:{uid:"test-learner"},attemptId:"new-attempt",overall:result.overall,sectionScores:result.sectionScores});
 assert.equal(doc.scoreDocument.assessmentVersion,"four-module-v2");
 assert.equal(doc.scoreDocument.maxPoints,100);
 assert.equal(doc.scoreDocument.scoreBreakdown.length,4);
 assert.equal(doc.notificationDocument.data.hoeren,"25");
});
test("new version rejects browser totals, missing receipt, and mismatched answer keys",()=>{
 assert.throws(()=>buildVerifiedA1MockScore({mockId:id,state:{...basic,assessmentVersion:"four-module-v2",hoerenAnswers:keys},verifiedSections:{}}),/Server-verified schreiben/);
 const empty=buildVerifiedA1MockScore({mockId:id,state:{...basic,assessmentVersion:"four-module-v2",hoerenAnswers:{}},verifiedSections:receipts});
 assert.equal(empty.objective.hoeren.score,0);
 assert.equal(empty.overall.maxPoints,100);
 assert.throws(()=>buildVerifiedA1MockScore({mockId:"a1-mock-07",state:{...basic,mockId:"a1-mock-07",assessmentVersion:"four-module-v2"},verifiedSections:receipts}),/Unsupported/);
});
