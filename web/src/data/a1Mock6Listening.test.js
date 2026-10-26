import { A1_MOCK_6_LISTENING } from "./a1Mock6Listening";
test("Mock 06 imports the 6/4/5 questions without exposing any marking solutions", () => {
  expect(Object.keys(A1_MOCK_6_LISTENING)).toEqual(["teil1","teil2","teil3"]);
  [1,2,3].forEach((number,index)=>{
    const part=A1_MOCK_6_LISTENING[`teil${number}`];
    expect(part.questions).toHaveLength([6,4,5][index]);
    expect(part.plays).toBe([2,1,2][index]);
    expect(part.audioObjectKey).toBe(`a1/mock-hoeren/mock-06/teil-${number}.mp3`);
    part.questions.forEach((q,i)=>{
      expect(q.number).toBe(i+1);
      expect(q).not.toHaveProperty("answer");
      expect(q).not.toHaveProperty("correctIndex");
      expect(q).not.toHaveProperty("evidence");
      if(number===2) expect(typeof q.statement).toBe("string");
      else expect(q.options.map(x=>x.id)).toEqual(["a","b","c"]);
    });
  });
  expect(A1_MOCK_6_LISTENING.teil3.questions[0].question).toBe("Die Praxis Dr. Weber ist am Mittwoch ...");
});
