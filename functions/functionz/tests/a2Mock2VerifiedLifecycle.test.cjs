"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {
  MOCK_2_READING_ANSWER_KEY,MOCK_2_LISTENING_ANSWER_KEY,
  buildVerifiedA2MockScore,buildA2MockCompletionArtifacts,
}=require("../a2MockCompletionSync");
const {scoreA2ExaminerSnapshots,bindLegacyMock2ExaminerReceipts}=require("../a2MockExaminerScore");

test("Mock 2 receives distinct correct server-owned objective keys",()=>{
  assert.equal(Object.keys(MOCK_2_READING_ANSWER_KEY).length,20);
  assert.equal(Object.keys(MOCK_2_LISTENING_ANSWER_KEY).length,20);
  assert.equal(MOCK_2_READING_ANSWER_KEY["12"],"a");
  assert.equal(MOCK_2_READING_ANSWER_KEY["20"],"x");
  assert.equal(MOCK_2_LISTENING_ANSWER_KEY["9"],"d");
  assert.equal(MOCK_2_LISTENING_ANSWER_KEY["11"],"c");
  const result=buildVerifiedA2MockScore({
    mockId:"a2-mock-02",
    state:{lesenAnswers:MOCK_2_READING_ANSWER_KEY,hoerenAnswers:MOCK_2_LISTENING_ANSWER_KEY},
    verifiedSections:{schreiben:{verified:true,score:16},sprechen:{verified:true,score:18}},
  });
  assert.deepEqual(result.sectionScores,{lesen:25,hoeren:25,schreiben:16,sprechen:18});
  assert.equal(result.overall.score,84);
  assert.throws(()=>buildVerifiedA2MockScore({
    mockId:"a2-mock-02",verifiedSections:{schreiben:{verified:true,score:16}},
  }),/server-verified sprechen/i);
});

test("Mock 2 generates its own score and notification records, not Mock 1",()=>{
  const a={authedUser:{uid:"uid",email:"student@example.test"},attemptId:"abc",
    attemptNumber:1,firstAttempt:true,
    overall:{score:84,passed:true},
    sectionScores:{lesen:25,hoeren:25,schreiben:16,sprechen:18}};
  const first=buildA2MockCompletionArtifacts(a);
  const second=buildA2MockCompletionArtifacts({...a,mockId:"a2-mock-02"});
  assert.notEqual(first.scoreDocId,second.scoreDocId);
  assert.notEqual(first.notificationId,second.notificationId);
  assert.equal(second.scoreDocument.assignment,"A2 Mock 2");
  assert.equal(second.scoreDocument.assignmentId,"A2-MOCK-02-ATTEMPT-1");
  assert.equal(second.scoreDocument.link,"/campus/course/a2-mock-2");
});

const receipt=(id,i,overrides={})=>({
  uid:"student",sessionId:id,mockAttemptId:"attempt-2",level:"A2",
  teil:"Teil "+i,source:"exam-speaking-practice",completed:true,
  task:{id:`a2-mock-02-speaking-teil-${i}`,teil:"Teil "+i},
  assessment:{score:8,maxScore:10},feedback:"Verified examiner feedback",
  ...overrides,
});
test("Mock 2 examiner receipts require the same student, task and attempt",async()=>{
  const ids=["s1","s2","s3"];
  const data=Object.fromEntries(ids.map((id,i)=>[id,receipt(id,i+1)]));
  const db={collection:name=>{
    assert.equal(name,"liveSpeakExamResults");
    return {doc:id=>({get:async()=>({data:()=>data[id]})})};
  }};
  const run=(records=db)=>scoreA2ExaminerSnapshots({
    db:records,uid:"student",mockId:"a2-mock-02",attemptId:"attempt-2",sessionIds:ids,
  });
  const result=await run();
  assert.equal(result.score,20);
  assert.equal(result.assessmentIdentity,"a2-mock-02-examiner-verified");
  const badDb={collection:()=>({doc:id=>({get:async()=>({data:()=>({...data[id],mockAttemptId:"other"})})})})};
  await assert.rejects(()=>run(badDb),/no verified examiner result/);
});

test("pre-upgrade Mock 2 receipts can be claimed once only by their owner",async()=>{
  const ids=["s1","s2","s3"];
  const items=Object.fromEntries(ids.map((id,i)=>[id,receipt(id,i+1,{
    mockAttemptId:"",
    createdAt:{toMillis:()=>Date.parse("2026-10-21T09:30:00Z")},
  })]));
  let writes=0;
  const db={
    collection:name=>{
      if(name==="a2MockExamUsers")return {doc:()=>({collection:()=>({doc:()=>({key:"attempt"})})})};
      if(name==="liveSpeakExamResults")return {doc:id=>({key:id})};
      throw Error(name);
    },
    runTransaction:async task=>task({
      get:async ref=>({data:()=>ref.key==="attempt"?{
        uid:"student",mockId:"a2-mock-02",startedAt:{toMillis:()=>Date.parse("2026-10-21T10:30:00Z")},
      }:items[ref.key]}),
      update:(ref,changes)=>{writes++;items[ref.key]={...items[ref.key],...changes}},
    }),
  };
  const args={db,admin:{firestore:{FieldValue:{serverTimestamp:()=>({})}}},
    uid:"student",attemptId:"attempt-2",sessionIds:ids};
  assert.equal(await bindLegacyMock2ExaminerReceipts(args),true);
  assert.equal(writes,3);
  assert.deepEqual(ids.map(id=>items[id].mockAttemptId),["attempt-2","attempt-2","attempt-2"]);
  assert.equal(await bindLegacyMock2ExaminerReceipts(args),true);
  assert.equal(writes,3);
  await assert.rejects(()=>bindLegacyMock2ExaminerReceipts({...args,uid:"other"}),
    /ownership could not be verified/);
});
