"use strict";
const {PART_MAX,PLAN_POINTS,TOPICS,PARTNER_PRESENTATION,
  speakingTasks,verifyReceipt,gradeParts}=require("../b1Mock3Speaking");
const {createExaminerFlow,currentStep,profileFor}=require("../goetheExaminerFlow");
const options={uid:"student-1",attemptId:"attempt-03",choice:"b"};
const receipt=(i)=>({
  uid:options.uid,sessionId:"mock3-session-"+i,
  level:"B1",mockAttemptId:options.attemptId,completed:true,
  source:"exam-speaking-practice",examFlowKey:"B1-"+i,teil:"Teil "+i,
  task:{id:"b1-mock-03-speaking-teil-"+i,prompt:speakingTasks(options.choice)[i-1].prompt},
  assessment:{score:8,maxScore:10,summary:"Recorded and assessed"},
  feedback:"Strengths: clear examples"
});
test("B1 Mock 3 has three original conversational parts and two presentation choices",()=>{
  expect(PART_MAX).toEqual([9,10,6]);
  expect(Object.keys(TOPICS)).toEqual(["a","b"]);
  const tasks=speakingTasks("b");
  expect(tasks.map(t=>t.teil)).toEqual(["1","2","3"]);
  expect(tasks[0].prompt).toMatch(/Sprachabend/);
  expect(tasks[0].prompt).toMatch(/Stadtbibliothek/);
  expect(tasks[1].prompt).toMatch(/Sport im Verein/);
  expect(tasks[2].prompt).toMatch(/Feedback und Fragen/);
  expect(PARTNER_PRESENTATION).toMatch(/Digitale Bücher/);
  expect(()=>speakingTasks("c")).toThrow(/Unknown B1 presentation topic/);
});
test("Familiar B1 LiveSpeak planning uses the actual Mock 3 decisions",()=>{
  const task={...speakingTasks("a")[0],id:"b1-mock-03-speaking-teil-1"};
  const flow=createExaminerFlow("B1",task,"simulation");
  expect(flow.key).toBe("B1-1");
  expect(profileFor(flow).decisionPoints).toEqual(PLAN_POINTS.map(p=>p.id));
  expect(currentStep(flow,0).instruction).toMatch(/Sprachabend/);
});
test("Mock 3 Teil 3 plays an AI partner presentation before asking the candidate a question",()=>{
  const task={...speakingTasks("b")[2],id:"b1-mock-03-speaking-teil-3"};
  const flow=createExaminerFlow("B1",task,"simulation");
  expect(flow.discussion.presentation).toBe(PARTNER_PRESENTATION);
  expect(currentStep(flow,0)).toMatchObject({action:"feedback-and-question",role:"partner"});
  expect(currentStep(flow,1)).toMatchObject({action:"answer-examiner",role:"examiner"});
  expect(currentStep(flow,1).instruction).toMatch(/Sport im Verein/);
});
test("Immutable sessions are verified against student, attempt, mock, flow and exact chosen topic",()=>{
  const verified=[1,2,3].map(i=>verifyReceipt(receipt(i),{...options,teil:String(i),sessionId:"mock3-session-"+i}));
  expect(verified.map(r=>r.maxScore)).toEqual([9,10,6]);
  expect(verified.map(r=>r.score)).toEqual([7.2,8,4.8]);
  expect(gradeParts(verified)).toMatchObject({score:20,maxScore:25,passed:true,practiceOnly:true,
    verifiedBy:"immutable-live-speak-results"});
  expect(()=>verifyReceipt({...receipt(1),uid:"another"},{...options,teil:"1",sessionId:"mock3-session-1"})).toThrow(/no saved/);
  expect(()=>verifyReceipt({...receipt(2),mockAttemptId:"another"},{...options,teil:"2",sessionId:"mock3-session-2"})).toThrow(/no saved/);
  expect(()=>verifyReceipt({...receipt(3),examFlowKey:"B1-2"},{...options,teil:"3",sessionId:"mock3-session-3"})).toThrow(/no saved/);
  expect(()=>verifyReceipt({...receipt(2),task:{...receipt(2).task,prompt:speakingTasks("a")[1].prompt}},{...options,teil:"2",sessionId:"mock3-session-2"})).toThrow(/no saved/);
  expect(()=>verifyReceipt({...receipt(3),completed:false},{...options,teil:"3",sessionId:"mock3-session-3"})).toThrow(/no saved/);
});
test("When the time expires, missing parts receive zero but a premature result is rejected",()=>{
  const first=verifyReceipt(receipt(1),{...options,teil:"1",sessionId:"mock3-session-1"});
  expect(()=>gradeParts([first,null,null])).toThrow(/Complete all 3/);
  expect(gradeParts([first,null,null],{expired:true})).toMatchObject({score:7.2,parts:{
    teil2:{score:0,maxScore:10},teil3:{score:0,maxScore:6}
  }});
});
test("All Mock 3 endpoints are release-gated, not exposed until teacher approval",()=>{
  const app={get:jest.fn(),post:jest.fn()};
  const register=require("../b1Mock3SpeakingRoutes");
  register(app,{admin:{},requireAccess:jest.fn()});
  const paths=[...app.get.mock.calls,...app.post.mock.calls].map(v=>v[0]);
  expect(paths).toEqual(expect.arrayContaining([
    "/b1-mock-03/sprechen/config","/b1-mock-03/sprechen/start",
    "/b1-mock-03/sprechen/part","/b1-mock-03/sprechen/score"
  ]));
  const route=app.get.mock.calls.find(([p])=>p.endsWith("/config"))[1];
  const old=process.env.B1_MOCK3_SPEAKING_RELEASED;
  delete process.env.B1_MOCK3_SPEAKING_RELEASED;
  const res={status:jest.fn().mockReturnThis(),json:jest.fn().mockReturnThis()};
  return Promise.resolve(route({},res)).then(()=>{
    expect(res.status).toHaveBeenCalledWith(404);
    if(old!==undefined)process.env.B1_MOCK3_SPEAKING_RELEASED=old;
  });
});
