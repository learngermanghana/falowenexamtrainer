import {A2_MOCK_05_HOEREN} from "./a2Mock05Hoeren";
test("Mock 05 has only the teacher's 20 questions and four protected MP3s",()=>{
 expect(A2_MOCK_05_HOEREN).toHaveLength(4);
 expect(A2_MOCK_05_HOEREN.map(x=>x.questions.length)).toEqual([5,5,5,5]);
 expect(A2_MOCK_05_HOEREN.flatMap(x=>x.questions.map(q=>q.number))).toEqual(Array.from({length:20},(_,i)=>i+1));
 expect(A2_MOCK_05_HOEREN.map(x=>x.audioObjectKey)).toEqual([1,2,3,4].map(i=>`a2/mock-hoeren/mock-05/teil-${i}.mp3`));
 expect(A2_MOCK_05_HOEREN.map(x=>x.embeddedRepetitions)).toEqual([2,1,1,2]);
 for(const q of A2_MOCK_05_HOEREN.flatMap(x=>x.questions)){
  expect(q.options).toHaveLength(q.number<=15?3:2);
  expect(q).not.toHaveProperty("answer");
  expect(q).not.toHaveProperty("evidence");
 }
 expect(A2_MOCK_05_HOEREN[2].questions[0].options[1].label).toContain("fünfundzwanzig");
});
