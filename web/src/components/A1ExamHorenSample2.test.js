import fs from "fs";
import path from "path";
import { A1_EXAM_HOEREN_SAMPLE_2_TEIL1 } from "../data/a1ExamHorenSample2";

describe("A1 Exams Room Hören Sample 2", () => {
  const horenPage = fs.readFileSync(path.resolve(__dirname, "./HorenPage.js"), "utf8");
  const samplePage = fs.readFileSync(path.resolve(__dirname, "./ListeningPracticeSamplePage.jsx"), "utf8");
  const catalog = fs.readFileSync(path.resolve(__dirname, "../data/mockExamCatalog.js"), "utf8");

  test("uses the supplied Teil 1 questions and answer key", () => {
    expect(A1_EXAM_HOEREN_SAMPLE_2_TEIL1.audioObjectKey).toBe("a1/horen-part-2/teil-1.mp3");
    expect(A1_EXAM_HOEREN_SAMPLE_2_TEIL1.questions.map((question) => question.number)).toEqual([
      1, 2, 3, 4, 5,
    ]);
    expect(A1_EXAM_HOEREN_SAMPLE_2_TEIL1.questions.map((question) => question.answer)).toEqual([
      "b", "b", "c", "a", "a",
    ]);
  });

  test("publishes Sample 2 under A1 Exams Room Hören", () => {
    expect(horenPage).toContain('normalizedLevel === "A1" && sampleId === "sample-2"');
    expect(horenPage).toContain('navigate("/exams/horen/a1/sample-2")');
    expect(horenPage).toContain("<strong>Hören Sample 2</strong>");
    expect(horenPage).toContain("5 questions · Teil 1");
    expect(samplePage).toContain("A1_SAMPLE_2_PARTS");
    expect(samplePage).toContain("fetchA1ExamHorenAudioPlaybackUrl");
  });

  test("keeps Sample 2 separate from Mock Exams", () => {
    expect(samplePage).toContain('level === "A1" && sampleId === "sample-2"');
    expect(samplePage).toContain("This audio belongs to");
    expect(catalog).not.toContain("a1-hoeren-sample-2");
  });
});
