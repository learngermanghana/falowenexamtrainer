import fs from "fs";
import path from "path";

jest.mock("./A1Day20LetterWritingWorkbookPage", () => () => null);

import { A1_DAY20_CHAPTER123_DIRECT_WORKBOOK_PATH } from "./A1Day20Chapter123DirectWorkbookRoute";
import { getA1TeilNumber } from "./A1WorkbookSectionTabs";
import inAppWorkbookRoutes from "../data/inAppWorkbookRoutes.json";

const readIndexSource = () =>
  fs.readFileSync(path.resolve(__dirname, "../index.jsx"), "utf8");

const readComponentSource = (fileName) =>
  fs.readFileSync(path.resolve(__dirname, fileName), "utf8");

describe("A1 Day 20 Chapter 12.3 direct workbook route", () => {
  it("keeps the Course Book mapping and registered direct route identical", () => {
    expect(A1_DAY20_CHAPTER123_DIRECT_WORKBOOK_PATH).toBe(
      "/campus/course/letter-writing-intro-german-a1-day-12-3",
    );
    expect(inAppWorkbookRoutes.A1["20"]["12.3"]).toBe(
      A1_DAY20_CHAPTER123_DIRECT_WORKBOOK_PATH,
    );

    const indexSource = readIndexSource();
    expect(indexSource).toContain(
      "path={A1_DAY20_CHAPTER123_DIRECT_WORKBOOK_PATH}",
    );
    expect(indexSource).toContain(
      "element={<A1Day20Chapter123DirectWorkbookRoute />}",
    );
  });

  it("renders the dedicated native shared workbook inside the direct authenticated shell", () => {
    const routeSource = readComponentSource(
      "A1Day20Chapter123DirectWorkbookRoute.js",
    );

    expect(routeSource).toContain(
      'import A1Day20LetterWritingWorkbookPage from "./A1Day20LetterWritingWorkbookPage"',
    );
    expect(routeSource).toContain('<main className="layout-main"');
    expect(routeSource).toContain("<A1Day20LetterWritingWorkbookPage />");
  });

  it("owns both letters with explicit WorkbookSection keys for the shared navigation", () => {
    const pageSource = readComponentSource("A1Day20LetterWritingWorkbookPage.js");

    expect(pageSource).toContain('WorkbookSection sectionKey="teil-1"');
    expect(pageSource).toContain('WorkbookSection sectionKey="teil-2"');
    expect(pageSource).toContain(
      "Teil 1 · Informal letter: Birthday message",
    );
    expect(pageSource).toContain(
      "Teil 2 · Formal letter: Enquiry to a language school",
    );
    expect(getA1TeilNumber("Teil 1 · Informal letter: Birthday message")).toBe(1);
    expect(getA1TeilNumber("Teil 2 · Formal letter: Enquiry to a language school")).toBe(2);
    expect(pageSource).toContain(
      "Use the shared navigation: <strong>Overview</strong>",
    );
  });

  it("integrates Mark My Letter under both tasks instead of relying on global injection", () => {
    const pageSource = readComponentSource("A1Day20LetterWritingWorkbookPage.js");
    const autoMountSource = readComponentSource("A1CoursePracticeAutoMount.js");

    expect(pageSource).toContain('title="Mark My Informal Letter"');
    expect(pageSource).toContain('title="Mark My Formal Letter"');
    expect(pageSource).toContain('type="writing"');
    expect(autoMountSource).toContain(
      "export const isA1LetterWritingCourseBookPath",
    );
    expect(autoMountSource).toContain(
      "if (!isCanonicalLessonPage && !isWritingPage && !isLetterGrammarPage)",
    );
  });

  it("uses the approved direct formal and informal task structure", () => {
    const pageSource = readComponentSource("A1Day20LetterWritingWorkbookPage.js");
    const grammarSource = readComponentSource("LetterWritingIntroPage.js");

    expect(pageSource).toContain("Letter 1 · Informal");
    expect(pageSource).toContain("Letter 2 · Formal");
    expect(pageSource).toContain("Schreiben Sie ungefähr 35–50 Wörter");
    expect(grammarSource).toContain("Formal Letter Structure");
    expect(grammarSource).toContain("Informal Letter Structure");
    expect(grammarSource).toContain(
      "Ich freue mich im Voraus auf Ihre Antwort.",
    );
    expect(grammarSource).toContain(
      "Ich freue mich im Voraus auf deine Antwort.",
    );
  });

  it("keeps the special grammar and workbook routes linked to the exact lesson hub", () => {
    const grammarSource = readComponentSource("LetterWritingIntroPage.js");
    const backButtonSource = readComponentSource("navigation/AppBackButton.jsx");

    expect(grammarSource).toContain(
      '"/campus/course/lesson/A1/20?chapter=12.3"',
    );
    expect(backButtonSource).toContain(
      'index.set("/campus/course/letter-writing-intro-12-3", a1Day20Chapter123Lesson)',
    );
    expect(backButtonSource).toContain(
      '"/campus/course/letter-writing-intro-german-a1-day-12-3"',
    );
  });
});
