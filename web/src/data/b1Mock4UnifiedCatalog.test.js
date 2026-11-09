import {getMockExam,getMockExamsForLevel} from "./mockExamCatalog";
describe("B1 Mock 04 appears as one full exam in the Mock Exams library",()=>{
  test("one start/resume card with four skills and a single full route",()=>{
    const mock=getMockExam("b1-mock-04");
    expect(mock).toMatchObject({
      id:"b1-mock-04",mode:"full",route:"/campus/course/b1-mock-4",
      questionSetId:"b1-mock-04",status:"preview"
    });
    expect(mock.sections).toEqual(["Lesen","Hören","Schreiben","Sprechen"]);
    const cards=getMockExamsForLevel("B1",{includeCourse:true});
    expect(cards.filter(c=>c.id.startsWith("b1-mock-04"))).toHaveLength(1);
    expect(cards.find(c=>c.id==="b1-mock-04")).toBeDefined();
  });
  test("legacy standalone practice entries remain accessible but hidden from library",()=>{
    for(const skill of ["lesen","hoeren","schreiben","sprechen"]){
      const item=getMockExam(`b1-mock-04-${skill}`);
      expect(item).toBeDefined();
      expect(item.showInMockLibrary).toBe(false);
    }
  });
});
