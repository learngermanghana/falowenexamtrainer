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

  it("routes legacy URLs to the canonical revised lesson and workbook", () => {
    expect(pageSource).toContain('<A1Day20GoetheWritingGrammarPage />');
    expect(pageSource).toContain('<A1Day20LetterWritingWorkbookPage />');
    expect(pageSource).not.toContain('Question 1 · Informal letter');
  });
});
