import {examinerTaskPreview} from "./examinerTaskPreview";
const flows=require("../../../functions/functionz/goetheExaminerFlow");
const catalogue=require("../../../functions/data/goetheExaminerFlows.json");
const publicCatalogue=require("../data/goetheExaminerPublicFlows.json");

test.each(["A1","A2","B1"].flatMap(level=>[1,2,3].map(part=>[level,part])))("%s Teil %s has consistent public materials and a bounded sequence",(level,part)=>{
  const task={teil:`Teil ${part}`,prompt:"Freizeit"};
  const flow=flows.createExaminerFlow(level,task);
  const session={examFlow:flow,level,examTask:task,answeredTurns:0};
  const preview=examinerTaskPreview(level,task);
  const view=flows.publicFlow(session);
  expect(preview).toEqual(expect.objectContaining({key:view.key,cards:view.cards,card:view.card,points:view.points,studentCalendar:view.studentCalendar}));
  const limit=flows.maxAnswers(session);
  expect(limit).toBeLessThanOrEqual(8);
  for(let answer=0;answer<limit;answer++)expect(flows.currentStep(flow,answer)).toEqual(expect.objectContaining({index:answer+1,seconds:expect.any(Number),role:expect.stringMatching(/examiner|partner/)}));
  expect(flows.currentStep(flow,limit)).toBe(null);
});

test("B1 presentation is uninterrupted for up to three minutes and has all five stages",()=>{
  const examFlow=flows.createExaminerFlow("B1",{teil:"Teil 2",prompt:"Ausbildung"},"simulation");
  expect(flows.currentStep(examFlow,0)).toEqual(expect.objectContaining({action:"presentation",seconds:180}));
  expect(flows.responsePlan({examFlow,answeredTurns:1})).toEqual(expect.objectContaining({dynamic:false,ready:true}));
  expect(flows.publicFlow({examFlow})).toEqual(expect.objectContaining({hints:[],points:expect.arrayContaining(["Abschluss und Dank"])}));
});

test("A1 and A2 questions alternate candidate questions with candidate answers",()=>{
  for(const [level,count] of [["A1",4],["A2",8]]){
    const flow=flows.createExaminerFlow(level,{teil:"Teil 2",prompt:"Freizeit"});
    const questionFlow=level === "A1" ? flow : flows.createExaminerFlow(level,{teil:"Teil 1",prompt:"Wohnort"});
    expect(Array.from({length:count},(_,i)=>flows.currentStep(questionFlow,i).action)).toEqual(Array.from({length:count},(_,i)=>i%2 ? "answer-question" : "ask-question"));
  }
});

test("calendar decisions need supported times and an exact student quote",()=>{
  const examFlow=flows.createExaminerFlow("A2",{teil:"Teil 3"});
  const session={examFlow,answeredTurns:2};
  const agreed={point:"appointment",value:"Mittwoch 18:00",quote:"Mittwoch um 18 Uhr passt"};
  expect(flows.mergeDecisions(session,[agreed],"Mittwoch um 18 Uhr passt").complete).toBe(true);
  expect(flows.mergeDecisions(session,[agreed],"Nein, Mittwoch um 18 Uhr passt nicht").complete).toBe(false);
  expect(flows.mergeDecisions(session,[{...agreed,value:"Montag 17:00"}],agreed.quote).complete).toBe(false);
  expect(flows.mergeDecisions(session,[{...agreed,quote:"invented"}],agreed.quote).complete).toBe(false);
});

test("simulation hides hints and the partner's private calendar",()=>{
  const examFlow=flows.createExaminerFlow("A2",{teil:"Teil 3"},"simulation");
  const view=flows.publicFlow({examFlow});
  expect(view.hints).toEqual([]);
  expect(view.studentCalendar).toContain("Montag 17:00");
  expect(JSON.stringify(view)).not.toContain("Dienstag 17:00");
  expect(JSON.stringify(publicCatalogue)).not.toContain("partnerCalendar");
  expect(flows.partnerInstructions({examFlow,level:"A2"},{previous:{action:"negotiate"},step:{}})).toContain("Dienstag 17:00");
});

test("public catalogue stays synchronized without private partner information",()=>{
  for(const [key,profile] of Object.entries(publicCatalogue.profiles))for(const [field,value] of Object.entries(profile))expect(value).toEqual(catalogue.profiles[key][field]);
  expect(Object.keys(publicCatalogue.profiles)).toHaveLength(9);
});

test("B2 and invalid exam parts do not receive an A1-B1 flow",()=>{
  expect(flows.createExaminerFlow("B2",{teil:"Teil 1"})).toBe(null);
  expect(flows.createExaminerFlow("B1",{teil:"2026"})).toBe(null);
});

test.each(["Ja, Donnerstag um 18 Uhr passt.","Ja, Mittwoch um 18:30 passt.","Nein, Mittwoch um 18 Uhr geht nicht.","Ja, um neunzehn Uhr."])("calendar does not invent an agreement from %s",transcript=>{
  const examFlow=flows.createExaminerFlow("A2",{teil:"Teil 3"});
  const result=flows.calendarResponse({examFlow,answeredTurns:2,messages:[{role:"assistant",text:"Passt Mittwoch um 18 Uhr?"}]},transcript);
  expect(result.complete).toBe(false);
});

test("calendar arithmetic needs no language-model call and accepts an explicit confirmation",()=>{
  const examFlow=flows.createExaminerFlow("A2",{teil:"Teil 3"});
  const session={examFlow,answeredTurns:2,messages:[{role:"assistant",text:"Passt Mittwoch um 18 Uhr?"}]};
  expect(flows.calendarResponse(session,"Ja, das passt.").complete).toBe(true);
  expect(flows.calendarResponse({...session,answeredTurns:1},"Mittwoch um 18 Uhr passt.").complete).toBe(false);
});

test.each(["Tagesablauf","Sprachen","Haustiere"])("selected A2 card %s survives",word=>{
 const task={teil:"Teil 1",prompt:word};const flow=flows.createExaminerFlow("A2",task);
 expect(flow.cards[0].word).toBe(word);expect(new Set(flow.cards.map(c=>c.word)).size).toBe(4);
 expect(examinerTaskPreview("A2",task).cards).toEqual(flow.cards.map(c=>c.word));
});
test("Frühstück has a distinct second card",()=>{
 const task={teil:"Teil 2",prompt:"Frühstück"};const flow=flows.createExaminerFlow("A1",task);
 expect(flow.cards.map(c=>c.word)).toEqual(["Frühstück","Wochenende"]);
 expect(examinerTaskPreview("A1",task).cards).toEqual(["Frühstück","Wochenende"]);
 expect(flow.cards[0].question).toBe("Was essen Sie zum Frühstück?");
});

test("feedback readiness alone does not complete interrupted tasks",()=>{
 const examFlow=flows.createExaminerFlow("A2",{teil:"Teil 1",prompt:"Sprachen"});
 expect(flows.isReady({examFlow,answeredTurns:2,taskReady:true})).toBe(true);
 expect(flows.isComplete({examFlow,answeredTurns:2,taskReady:true})).toBe(false);
});
