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

describe("A1 Day 13 focused self-practice", () => {
  test("has exactly eleven revision questions across numbers, days/time and prices", () => {
    const counts = [
      ["const numberReviewItems = [", "const daysReviewItems = [", 4],
      ["const daysReviewItems = [", "const timeReviewItems = [", 2],
      ["const timeReviewItems = [", "const priceReviewItems = [", 2],
      ["const priceReviewItems = [", "const priceVerbReviewItems = [", 2],
      ["const priceVerbReviewItems = [", "const groupTaskChecklist = [", 1],
    ];
    let total = 0;
    counts.forEach(([begin, end, expected]) => {
      const block = sliceBetween(begin, end);
      const actual = (block.match(/(?:\{\s*id:|\{\s*prompt:)/g) || []).length;
      expect(actual).toBe(expected);
      total += actual;
    });
    expect(total).toBe(11);
    expect(workbook).not.toContain("const yearPracticeItems =");
    expect(workbook).not.toContain("const birthdayMcqItems =");
  });

  test("teaches subject-first and time-first verb-second statements", () => {
    expect(workbook).toContain("4. Satzbildung");
    expect(workbook).toContain("conjugated verb stays in position 2");
    expect(workbook).toContain("Ich <strong");
    expect(workbook).toContain("Am Montag <strong");
    expect(workbook).toContain("Um acht Uhr <strong>");
  });

  test("keeps existing class-discussion collection and save mechanism", () => {
    expect(workbook).toContain('"group_discussion"');
    expect(workbook).toContain('const LESSON_ID = "a1-day-13-revision-numbers-time-prices-statements"');
    expect(workbook).toContain('function StatementContributionSection()');
    expect(workbook).toContain("await setDoc(");
    expect(workbook).toContain("onSnapshot(");
    expect(workbook).toContain("Save to class discussion");
    expect(workbook).toContain("Write four original German sentences");
  });

  test("retains the existing A1 tab layout and avoids tutor-marked assignments", () => {
    expect(app).toContain('withA1PracticeBook(13, "3.5"');
    expect(app).toContain("Check numbers, days, time and prices, then learn to form German statements.");
    expect(workbook).not.toContain("A1TutorMarkedWorkbookShell");
    expect(workbook).toContain('data-a1-day13-section="numbers"');
    expect(workbook).toContain('data-a1-day13-section="days-time"');
    expect(workbook).toContain('data-a1-day13-section="prices"');
    expect(workbook).toContain('data-a1-day13-section="statement-formation"');
  });
});
