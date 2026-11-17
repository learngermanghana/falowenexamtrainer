import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(process.cwd(), "src", name), "utf8");
const workbook = read("components/A1Day13RevisionNumbersTimePricesWorkbookPage.js");
const app = read("App.js");

const sliceBetween = (start, end) => {
  const first = workbook.indexOf(start);
  const last = workbook.indexOf(end, first + start.length);
  if (first < 0 || last < 0) throw new Error("Expected Day 13 content block missing: " + start);
  return workbook.slice(first, last);
};

describe("A1 Day 13 focused sentence and question practice", () => {
  test("removes the old revision quizzes and keeps the concise lesson", () => {
    expect(workbook).not.toContain("const numberReviewItems = [");
    expect(workbook).not.toContain("const daysReviewItems = [");
    expect(workbook).not.toContain("const timeReviewItems = [");
    expect(workbook).not.toContain("const priceReviewItems = [");
    expect(workbook).not.toContain("const yearPracticeItems =");
    expect(workbook).not.toContain('data-a1-day13-section="numbers"');
    expect(workbook).toContain("3 sentence patterns · 6 word builders · 2 responses · short writing task");
  });

  test("teaches three distinct German sentence patterns", () => {
    expect(workbook).toContain('data-a1-day13-section="question-formation"');
    expect(workbook).toContain('title="Statement · Aussagesatz"');
    expect(workbook).toContain('title="W-question · W-Frage"');
    expect(workbook).toContain('title="Yes/no question · Ja/Nein-Frage"');
    expect(workbook).toContain("The conjugated verb stays in position 2.");
    expect(workbook).toContain("Start with the conjugated verb.");
  });

  test("provides six sentence builders and two response questions", () => {
    const builders = sliceBetween("const sentenceBuilderTasks = [", "const responsePracticeTasks = [");
    expect((builders.match(/\{type:"/g) || []).length).toBe(6);
    expect((builders.match(/type:"Statement"/g) || []).length).toBe(3);
    expect((builders.match(/type:"W-question"/g) || []).length).toBe(2);
    expect((builders.match(/type:"Yes\/no question"/g) || []).length).toBe(1);
    const responses = sliceBetween("const responsePracticeTasks = [", "const grammarStrip =");
    expect((responses.match(/\{question:"/g) || []).length).toBe(2);
    expect(workbook).toContain('data-a1-day13-section="sentence-builder"');
    expect(workbook).toContain('data-a1-day13-section="response-practice"');
  });

  test("keeps existing class discussion and the shorter original-writing task", () => {
    expect(workbook).toContain('"group_discussion"');
    expect(workbook).toContain('const LESSON_ID = "a1-day-13-revision-numbers-time-prices-statements"');
    expect(workbook).toContain("function StatementContributionSection()");
    expect(workbook).toContain("await setDoc(");
    expect(workbook).toContain("onSnapshot(");
    expect(workbook).toContain("Save to class discussion");
    expect(workbook).toContain("Write two original statements about time or prices.");
    expect(workbook).toContain("Write two W-questions (Wann or Wie viel).");
    expect(workbook).toContain("Write one yes/no question beginning with the verb.");
    expect(workbook).not.toContain("Write four original German sentences");
  });

  test("never runs the retired Day 13 source-rewriting patch", () => {
    const lifecycle = fs.readFileSync(path.resolve(process.cwd(), "..", "scripts", "patchA1TutorNavigationSelfPracticeSafety.mjs"), "utf8");
    const obsoletePatch = path.resolve(process.cwd(), "..", "scripts", "patchA1Day13RevisionClarity.mjs");
    expect(lifecycle).not.toContain('import("./patchA1Day13RevisionClarity.mjs")');
    expect(fs.existsSync(obsoletePatch)).toBe(false);
  });

  test("retains the A1 self-practice tab and avoids tutor-marked assignments", () => {
    expect(app).toContain('withA1PracticeBook(13, "3.5"');
    expect(workbook).not.toContain("A1TutorMarkedWorkbookShell");
    expect(workbook).toContain("<SentenceBuilderSection/>");
    expect(workbook).toContain("<ResponsePracticeSection/>");
    expect(workbook).toContain("<StatementContributionSection/>");
  });
});
