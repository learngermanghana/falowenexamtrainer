"use strict";
const { getExamPractice, listExamPractice, safeTask } = require("../chatgptExamPractice");

describe("answer-safe Falowen ChatGPT exam practice", () => {
  test("returns authentic A2 writing prompt without rubric or grading keys", () => {
    const result = getExamPractice("A2", "a2-mock-02", "writing", "teil1");
    expect(result.available).toBe(true);
    expect(result.task.situation).toMatch(/Julia/);
    expect(JSON.stringify(result)).not.toMatch(/readingAnswerKey|listeningAnswerKey|rubric|sampleAnswer|correctAnswer/);
    expect(result.officialResult).toBe(false);
  });
  test("blocks cross-level questions and unknown mocks", () => {
    expect(getExamPractice("B1", "a2-mock-02", "writing").available).toBe(false);
    expect(getExamPractice("A2", "a2-mock-03", "writing").available).toBe(false);
  });
  test("does not expose listening transcripts, correct answers or private Hören media", () => {
    expect(getExamPractice("A1", "a1-mock-02", "listening").available).toBe(false);
    expect(getExamPractice("A1", "a1-mock-02", "reading").available).toBe(false);
  });
  test("explicit allowlist excludes answer-bearing data even if source contains it", () => {
    const result = safeTask({ title: "Aufgabe", prompt: "Schreiben Sie", answer: "secret",
      correctOption: 2, rubric: { hidden: "secret" }, form: { answer: "secret" } });
    expect(result).toEqual({ title: "Aufgabe", prompt: "Schreiben Sie" });
  });
});


describe("approved Exams Room mock discovery", () => {
  test("returns A1 and A2 source-approved writing/speaking mocks without private questions or keys", () => {
    const a1 = listExamPractice("A1");
    expect(a1.available).toBe(true);
    expect(a1.mocks.map(mock => mock.mockId)).toEqual(["a1-mock-02", "a1-mock-03"]);
    expect(a1.mocks.every(mock => mock.skills.includes("writing") && mock.practiceOnly)).toBe(true);
    expect(listExamPractice("A2").mocks.map(mock => mock.mockId)).toEqual(["a2-mock-02"]);
    expect(listExamPractice("C2").available).toBe(false);
    expect(JSON.stringify(a1)).not.toMatch(/correctOption|answerKey|rubric|sampleAnswer|transcript/);
  });
});
