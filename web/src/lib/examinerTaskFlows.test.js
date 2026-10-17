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
    const questionFlow=flows.createExaminerFlow(level,level === "A1"
      ? {teil:"Teil 2",prompt:"Essen und Trinken",keywords:"Frühstück"}
      : {teil:"Teil 1",prompt:"Wohnort"});
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
  expect(Object.keys(publicCatalogue.profiles)).toHaveLength(15);
});

test("unsupported levels and invalid exam parts do not receive an examiner flow",()=>{
  expect(flows.createExaminerFlow("C1",{teil:"Teil 1"})).not.toBe(null);
  expect(flows.createExaminerFlow("C1",{teil:"Teil 3"})).toBe(null);
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
 expect(flow.cards.map(c=>c.word)).toEqual(["Frühstück","Obst"]);
 expect(examinerTaskPreview("A1",task).cards).toEqual(["Frühstück","Obst"]);
 expect(flow.cards[0].question).toBe("Was essen Sie zum Frühstück?");
});

test("feedback readiness alone does not complete interrupted tasks",()=>{
 const examFlow=flows.createExaminerFlow("A2",{teil:"Teil 1",prompt:"Sprachen"});
 expect(flows.isReady({examFlow,answeredTurns:2,taskReady:true})).toBe(true);
 expect(flows.isComplete({examFlow,answeredTurns:2,taskReady:true})).toBe(false);
});

test("A1 Teil 1 keeps spelling and numbers, then asks exactly one personal follow-up",()=>{
  const task={teil:"Teil 1",prompt:"Stellen Sie sich kurz vor"};
  const examFlow=flows.createExaminerFlow("A1",task);
  expect(examFlow.key).toBe("A1-1");
  expect(flows.maxAnswers({examFlow})).toBe(4);
  expect([0,1,2,3].map(i=>flows.currentStep(examFlow,i).action))
    .toEqual(["introduce","spell","number","personal-follow-up"]);
  expect(flows.currentStep(examFlow,4)).toBe(null);
  const session={examFlow,level:"A1",examTask:task,answeredTurns:3,
    confirmedAnswers:["Ich heiße Ama. Ich wohne in Accra. Ich spiele gern Fußball.","A M A","024 123 4567"]};
  const plan=flows.responsePlan(session);
  expect(plan).toEqual(expect.objectContaining({dynamic:true,ready:false}));
  const instructions=flows.partnerInstructions(session,plan);
  expect(instructions).toMatch(/Ask exactly ONE short, easy A1 personal follow-up/);
  expect(instructions).toContain("Ich spiele gern Fußball");
  expect(flows.responsePlan({...session,answeredTurns:4})).toEqual(expect.objectContaining({ready:true,dynamic:false}));
});

test("A1 Teil 3 uses two picture/action cards and alternates requesting with reacting",()=>{
  const task={teil:"Teil 3",prompt:"Fenster"};
  const examFlow=flows.createExaminerFlow("A1",task);
  expect(flows.maxAnswers({examFlow})).toBe(4);
  expect(examFlow.requestCards[0].word).toBe("Fenster");
  expect(examFlow.requestCards[0].symbol).toBe("🪟");
  expect(examFlow.requestCards[1].word).not.toBe("Fenster");
  expect([0,1,2,3].map(i=>flows.currentStep(examFlow,i).action))
    .toEqual(["make-request","respond-request","make-request","respond-request"]);
  expect(flows.currentStep(examFlow,1).instruction).toMatch(/bitte/i);
  expect(flows.currentStep(examFlow,2).instruction).toContain(examFlow.requestCards[1].word);
  expect(flows.currentStep(examFlow,3).instruction).not.toBe(flows.currentStep(examFlow,1).instruction);
  for(const i of [1,3]) {
    const session={level:"A1",examFlow,examTask:task,answeredTurns:i,confirmedAnswers:["Können Sie bitte das Fenster?"]};
    const plan=flows.responsePlan(session);
    expect(plan).toEqual(expect.objectContaining({dynamic:true,ready:false}));
    expect(flows.partnerInstructions(session,plan)).toMatch(/React naturally ONLY to the candidate's actual polite request/);
  }
  expect(flows.responsePlan({examFlow,answeredTurns:4})).toEqual(expect.objectContaining({ready:true,dynamic:false}));
  const preview=examinerTaskPreview("A1",task);
  const view=flows.publicFlow({examFlow,answeredTurns:0});
  expect(preview.requestCards).toEqual(view.requestCards);
  expect(JSON.stringify(view)).not.toContain("partnerRequest");
  expect(JSON.stringify(publicCatalogue)).not.toContain("partnerRequest");
});

test("A1 Teil 2 retains two word-card question-and-answer rounds",()=>{
  const task={teil:"Teil 2",prompt:"Essen",keywords:"Frühstück"};
  const examFlow=flows.createExaminerFlow("A1",task);
  expect(examFlow.cards.map(card=>card.word)).toEqual(["Frühstück","Obst"]);
  const steps=[0,1,2,3].map(i=>flows.currentStep(examFlow,i));
  expect(steps.map(step=>step.action)).toEqual(["ask-question","answer-question","ask-question","answer-question"]);
  expect(steps[0].instruction).toContain("Frühstück");
  expect(steps[2].instruction).toContain("Obst");
  expect(flows.responsePlan({examFlow,answeredTurns:1}).dynamic).toBe(true);
  expect(flows.responsePlan({examFlow,answeredTurns:3}).dynamic).toBe(true);
});

test.each(catalogue.b1PlanningTasks)("B1 planning matches the selected task: $match", ({match,points})=>{
  const task={teil:"Teil 1",prompt:match};
  const examFlow=flows.createExaminerFlow("B1",task);
  const session={examFlow,level:"B1",examTask:task,answeredTurns:2};
  expect(flows.currentStep(examFlow).instruction).toContain(match);
  expect(flows.publicFlow(session).points).toEqual(points.map(point=>point.text));
  expect(examinerTaskPreview("B1",task).points).toEqual(points.map(point=>point.text));
  const decisions=points.map(point=>({point:point.id,value:"vereinbart",quote:"Ja, das machen wir so."}));
  expect(flows.mergeDecisions(session,decisions,"Ja, das machen wir so.").complete).toBe(true);
  expect(flows.mergeDecisions(session,decisions.slice(1),"Ja, das machen wir so.").complete).toBe(false);
});

test("A2 personal rounds answer the selected card question before asking the candidate",()=>{
  const task={teil:"Teil 1",prompt:"Wohnort"};
  const examFlow=flows.createExaminerFlow("A2",task);
  const session={examFlow,examTask:task,level:"A2",answeredTurns:1};
  const instructions=flows.partnerInstructions(session,flows.responsePlan(session));
  expect(instructions).toContain("Answer ONLY the candidate's question naturally");
  expect(instructions).toContain('"Wohnort"');
  expect(flows.currentStep(examFlow,1).action).toBe("answer-question");
});

test.each([["A2","Teil 2","Was machen Sie am Wochenende?"],["B1","Teil 2","Ausbildung"]])("%s main speaking task announces the selected topic",(level,teil,prompt)=>{
  const task={teil,prompt};const examFlow=flows.createExaminerFlow(level,task);
  expect(flows.currentStep(examFlow).instruction).toContain(prompt);
  expect(flows.publicFlow({examFlow}).stageGuide).toBe(examinerTaskPreview(level,task).stageGuide);
});

test("B1 discussion passes the retained own presentation to the interlocutor without exposing it as a model answer",()=>{
  const examFlow=flows.createExaminerFlow("B1",{teil:"Teil 3",prompt:"Fragen stellen"});
  examFlow.ownPresentation="Ich mache eine Ausbildung im Hotel.";
  const session={examFlow,level:"B1",answeredTurns:2};
  expect(flows.partnerInstructions(session,flows.responsePlan(session))).toContain(examFlow.ownPresentation);
  expect(JSON.stringify(flows.publicFlow(session))).not.toContain(examFlow.ownPresentation);
});

test("A1 dictionary uses exactly the supplied keyword and picture banks",()=>{
  const fs=require("fs"),path=require("path");
  const source=fs.readFileSync(path.resolve(__dirname,"../data/speakingDictionary.js"),"utf8");
  const rows=JSON.parse(source.slice(source.indexOf("["),source.lastIndexOf("]")+1));
  const words=rows.filter(row=>row.level === "A1" && row.teilId === "teil-2");
  expect(words).toHaveLength(27);
  expect(new Set(words.map(row=>row.topicPrompt)).size).toBe(15);
  for(const row of words){
    const task={teil:row.teilLabel,prompt:row.topicPrompt,keywords:row.keywordSubtopic};
    const examFlow=flows.createExaminerFlow("A1",task);
    const preview=examinerTaskPreview("A1",task);
    expect(examFlow.cards[0].word).toBe(row.keywordSubtopic);
    expect(examFlow.cards[0].theme).toBe(row.topicPrompt);
    expect(examFlow.cards[1].theme).not.toBe(row.topicPrompt);
    expect(preview.cards).toEqual(examFlow.cards.map(card=>card.word));
    expect(preview.cardThemes).toEqual(flows.publicFlow({examFlow}).cardThemes);
    expect(preview.maxAnswers).toBe(flows.maxAnswers({examFlow}));
  }
  const pictures=rows.filter(row=>row.level === "A1" && row.teilId === "teil-3");
  expect(pictures).toHaveLength(15);
  for(const row of pictures){
    const task={teil:row.teilLabel,prompt:row.topicPrompt};
    const examFlow=flows.createExaminerFlow("A1",task);
    const card=flows.publicFlow({examFlow}).requestCards[0];
    expect(card.word).toBe(row.topicPrompt);
    expect(card.picture).toMatch(/^\/images\/speaking\/a1\/[a-z-]+\.svg$/);
    expect(fs.existsSync(path.resolve(__dirname,"../../public"+card.picture))).toBe(true);
    expect(examinerTaskPreview("A1",task).requestCards).toEqual(flows.publicFlow({examFlow}).requestCards);
  }
});

test.each(["Deutsch","Schuhe","Geburtstag"])("single keyword %s ends after its question and answer",keyword=>{
  const examFlow=flows.createExaminerFlow("A1",{teil:"Teil 2",keywords:keyword});
  expect(examFlow.cards).toHaveLength(1);
  expect(flows.maxAnswers({examFlow})).toBe(2);
  expect(flows.currentStep(examFlow,2)).toBe(null);
  expect(flows.isComplete({examFlow,answeredTurns:2})).toBe(true);
});

test("A2 curated bank has 8 personal topics, 10 four-keyword topics and 5 calendar tasks",()=>{
  const fs=require("fs"),path=require("path");
  const source=fs.readFileSync(path.resolve(__dirname,"../data/speakingDictionary.js"),"utf8");
  const rows=JSON.parse(source.slice(source.indexOf("["),source.lastIndexOf("]")+1)).filter(row=>row.level === "A2");
  expect([1,2,3].map(part=>rows.filter(row=>row.teilId === `teil-${part}`).length)).toEqual([8,10,5]);
  for(const row of rows){
    const task={teil:row.teilLabel,prompt:row.topicPrompt,keywords:row.keywordSubtopic};
    const examFlow=flows.createExaminerFlow("A2",task), view=flows.publicFlow({examFlow}), preview=examinerTaskPreview("A2",task);
    expect(preview.cards).toEqual(view.cards);
    expect(preview.points).toEqual(view.points);
    expect(preview.studentSchedule).toEqual(view.studentSchedule);
    if(row.teilId === "teil-1")expect(new Set(view.cards).size).toBe(4);
    if(row.teilId === "teil-2"){expect(view.points).toHaveLength(4);expect(view.points).toEqual(row.keywordSubtopic.split(", "));}
    if(row.teilId === "teil-3"){
      expect(view.studentSchedule).toHaveLength(15);
      expect(view.studentCalendar).toEqual(preview.studentCalendar);
      expect(JSON.stringify(view)).not.toContain('"agreement"');
      expect(JSON.stringify(view)).not.toContain('"partnerCalendar"');
    }
  }
  expect(JSON.stringify(publicCatalogue)).not.toContain('"agreement"');
  expect(JSON.stringify(publicCatalogue)).not.toContain('"partnerCalendar"');
});

test.each(catalogue.a2PlanningTasks)("calendar agreement for $topic uses both partners' free time",task=>{
  const examFlow=flows.createExaminerFlow("A2",{teil:"Teil 3",prompt:task.topic});
  const slot=`Samstag ${task.agreement.hour}:00`;
  expect(task.studentCalendar).toContain(slot);
  expect(task.partnerCalendar).toContain(slot);
  const session={examFlow,answeredTurns:2,messages:[{role:"assistant",text:`Passt Samstag um ${task.agreement.hour} Uhr?`}]};
  expect(flows.calendarResponse(session,"Ja, das passt.").complete).toBe(true);
  expect(flows.calendarResponse(session,`Samstag um ${task.agreement.hour} Uhr passt.`).complete).toBe(true);
  for(const reply of ["Samstag um 8 Uhr passt.","Nein, das geht nicht.","Sonntag um 13 Uhr passt."])
    expect(flows.calendarResponse(session,reply).complete).toBe(false);
});

test("B1 curated bank replaces old prompts with 8 tasks per part",()=>{
  const fs=require("fs"),path=require("path"),source=fs.readFileSync(path.resolve(__dirname,"../data/speakingDictionary.js"),"utf8");
  const rows=JSON.parse(source.slice(source.indexOf("["),source.lastIndexOf("]")+1)).filter(row=>row.level === "B1");
  expect([1,2,3].map(part=>rows.filter(row=>row.teilId === `teil-${part}`).length)).toEqual([8,8,8]);
  for(const row of rows){
    const task={teil:row.teilLabel,prompt:row.topicPrompt};const flow=flows.createExaminerFlow("B1",task);
    if(row.teilId === "teil-1")expect(flow.planningPoints).toHaveLength(4);
    if(row.teilId === "teil-2"){expect(flows.currentStep(flow).instruction).toContain(row.hint);expect(examinerTaskPreview("B1",task).presentationQuestion).toBe(row.hint);}
    if(row.teilId === "teil-3"){
      expect(flow.discussion.presentation.length).toBeGreaterThan(100);
      const opening=flows.currentStep(flow).instruction;
      expect(opening).toContain(flow.discussion.presentation);
      expect(opening).toContain(flow.discussion.question);
      expect(flows.currentStep(flow,1).instruction).not.toContain(flow.discussion.presentation);
      expect(flows.currentStep(flow,1).instruction).toContain("Rückmeldung");
    }
  }
});

test("legacy split B1 task includes its complete subtopic in audio and preview",()=>{
 const task={teil:"Teil 1",prompt:"Kulturelles Ereignis (Konzert",keywords:"Ausstellung) planen"};
 const flow=flows.createExaminerFlow("B1",task);
 expect(flow.contextTopic).toBe("Kulturelles Ereignis (Konzert, Ausstellung) planen");
 expect(flows.currentStep(flow).instruction).toContain(flow.contextTopic);
 expect(examinerTaskPreview("B1",task).topic).toBe(flow.contextTopic);
 const plain={teil:"Teil 1",prompt:"Einen Ausflug planen",keywords:"Zeit, Ort"};
 expect(flows.createExaminerFlow("B1",plain).contextTopic).toBe(plain.prompt);
});

test("B2 has exactly eight presentation topics and eight discussion topics",()=>{
 const fs=require("fs"),path=require("path"),source=fs.readFileSync(path.resolve(__dirname,"../data/speakingDictionary.js"),"utf8");
 const rows=JSON.parse(source.slice(source.indexOf("["),source.lastIndexOf("]")+1)).filter(row=>row.level === "B2");
 expect(rows.filter(row=>row.teilId === "teil-1")).toHaveLength(8);
 expect(rows.filter(row=>row.teilId === "teil-2")).toHaveLength(8);
 expect(rows.some(row=>row.teilId === "teil-3")).toBe(false);
 for(const row of rows){
  const task={teil:row.teilLabel,prompt:row.topicPrompt,hint:row.hint},flow=flows.createExaminerFlow("B2",task);
  expect(flows.currentStep(flow).instruction).toContain(row.hint);
  const preview=examinerTaskPreview("B2",task);
  expect(preview.presentationQuestion).toBe(flow.presentationQuestion);
  expect(preview.points).toEqual(flows.publicFlow({examFlow:flow}).points);
  expect(preview.preparationSeconds).toBe(900);
 }
 expect(flows.createExaminerFlow("B2",{teil:"Teil 3"})).toBe(null);
});

test("B2 presentation asks one follow-up after an uninterrupted four-minute turn",()=>{
 const examFlow=flows.createExaminerFlow("B2",{teil:"Teil 1",prompt:"Finanzierung des Studiums"});
 expect(flows.currentStep(examFlow).seconds).toBe(240);
 const session={examFlow,level:"B2",answeredTurns:1};
 expect(flows.responsePlan(session).dynamic).toBe(true);
 expect(flows.partnerInstructions(session,flows.responsePlan(session))).toContain("exactly ONE new relevant question");
 expect(flows.responsePlan({...session,answeredTurns:2}).ready).toBe(true);
});

test("B2 discussion responds to arguments and finishes with a summary, without forced consensus",()=>{
 const examFlow=flows.createExaminerFlow("B2",{teil:"Teil 2",prompt:"Bargeldabschaffung"});
 expect(flows.currentStep(examFlow).instruction).toContain("Bargeld");
 const session={examFlow,level:"B2",answeredTurns:3};const plan=flows.responsePlan(session);
 expect(plan.dynamic).toBe(true);
 expect(plan.step.instruction).toContain("Standpunkt zusammen");
 expect(flows.partnerInstructions(session,plan)).toContain("Do not demand agreement");
 expect(flows.responsePlan({...session,answeredTurns:4})).toEqual(expect.objectContaining({ready:true,dynamic:false}));
});


describe("Termin negotiation in shared course mocks and Exam Room", () => {
  const a2Session=(transcript,previous="Wie wäre es mit Mittwoch um 18 Uhr?") => {
    const examFlow=flows.createExaminerFlow("A2",{teil:"Teil 3"});
    return flows.calendarResponse({examFlow,answeredTurns:2,
      messages:[{role:"assistant",text:previous}]},transcript);
  };

  test.each([
    "Ich habe frei.",
    "Ja, ich habe frei.",
    "Ich habe Zeit.",
    "Da habe ich Zeit.",
    "Da kann ich.",
    "Am Mittwoch habe ich frei.",
    "Mittwoch um 18 Uhr habe ich Zeit.",
    "Mittwoch bin ich frei.",
    "Das geht bei mir.",
    "Ja, das klappt.",
    "Das ist gut für mich.",
    "Ich kann am Mittwoch.",
  ])("A2 accepts a non-passen confirmation: %s",reply=>{
    const result=a2Session(reply);
    expect(result.complete).toBe(true);
    expect(result.decisions).toEqual(expect.arrayContaining([
      expect.objectContaining({point:"appointment",value:"Mittwoch 18:00"}),
    ]));
  });

  test.each([
    "Ich habe keine Zeit.",
    "Nein, ich habe frei.",
    "Leider habe ich keine Zeit.",
    "Da kann ich nicht.",
    "Mittwoch um 18 Uhr geht leider nicht.",
    "Ja, das passt mir nicht.",
    "Am Donnerstag habe ich frei.",
    "Am Mittwoch um 19 Uhr habe ich Zeit.",
    "Ja, am Mittwoch um 18:30 Uhr geht es.",
    "Vielleicht habe ich Zeit.",
    "Ja, aber ich muss arbeiten.",
  ])("A2 does not invent agreement from refusal or conflicting time: %s",reply=>{
    expect(a2Session(reply).complete).toBe(false);
  });

  test("A2 needs a real partner proposal before treating bare availability as agreement",()=>{
    const result=a2Session("Ich habe frei.","Wann hast du Zeit?");
    expect(result.complete).toBe(false);
    expect(result.reply).toContain("Mittwoch um 18 Uhr");
  });

  test.each(catalogue.a2PlanningTasks)("A2 $topic can confirm its genuine shared calendar slot without passen",task=>{
    const examFlow=flows.createExaminerFlow("A2",{teil:"Teil 3",prompt:task.topic});
    const session={examFlow,answeredTurns:2,
      messages:[{role:"assistant",text:"Wie wäre es mit Samstag um "+task.agreement.hour+" Uhr?"}]};
    expect(flows.calendarResponse(session,"Da habe ich frei.").complete).toBe(true);
    expect(flows.calendarResponse(session,"Ich kann leider nicht.").complete).toBe(false);
  });

  test("B1 time-only planning point accepts an availability confirmation without passen",()=>{
    const task={teil:"Teil 1",prompt:"Einen kranken Freund oder Lehrer besuchen"};
    const examFlow=flows.createExaminerFlow("B1",task);
    const session={examFlow,answeredTurns:2,
      messages:[{role:"assistant",text:"Wie wäre es mit Samstag um 15 Uhr?"}]};
    const result=flows.mergeDecisions(session,[],"Da habe ich frei.");
    expect(result.availabilityConfirmed).toEqual(expect.objectContaining({day:"Samstag",hour:15}));
    expect(result.decisions).toContainEqual(expect.objectContaining({
      point:"point1",value:"Samstag 15:00",quote:"Da habe ich frei.",
    }));
    expect(result.complete).toBe(false);
  });

  test("B1 combined wann-und-wo responds to free time without falsely claiming a location",()=>{
    const task={teil:"Teil 1",prompt:"Einen Sporttag / eine Fahrradtour planen"};
    const examFlow=flows.createExaminerFlow("B1",task);
    const session={examFlow,answeredTurns:2,
      messages:[{role:"assistant",text:"Wie wäre es mit Samstag um 15 Uhr?"}]};
    const result=flows.mergeDecisions(session,[],"Ja, ich habe frei.");
    expect(result.availabilityConfirmed?.slot).toBe("Samstag 15:00");
    expect(result.decisions).toHaveLength(0);
    expect(result.complete).toBe(false);
    expect(flows.partnerInstructions({...session,level:"B1"},
      {previous:{action:"negotiate"},step:{instruction:"Wo treffen wir uns?"}}))
      .toContain("Ich habe frei");
  });

  test.each(["Ich habe keine Zeit.","Am Sonntag bin ich frei.",
    "Ja, aber um 17 Uhr.", "Vielleicht habe ich frei.","Das passt mir nicht."])(
    "B1 does not treat %s as agreement to a Saturday 15h suggestion",reply=>{
      const examFlow=flows.createExaminerFlow("B1",{teil:"Teil 1",
        prompt:"Einen kranken Freund oder Lehrer besuchen"});
      const session={examFlow,answeredTurns:2,
        messages:[{role:"assistant",text:"Wie wäre es mit Samstag um 15 Uhr?"}]};
      expect(flows.mergeDecisions(session,[],reply).decisions).toHaveLength(0);
    });

  test.each([
    "Am Samstag um 15 Uhr kann ich leider nicht.",
    "Wie wäre es mit Samstag um 15 Uhr oder Sonntag um 16 Uhr?",
    "Am Samstag um 15 Uhr oder um 17 Uhr?",
  ])("B1 refuses non-proposals and ambiguous alternatives from the partner: %s",previous=>{
    const flow=flows.createExaminerFlow("B1",{teil:"Teil 1",
      prompt:"Einen kranken Freund oder Lehrer besuchen"});
    const session={examFlow:flow,answeredTurns:2,messages:[{role:"assistant",text:previous}]};
    expect(flows.mergeDecisions(session,[],"Ich habe frei.").decisions).toHaveLength(0);
  });

  test("B1 availability alone cannot claim a time never proposed by the partner",()=>{
    const flow=flows.createExaminerFlow("B1",{teil:"Teil 1",
      prompt:"Einen kranken Freund oder Lehrer besuchen"});
    const session={examFlow:flow,answeredTurns:2,
      messages:[{role:"assistant",text:"Wann hast du Zeit?"}]};
    expect(flows.mergeDecisions(session,[],"Ich habe frei.").decisions).toHaveLength(0);
  });
});
