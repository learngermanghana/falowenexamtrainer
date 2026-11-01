"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const keys = require("../a2Mock3MarkingSet");
const { buildVerifiedA2MockScore, buildA2MockCompletionArtifacts } = require("../a2MockCompletionSync");
const { mockTaskPrompt, mockTaskVersion } = require("../assessmentTaskContext");

test("A2 Mock 03 owns exactly twenty distinct Lesen and Hören keys", () => {
  const expected = Array.from({length:20}, (_,i)=>String(i+1));
  assert.deepEqual(Object.keys(keys.lesen),expected);
  assert.deepEqual(Object.keys(keys.hoeren),expected);
  assert.deepEqual([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(i=>keys.lesen[i]),
    ["b","a","b","b","c","b","c","c","a","c","b","a","b","c","b","c","b","a","x","e"]);
  assert.deepEqual([16,17,18,19,20].map(i=>keys.hoeren[i]),
    ["richtig","richtig","falsch","richtig","falsch"]);
});

test("A2 Mock 03 uses server keys for genuine verified four-skill totals", () => {
  const verifiedSections={schreiben:{verified:true,score:22},sprechen:{verified:true,score:20}};
  const state={lesenAnswers:keys.lesen,hoerenAnswers:keys.hoeren};
  const result=buildVerifiedA2MockScore({state,verifiedSections,mockId:"a2-mock-03"});
  assert.deepEqual(result.sectionScores,{lesen:25,hoeren:25,schreiben:22,sprechen:20});
  assert.equal(result.overall.score,92);
  assert.equal(result.overall.maxScore,100);
  assert.equal(result.overall.passed,true);
  assert.equal(result.objective.lesen.total,20);
  assert.equal(result.objective.hoeren.total,20);
  const withWrong={...state,lesenAnswers:{...keys.lesen,"19":"d"}};
  assert.equal(buildVerifiedA2MockScore({state:withWrong,verifiedSections,mockId:"a2-mock-03"}).sectionScores.lesen,23.8);
});
test("A2 Mock 03 cannot finish with fabricated browser-supplied AI marks", () => {
  assert.throws(()=>buildVerifiedA2MockScore({
    state:{lesenAnswers:keys.lesen,hoerenAnswers:keys.hoeren},
    verifiedSections:{},
    mockId:"a2-mock-03",
  }),/Server-verified schreiben score/);
  assert.throws(()=>buildVerifiedA2MockScore({
    state:{lesenAnswers:keys.lesen,hoerenAnswers:keys.hoeren,sectionScores:{sprechen:25,schreiben:25}},
    verifiedSections:{schreiben:{verified:true,score:25}},
    mockId:"a2-mock-03",
  }),/Server-verified sprechen score/);
});
test("A2 Mock 03 prompts are teacher-specific with pinned marking versions", () => {
  const writing=mockTaskPrompt("A2","writing",undefined,"a2-mock-03");
  assert.match(writing,/Thomas/);
  assert.match(writing,/Alpenblick/);
  assert.match(writing,/Wochenend-Seminar/);
  const speaking=mockTaskPrompt("A2","speaking",undefined,"a2-mock-03");
  assert.match(speaking,/Mein letzter Urlaub/);
  assert.match(speaking,/Überraschungsparty/);
  assert.equal(mockTaskVersion("A2","writing","a2-mock-03"),"a2-mock-03-writing-v1");
  assert.equal(mockTaskVersion("A2","speaking","a2-mock-03"),"a2-mock-03-speaking-v1");
});
test("A2 Mock 03 Results and notifications are isolated from Mock 1 and 2", () => {
  const artifacts=buildA2MockCompletionArtifacts({
    authedUser:{uid:"a2-student",email:"student@example.test"},
    attemptId:"attempt-03",attemptNumber:1,firstAttempt:true,mockId:"a2-mock-03",
    sectionScores:{lesen:25,hoeren:25,schreiben:20,sprechen:20},
    overall:{score:90,passed:true},
    now:new Date("2026-10-27T00:00:00Z"),
  });
  assert.equal(artifacts.scoreDocument.source,"a2_mock_03");
  assert.equal(artifacts.scoreDocument.link,"/campus/course/a2-mock-3");
  assert.equal(artifacts.scoreDocument.assignment,"A2 Mock 3");
  assert.match(artifacts.scoreDocId,/a2-mock-03/);
  assert.match(artifacts.scoreDocument.assignmentId,/A2-MOCK-03/);
});
