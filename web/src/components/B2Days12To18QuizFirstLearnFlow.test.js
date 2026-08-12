import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

const expectQuizFirst = (source) => {
  expect(source).toContain("B2QuizFirstLearnPreview");
  expect(source).toContain("B2KnowledgeChoicePractice");
  expect(source).toContain('Section title="Deep grammar notes"');
  expect(source.indexOf("<B2QuizFirstLearnPreview lesson={guidedLesson} />")).toBeLessThan(
    source.indexOf("<B2KnowledgeChoicePractice lesson={guidedLesson}"),
  );
  expect(source.indexOf("<B2KnowledgeChoicePractice lesson={guidedLesson}")).toBeLessThan(
    source.indexOf('<Section title="Deep grammar notes">'),
  );
  expect(source.indexOf('<Section title="Deep grammar notes">')).toBeLessThan(
    source.indexOf("<GrammarNotes day={day}"),
  );
};

describe("B2 Days 12-18 quiz-first Learn flow", () => {
  test("Days 12-15 already use the quiz-first order through the shared page", () => {
    const source = read("B2Day11To15SelfTutoringPage.jsx");
    expectQuizFirst(source);
    ["12: {", "13: {", "14: {", "15: {"].forEach((marker) => expect(source).toContain(marker));
  });

  test("Days 16-18 use preview and clickable grammar questions before deep notes", () => {
    const source = read("B2Day16To20SelfTutoringPage.jsx");
    expectQuizFirst(source);
    expect(source).toContain("enhanceB2Day16To20Lesson");
  });

  test("shared clickable practice keeps instant answer feedback", () => {
    const source = read("B2KnowledgeChoicePractice.jsx");
    expect(source).toContain("Grammatik-Check");
    expect(source).toContain("onClick={() => setAnswers");
    expect(source).toContain("Richtig.");
  });
});
