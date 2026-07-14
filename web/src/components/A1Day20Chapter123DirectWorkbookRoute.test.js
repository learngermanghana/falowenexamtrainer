import fs from "fs";
import path from "path";
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

  it("renders the letter-writing workbook through the same direct shell pattern as Day 11", () => {
    const routeSource = readComponentSource(
      "A1Day20Chapter123DirectWorkbookRoute.js",
    );

    expect(routeSource).toContain(
      'import LetterWritingIntroPage from "./LetterWritingIntroPage"',
    );
    expect(routeSource).toContain("<main className=\"layout-main\"");
    expect(routeSource).toContain("<LetterWritingIntroPage />");
  });

  it("formats both letters as Teil sections for the unified A1 tutor navigation", () => {
    const pageSource = readComponentSource("LetterWritingIntroPage.js");

    expect(pageSource).toContain(
      "Teil 1 · Informal letter: Birthday message",
    );
    expect(pageSource).toContain(
      "Teil 2 · Formal letter: Enquiry to a language school",
    );
    expect(getA1TeilNumber("Teil 1 · Informal letter: Birthday message")).toBe(1);
    expect(getA1TeilNumber("Teil 2 · Formal letter: Enquiry to a language school")).toBe(2);
    expect(pageSource).toContain(
      "Overview</strong>, <strong>Teil 1</strong>",
    );
  });

  it("keeps the special grammar and workbook routes linked to the exact lesson hub", () => {
    const pageSource = readComponentSource("LetterWritingIntroPage.js");
    const backButtonSource = readComponentSource("navigation/AppBackButton.jsx");

    expect(pageSource).toContain(
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
