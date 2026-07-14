import fs from "fs";
import path from "path";
import {
  A1_DAY20_CHAPTER123_GRAMMAR_ROUTE,
  A1_DAY20_CHAPTER123_WORKBOOK_ROUTE,
  resolveLetterWritingPageMode,
} from "./LetterWritingIntroPage";

const pageSource = fs.readFileSync(
  path.resolve(__dirname, "LetterWritingIntroPage.js"),
  "utf8",
);

describe("LetterWritingIntroPage routing", () => {
  it("uses the short 12.3 route for grammar notes", () => {
    expect(resolveLetterWritingPageMode(A1_DAY20_CHAPTER123_GRAMMAR_ROUTE)).toBe("grammar");
  });

  it("uses the existing long route for the workbook", () => {
    expect(resolveLetterWritingPageMode(A1_DAY20_CHAPTER123_WORKBOOK_ROUTE)).toBe("workbook");
  });

  it("uses the standard A1 tutor-marked Assignment and Submit shell", () => {
    expect(pageSource).toContain('import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell"');
    expect(pageSource).toContain("<A1TutorMarkedWorkbookShell");
    expect(pageSource).toContain('day={20}');
    expect(pageSource).toContain('chapter="12.3"');
    expect(pageSource).toContain('fallbackAssignmentKey="A1-12.3"');
    expect(pageSource).toContain("Tutor-marked Schreiben assignment");
  });

  it("keeps only the two required writing questions inside the workbook", () => {
    expect(pageSource).toContain("Question 1 · Informal letter");
    expect(pageSource).toContain("Question 2 · Formal letter");
    expect(pageSource).toContain('data-a1-day20-chapter123-workbook-content="true"');
  });
});
