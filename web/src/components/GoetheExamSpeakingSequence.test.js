const {examPlan,progress,partNumber,maxAnswersForExam} = require("../../../functions/functionz/goetheExamSpeakingSequence");

test("A1 Teil 1 prompts for identification, work and language rather than random chat",()=>{
  const task={teil:"Teil 1",prompt:"Stellen Sie sich kurz vor"};
  const plan=examPlan("A1",task);
  expect(plan.opening).toMatch(/Wie heißen Sie/);
  expect(plan.followups[0]).toMatch(/beruflich/);
  expect(plan.followups[1]).toMatch(/Sprachen/);
  expect(plan.followups[2]).toMatch(/beendet/);
  expect(maxAnswersForExam("A1")).toBe(3);
});

test("A1 Teil 2 uses word-card questions, Teil 3 practises polite requests",()=>{
  const card=examPlan("A1",{teil:"Teil 2",prompt:"Uhr",keywords:"Uhrzeit"});
  expect(card.opening).toContain("Stichwort: Uhrzeit");
  expect(card.opening).toMatch(/Frage/);
  const request=examPlan("A1",{teil:"Teil 3",prompt:"Fenster zumachen"});
  expect(request.opening).toMatch(/höfliche Bitte/);
  expect(request.followups[0]).toMatch(/Können Sie bitte/);
});

test("A2 Teil 1 covers personal themes, Teil 2 presentation and Teil 3 partner planning",()=>{
  expect(examPlan("A2",{teil:"Teil 1",prompt:"Freizeit"}).opening).toContain("Freizeit");
  expect(examPlan("A2",{teil:"Teil 2",prompt:"Wie verbringen Sie Ihren Urlaub?"})
    .followups[0]).toMatch(/Beispiel/);
  const planning=examPlan("A2",{teil:"Teil 3",prompt:"Einen Ausflug planen"});
  expect(planning.opening).toMatch(/Vorschlag/);
  expect(planning.followups[0]).toMatch(/Wann und wo/);
  expect(planning.followups[1]).toMatch(/organisieren/);
  expect(progress("A2",3)).toEqual({answered:3,maxAnswers:3,complete:true});
});

test("higher levels retain flexible discussion and bounded answers",()=>{
  expect(examPlan("B1",{teil:"Teil 2",prompt:"Gesundheit"}).opening).toContain("Gesundheit");
  expect(maxAnswersForExam("C2")).toBe(4);
  expect(progress("C2",20)).toEqual({answered:4,maxAnswers:4,complete:true});
  expect(partNumber({teil:"teil-3"})).toBe(3);
});
