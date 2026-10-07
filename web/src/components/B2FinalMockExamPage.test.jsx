import fs from "fs";
import path from "path";
import { B2_READING } from "../data/b2FinalMockData";

describe("B2 Final Mock Lesen Teil 1", () => {
  const page = fs.readFileSync(path.resolve(__dirname, "./B2FinalMockExamPage.jsx"), "utf8");
  const app = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");

  test("uses the supplied Minimalismus forum and answer key", () => {
    expect(B2_READING.teil1.forumTitle).toBe("Minimalismus – Befreiung oder moderner Luxus?");
    expect(B2_READING.teil1.people.map((person) => person.id)).toEqual(["A", "B", "C", "D"]);
    expect(B2_READING.teil1.example).toMatchObject({ number: 0, answer: "A" });
    expect(B2_READING.teil1.questions.map((question) => question.answer)).toEqual([
      "B", "A", "C", "D", "D", "B", "C", "C", "B",
    ]);
  });

  test("keeps the Goethe-style 18-minute section and autosaves answers", () => {
    expect(page).toContain("const DURATION_SECONDS = 18 * 60");
    expect(page).toContain("window.localStorage.setItem");
    expect(page).toContain("Automatisch gespeichert");
    expect(page).toContain("Die Personen können mehrmals gewählt werden");
  });

  test("publishes only a preview route while the B2 mock is still being built", () => {
    expect(app).toContain('path="/campus/course/b2-mock-practice-preview" element={<B2FinalMockExamPage />}');
  });
});
