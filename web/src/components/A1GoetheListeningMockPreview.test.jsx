import fs from "fs";
import path from "path";
import { A1_GOETHE_LISTENING_MOCK } from "./A1GoetheListeningMockPreview";

describe("A1 Goethe-style Hören mock preview", () => {
  test("keeps Teil 2 Aufgaben 7 to 10 and one-play format", () => {
    expect(A1_GOETHE_LISTENING_MOCK.teil2.questions.map((q) => q.number)).toEqual([7, 8, 9, 10]);
    expect(A1_GOETHE_LISTENING_MOCK.teil2.plays).toBe(1);
    expect(A1_GOETHE_LISTENING_MOCK.teil2.audioObjectKey).toBe("a1/mock-hoeren/mock-01/teil-2.mp3");
  });

  test("uses balanced Teil 2 richtig/falsch traps from the supplied audio", () => {
    expect(
      Object.fromEntries(
        A1_GOETHE_LISTENING_MOCK.teil2.questions.map((q) => [q.number, q.answer]),
      ),
    ).toEqual({
      7: "falsch",
      8: "richtig",
      9: "falsch",
      10: "richtig",
    });
  });

  test("keeps five Teil 3 multiple-choice questions numbered 11 to 15", () => {
    expect(A1_GOETHE_LISTENING_MOCK.teil3.questions).toHaveLength(5);
    expect(A1_GOETHE_LISTENING_MOCK.teil3.questions.map((q) => q.number)).toEqual([11, 12, 13, 14, 15]);
    expect(A1_GOETHE_LISTENING_MOCK.teil3.plays).toBe(2);
    expect(A1_GOETHE_LISTENING_MOCK.teil3.questions.every((q) => q.options.length === 3)).toBe(true);
    expect(A1_GOETHE_LISTENING_MOCK.teil3.audioObjectKey).toBe("a1/mock-hoeren/mock-01/teil-3.mp3");
  });

  test("uses the supplied Teil 3 answer key", () => {
    expect(
      Object.fromEntries(
        A1_GOETHE_LISTENING_MOCK.teil3.questions.map((q) => [q.number, q.answer]),
      ),
    ).toEqual({
      11: "B",
      12: "A",
      13: "B",
      14: "B",
      15: "A",
    });
  });

  test("stays hidden from the A1 Course Book", () => {
    const appSource = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");
    const courseBookSource = fs.readFileSync(path.resolve(__dirname, "../data/a1CourseBookCards.js"), "utf8");

    expect(appSource).toContain("/campus/course/a1-mock-hoeren-preview");
    expect(courseBookSource).not.toContain("a1-mock-hoeren-preview");
  });
});
