const flow = require("../../../functions/functionz/goetheExaminerFlow");
const {examinerTaskPreview} = require("../lib/examinerTaskPreview");
const {nextExamTeil} = require("../lib/speakingPracticeHistory");

test.each([
  ["A1",1,4],["A1",2,4],["A1",3,4],
  ["A2",1,8],["A2",2,2],["A2",3,4],
  ["B1",1,5],["B1",2,1],["B1",3,2],
  ["B2",1,2],["B2",2,4],
  ["C1",1,2],["C1",2,4],["C2",1,3],["C2",2,4]
])("%s Teil %s uses the same server-controlled examiner state machine", (level,part,count)=>{
  const task={id:`${level}-${part}`,teil:`Teil ${part}`,prompt:"Digitalisierung"};
  const exam=flow.createExaminerFlow(level,task);
  expect(exam).toEqual(expect.objectContaining({key:`${level}-${part}`}));
  const session={examFlow:exam,answeredTurns:0};
  const profile=flow.profileFor(exam);
  expect(profile.maxAnswers).toBe(count);
  expect(flow.currentStep(exam,0).instruction).toBeTruthy();
  expect(flow.isComplete({...session,answeredTurns:0})).toBe(false);
  if (!profile.decisionPoints) expect(flow.isComplete({...session,answeredTurns:count})).toBe(true);
  expect(flow.responsePlan({...session,answeredTurns:count}).ready).toBe(true);
});

test("A1 Teil 2 uses two distinct themes and the partner answers without inventing a next question",()=>{
  const exam=flow.createExaminerFlow("A1",{id:"fahrkarte",teil:"Teil 2",prompt:"Verkehr / Unterwegs",keywords:"Fahrkarte"});
  expect(exam.cards).toHaveLength(2);
  expect(exam.cards[0].word).toBe("Fahrkarte");
  expect(exam.cards[0].theme).not.toEqual(exam.cards[1].theme);
  const session={level:"A1",examTask:{teil:"Teil 2"},examFlow:exam,answeredTurns:1};
  const plan=flow.responsePlan(session);
  expect(plan.previous.action).toBe("ask-question");
  expect(plan.step.action).toBe("answer-question");
  const instructions=flow.partnerInstructions(session,plan);
  expect(instructions).toContain("Answer ONLY the candidate's question");
  expect(instructions).toContain("do not include nextInstruction");
  expect(instructions).toContain('"nextInstruction":""');
  const preview=examinerTaskPreview("A1",{teil:"Teil 2",prompt:"Verkehr / Unterwegs",keywords:"Fahrkarte"});
  expect(preview.cardThemes[0]).not.toEqual(preview.cardThemes[1]);
});

test("A2 questions use the same focused partner rule while higher levels adapt the interaction",()=>{
  const a2=flow.createExaminerFlow("A2",{teil:"Teil 1",prompt:"Persönliche Fragen",keywords:"Sprachen"});
  const a2Instructions=flow.partnerInstructions({level:"A2",examFlow:a2,answeredTurns:1,examTask:{}},
    flow.responsePlan({examFlow:a2,answeredTurns:1}));
  expect(a2Instructions).toContain("Answer ONLY");
  const c2=flow.createExaminerFlow("C2",{teil:"Teil 2",prompt:"Politische Kommunikation"});
  const dynamic=flow.responsePlan({examFlow:c2,answeredTurns:1});
  expect(dynamic.dynamic).toBe(true);
  expect(flow.partnerInstructions({level:"C2",examFlow:c2,answeredTurns:1,examTask:{}},dynamic)).toContain("counterargument");
  expect(flow.currentStep(c2,3).instruction).toContain("Fassen Sie");
});

test("upper Goethe levels have exactly two parts",()=>{
  expect(nextExamTeil("C1","Teil 1")).toBe("2");
  expect(nextExamTeil("C1","Teil 2")).toBeNull();
  expect(nextExamTeil("C2","Teil 2")).toBeNull();
  expect(flow.createExaminerFlow("C2",{teil:"Teil 3"})).toBeNull();
});
