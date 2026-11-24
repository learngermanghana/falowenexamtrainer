const { queueId, enqueueA2Writing, validateTutorGrade, publishA2TutorGrade } = require("../mockWritingTutorFallback");
const { READING_ANSWER_KEY, LISTENING_ANSWER_KEY } = require("../a2MockCompletionSync");
function fixture() {
  const path = "a2MockExamUsers/u/attempts/a";
  const docs = new Map([[path,{uid:"u",mockId:"a2-mock-01",email:"student@example.test",status:"in_progress",attemptNumber:1,firstAttempt:true,
    verifiedSections:{sprechen:{verified:true,score:20}},
    state:{stage:"result",completed:true,writingPending:true,schreibenSms:"Hallo",schreibenEmail:"Guten Tag",lesenAnswers:READING_ANSWER_KEY,hoerenAnswers:LISTENING_ANSWER_KEY}}]]);
  const ref = p => ({path:p,collection:n=>ref(p+"/"+n),doc:n=>ref(p+"/"+n),get:async()=>snap(p)});
  const snap = p => ({exists:docs.has(p),data:()=>docs.get(p)});
  const db = {collection:ref,runTransaction:async fn=>{
    const writes=[];
    const tx={get:async r=>snap(r.path),set:(r,d,o)=>writes.push(()=>docs.set(r.path,o?.merge?{...docs.get(r.path),...d}:d)),update:(r,d)=>writes.push(()=>docs.set(r.path,{...docs.get(r.path),...d}))};
    const result=await fn(tx);writes.forEach(write=>write());return result;
  }};
  const admin={firestore:{FieldValue:{serverTimestamp:()=>"timestamp"}}};
  return {db,admin,docs,path};
}
test("queues the exact saved attempt once and preserves original submitted answers",async()=>{
  const f=fixture();
  expect(await enqueueA2Writing({...f,uid:"u",attemptId:"a",recover:true})).toBe(true);
  expect(await enqueueA2Writing({...f,uid:"u",attemptId:"a",answers:{sms:"changed",email:"changed"}})).toBe(true);
  expect(f.docs.get("mockWritingTutorQueue/"+queueId("u","a")).answers).toEqual({sms:"Hallo",email:"Guten Tag"});
  expect(f.docs.get(f.path).writingTutorReview.status).toBe("pending");
});
test("publishes the verified score, feedback and notification exactly once",async()=>{
  const f=fixture();
  await enqueueA2Writing({...f,uid:"u",attemptId:"a",recover:true});
  const input={...f,id:queueId("u","a"),identity:{uid:"tutor"},grade:{smsScore:8,emailScore:12,feedback:"Good work"},findStudentProfile:async()=>null};
  expect(await publishA2TutorGrade(input)).toEqual({published:true,score:90});
  const data=f.docs.get(f.path);
  expect(data.status).toBe("completed");
  expect(data.state.writingPending).toBe(false);
  expect(data.verifiedSections.schreiben.score).toBe(20);
  expect(f.docs.get("scores/"+data.completionSync.scoreDocId).feedback).toBe("Good work");
  expect(await publishA2TutorGrade(input)).toEqual({alreadyPublished:true});
});
test("does not publish when another module is unverified",async()=>{
  const f=fixture();f.docs.get(f.path).verifiedSections={};
  await enqueueA2Writing({...f,uid:"u",attemptId:"a",recover:true});
  await expect(publishA2TutorGrade({...f,id:queueId("u","a"),identity:{uid:"tutor"},grade:{smsScore:8,emailScore:12,feedback:"Feedback"},findStudentProfile:async()=>null})).rejects.toMatchObject({code:"A2_MOCK_SECTION_NOT_VERIFIED"});
  expect(f.docs.get(f.path).status).toBe("in_progress");
});
test("rejects invalid grade bounds and unsubmitted recovery",async()=>{
  expect(()=>validateTutorGrade({smsScore:11,emailScore:12,feedback:"x"})).toThrow();
  const f=fixture();f.docs.get(f.path).state.stage="sprechen";
  await expect(enqueueA2Writing({...f,uid:"u",attemptId:"a",recover:true})).rejects.toMatchObject({status:409});
});
