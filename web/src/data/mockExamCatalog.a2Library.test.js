import { getMockExam, getMockExamsForLevel } from "./mockExamCatalog";
test("the main A2 mock library shows exactly Mock 1 and Mock 2", () => {
 const items=getMockExamsForLevel("A2",{includeCourse:true});
 expect(items.map(x=>x.id)).toEqual(["a2-final-01","a2-mock-02"]);
 expect(getMockExam("a2-mock-02").sections).toEqual(["Lesen","Hören","Schreiben","Sprechen"]);
});
test("each A2 Mock 2 section remains accessible within its exam", () => {
 ["lesen","hoeren","schreiben","sprechen"].forEach(section=>{
  expect(getMockExam("a2-mock-02-"+section).route).toContain("a2-mock-2-"+section);
 });
});
