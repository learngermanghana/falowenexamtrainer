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

describe("B2 Days 19-24 quiz-first Learn flow", () => {
  test("Days 19-20 inherit the quiz-first structure from the shared Day 16-20 page", () => {
    const source = read("B2Day16To20SelfTutoringPage.jsx");
    expectQuizFirst(source);
    expect(source).toContain("enhanceB2Day16To20Lesson");
  });

  test("Days 21-24 show the clickable grammar check before deep grammar notes", () => {
    const source = read("B2Day21To25SelfTutoringPage.jsx");
    expectQuizFirst(source);
    expect(source).toContain("B2Day21To24GrammarNotes");
    expect(source).toContain("getB2Days21To25Tutoring");
  });

  test("shared preview still derives content from the lesson grammar data", () => {
    const source = read("B2QuizFirstLearnPreview.jsx");
    expect(source).toContain("lesson?.grammarLesson");
    expect(source).toContain("grammar.explanation");
    expect(source).toContain("grammar.rules");
    expect(source).toContain("grammar.examples");
  });
});
