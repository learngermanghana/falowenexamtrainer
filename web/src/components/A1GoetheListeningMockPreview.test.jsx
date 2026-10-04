import fs from "fs";
import path from "path";
import { A1_GOETHE_LISTENING_MOCK } from "./A1GoetheListeningMockPreview";

describe("A1 Goethe-style Hören mock preview", () => {
  test("keeps the supplied Teil 2 questions 2 to 4", () => {
    expect(A1_GOETHE_LISTENING_MOCK.teil2.questions.map((q) => q.number)).toEqual([2, 3, 4]);
    expect(A1_GOETHE_LISTENING_MOCK.teil2.plays).toBe(1);
  });

  test("keeps five Teil 3 multiple-choice questions and two plays", () => {
    expect(A1_GOETHE_LISTENING_MOCK.teil3.questions).toHaveLength(5);
    expect(A1_GOETHE_LISTENING_MOCK.teil3.questions.map((q) => q.number)).toEqual([1, 2, 3, 4, 5]);
    expect(A1_GOETHE_LISTENING_MOCK.teil3.plays).toBe(2);
    expect(A1_GOETHE_LISTENING_MOCK.teil3.questions.every((q) => q.options.length === 3)).toBe(true);
  });

  test("does not hardcode answer keys before the user supplies them", () => {
    expect(A1_GOETHE_LISTENING_MOCK.teil2.questions.every((q) => !("answer" in q))).toBe(true);
    expect(A1_GOETHE_LISTENING_MOCK.teil3.questions.every((q) => !("answer" in q))).toBe(true);
  });

  test("stays hidden from the A1 Course Book", () => {
    const appSource = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");
    const courseBookSource = fs.readFileSync(path.resolve(__dirname, "../data/a1CourseBookCards.js"), "utf8");

    expect(appSource).toContain("/campus/course/a1-mock-hoeren-preview");
    expect(courseBookSource).not.toContain("a1-mock-hoeren-preview");
  });
});
