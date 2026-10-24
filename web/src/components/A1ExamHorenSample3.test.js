import fs from "fs";
import path from "path";
import {
  A1_EXAM_HOEREN_SAMPLE_3_TEIL1,
  A1_EXAM_HOEREN_SAMPLE_3_TEIL2,
  A1_EXAM_HOEREN_SAMPLE_3_TEIL3,
} from "../data/a1ExamHorenSample3";

describe("A1 Exams Room Hören Sample 3", () => {
  const horenPage = fs.readFileSync(path.resolve(__dirname, "./HorenPage.js"), "utf8");
  const samplePage = fs.readFileSync(path.resolve(__dirname, "./ListeningPracticeSamplePage.jsx"), "utf8");
  const catalog = fs.readFileSync(path.resolve(__dirname, "../data/mockExamCatalog.js"), "utf8");

  test("uses the supplied Teil 1 questions and answer key", () => {
    expect(A1_EXAM_HOEREN_SAMPLE_3_TEIL1.audioObjectKey).toBe("a1/horen-part-3/teil-1.mp3");
    expect(A1_EXAM_HOEREN_SAMPLE_3_TEIL1.questions.map((question) => question.number)).toEqual([
      1, 2, 3, 4, 5, 6,
    ]);
    expect(A1_EXAM_HOEREN_SAMPLE_3_TEIL1.questions.map((question) => question.answer)).toEqual([
      "b", "a", "b", "a", "b", "b",
    ]);
  });

  test("uses the supplied Teil 2 example, questions and key", () => {
    expect(A1_EXAM_HOEREN_SAMPLE_3_TEIL2.audioObjectKey).toBe("a1/horen-part-3/teil-2.mp3");
    expect(A1_EXAM_HOEREN_SAMPLE_3_TEIL2.example.question).toBe(
      "Bis wohin fährt die Straßenbahn Linie 5 heute?",
    );
    expect(A1_EXAM_HOEREN_SAMPLE_3_TEIL2.questions.map((question) => question.number)).toEqual([
      7, 8, 9, 10,
    ]);
    expect(A1_EXAM_HOEREN_SAMPLE_3_TEIL2.questions.map((question) => question.answer)).toEqual([
      "a", "c", "b", "b",
    ]);
    expect(A1_EXAM_HOEREN_SAMPLE_3_TEIL2.plays).toBe(1);
  });

  test("uses the supplied Teil 3 questions and key", () => {
    expect(A1_EXAM_HOEREN_SAMPLE_3_TEIL3.audioObjectKey).toBe("a1/horen-part-3/teil-3.mp3");
    expect(A1_EXAM_HOEREN_SAMPLE_3_TEIL3.questions.map((question) => question.number)).toEqual([
      11, 12, 13, 14, 15,
    ]);
    expect(A1_EXAM_HOEREN_SAMPLE_3_TEIL3.questions.map((question) => question.answer)).toEqual([
      "b", "c", "c", "b", "b",
    ]);
    expect(A1_EXAM_HOEREN_SAMPLE_3_TEIL3.plays).toBe(2);
  });

  test("publishes Hören Sample 3 under A1 Exams Room and keeps it out of mocks", () => {
    expect(horenPage).toContain('["sample-2", "sample-3"].includes(sampleId)');
    expect(horenPage).toContain('navigate("/exams/horen/a1/sample-3")');
    expect(horenPage).toContain("<strong>Hören Sample 3</strong>");
    expect(horenPage).toContain("15 questions · Teil 1–3");
    expect(samplePage).toContain("A1_SAMPLE_3_PARTS");
    expect(samplePage).toContain('sampleId === "sample-3"');
    expect(catalog).not.toContain("a1-hoeren-sample-3");
  });
});
