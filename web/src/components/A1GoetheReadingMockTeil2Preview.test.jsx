import fs from "fs";
import path from "path";
import { A1_GOETHE_READING_MOCK_TEIL2 } from "./A1GoetheReadingMockTeil2Preview";

describe("A1 Goethe-style Lesen Teil 2 mock preview", () => {
  test("keeps one example and Aufgaben 6 to 10", () => {
    expect(A1_GOETHE_READING_MOCK_TEIL2.example.number).toBe(0);
    expect(A1_GOETHE_READING_MOCK_TEIL2.questions.map((question) => question.number)).toEqual([6, 7, 8, 9, 10]);
  });

  test("uses side-by-side website alternatives for 6 to 9 and a timetable for 10", () => {
    const websiteQuestions = A1_GOETHE_READING_MOCK_TEIL2.questions.filter((question) => question.number < 10);
    expect(websiteQuestions.every((question) => !question.timetable && question.options.length === 2)).toBe(true);

    const question10 = A1_GOETHE_READING_MOCK_TEIL2.questions.find((question) => question.number === 10);
    expect(question10.timetable).toBe(true);
    expect(question10.options).toHaveLength(2);
    expect(question10.options.every((option) => option.rows.length === 2)).toBe(true);
  });

  test("stays hidden from the A1 Course Book", () => {
    const appSource = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");
    const courseBookSource = fs.readFileSync(path.resolve(__dirname, "../data/a1CourseBookCards.js"), "utf8");

    expect(appSource).toContain("/campus/course/a1-mock-lesen-teil-2-preview");
    expect(courseBookSource).not.toContain("a1-mock-lesen-teil-2-preview");
  });
});
