import fs from "fs";
import path from "path";
import {
  C1_EXAM_HOEREN_SAMPLE_1,
  C1_EXAM_HOEREN_SAMPLE_1_TEIL2,
} from "../data/c1ExamHorenSample1";

describe("C1 Exams Room Hören Sample 1", () => {
  const horenPage = fs.readFileSync(path.resolve(__dirname, "./HorenPage.js"), "utf8");
  const samplePage = fs.readFileSync(path.resolve(__dirname, "./ListeningPracticeSamplePage.jsx"), "utf8");
  const catalog = fs.readFileSync(path.resolve(__dirname, "../data/mockExamCatalog.js"), "utf8");

  test("uses the supplied C1 Teil 1 book-matching questions and key", () => {
    expect(C1_EXAM_HOEREN_SAMPLE_1.audioObjectKey).toBe("c1/exam-horen-1/teil-1.mp3");
    expect(C1_EXAM_HOEREN_SAMPLE_1.questions.map((question) => question.number)).toEqual([
      1, 2, 3, 4, 5, 6,
    ]);
    expect(C1_EXAM_HOEREN_SAMPLE_1.questions.map((question) => question.answer)).toEqual([
      "a", "b", "c", "a", "b", "c",
    ]);
  });

  test("uses the supplied C1 Teil 2 sleep-research interview questions and key", () => {
    expect(C1_EXAM_HOEREN_SAMPLE_1_TEIL2.audioObjectKey).toBe("c1/exam-horen-1/teil-2.mp3");
    expect(C1_EXAM_HOEREN_SAMPLE_1_TEIL2.questions.map((question) => question.number)).toEqual([
      7, 8, 9, 10, 11, 12, 13, 14, 15,
    ]);
    expect(C1_EXAM_HOEREN_SAMPLE_1_TEIL2.questions.map((question) => question.answer)).toEqual([
      "b", "b", "b", "c", "a", "b", "b", "a", "b",
    ]);
  });

  test("publishes it under Exams Room Hören, not Mock Exams", () => {
    expect(horenPage).toContain('["A1", "A2", "C1"].includes(normalizedLevel)');
    expect(horenPage).toContain('"15 questions · Teil 1–2"');
    expect(samplePage).toContain("fetchC1ExamHorenAudioPlaybackUrl");
    expect(samplePage).toContain('level === "C1"');
    expect(catalog).not.toContain("c1-final-01");
  });

  test("uses practice wording instead of calling the C1 audio a mock", () => {
    expect(samplePage).toContain("This audio belongs to C1 Hören practice in the Exams Room.");
    expect(samplePage).toContain('level === "C1" ? `${plays}× practice audio`');
  });
});
