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

  it("parses fenced JSON nested inside feedback", () => {
    const result = normalizeWritingFeedback({
      requestId: "abc",
      feedback:
        '```json\n{"score":16,"maxScore":25,"summary":"Structured result","rubric":{"task":4}}\n```',
    });

    expect(result.parseError).toBe(false);
    expect(result.score).toBe(16);
    expect(result.summary).toBe("Structured result");
    expect(result.rubric.task.score).toBe(4);
    expect(result.summary).not.toContain("```");
  });

  it("parses raw JSON nested inside result", () => {
    const result = normalizeWritingFeedback({
      result: '{"score":"14/25","summary":"Nested result"}',
    });

    expect(result.parseError).toBe(false);
    expect(result.score).toBe(14);
    expect(result.maxScore).toBe(25);
    expect(result.summary).toBe("Nested result");
  });

  it("keeps normal plain-text feedback as a safe summary", () => {
    const result = normalizeWritingFeedback({
      feedback: "Your argument is clear. Improve the word order in paragraph two.",
    });

    expect(result.parseError).toBe(false);
    expect(result.summary).toMatch(/argument is clear/i);
  });

  it("rejects malformed nested JSON instead of displaying it", () => {
    const result = normalizeWritingFeedback({
      feedback: '```json\n{"score":16, invalid}\n```',
    });

    expect(result.parseError).toBe(true);
    expect(result.summary).toMatch(/try again/i);
    expect(result.summary).not.toContain("invalid");
  });

  it("uses an overall rubric object when top-level scores are missing", () => {
    const result = normalizeWritingFeedback({
      rubric: {
        overall: { score: 18, maxScore: 25 },
        coherence: { score: 4, maxScore: 5 },
      },
      summary: "Good structure",
    });

    expect(result.score).toBe(18);
    expect(result.maxScore).toBe(25);
    expect(result.rubric.coherence.score).toBe(4);
  });
});
