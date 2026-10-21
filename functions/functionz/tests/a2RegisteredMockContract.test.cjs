"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const {KNOWN_A2_MOCKS,MOCK_TWO,getA2MockDefinition,isRegisteredA2Mock}=require("../a2MockRegistry");
const {buildVerifiedA2MockScore,buildA2MockCompletionArtifacts}=require("../a2MockCompletionSync");
const {scoreA2ExaminerSnapshots,claimLegacyA2Mock2ExaminerSessions}=require("../a2MockExaminerScore");
const {isA2SpeakingAttemptBindingSafe}=require("../a2MockSpeakingAttemptIdentity");
test("A2 Mock 1 and Mock 2 share a registered verified-result contract",()=>{
  assert.deepEqual(KNOWN_A2_MOCKS,["a2-mock-01","a2-mock-02"]);
  assert.equal(isRegisteredA2Mock("a2-mock-03"),false); // fail closed until explicitly registered
  assert.equal(getA2MockDefinition("a2-mock-02").assignmentId,"A2-MOCK-02");
  assert.equal(Object.keys(MOCK_TWO.lesen).length,20);
  assert.equal(Object.keys(MOCK_TWO.hoeren).length,20);
  assert.equal(isA2SpeakingAttemptBindingSafe({mockId:"a2-mock-02",attemptId:""}),false);
  assert.equal(isA2SpeakingAttemptBindingSafe({mockId:"a2-mock-02",attemptId:"server-id"}),true);
});
test("A2 Mock 2 keys are scored by the server and final results are mock-specific",()=>{
  const verifiedSections={schreiben:{verified:true,score:16},sprechen:{verified:true,score:20}};
  const score=buildVerifiedA2MockScore({mockId:"a2-mock-02",
    state:{lesenAnswers:{...MOCK_TWO.lesen},hoerenAnswers:{...MOCK_TWO.hoeren}},
    verifiedSections});
  assert.equal(score.overall.score,86);
  assert.equal(score.sectionScores.lesen,25);
  assert.equal(score.sectionScores.hoeren,25);
  assert.throws(()=>buildVerifiedA2MockScore({mockId:"a2-mock-02",
    state:{lesenAnswers:MOCK_TWO.lesen,hoerenAnswers:MOCK_TWO.hoeren},
    verifiedSections:{schreiben:{verified:true,score:16}}}),/Server-verified sprechen/);
  const output=buildA2MockCompletionArtifacts({mockId:"a2-mock-02",
    authedUser:{uid:"mock2-student",email:"student@example.org"},attemptId:"mock2-attempt",
    firstAttempt:true,attemptNumber:1,overall:score.overall,sectionScores:score.sectionScores});
  assert.equal(output.scoreDocument.mockId,"a2-mock-02");
  assert.equal(output.scoreDocument.assignmentId,"A2-MOCK-02");
  assert.equal(output.scoreDocument.link,"/campus/course/a2-mock-2");
  assert.equal(output.scoreDocument.source,"a2_final_mock");
});
test("historical Mock 1 publication remains unchanged",()=>{
  const result=buildA2MockCompletionArtifacts({authedUser:{uid:"one"},attemptId:"a",firstAttempt:true});
  assert.equal(result.scoreDocId,"a2-final-mock-one-a");
  assert.equal(result.notificationId,"a2-final-mock-result-one-a");
  assert.equal(result.scoreDocument.assignmentId,"A2-FINAL-MOCK");
});
test("only server-owned, attempt-matching speaking receipts count",async()=>{
  const uid="student", attemptId="attempt";
  const data=Object.fromEntries([1,2,3].map(i=>["s"+i,{
    uid,sessionId:"s"+i,mockAttemptId:attemptId,level:"A2",teil:"Teil "+i,
    source:"exam-speaking-practice",completed:true,
    task:{id:"a2-mock-02-speaking-teil-"+i},assessment:{score:8,maxScore:10},
  }]));
  const db={collection:()=>({doc:id=>({get:async()=>({data:()=>data[id]})})})};
  const result=await scoreA2ExaminerSnapshots({db,uid,attemptId,sessionIds:["s1","s2","s3"],mockId:"a2-mock-02"});
  assert.equal(result.score,20);
  assert.equal(result.assessmentIdentity,"a2-mock-02-examiner-verified");
  await assert.rejects(()=>scoreA2ExaminerSnapshots({db,uid,attemptId:"other",sessionIds:["s1","s2","s3"],mockId:"a2-mock-02"}),/no verified examiner result/);
});
test("legacy Mock 2 receipts are claimed only once for their real owner and attempt",async()=>{
  const uid="student",attemptId="recovered";
  const stored=Object.fromEntries([1,2,3].map(i=>["s"+i,{
    uid,sessionId:"s"+i,level:"A2",teil:"Teil "+i,
    source:"exam-speaking-practice",completed:true,
    task:{id:"a2-mock-02-speaking-teil-"+i},assessment:{score:7,maxScore:10},
  }]));
  const ref=(group,id)=>({group,id});
  const db={collection:group=>({doc:id=>({
    collection:inner=>({doc:child=>ref(inner,child)}),
    get:async()=>({data:()=>stored[id]}),
    ...ref(group,id),
  })}),
    runTransaction:async fn=>{
      const tx={
        get:async ref=>ref.group==="attempts"
          ? {exists:true,data:()=>({uid,mockId:"a2-mock-02"})}
          :{exists:true,data:()=>stored[ref.id]},
        update:(ref,patch)=>Object.assign(stored[ref.id],patch),
      };return fn(tx);
    },
  };
  await claimLegacyA2Mock2ExaminerSessions({db,uid,attemptId,sessionIds:["s1","s2","s3"]});
  assert.equal(stored.s2.mockAttemptId,attemptId);
  await assert.rejects(()=>claimLegacyA2Mock2ExaminerSessions({db,uid,attemptId:"other",sessionIds:["s1","s2","s3"]}),/cannot be securely recovered/);
});
test("new A2 Mock 2 uses genuine server finalization instead of browser telemetry",()=>{
 const hub=fs.readFileSync(path.join(__dirname,"../../../web/src/components/A2Mock2ExamHub.jsx"),"utf8");
 const engine=fs.readFileSync(path.join(__dirname,"../../../web/src/services/a2VerifiedMockEngine.js"),"utf8");
 const speaking=fs.readFileSync(path.join(__dirname,"../../../web/src/components/A2MockSpeakingExaminer.jsx"),"utf8");
 assert.match(hub,/startA2MockAttempt/);
 assert.match(hub,/finalizeA2RegisteredMock/);
 assert.match(engine,/scoreA2MockWriting/);
 assert.match(engine,/scoreA2MockSpeaking/);
 assert.match(engine,/status:"completed"/);
 assert.match(engine,/completionSync\?\.ok!==true/);
 assert.match(speaking,/mockAttemptId:attemptId/);
});
