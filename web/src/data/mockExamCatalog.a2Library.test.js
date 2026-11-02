import { getMockExam, getMockExamsForLevel } from "./mockExamCatalog";
test("the A2 library lists full mocks without a duplicate Mock 3 listening card", () => {
 const items=getMockExamsForLevel("A2",{includeCourse:true});
 expect(items.map(x=>x.id)).toEqual(["a2-final-01","a2-mock-02","a2-mock-03","a2-mock-04","a2-mock-05","a2-mock-06","a2-mock-07","a2-mock-08"]);
 expect(getMockExam("a2-mock-02").sections).toEqual(["Lesen","Hören","Schreiben","Sprechen"]);
});
test("each A2 Mock 2 section remains accessible within its exam", () => {
 ["lesen","hoeren","schreiben","sprechen"].forEach(section=>{
  expect(getMockExam("a2-mock-02-"+section).route).toContain("a2-mock-2-"+section);
 });
});

test("A2 Mock 3 preserves standalone listening practice alongside a four-module preview", () => {
 const practice = getMockExam("a2-mock-03-hoeren");
 expect(practice.mode).toBe("practice");
 expect(practice.status).toBe("preview");
 expect(practice.sections).toEqual(["Hören · Teile 1 bis 4"]);
 expect(practice.route).toBe("/campus/course/a2-mock-3-hoeren");
 expect(getMockExam("a2-mock-03").status).toBe("preview");
 expect(getMockExam("a2-mock-03").sections).toEqual(["Lesen","Hören","Schreiben","Sprechen"]);
});


test("A2 Mock 3 in Mock Exams opens the complete four-module exam, not Hören-only", () => {
 const items=getMockExamsForLevel("A2",{includeCourse:true});
 const mock3=items.filter(exam=>exam.id==="a2-mock-03");
 expect(mock3).toHaveLength(1);
 expect(mock3[0]).toMatchObject({
  shortTitle:"A2 Mock 3",
  mode:"full",
  route:"/campus/course/a2-mock-3",
  sections:["Lesen","Hören","Schreiben","Sprechen"],
 });
 expect(items.some(exam=>exam.route==="/campus/course/a2-mock-3-hoeren")).toBe(false);
 // The listening-only course continues to work when opened directly.
 expect(getMockExam("a2-mock-03-hoeren").route).toBe("/campus/course/a2-mock-3-hoeren");
});
