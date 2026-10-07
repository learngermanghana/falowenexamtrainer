import fs from "fs";
import path from "path";
import { C1_READING } from "../data/c1FinalMockData";
import { C1_READING_TEIL2 } from "../data/c1FinalMockTeil2Data";
import { C1_READING_TEIL3 } from "../data/c1FinalMockTeil3Data";
import { C1_READING_TEIL4 } from "../data/c1FinalMockTeil4Data";

describe("C1 Lesen practice", () => {
  const page = fs.readFileSync(path.resolve(__dirname, "./C1FinalMockExamPage.jsx"), "utf8");
  const app = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");
  const lesenPage = fs.readFileSync(path.resolve(__dirname, "./LesenPage.js"), "utf8");

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
    expect(page).toContain("teil3: 20 * 60");
    expect(page).toContain("teil4: 15 * 60");
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
    expect(page).toContain("migratedFromTeil2Completion");
    expect(page).toContain("migratedFromTeil3Completion");
    expect(page).toContain('stage = migratedFromTeil1Completion');
    expect(page).toContain("Teil 1 bis Teil 4 gespeichert");
  });

  test("uses the supplied sleep reconstruction and answer key for Teil 3", () => {
    expect(C1_READING_TEIL3.articleTitle).toBe(
      "Die Vermessung des Schlafs: Wenn Optimierung krank macht",
    );
    expect(C1_READING_TEIL3.sentences.map((sentence) => sentence.id)).toEqual([
      "A", "B", "C", "D", "E", "F", "G", "H",
    ]);
    expect(C1_READING_TEIL3.answers).toEqual({
      13: "F",
      14: "B",
      15: "C",
      16: "D",
      17: "A",
      18: "G",
    });
  });

  test("renders Teil 3 as an inline sentence reconstruction with no duplicate sentence use", () => {
    expect(page).toContain("c1-mock-reconstruction-gap");
    expect(page).toContain("Sätze A bis H · Teil 3");
    expect(page).toContain("Zwei Sätze passen nicht.");
    expect(page).toContain("disabled={usedLetters.has(sentence.id)}");
    expect(page).toContain("Teil 2 abschließen · weiter zu Teil 3");
    expect(page).toContain("Teil 3 abschließen · weiter zu Teil 4");
  });

  test("uses the supplied urban transformation statements and answer key for Teil 4", () => {
    expect(C1_READING_TEIL4.articleTitle).toBe(
      "Beiträge aus der Fachzeitschrift Urbanik & Gesellschaft",
    );
    expect(C1_READING_TEIL4.people.map((person) => person.id)).toEqual(["A", "B", "C"]);
    expect(C1_READING_TEIL4.questions.map((question) => question.number)).toEqual([
      23, 24, 25, 26, 27, 28, 29, 30,
    ]);
    expect(C1_READING_TEIL4.questions.map((question) => question.answer)).toEqual([
      "B", "x", "A", "C", "x", "B", "A", "C",
    ]);
  });

  test("renders Teil 4 with A/B/C/x choices and completes the four reading parts", () => {
    expect(page).toContain("Wählen Sie A, B oder C. Wenn keine Person passt, wählen Sie x.");
    expect(page).toContain("Teil 4 abschließen");
    expect(page).toContain("completed: Boolean(parsed.completed && parsed.teil4Completed)");
  });

  test("publishes C1 as Lesen practice in the Exams Room, not as a mock route", () => {
    expect(lesenPage).toContain('label: "C1 Lesen Sample 1"');
    expect(lesenPage).toContain('detail: "30 questions · Teil 1–4"');
    expect(lesenPage).toContain('navigate(`/exams/lesen/c1/${sample.slug}`)');
    expect(app).not.toContain('path="/campus/course/c1-mock-practice-preview"');
  });

  test("uses a Lesen-practice storage key and only reads the old mock key for migration", () => {
    expect(page).toContain("C1_READING_PRACTICE_STORAGE_KEY");
    expect(page).toContain("C1_FINAL_MOCK_STORAGE_KEY");
    expect(page).toContain("Dieses Training gehört zum Lesen-Bereich im Exams Room und ist kein vollständiger C1-Mock.");
  });
});
