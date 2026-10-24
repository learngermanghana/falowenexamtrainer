"use strict";
const {scoreB1ExaminerSnapshots,PART_MAX}=require("../b1MockExaminerScore");
const {createExaminerFlow,currentStep,profileFor}=require("../goetheExaminerFlow");

function fixture({mockId="b1-mock-02",uid="learner-1",attemptId="att-1"}={}) {
  const prompts=mockId==="b1-mock-02"
    ? ["Frau Keller feiert ihr Firmenjubiläum. Gemeinsam planen.","Bio-Produkte kaufen? Präsentation.","Geben Sie Feedback zur Präsentation."]
    : ["Geburtstagsparty gemeinsam planen.","Bücher oder digital lernen?","Geben Sie Feedback zur Präsentation."];
  const receipts=Object.fromEntries([1,2,3].map((teil,index)=>{
    const id=`session-${teil}`;
    return [id,{uid,sessionId:id,mockAttemptId:attemptId,level:"B1",
      teil:`Teil ${teil}`,source:"exam-speaking-practice",examFlowKey:`B1-${teil}`,completed:true,
      task:{id:`${mockId}-speaking-teil-${teil}`,prompt:prompts[index]},
      assessment:{score:6,maxScore:8,summary:"Task completed"}}];
  }));
  const attempt={uid,mockId,status:"in_progress"};
  const db={collection:name=>({
    doc:id=>({
      collection:()=>({doc:()=>({get:async()=>({exists:true,data:()=>attempt})})}),
      get:async()=>({exists:Boolean(receipts[id]),data:()=>receipts[id]})
    })
  })};
  return {db,receipts,attempt,params:{db,uid,attemptId,mockId,sessionIds:["session-1","session-2","session-3"]}};
}

test("B1 live examiner verifies 3 independent parts and scores to 25",async()=>{
  const {params}=fixture();
  const result=await scoreB1ExaminerSnapshots(params);
  expect(PART_MAX).toEqual([9,10,6]);
  expect(result.score).toBe(18.8);
  expect(result.assessmentIdentity).toBe("b1-mock-02-examiner-verified");
  expect(result.parts.teil1.maxScore).toBe(9);
  expect(result.parts.teil2.maxScore).toBe(10);
  expect(result.parts.teil3.maxScore).toBe(6);
});
test("B1 Mock 1 uses the same protected examiner infrastructure",async()=>{
  const {params}=fixture({mockId:"b1-mock-01"});
  const result=await scoreB1ExaminerSnapshots(params);
  expect(result.assessmentIdentity).toBe("b1-mock-01-examiner-verified");
});
test("rejects mismatched attempt, user, fake prompts, duplicates and missing receipts",async()=>{
  const f=fixture();
  await expect(scoreB1ExaminerSnapshots({...f.params,sessionIds:["session-1","session-1","session-3"]}))
    .rejects.toMatchObject({code:"B1_MOCK_EXAMINER_SESSION_DUPLICATE"});
  await expect(scoreB1ExaminerSnapshots({...f.params,uid:"another"}))
    .rejects.toMatchObject({code:"B1_MOCK_ATTEMPT_MISMATCH"});
  await expect(scoreB1ExaminerSnapshots({...f.params,mockId:"b1-mock-01"}))
    .rejects.toMatchObject({code:"B1_MOCK_ATTEMPT_MISMATCH"});
  f.receipts["session-2"].mockAttemptId="different";
  await expect(scoreB1ExaminerSnapshots(f.params)).rejects.toMatchObject({code:"B1_MOCK_EXAMINER_RESULT_NOT_VERIFIED"});
  f.receipts["session-2"].mockAttemptId=f.params.attemptId;
  f.receipts["session-1"].task.prompt="Unrelated generic speaking practice";
  await expect(scoreB1ExaminerSnapshots(f.params)).rejects.toMatchObject({code:"B1_MOCK_EXAMINER_RESULT_NOT_VERIFIED"});
});
test("unanswered parts receive zero only when explicitly null at timeout",async()=>{
  const {params}=fixture();
  const r=await scoreB1ExaminerSnapshots({...params,sessionIds:["session-1",null,null]});
  expect(r.score).toBe(6.8);
  expect(r.parts.teil3.score).toBe(0);
});
test("Frau Keller and partner-presentation tasks are selected server-side",()=>{
  const plan=createExaminerFlow("B1",{id:"b1-mock-02-speaking-teil-1",teil:"Teil 1",prompt:"Frau Keller feiert Firmenjubiläum: eine Überraschungsfeier planen"},"simulation");
  expect(plan.planningPoints.map(x=>x.id)).toEqual(["time_place","guests","gift_budget","food_decoration"]);
  expect(profileFor(plan).decisionPoints).toEqual(["time_place","guests","gift_budget","food_decoration"]);
  const discussion=createExaminerFlow("B1",{id:"b1-mock-02-speaking-teil-3",teil:"Teil 3",prompt:"Feedback und Fragen zur Präsentation",keywords:"Sollte man im Alltag mehr Bio-Produkte kaufen?"},"simulation");
  expect(currentStep(discussion,0).instruction).toContain("Online Deutsch lernen");
  expect(currentStep(discussion,0).action).toBe("feedback-and-question");
  expect(currentStep(discussion,1).instruction).toContain("Bio-Produkte");
});
