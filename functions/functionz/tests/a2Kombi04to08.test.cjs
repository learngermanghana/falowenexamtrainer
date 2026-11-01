"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const sets=require("../a2KombiMarkingSets");
const {buildVerifiedA2MockScore,buildA2MockCompletionArtifacts}=require("../a2MockCompletionSync");
const {mockTaskPrompt,mockTaskVersion}=require("../assessmentTaskContext");

test("all five A2 Kombiprüfungen have 20 private answer keys and unique task rubrics",()=>{
  assert.deepEqual(Object.keys(sets),["a2-mock-04","a2-mock-05","a2-mock-06","a2-mock-07","a2-mock-08"]);
  for(let n=4;n<=8;n++){
    const id=`a2-mock-0${n}`,set=sets[id];
    assert.deepEqual(Object.keys(set.reading),Array.from({length:20},(_,i)=>String(i+1)));
    assert.deepEqual(Object.keys(set.writing),["teil1","teil2"]);
    for(const teil of Object.values(set.writing)) {
      assert.equal(teil.points.length,3);
      assert.ok(teil.situation.length>20);
    }
    assert.equal(set.speaking.cards.length,4);
    assert.equal(set.speaking.teil2.points.length,4);
    assert.equal(set.speaking.teil3.points.length,4);
    assert.ok(mockTaskPrompt("A2","writing",undefined,id).includes(set.writing.teil1.situation));
    assert.ok(mockTaskPrompt("A2","speaking",undefined,id).includes(set.speaking.teil3.situation));
    assert.equal(mockTaskVersion("A2","writing",id),`${id}-writing-v1`);
    assert.equal(mockTaskVersion("A2","speaking",id),`${id}-speaking-v1`);
  }
});

test("Historical A2 Mocks 04–08 keep their three-module /75 verified results; Hören is not fabricated",()=>{
  for(let n=4;n<=8;n++){
    const id=`a2-mock-0${n}`,key=sets[id].reading;
    const verification={schreiben:{verified:true,score:20},sprechen:{verified:true,score:22}};
    const grade=buildVerifiedA2MockScore({
      mockId:id,state:{mockId:id,assessmentVersion:"three-module-v1",lesenAnswers:key},
      verifiedSections:verification,
    });
    assert.deepEqual(Object.keys(grade.sectionScores),["lesen","schreiben","sprechen"]);
    assert.equal(grade.sectionScores.lesen,25);
    assert.equal(grade.overall.points,67);
    assert.equal(grade.overall.maxPoints,75);
    assert.equal(grade.overall.assessmentVersion,"three-module-v1");
    assert.equal(grade.overall.score,89.3);
    assert.equal(grade.overall.passed,true);
    assert.equal(grade.objective.lesen.total,20);
    assert.equal("hoeren" in grade.sectionScores,false);
    assert.throws(()=>buildVerifiedA2MockScore({
      mockId:id,state:{lesenAnswers:key},verifiedSections:{schreiben:{verified:true,score:20}},
    }),/Server-verified sprechen/);
    assert.throws(()=>buildVerifiedA2MockScore({
      mockId:id,state:{mockId:"a2-mock-01",lesenAnswers:key},verifiedSections:verification,
    }),/another paper/);
  }
});

test("completed Kombi scores preserve mock identity, no Hören and separate /75 historical result",()=>{
  for(let n=4;n<=8;n++){
    const id=`a2-mock-0${n}`;
    const artifacts=buildA2MockCompletionArtifacts({
      mockId:id,authedUser:{uid:"student-77",email:"learner@example.test"},
      attemptId:`attempt-${n}`,attemptNumber:1,firstAttempt:true,
      overall:{score:80,points:60,maxPoints:75,passed:true,assessmentVersion:"three-module-v1"},
      sectionScores:{lesen:20,schreiben:20,sprechen:20},
      now:new Date("2026-10-27T10:00:00.000Z"),
    });
    assert.equal(artifacts.scoreDocument.maxPoints,75);
    assert.equal(artifacts.scoreDocument.hoerenPending,true);
    assert.equal(artifacts.scoreDocument.sectionScores.hoeren,undefined);
    assert.deepEqual(artifacts.scoreDocument.completedSections,["lesen","schreiben","sprechen"]);
    assert.equal(artifacts.scoreDocument.link,`/campus/course/a2-kombi-mock-${n}`);
    assert.equal(artifacts.scoreDocument.source,`a2_mock_0${n}`);
    assert.ok(artifacts.scoreDocId.includes(id));
  }
});

test("new A2 Mock 04 Hören is verified as the fourth /25 module without altering legacy attempts",()=>{
  const listening=require("../a2Mock04HoerenKeys");
  const reading=sets["a2-mock-04"].reading;
  assert.deepEqual(Object.keys(listening),Array.from({length:20},(_,i)=>String(i+1)));
  const verification={schreiben:{verified:true,score:25},sprechen:{verified:true,score:25}};
  const state={mockId:"a2-mock-04",assessmentVersion:"four-module-v2",lesenAnswers:reading,hoerenAnswers:listening};
  const graded=buildVerifiedA2MockScore({mockId:"a2-mock-04",state,verifiedSections:verification});
  assert.equal(graded.overall.points,100);
  assert.equal(graded.overall.maxPoints,100);
  assert.equal(graded.overall.assessmentVersion,"four-module-v2");
  assert.deepEqual(graded.overall.sections,["lesen","hoeren","schreiben","sprechen"]);
  assert.equal(graded.sectionScores.hoeren,25);
  const artifacts=buildA2MockCompletionArtifacts({
    authedUser:{uid:"student-77",email:"learner@example.test"},
    mockId:"a2-mock-04",attemptId:"fresh-four-skill",attemptNumber:2,
    overall:graded.overall,sectionScores:graded.sectionScores,
    now:new Date("2026-10-28T10:00:00.000Z"),
  });
  assert.equal(artifacts.scoreDocument.maxPoints,100);
  assert.equal(artifacts.scoreDocument.hoerenPending,false);
  assert.deepEqual(artifacts.scoreDocument.completedSections,["lesen","hoeren","schreiben","sprechen"]);
  assert.equal(artifacts.scoreDocument.sectionScores.hoeren,25);
  const sixListening = require("../a2Mock06HoerenKeys");
  const sixReading = sets["a2-mock-06"].reading;
  const sixResult = buildVerifiedA2MockScore({
    mockId:"a2-mock-06",
    state:{mockId:"a2-mock-06",assessmentVersion:"four-module-v2",
      lesenAnswers:sixReading,hoerenAnswers:sixListening},
    verifiedSections:verification,
  });
  assert.equal(sixResult.overall.points,100);
  assert.equal(sixResult.overall.maxPoints,100);
  assert.equal(sixResult.sectionScores.hoeren,25);
  const sixArtifacts=buildA2MockCompletionArtifacts({
    mockId:"a2-mock-06",authedUser:{uid:"student-06"},attemptId:"fresh",
    overall:sixResult.overall,sectionScores:sixResult.sectionScores,
  });
  assert.equal(sixArtifacts.scoreDocument.maxPoints,100);
  assert.equal(sixArtifacts.scoreDocument.hoerenPending,false);
  assert.deepEqual(sixArtifacts.scoreDocument.completedSections,["lesen","hoeren","schreiben","sprechen"]);
  const listening07=require("../a2Mock07HoerenKeys");
  const result07=buildVerifiedA2MockScore({
    mockId:"a2-mock-07",
    state:{mockId:"a2-mock-07",assessmentVersion:"four-module-v2",
      lesenAnswers:sets["a2-mock-07"].reading,hoerenAnswers:listening07},
    verifiedSections:verification,
  });
  assert.equal(result07.overall.points,100);
  assert.equal(result07.overall.maxPoints,100);
  assert.equal(result07.sectionScores.hoeren,25);
  const artifacts07=buildA2MockCompletionArtifacts({
    mockId:"a2-mock-07",authedUser:{uid:"student-07"},attemptId:"fresh",
    overall:result07.overall,sectionScores:result07.sectionScores,
  });
  assert.equal(artifacts07.scoreDocument.maxPoints,100);
  assert.equal(artifacts07.scoreDocument.hoerenPending,false);
  assert.deepEqual(artifacts07.scoreDocument.completedSections,["lesen","hoeren","schreiben","sprechen"]);
  assert.throws(()=>buildVerifiedA2MockScore({
    mockId:"a2-mock-05",state:{assessmentVersion:"four-module-v2",lesenAnswers:reading},
    verifiedSections:verification,
  }),/Unsupported/);
});
