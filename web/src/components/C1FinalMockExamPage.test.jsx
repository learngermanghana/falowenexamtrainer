import fs from "fs";
import path from "path";
import { C1_READING } from "../data/c1FinalMockData";
import { C1_READING_TEIL2 } from "../data/c1FinalMockTeil2Data";

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

  test("uses the Goethe-style section timers and autosave", () => {
    expect(page).toContain("teil1: 10 * 60");
    expect(page).toContain("teil2: 20 * 60");
    expect(page).toContain("window.localStorage.setItem");
    expect(page).toContain("c1-mock-inline-gap");
    expect(page).toContain("Wählen Sie a, b, c oder d.");
    expect(page).toContain("Automatisch gespeichert");
  });

  test("uses the supplied smartphone article and answer key for Teil 2", () => {
    expect(C1_READING_TEIL2.articleTitle).toBe(
      "Das Smartphone am Esstisch: Wie die digitale Dauerpräsenz Familien verändert",
    );
    expect(C1_READING_TEIL2.questions.map((question) => question.number)).toEqual([
      7, 8, 9, 10, 11, 12,
    ]);
    expect(C1_READING_TEIL2.questions.map((question) => question.answer)).toEqual([
      "b", "b", "c", "a", "c", "b",
    ]);
  });

  test("continues Teil 1 into Teil 2 and migrates the older Teil-1-only preview", () => {
    expect(page).toContain("Teil 1 abschließen · weiter zu Teil 2");
    expect(page).toContain("migratedFromTeil1Completion");
    expect(page).toContain('stage: migratedFromTeil1Completion ? "teil2"');
    expect(page).toContain("Teil 1 und Teil 2 gespeichert");
  });

  test("publishes a C1 mock preview route while the remaining parts are built", () => {
    expect(app).toContain('path="/campus/course/c1-mock-practice-preview" element={<C1FinalMockExamPage />}');
  });
});
