import fs from "fs";
import path from "path";
import {
  A1_EXAM_HOEREN_SAMPLE_2_TEIL1,
  A1_EXAM_HOEREN_SAMPLE_2_TEIL2,
  A1_EXAM_HOEREN_SAMPLE_2_TEIL3,
} from "../data/a1ExamHorenSample2";

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

  test("uses the supplied Teil 2 example, questions 6–10 and answer key", () => {
    expect(A1_EXAM_HOEREN_SAMPLE_2_TEIL2.audioObjectKey).toBe("a1/horen-part-2/teil-2.mp3");
    expect(A1_EXAM_HOEREN_SAMPLE_2_TEIL2.example.question).toBe(
      "Wohin fährt der Bus Linie 12 heute?",
    );
    expect(A1_EXAM_HOEREN_SAMPLE_2_TEIL2.questions.map((question) => question.number)).toEqual([
      6, 7, 8, 9, 10,
    ]);
    expect(A1_EXAM_HOEREN_SAMPLE_2_TEIL2.questions.map((question) => question.answer)).toEqual([
      "b", "b", "c", "b", "c",
    ]);
    expect(A1_EXAM_HOEREN_SAMPLE_2_TEIL2.questions[0].question).toBe(
      "Wann ist die Bibliothek heute offen?",
    );
  });

  test("uses the supplied Teil 3 questions and answer key", () => {
    expect(A1_EXAM_HOEREN_SAMPLE_2_TEIL3.audioObjectKey).toBe("a1/horen-part-2/teil-3.mp3");
    expect(A1_EXAM_HOEREN_SAMPLE_2_TEIL3.questions.map((question) => question.number)).toEqual([
      11, 12, 13, 14, 15,
    ]);
    expect(A1_EXAM_HOEREN_SAMPLE_2_TEIL3.questions.map((question) => question.answer)).toEqual([
      "b", "c", "b", "c", "a",
    ]);
    expect(A1_EXAM_HOEREN_SAMPLE_2_TEIL3.questions[4].question).toBe("Was möchte Julia?");
  });

  test("renders Teil 1 as picture cards with the answer underneath", () => {
    expect(A1_EXAM_HOEREN_SAMPLE_2_TEIL1.questions.every(
      (question) => question.options.every((option) => Boolean(option.picture)),
    )).toBe(true);
    expect(samplePage).toContain("A1PictureOptions");
    expect(samplePage).toContain("a1-practice-picture-frame");
    expect(samplePage).toContain("a1-practice-picture-answer");
  });

  test("publishes Sample 2 under A1 Exams Room Hören", () => {
    expect(horenPage).toContain('normalizedLevel === "A1" && sampleId === "sample-2"');
    expect(horenPage).toContain('navigate("/exams/horen/a1/sample-2")');
    expect(horenPage).toContain("<strong>Hören Sample 2</strong>");
    expect(horenPage).toContain("15 questions · Teil 1–3");
    expect(samplePage).toContain("A1_SAMPLE_2_PARTS");
    expect(samplePage).toContain("part.data.example");
    expect(horenPage).toContain('? "15 questions · Teil 1–3"');
    expect(samplePage).toContain("fetchA1ExamHorenAudioPlaybackUrl");
  });

  test("keeps Sample 2 separate from Mock Exams", () => {
    expect(samplePage).toContain('level === "A1" && sampleId === "sample-2"');
    expect(samplePage).toContain("This audio belongs to");
    expect(catalog).not.toContain("a1-hoeren-sample-2");
  });
});
