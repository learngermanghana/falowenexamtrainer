const fs = require("fs");
const path = require("path");
const {
  READING_ANSWER_KEY,
  LISTENING_ANSWER_KEY,
  assignmentIdForAttempt,
  buildVerifiedB1MockScore,
  buildB1MockCompletionArtifacts,
} = require("../b1MockCompletionSync");

describe("B1 final mock verified scoring and persistence", () => {
  const verifiedSections = {
    schreiben: { verified: true, score: 18, source: "/writing/b1-mock-score" },
    sprechen: { verified: true, score: 20, source: "/speaking/b1-mock-score" },
  };

  test("recomputes supplied objective answers server-side", () => {
    const result = buildVerifiedB1MockScore({
      state: {
        lesenAnswers: { ...READING_ANSWER_KEY },
        hoerenAnswers: { ...LISTENING_ANSWER_KEY },
      },
      verifiedSections,
    });

    expect(result.sectionScores).toEqual({
      lesen: 25,
      hoeren: 25,
      schreiben: 18,
      sprechen: 20,
    });
    expect(result.overall).toEqual({ score: 88, maxScore: 100, passed: true });
    expect(Object.keys(READING_ANSWER_KEY)).toHaveLength(30);
    expect(READING_ANSWER_KEY).toMatchObject({
      "t2-10": "b",
      "t2-11": "a",
      "t2-12": "b",
    });
    expect(Object.keys(LISTENING_ANSWER_KEY)).toHaveLength(30);
  });

  test("requires verified Schreiben and Sprechen to complete", () => {
    expect(() =>
      buildVerifiedB1MockScore({
        state: {
          lesenAnswers: { ...READING_ANSWER_KEY },
          hoerenAnswers: { ...LISTENING_ANSWER_KEY },
        },
        verifiedSections: { schreiben: { verified: true, score: 20 } },
      }),
    ).toThrow(/server-verified sprechen/i);
  });

  test("publishes readiness and practice attempts separately", () => {
    expect(assignmentIdForAttempt({ attemptNumber: 1, firstAttempt: true })).toBe("B1-FINAL-MOCK");
    expect(assignmentIdForAttempt({ attemptNumber: 2, firstAttempt: false })).toBe("B1-FINAL-MOCK-PRACTICE-2");

    const artifacts = buildB1MockCompletionArtifacts({
      authedUser: { uid: "uid-b1", email: "b1@example.com" },
      studentProfile: {
        snap: { id: "b1student" },
        data: { studentCode: "B1STUDENT", name: "B1 Student", email: "b1@example.com", level: "B1" },
      },
      attemptId: "attempt-b1",
      attemptNumber: 1,
      firstAttempt: true,
      overall: { score: 88, passed: true },
      sectionScores: { lesen: 25, hoeren: 25, schreiben: 18, sprechen: 20 },
      now: new Date("2026-10-07T10:00:00.000Z"),
    });

    expect(artifacts.scoreDocument).toMatchObject({
      assignment: "B1 Final Mock Exam",
      assignmentId: "B1-FINAL-MOCK",
      level: "B1",
      score: 88,
      certificateEligible: false,
      progressionEligible: false,
      attemptLabel: "First readiness attempt",
      attemptType: "readiness",
    });
    expect(artifacts.notificationDocument.title).toBe("Your B1 Final Mock result is ready");
  });

  test("backend owns B1 writing, speaking and attempt routes", () => {
    const appSource = fs.readFileSync(path.resolve(__dirname, "../app.js"), "utf8");
    expect(appSource).toContain('app.post("/writing/b1-mock-score"');
    expect(appSource).toContain('app.post("/speaking/b1-mock-score"');
    expect(appSource).toContain('app.post("/b1-mock/attempt/start"');
    expect(appSource).toContain('app.post("/b1-mock/attempt/save"');
    expect(appSource).toContain("persistVerifiedB1MockSection");
    expect(appSource).toContain("syncB1MockCompletion");
  });
});
