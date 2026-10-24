import fs from "fs";
import path from "path";
import { A2_GOETHE_READING_MOCK } from "./A2GoetheReadingMockPreview";

describe("A2 Goethe-style Lesen mock preview", () => {
  test("contains the four Lesen parts and 20 scored tasks", () => {
    expect(A2_GOETHE_READING_MOCK.teil1.questions).toHaveLength(5);
    expect(A2_GOETHE_READING_MOCK.teil2.questions).toHaveLength(5);
    expect(A2_GOETHE_READING_MOCK.teil3.questions).toHaveLength(5);
    expect(A2_GOETHE_READING_MOCK.teil4.people).toHaveLength(5);
  });

  test("keeps Teil 4 as ad matching with one X answer", () => {
    expect(A2_GOETHE_READING_MOCK.teil4.ads).toHaveLength(6);
    expect(
      A2_GOETHE_READING_MOCK.teil4.people.filter((item) => item.answer === "X"),
    ).toHaveLength(1);
    expect(A2_GOETHE_READING_MOCK.teil4.example.answer).toBe("d");
  });

  test("keeps the preview hidden from the A2 Course Book", () => {
    const appSource = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");
    const scheduleSource = fs.readFileSync(path.resolve(__dirname, "../data/courseSchedule.js"), "utf8");

    expect(appSource).toContain("/campus/course/a2-mock-lesen-preview");
    expect(scheduleSource).not.toContain("/campus/course/a2-mock-lesen-preview");
  });
});
