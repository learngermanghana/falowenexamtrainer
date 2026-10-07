import fs from "fs";
import path from "path";
import { C1_READING } from "../data/c1FinalMockData";

describe("C1 Final Mock Lesen Teil 1", () => {
  const page = fs.readFileSync(path.resolve(__dirname, "./C1FinalMockExamPage.jsx"), "utf8");
  const app = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");

  test("uses the supplied GreenVoyage cloze task and answer key", () => {
    expect(C1_READING.teil1.articleTitle).toBe("Ein Pionier des nachhaltigen Reisens");
    expect(C1_READING.teil1.questions.map((question) => question.number)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(C1_READING.teil1.questions.map((question) => question.answer)).toEqual([
      "a", "b", "a", "c", "b", "b",
    ]);
  });

  test("uses the Goethe-style 10-minute cloze flow with autosave", () => {
    expect(page).toContain("const DURATION_SECONDS = 10 * 60");
    expect(page).toContain("window.localStorage.setItem");
    expect(page).toContain("c1-mock-inline-gap");
    expect(page).toContain("Wählen Sie a, b, c oder d.");
    expect(page).toContain("Automatisch gespeichert");
  });

  test("publishes a C1 mock preview route while the remaining parts are built", () => {
    expect(app).toContain('path="/campus/course/c1-mock-practice-preview" element={<C1FinalMockExamPage />}');
  });
});
