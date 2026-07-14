import fs from "fs";
import path from "path";
import { A1_DAY20_CHAPTER123_DIRECT_WORKBOOK_PATH } from "./A1Day20Chapter123DirectWorkbookRoute";
import inAppWorkbookRoutes from "../data/inAppWorkbookRoutes.json";

const readIndexSource = () =>
  fs.readFileSync(path.resolve(__dirname, "../index.jsx"), "utf8");

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
    const routeSource = fs.readFileSync(
      path.resolve(__dirname, "A1Day20Chapter123DirectWorkbookRoute.js"),
      "utf8",
    );

    expect(routeSource).toContain(
      'import LetterWritingIntroPage from "./LetterWritingIntroPage"',
    );
    expect(routeSource).toContain("<main className=\"layout-main\"");
    expect(routeSource).toContain("<LetterWritingIntroPage />");
  });
});
