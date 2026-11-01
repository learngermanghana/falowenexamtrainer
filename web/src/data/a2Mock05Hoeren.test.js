import {A2_MOCK_05_HOEREN} from "./a2Mock05Hoeren";
test("A2 Mock 05 practice reuses all four protected listening parts without public answers",()=>{
  expect(A2_MOCK_05_HOEREN).toHaveLength(4);
  expect(A2_MOCK_05_HOEREN.flatMap(x=>x.questions).map(q=>q.number)).toEqual(Array.from({length:20},(_,i)=>i+1));
  A2_MOCK_05_HOEREN.forEach((part,index)=>{
    expect(part.audioObjectKey).toBe(`a2/mock-hoeren/mock-05/teil-${index+1}.mp3`);
    expect(part.questions).toHaveLength(5);
    expect(part.questions.every(q=>!Object.hasOwn(q,"answer")&&!Object.hasOwn(q,"evidence"))).toBe(true);
  });
});
