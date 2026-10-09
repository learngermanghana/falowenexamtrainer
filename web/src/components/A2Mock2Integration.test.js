import { A2_MOCK_2_LESEN_QUESTIONS } from "../data/a2Mock2Lesen";
import { A2_MOCK_2_HOEREN_QUESTIONS } from "../data/a2Mock2Hoeren";
import { getMockExam } from "../data/mockExamCatalog";
test("A2 Mock 2 has a unified route and four separate practice sections",()=>{
 const hub=getMockExam("a2-mock-02");
 expect(hub.route).toBe("/campus/course/a2-mock-2");
 expect(hub.sections).toEqual(["Lesen","Hören","Schreiben","Sprechen"]);
 expect(hub.mode).toBe("section-preview");
 ["lesen","hoeren","schreiben","sprechen"].forEach(key=>expect(getMockExam("a2-mock-02-"+key).route).toBeTruthy());
 expect(A2_MOCK_2_LESEN_QUESTIONS).toHaveLength(20);
 expect(A2_MOCK_2_HOEREN_QUESTIONS).toHaveLength(20);
});
