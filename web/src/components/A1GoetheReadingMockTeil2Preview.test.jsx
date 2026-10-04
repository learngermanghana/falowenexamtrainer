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

  test("keeps distractors plausible and hides answers from obvious domain names", () => {
    const q7 = A1_GOETHE_READING_MOCK_TEIL2.questions.find((question) => question.number === 7);
    expect(q7.options.map((option) => option.title)).toEqual(["Deutsch im Sommer", "Deutsch im Sommer"]);
    expect(q7.options[0].url).not.toContain("online");
    expect(q7.options[1].url).not.toContain("berlin");

    const q8 = A1_GOETHE_READING_MOCK_TEIL2.questions.find((question) => question.number === 8);
    expect(q8.options.map((option) => option.title)).toEqual([
      "Bahnreisen einfach planen",
      "Bahnreisen einfach planen",
    ]);
    expect(q8.answer).toBe("a");

    const q9 = A1_GOETHE_READING_MOCK_TEIL2.questions.find((question) => question.number === 9);
    expect(q9.options.map((option) => option.title)).toEqual([
      "Den Chiemsee entdecken",
      "Den Chiemsee entdecken",
    ]);
    expect(q9.answer).toBe("b");
  });

  test("stays hidden from the A1 Course Book", () => {
    const appSource = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");
    const courseBookSource = fs.readFileSync(path.resolve(__dirname, "../data/a1CourseBookCards.js"), "utf8");

    expect(appSource).toContain("/campus/course/a1-mock-lesen-teil-2-preview");
    expect(courseBookSource).not.toContain("a1-mock-lesen-teil-2-preview");
  });
});
