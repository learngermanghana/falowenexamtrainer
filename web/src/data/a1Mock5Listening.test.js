import { A1_MOCK_5_LISTENING } from "./a1Mock5Listening";
it("matches the supplied 6/4/5-question recording structure without exposing solutions", () => {
 [1,2,3].forEach((number,index) => {
  const part=A1_MOCK_5_LISTENING[`teil${number}`];
  expect(part.questions).toHaveLength([6,4,5][index]);
  expect(part.plays).toBe([2,1,2][index]);
  expect(part.audioObjectKey).toBe(`a1/mock-hoeren/mock-05/teil-${number}.mp3`);
  part.questions.forEach((q,i) => {
   expect(q.number).toBe(i+1);
   expect(q).not.toHaveProperty("answer");
   expect(q).not.toHaveProperty("correctIndex");
   expect(q).not.toHaveProperty("evidence");
   if(number!==2) expect(q.options.map(o=>o.id)).toEqual(["a","b","c"]);
  });
 });
});
