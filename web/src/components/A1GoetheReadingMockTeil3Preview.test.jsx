import fs from "fs";
import path from "path";
import { A1_GOETHE_READING_MOCK_TEIL3 } from "./A1GoetheReadingMockTeil3Preview";

describe("A1 Goethe-style Lesen Teil 3 mock preview", () => {
  test("keeps one example and Aufgaben 11 to 15", () => {
    expect(A1_GOETHE_READING_MOCK_TEIL3.example.number).toBe(0);
    expect(A1_GOETHE_READING_MOCK_TEIL3.questions.map((question) => question.number)).toEqual([11, 12, 13, 14, 15]);
  });

  test("uses short public notices with richtig/falsch answers", () => {
    expect(
      A1_GOETHE_READING_MOCK_TEIL3.questions.every((question) =>
        ["richtig", "falsch"].includes(question.answer),
      ),
    ).toBe(true);
    expect(A1_GOETHE_READING_MOCK_TEIL3.questions.every((question) => question.notice.lines.length >= 2)).toBe(true);
  });

  test("covers time, prohibition, event, and transport reading", () => {
    expect(A1_GOETHE_READING_MOCK_TEIL3.questions.find((q) => q.number === 12)?.answer).toBe("falsch");
    expect(A1_GOETHE_READING_MOCK_TEIL3.questions.find((q) => q.number === 13)?.notice.heading).toBe("RUHEBEREICH");
    expect(A1_GOETHE_READING_MOCK_TEIL3.questions.find((q) => q.number === 14)?.answer).toBe("richtig");
    expect(A1_GOETHE_READING_MOCK_TEIL3.questions.find((q) => q.number === 15)?.answer).toBe("richtig");
  });

  test("stays hidden from the A1 Course Book", () => {
    const appSource = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");
    const courseBookSource = fs.readFileSync(path.resolve(__dirname, "../data/a1CourseBookCards.js"), "utf8");

    expect(appSource).toContain("/campus/course/a1-mock-lesen-teil-3-preview");
    expect(courseBookSource).not.toContain("a1-mock-lesen-teil-3-preview");
  });
});
