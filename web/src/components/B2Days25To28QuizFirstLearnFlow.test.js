import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

const expectQuizFirst = (source, notesToken) => {
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
    source.indexOf(notesToken),
  );
};

describe("B2 Days 25-28 quiz-first Learn flow", () => {
  test("Day 25 inherits quiz-first order from the shared Day 21-25 page", () => {
    const source = read("B2Day21To25SelfTutoringPage.jsx");
    expectQuizFirst(source, "<GrammarNotes day={day}");
    expect(source).toContain("day === 25");
  });

  test("Days 26-28 show clickable grammar questions before deep notes", () => {
    const source = read("B2Day26To28SelfTutoringPage.jsx");
    expectQuizFirst(source, "<B2Day25To28GrammarNotes day={day}");
    expect(source).toContain("tutoring[Number(lesson?.day || 0)]");
  });

  test("final B2 range continues to use the shared lesson-derived preview", () => {
    const source = read("B2QuizFirstLearnPreview.jsx");
    expect(source).toContain("lesson?.grammarLesson");
    expect(source).toContain("grammar.explanation");
    expect(source).toContain("grammar.rules");
    expect(source).toContain("grammar.examples");
  });
});
