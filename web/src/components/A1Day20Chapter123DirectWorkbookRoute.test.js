import fs from "fs";
import path from "path";
import {
  A1_DAY20_CHAPTER123_GRAMMAR_ROUTE,
  A1_DAY20_CHAPTER123_LESSON_ROUTE,
  A1_DAY20_CHAPTER123_RESOURCE_HUB_ROUTE,
  A1_DAY20_CHAPTER123_WORKBOOK_ROUTE,
  shouldOpenA1Day20Workbook,
} from "../data/a1Day20LetterWritingRoutes";
import inAppWorkbookRoutes from "../data/inAppWorkbookRoutes.json";

const readSource = (fileName) =>
  fs.readFileSync(path.resolve(__dirname, fileName), "utf8");

describe("A1 Day 20 Chapter 12.3 direct workbook route", () => {
  test("keeps the canonical grammar, workbook, lesson and resource hub URLs", () => {
    expect(A1_DAY20_CHAPTER123_GRAMMAR_ROUTE).toBe(
      "/campus/course/letter-writing-intro-12-3",
    );
    expect(A1_DAY20_CHAPTER123_WORKBOOK_ROUTE).toBe(
      "/campus/course/letter-writing-intro-german-a1-day-12-3",
    );
    expect(A1_DAY20_CHAPTER123_LESSON_ROUTE).toBe(
      "/campus/course/lesson/A1/20?chapter=12.3",
    );
    expect(A1_DAY20_CHAPTER123_RESOURCE_HUB_ROUTE).toBe(
      "/campus/course/lesson/A1/20?chapter=12.3&hub=1",
    );
    expect(inAppWorkbookRoutes.A1["20"]["12.3"]).toBe(
      A1_DAY20_CHAPTER123_WORKBOOK_ROUTE,
    );
  });

  test("registers and renders the dedicated A1 letter workbook", () => {
    const indexSource = readSource("../index.jsx");
    const routeSource = readSource("A1Day20Chapter123DirectWorkbookRoute.js");

    expect(indexSource).toMatch(
      /path=\{A1_DAY20_CHAPTER123_DIRECT_WORKBOOK_PATH\}[\s\S]*element=\{<A1Day20Chapter123DirectWorkbookRoute\s*\/>\}/,
    );
    expect(routeSource).toContain(
      'import A1Day20LetterWritingWorkbookPage from "./A1Day20LetterWritingWorkbookPage"',
    );
    expect(routeSource).toContain(
      "A1_DAY20_CHAPTER123_DIRECT_WORKBOOK_PATH =",
    );
    expect(routeSource).toContain("A1_DAY20_CHAPTER123_WORKBOOK_ROUTE");
    expect(routeSource).toContain("<A1Day20LetterWritingWorkbookPage />");
  });

  test("keeps the dedicated workbook mounted while its shared tabs change the view", () => {
    expect(shouldOpenA1Day20Workbook("?view=workbook&radio=done")).toBe(true);
    expect(
      shouldOpenA1Day20Workbook("?view=grammar&workbookTab=grammar&radio=done"),
    ).toBe(true);
    expect(
      shouldOpenA1Day20Workbook("?view=teil-1&workbookTab=teil-1&radio=done"),
    ).toBe(true);
    expect(
      shouldOpenA1Day20Workbook("?view=submit&workbookTab=submit&radio=done"),
    ).toBe(true);
  });

  test("still sends a bare legacy workbook URL through the lesson hub", () => {
    expect(shouldOpenA1Day20Workbook("?radio=done")).toBe(false);
  });
});
