import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("B2 Days 1-5 quiz-first Learn flow", () => {
  test("keeps the clickable grammar check before the deep grammar notes", () => {
    const source = read("B2Day1To4GuidedLessonPage.js");
    expect(source).toContain("QuickGrammarPreview");
    expect(source).toContain("B2KnowledgeChoicePractice");
    expect(source).toContain('Section title="Deep grammar notes"');
    expect(source.indexOf("<QuickGrammarPreview lesson={lesson} />")).toBeLessThan(
      source.indexOf("<B2KnowledgeChoicePractice lesson={lesson}"),
    );
    expect(source.indexOf("<B2KnowledgeChoicePractice lesson={lesson}")).toBeLessThan(
      source.indexOf('<Section title="Deep grammar notes">'),
    );
    expect(source.indexOf('<Section title="Deep grammar notes">')).toBeLessThan(
      source.indexOf("<GrammarNotes lesson={lesson}"),
    );
  });

  test("quick preview uses the lesson grammar content instead of duplicate hard-coded Day 2 text", () => {
    const source = read("B2Day1To4GuidedLessonPage.js");
    expect(source).toContain("lesson?.grammarLesson");
    expect(source).toContain("grammar.explanation");
    expect(source).toContain("grammar.rules");
    expect(source).toContain("grammar.examples");
  });

  test("Day 2 still has clickable multiple-choice knowledge data", () => {
    const source = read("../data/selfLearningLessons/b2/day2AlltagUndZeitmanagement.js");
    expect(source).toContain("knowledgeTest");
    expect(source).toContain("Welche Bitte klingt am höflichsten?");
    expect(source).toContain("Welche Wortstellung ist im wenn-Satz richtig?");
  });
});
