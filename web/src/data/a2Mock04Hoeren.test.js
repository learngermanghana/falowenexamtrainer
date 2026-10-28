import { A2_MOCK_04_HOEREN } from "./a2Mock04Hoeren";
test("Mock 04 has four unique protected listening recordings and 20 learner-only questions",()=>{
  expect(A2_MOCK_04_HOEREN).toHaveLength(4);
  expect(A2_MOCK_04_HOEREN.map(p=>p.questions.length)).toEqual([5,5,5,5]);
  expect(A2_MOCK_04_HOEREN.flatMap(p=>p.questions.map(q=>q.number))).toEqual(Array.from({length:20},(_,i)=>i+1));
  expect(A2_MOCK_04_HOEREN.map(p=>p.audioObjectKey)).toEqual([1,2,3,4].map(i=>`a2/mock-hoeren/mock-04/teil-${i}.mp3`));
  expect(A2_MOCK_04_HOEREN.map(p=>p.embeddedRepetitions)).toEqual([2,1,1,2]);
  for(const question of A2_MOCK_04_HOEREN.flatMap(p=>p.questions)){
    expect(question.options).toHaveLength(question.number<=15?3:2);
    expect(question).not.toHaveProperty("answer");
    expect(question).not.toHaveProperty("evidence");
  }
});
