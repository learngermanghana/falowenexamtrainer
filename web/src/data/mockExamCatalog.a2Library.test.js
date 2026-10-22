import { getMockExam, getMockExamsForLevel } from "./mockExamCatalog";
test("the A2 library shows full mocks and separately labelled Mock 3 listening practice", () => {
 const items=getMockExamsForLevel("A2",{includeCourse:true});
 expect(items.map(x=>x.id)).toEqual(["a2-final-01","a2-mock-02","a2-mock-03-hoeren"]);
 expect(getMockExam("a2-mock-02").sections).toEqual(["Lesen","Hören","Schreiben","Sprechen"]);
});
test("each A2 Mock 2 section remains accessible within its exam", () => {
 ["lesen","hoeren","schreiben","sprechen"].forEach(section=>{
  expect(getMockExam("a2-mock-02-"+section).route).toContain("a2-mock-2-"+section);
 });
});

test("A2 Mock 3 is clearly a 20-question listening practice, never a published four-skill exam", () => {
 const practice = getMockExam("a2-mock-03-hoeren");
 expect(practice.mode).toBe("practice");
 expect(practice.status).toBe("preview");
 expect(practice.sections).toEqual(["Hören · Teile 1 bis 4"]);
 expect(practice.route).toBe("/campus/course/a2-mock-3-hoeren");
 expect(getMockExam("a2-mock-03")).toBeNull();
});
