"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {getA1MockSet}=require("../a1MockSets");
const {validateA1MockAudioKey}=require("../r2CourseAudio");
const {buildVerifiedA1MockScore,buildA1MockCompletionArtifacts}=require("../a1MockCompletionSync");
const keys=require("../a1Mock6ListeningKeys")["a1-mock-06"];
const id="a1-mock-06",set=getA1MockSet(id);
const verified={schreiben:{verified:true,score:20},sprechen:{verified:true,score:15}};
const basic={mockId:id,lesenAnswers:set.readingAnswerKey};
test("Mock 06 validates exactly three protected R2 MP3 keys",()=>{
 for(let i=1;i<=3;i++){
  const key=`a1/mock-hoeren/mock-06/teil-${i}.mp3`;
  assert.equal(validateA1MockAudioKey({mockId:"mock-06",part:`teil-${i}`,key})?.key,key);
  assert.equal(validateA1MockAudioKey({mockId:"mock-07",part:`teil-${i}`,key}),null);
 }
 assert.equal(validateA1MockAudioKey({mockId:"mock-06",part:"teil-1",key:"a1/mock-hoeren/mock-06/private/answers.json"}),null);
});
test("all 15 answers remain private with stable question IDs",()=>{
 const ids=[...Array.from({length:6},(_,i)=>`t1-${i+1}`),
   ...Array.from({length:4},(_,i)=>`t2-${i+1}`),
   ...Array.from({length:5},(_,i)=>`t3-${i+1}`)];
 assert.deepEqual(Object.keys(keys),ids);
 assert.deepEqual(set.listeningAnswerKey,keys);
});
test("previous Mock 06 attempts keep their three-module /75 scoring",()=>{
 const score=buildVerifiedA1MockScore({mockId:id,state:{...basic,assessmentVersion:"three-module-v1",hoerenAnswers:keys},verifiedSections:verified});
 assert.equal(score.overall.maxPoints,75);
 assert.deepEqual(Object.keys(score.sectionScores),["lesen","schreiben","sprechen"]);
 const stored=buildA1MockCompletionArtifacts({mockId:id,authedUser:{uid:"student"},attemptId:"historical",overall:score.overall,sectionScores:score.sectionScores});
 assert.equal(stored.scoreDocument.maxPoints,75);
 assert.equal(stored.notificationDocument.data.hoeren,undefined);
});
test("new four-module Mock 06 grades listening only on the server and syncs /100",()=>{
 const score=buildVerifiedA1MockScore({mockId:id,state:{...basic,assessmentVersion:"four-module-v2",hoerenAnswers:keys,sectionScores:{hoeren:0},overall:{score:999}},verifiedSections:verified});
 assert.equal(score.objective.hoeren.correct,15);
 assert.equal(score.overall.maxPoints,100);
 assert.equal(score.overall.score,85);
 assert.deepEqual(Object.keys(score.sectionScores),["lesen","hoeren","schreiben","sprechen"]);
 const stored=buildA1MockCompletionArtifacts({mockId:id,authedUser:{uid:"student"},attemptId:"new",overall:score.overall,sectionScores:score.sectionScores});
 assert.equal(stored.scoreDocument.assessmentVersion,"four-module-v2");
 assert.equal(stored.scoreDocument.scoreBreakdown.length,4);
 assert.equal(stored.notificationDocument.data.hoeren,"25");
});
test("browser grades and unverified writing are never trusted",()=>{
 assert.throws(()=>buildVerifiedA1MockScore({mockId:id,state:{...basic,assessmentVersion:"four-module-v2",hoerenAnswers:keys,overall:{score:100}},verifiedSections:{}}),/Server-verified schreiben/);
 const blank=buildVerifiedA1MockScore({mockId:id,state:{...basic,assessmentVersion:"four-module-v2",hoerenAnswers:{}},verifiedSections:verified});
 assert.equal(blank.objective.hoeren.score,0);
 assert.throws(()=>buildVerifiedA1MockScore({mockId:"a1-mock-07",state:{mockId:"a1-mock-07",assessmentVersion:"four-module-v2"},verifiedSections:verified}),/Unsupported/);
});
