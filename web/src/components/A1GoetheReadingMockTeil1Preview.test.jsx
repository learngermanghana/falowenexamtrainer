import fs from "fs";
import path from "path";
import { A1_GOETHE_READING_MOCK_TEIL1 } from "./A1GoetheReadingMockTeil1Preview";

describe("A1 Goethe-style Lesen Teil 1 mock preview", () => {
  test("keeps the Goethe-style structure: one example and five richtig/falsch tasks", () => {
    expect(A1_GOETHE_READING_MOCK_TEIL1.example.number).toBe(0);
    expect(A1_GOETHE_READING_MOCK_TEIL1.questions).toHaveLength(5);
    expect(A1_GOETHE_READING_MOCK_TEIL1.questions.map((question) => question.number)).toEqual([1, 2, 3, 4, 5]);
    expect(
      A1_GOETHE_READING_MOCK_TEIL1.questions.every((question) =>
        ["richtig", "falsch"].includes(question.answer),
      ),
    ).toBe(true);
  });

  test("uses two original everyday texts and does not copy the Goethe source names", () => {
    const allText = [
      ...A1_GOETHE_READING_MOCK_TEIL1.text1.body,
      ...A1_GOETHE_READING_MOCK_TEIL1.text2.body,
    ].join(" ");

    expect(allText).toContain("Samira");
    expect(allText).toContain("Mira");
    expect(allText).not.toContain("Carmen");
    expect(allText).not.toContain("Ralf");
    expect(allText).not.toContain("Hannover");
  });

  test("has a hidden preview route but no A1 Course Book registration", () => {
    const appSource = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");
    const courseBookSource = fs.readFileSync(path.resolve(__dirname, "../data/a1CourseBookCards.js"), "utf8");

    expect(appSource).toContain("/campus/course/a1-mock-lesen-teil-1-preview");
    expect(courseBookSource).not.toContain("a1-mock-lesen-teil-1-preview");
    expect(courseBookSource).not.toContain("Goethe-style Lesen Teil 1");
  });
});
