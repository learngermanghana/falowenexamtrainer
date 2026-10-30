import { A2_MOCK_05_HOEREN } from "./a2Mock05Hoeren";

test("Mock 05 has four unique protected listening recordings, 20 questions, and no learner-facing answer key",()=>{
  expect(A2_MOCK_05_HOEREN).toHaveLength(4);
  expect(A2_MOCK_05_HOEREN.map(p=>p.questions.length)).toEqual([5,5,5,5]);
  expect(A2_MOCK_05_HOEREN.flatMap(p=>p.questions.map(q=>q.number))).toEqual(Array.from({length:20},(_,i)=>i+1));
  expect(A2_MOCK_05_HOEREN.map(p=>p.audioObjectKey)).toEqual([1,2,3,4].map(i=>`a2/mock-hoeren/mock-05/teil-${i}.mp3`));
  expect(A2_MOCK_05_HOEREN.map(p=>p.embeddedRepetitions)).toEqual([2,1,1,2]);
  expect(A2_MOCK_05_HOEREN[0].questions[0].question).toBe("Was soll Frau Klein zum Termin mitbringen?");
  expect(A2_MOCK_05_HOEREN[3].questions[4].question).toBe("Als Nächstes reist er nach Thailand.");
  for(const question of A2_MOCK_05_HOEREN.flatMap(p=>p.questions)){
    expect(question.options).toHaveLength(question.number<=15?3:2);
    expect(question).not.toHaveProperty("answer");
    expect(question).not.toHaveProperty("evidence");
  }
});
