import {A2_MOCK_06_HOEREN} from "./a2Mock06Hoeren";
import {getMockExam} from "./mockExamCatalog";
test("Mock06 has four recorded sections, 20 learner questions and no answers in browser",()=>{
  expect(A2_MOCK_06_HOEREN).toHaveLength(4);
  expect(A2_MOCK_06_HOEREN.map(x=>x.embeddedRepetitions)).toEqual([2,1,1,2]);
  expect(A2_MOCK_06_HOEREN.flatMap(p=>p.questions).map(q=>q.number)).toEqual(Array.from({length:20},(_,i)=>i+1));
  A2_MOCK_06_HOEREN.forEach((part,i)=>{
    expect(part.audioObjectKey).toBe(`a2/mock-hoeren/mock-06/teil-${i+1}.mp3`);
    expect(part.questions).toHaveLength(5);
    for(const question of part.questions){
      expect(question.options).toHaveLength(i===3?2:3);
      expect(question).not.toHaveProperty("answer");
      expect(question).not.toHaveProperty("evidence");
    }
  });
  expect(getMockExam("a2-mock-06").sections).toEqual(["Lesen","Hören","Schreiben","Sprechen"]);
});
