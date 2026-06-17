import { normalizeWritingFeedback } from "../writingFeedbackNormalizer";

describe("normalizeWritingFeedback", () => {
  it("parses fenced JSON with arrays", () => {
    const result = normalizeWritingFeedback(
      'hello```json\n{"score":"21","maxScore":"25","summary":"Good","strengths":["Clear"],"areasToImprove":["Grammar"]}\n```bye',
    );
    expect(result.parseError).toBe(false);
    expect(result.score).toBe(21);
    expect(result.areasToImprove).toEqual(["Grammar"]);
  });

  it("returns a safe retry message for malformed output", () => {
    const result = normalizeWritingFeedback("```json\nnot valid\n```");
    expect(result.parseError).toBe(true);
    expect(result.summary).toMatch(/try again/i);
  });

  it("keeps slash scores as score and max score", () => {
    const result = normalizeWritingFeedback({ score: "16/25", summary: "Ok" });
    expect(result.score).toBe(16);
    expect(result.maxScore).toBe(25);
  });

  it("normalizes simple and nested rubric values", () => {
    const result = normalizeWritingFeedback({
      rubric: {
        task: 4,
        grammar: { score: 3, maxScore: 5, feedback: "Articles" },
      },
    });
    expect(result.rubric.task.score).toBe(4);
    expect(result.rubric.grammar).toEqual({
      score: 3,
      maxScore: 5,
      feedback: "Articles",
    });
  });

  it("supports main issues and areas to improve", () => {
    const result = normalizeWritingFeedback({
      mainIssues: ["Word order"],
      areasToImprove: ["Cases"],
    });
    expect(result.mainIssues).toEqual(["Word order"]);
    expect(result.areasToImprove).toEqual(["Cases"]);
  });

  it("normalizes correction key variants", () => {
    const result = normalizeWritingFeedback({
      corrections: [
        {
          original: "ich bin gehen",
          corrected: "ich gehe",
          explanation: "Verb form",
        },
        { wrong: "der Frau", correct: "die Frau", reason: "Accusative" },
      ],
    });
    expect(result.corrections).toEqual([
      { wrong: "ich bin gehen", correct: "ich gehe", reason: "Verb form" },
      { wrong: "der Frau", correct: "die Frau", reason: "Accusative" },
    ]);
  });
});
