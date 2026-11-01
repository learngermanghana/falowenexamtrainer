import {A2_MOCK_07_HOEREN} from "./a2Mock07Hoeren";
import {getMockExam} from "./mockExamCatalog";
test("Mock 07 has its own four parts, 20 private-result questions and 4 protected audio object keys",()=>{
  expect(A2_MOCK_07_HOEREN).toHaveLength(4);
  expect(A2_MOCK_07_HOEREN.map(p=>p.embeddedRepetitions)).toEqual([2,1,1,2]);
  const questions=A2_MOCK_07_HOEREN.flatMap(p=>p.questions);
  expect(questions.map(q=>q.number)).toEqual(Array.from({length:20},(_,i)=>i+1));
  A2_MOCK_07_HOEREN.forEach((p,i)=>{
    expect(p.audioObjectKey).toBe(`a2/mock-hoeren/mock-07/teil-${i+1}.mp3`);
    expect(p.questions).toHaveLength(5);
    for(const q of p.questions){
      expect(q.options).toHaveLength(i===3?2:3);
      expect(q).not.toHaveProperty("answer");
      expect(q).not.toHaveProperty("evidence");
    }
  });
  expect(getMockExam("a2-mock-07").sections).toEqual(["Lesen","Hören","Schreiben","Sprechen"]);
});
