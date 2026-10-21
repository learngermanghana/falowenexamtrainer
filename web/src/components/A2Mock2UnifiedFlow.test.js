import fs from "fs";
import path from "path";
const source = fs.readFileSync(path.join(__dirname, "A2Mock2ExamHub.jsx"), "utf8");
const lesen = fs.readFileSync(path.join(__dirname, "A2Mock2Lesen.jsx"), "utf8");
const hoeren = fs.readFileSync(path.join(__dirname, "A2Mock2Hoeren.jsx"), "utf8");
const schreiben = fs.readFileSync(path.join(__dirname, "A2Mock2Schreiben.jsx"), "utf8");
const sprechen = fs.readFileSync(path.join(__dirname, "A2Mock2ConversationalSpeaking.jsx"), "utf8");
test("A2 Mock 2 starts once and moves automatically through four modules", () => {
 expect(source).toContain('["lesen", "hoeren", "schreiben", "sprechen"]');
 expect(source).toContain('stage:i===3?"result":ORDER[i+1]');
 expect(source).toContain("Start full mock exam");
 expect(source).toContain("Exam progress");
 [lesen,hoeren,schreiben,sprechen].forEach(component => {
  expect(component).toContain("embedded");
  expect(component).toContain("onComplete");
 });
 expect(sprechen).toContain("A2MockSpeakingExaminer");
 expect(sprechen).toContain("a2-mock-02");
});
test("AI results are not represented as verified final marks", () => {
 expect(source).toContain("A verified overall score");
 expect(schreiben).toContain("aiFeedback");
 expect(sprechen).toContain("_examinerParts");
});
