import fs from "fs";
import path from "path";
import {
  A1_DAY20_CHAPTER123_GRAMMAR_ROUTE,
  A1_DAY20_CHAPTER123_LESSON_ROUTE,
  A1_DAY20_CHAPTER123_WORKBOOK_ROUTE,
} from "../data/a1Day20LetterWritingRoutes";
import inAppWorkbookRoutes from "../data/inAppWorkbookRoutes.json";

const readIndexSource = () =>
  fs.readFileSync(path.resolve(__dirname, "../index.jsx"), "utf8");

const readComponentSource = (fileName) =>
  fs.readFileSync(path.resolve(__dirname, fileName), "utf8");

describe("A1 Day 20 Chapter 12.3 direct workbook route", () => {
  it("keeps one canonical grammar, workbook and lesson route contract", () => {
    expect(A1_DAY20_CHAPTER123_GRAMMAR_ROUTE).toBe(
      "/campus/course/letter-writing-intro-12-3",
    );
    expect(A1_DAY20_CHAPTER123_WORKBOOK_ROUTE).toBe(
      "/campus/course/letter-writing-intro-german-a1-day-12-3",
    );
    expect(A1_DAY20_CHAPTER123_LESSON_ROUTE).toBe(
      "/campus/course/lesson/A1/20?chapter=12.3",
    );
    expect(inAppWorkbookRoutes.A1["20"]["12.3"]).toBe(
      A1_DAY20_CHAPTER123_WORKBOOK_ROUTE,
    );
  });

  it("registers the dedicated direct workbook route before the main App fallback", () => {
    const indexSource = readIndexSource();
    expect(indexSource).toContain(
      "path={A1_DAY20_CHAPTER123_DIRECT_WORKBOOK_PATH}",
    );
    expect(indexSource).toContain(
      "element={<A1Day20Chapter123DirectWorkbookRoute />}",
    );

    const routeSource = readComponentSource(
      "A1Day20Chapter123DirectWorkbookRoute.js",
    );
    expect(routeSource).toContain(
      'import { A1_DAY20_CHAPTER123_WORKBOOK_ROUTE } from "../data/a1Day20LetterWritingRoutes"',
    );
    expect(routeSource).toContain(
      "A1_DAY20_CHAPTER123_DIRECT_WORKBOOK_PATH =\n  A1_DAY20_CHAPTER123_WORKBOOK_ROUTE",
    );
    expect(routeSource).toContain("<A1Day20LetterWritingWorkbookPage />");
  });

  it("owns both letter sections and both practice tools inside the workbook", () => {
    const pageSource = readComponentSource("A1Day20LetterWritingWorkbookPage.js");

    expect(pageSource).toContain('WorkbookSection sectionKey="teil-1"');
    expect(pageSource).toContain('WorkbookSection sectionKey="teil-2"');
    expect(pageSource).toContain('title="Mark My Informal Letter"');
    expect(pageSource).toContain('title="Mark My Formal Letter"');
    expect(pageSource).toContain("Teil 1 · Informal letter: Birthday message");
    expect(pageSource).toContain("Teil 2 · Formal letter: Enquiry to a language school");
    expect(pageSource).toContain("Schreiben Sie ungefähr 35–50 Wörter");
  });

  it("keeps global practice injection out of the letter-writing workbook", () => {
    const autoMountSource = readComponentSource("A1CoursePracticeAutoMount.js");
    expect(autoMountSource).toContain(
      "export const isA1LetterWritingCourseBookPath",
    );
    expect(autoMountSource).toContain(
      "const isWritingPage = shouldAutoMountA1WritingPractice(pathname)",
    );
    expect(autoMountSource).not.toContain(
      "WRITING_PATHS = new Set([\n  LETTER_WRITING_WORKBOOK_PATH",
    );
  });
});
