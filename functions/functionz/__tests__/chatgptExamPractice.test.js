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
  test("returns actual A1 mock Lesen and Hören question without private answer keys or audio URLs", () => {
    const lesen = getExamPractice("A1", "a1-mock-02", "reading", "teil1", 1);
    expect(lesen.available).toBe(true);
    expect(lesen.passage[0].subject).toMatch(/Geburtstagsparty/);
    expect(lesen.question.statement).toMatch(/Sonntag/);
    expect(lesen.choices.map(x => x.label)).toEqual(["Richtig","Falsch"]);
    const hoeren = getExamPractice("A1", "a1-mock-03", "listening", "teil1", 1);
    expect(hoeren.available).toBe(true);
    expect(hoeren.audioLinkPolicy).toMatch(/authenticated/);
    expect(hoeren.examRoomUrl).toMatch(/a1-final-mock-3/);
    for (const result of [lesen, hoeren]) {
      expect(JSON.stringify(result)).not.toMatch(/"answer"|"explanation"|"transcript"|"audioObjectKey"|"rubric"|"audioUrl"/);
      expect(result.officialResult).toBe(false);
    }
    expect(getExamPractice("B1","a1-mock-02","reading").available).toBe(false);
    expect(getExamPractice("A1","a1-mock-02","reading","teil2",99).available).toBe(false);
  });
  test("explicit allowlist excludes answer-bearing data even if source contains it", () => {
    const result = safeTask({ title: "Aufgabe", prompt: "Schreiben Sie", answer: "secret",
      correctOption: 2, rubric: { hidden: "secret" }, form: { answer: "secret" } });
    expect(result).toEqual({ title: "Aufgabe", prompt: "Schreiben Sie" });
  });
});


describe("approved Exams Room mock discovery", () => {
  test("lists all published German mocks but only advertises real exported ChatGPT skills", () => {
    const a1 = listExamPractice("A1");
    expect(a1.available).toBe(true);
    const mock2 = a1.mocks.find(m => m.mockId === "a1-mock-02");
    expect(mock2.chatGPTPracticeSkills).toEqual(["writing","speaking","reading","listening"]);
    expect(mock2.examRoomUrl).toMatch(/a1-final-mock-2/);
    expect(a1.mocks.some(m => m.mockId === "a1-mock-03")).toBe(true);
    expect(a1.mocks.some(m => m.mockId === "a1-mock-01")).toBe(false);
    expect(listExamPractice("A2").mocks.some(m=>m.mockId === "a2-mock-02")).toBe(true);
    expect(listExamPractice("C2").available).toBe(false);
    expect(JSON.stringify(a1)).not.toMatch(/"correctOption"|"answerKey"|"rubric"|"sampleAnswer"|"transcript"/);
  });
});
