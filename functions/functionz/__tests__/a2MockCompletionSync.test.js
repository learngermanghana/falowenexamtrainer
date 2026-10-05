const fs = require("fs");
const path = require("path");
const {
  READING_ANSWER_KEY,
  LISTENING_ANSWER_KEY,
  assignmentIdForAttempt,
  buildVerifiedA2MockScore,
  buildA2MockCompletionArtifacts,
} = require("../a2MockCompletionSync");

describe("A2 final mock verified scoring and persistence", () => {
  const verifiedSections = {
    schreiben: { verified: true, score: 18, source: "/writing/a2-mock-score" },
    sprechen: { verified: true, score: 20, source: "/speaking/a2-mock-score" },
  };

  test("uses the supplied Lesen answer keys for Teil 1–4", () => {
    expect(READING_ANSWER_KEY).toMatchObject({
      "t1-1": "b",
      "t1-2": "c",
      "t1-3": "b",
      "t1-4": "a",
      "t1-5": "b",
      "t2-6": "a",
      "t2-7": "b",
      "t2-8": "a",
      "t2-9": "a",
      "t2-10": "c",
      "t3-11": "b",
      "t3-12": "b",
      "t3-13": "a",
      "t3-14": "c",
      "t3-15": "b",
      "t4-16": "e",
      "t4-17": "b",
      "t4-18": "a",
      "t4-19": "d",
      "t4-20": "x",
    });
  });

  test("uses the audited Hören key for all four parts", () => {
    expect(LISTENING_ANSWER_KEY).toEqual({
      "t1-1": "c",
      "t1-2": "b",
      "t1-3": "b",
      "t1-4": "b",
      "t1-5": "b",
      "t2-6": "a",
      "t2-7": "b",
      "t2-8": "c",
      "t2-9": "d",
      "t2-10": "e",
      "t3-11": "a",
      "t3-12": "c",
      "t3-13": "b",
      "t3-14": "a",
      "t3-15": "c",
      "t4-16": "ja",
      "t4-17": "nein",
      "t4-18": "ja",
      "t4-19": "nein",
      "t4-20": "ja",
    });
  });

  test("caps Schreiben when required content points are missing", () => {
    const appSource = fs.readFileSync(path.resolve(__dirname, "../app.js"), "utf8");
    expect(appSource).toContain("capA2MockWritingScoreForTaskCompletion");
    expect(appSource).toContain("missingCaps: [7, 4, 1]");
    expect(appSource).toContain("missingCaps: [11, 7, 3]");
    expect(appSource).toContain("required_points_met");
    expect(appSource).toContain("greeting_ok");
    expect(appSource).toContain("closing_ok");
    expect(appSource).toContain("responsePresent: Boolean(sms)");
    expect(appSource).toContain("responsePresent: Boolean(email)");
  });

  test("recomputes objective sections server-side and combines four 25-point skills", () => {
    const result = buildVerifiedA2MockScore({
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
    expect(result.overall).toEqual({
      score: 88,
      maxScore: 100,
      passed: true,
    });
  });

  test("requires server-verified Schreiben and Sprechen before completion", () => {
    expect(() =>
      buildVerifiedA2MockScore({
        state: {
          lesenAnswers: { ...READING_ANSWER_KEY },
          hoerenAnswers: { ...LISTENING_ANSWER_KEY },
        },
        verifiedSections: {
          schreiben: { verified: true, score: 20 },
        },
      }),
    ).toThrow(/server-verified sprechen/i);
  });

  test("publishes first and practice attempts separately without certificate ownership", () => {
    expect(assignmentIdForAttempt({ attemptNumber: 1, firstAttempt: true })).toBe("A2-FINAL-MOCK");
    expect(assignmentIdForAttempt({ attemptNumber: 2, firstAttempt: false })).toBe("A2-FINAL-MOCK-PRACTICE-2");

    const artifacts = buildA2MockCompletionArtifacts({
      authedUser: { uid: "uid-a2", email: "a2@example.com" },
      studentProfile: {
        snap: { id: "a2student" },
        data: { studentCode: "A2STUDENT", name: "A2 Student", email: "a2@example.com", level: "A2" },
      },
      attemptId: "attempt-a2",
      attemptNumber: 1,
      firstAttempt: true,
      overall: { score: 88, passed: true },
      sectionScores: { lesen: 25, hoeren: 25, schreiben: 18, sprechen: 20 },
      now: new Date("2026-10-05T18:00:00.000Z"),
    });

    expect(artifacts.scoreDocument).toMatchObject({
      assignment: "A2 Final Mock Exam",
      assignmentId: "A2-FINAL-MOCK",
      level: "A2",
      score: 88,
      certificateEligible: false,
      progressionEligible: false,
      attemptLabel: "First readiness attempt",
      attemptType: "readiness",
    });
    expect(artifacts.notificationDocument.title).toBe("Your A2 Final Mock result is ready");
  });

  test("A2 speaking endpoint requires the five synchronized responses", () => {
    const appSource = fs.readFileSync(path.resolve(__dirname, "../app.js"), "utf8");
    const start = appSource.indexOf('app.post("/speaking/a2-mock-score"');
    const end = appSource.indexOf('app.post("/speech-trainer/feedback"', start);
    const routeSource = appSource.slice(start, end);

    expect(routeSource).toContain("attempts.length !== 5");
    expect(routeSource).toContain("teil1_questions");
    expect(routeSource).toContain("teil1_answers");
    expect(routeSource).toContain("teil2_main");
    expect(routeSource).toContain("teil2_followup");
    expect(routeSource).toContain('"teil3"');
    expect(routeSource).toContain("persistVerifiedA2MockSection");
  });
});
