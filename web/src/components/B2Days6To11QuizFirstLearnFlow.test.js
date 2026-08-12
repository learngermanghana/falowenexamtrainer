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

describe("B2 Days 6-11 quiz-first Learn flow", () => {
  test("Days 6-10 show preview and clickable grammar questions before deep notes", () => {
    expectQuizFirst(read("B2Day6To10SelfTutoringPage.jsx"));
  });

  test("Day 11 shared self-tutoring page uses the same visible order", () => {
    expectQuizFirst(read("B2Day11To15SelfTutoringPage.jsx"));
    expect(read("B2Day11To15SelfTutoringPage.jsx")).toContain('11: {');
  });

  test("shared preview is derived from each lesson grammar data", () => {
    const source = read("B2QuizFirstLearnPreview.jsx");
    expect(source).toContain("lesson?.grammarLesson");
    expect(source).toContain("grammar.explanation");
    expect(source).toContain("grammar.rules");
    expect(source).toContain("grammar.examples");
  });

  test("quiz-first component keeps instant clickable feedback", () => {
    const source = read("B2KnowledgeChoicePractice.jsx");
    expect(source).toContain("Grammatik-Check");
    expect(source).toContain("onClick={() => setAnswers");
    expect(source).toContain("Richtig.");
  });
});
