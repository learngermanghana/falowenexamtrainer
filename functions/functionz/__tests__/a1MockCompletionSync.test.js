const {
  assignmentIdForAttempt,
  buildA1MockCompletionArtifacts,
  deriveMockInsights,
} = require("../a1MockCompletionSync");

describe("A1 mock completion Admin + announcement sync", () => {
  const studentProfile = {
    snap: { id: "a1berlin001" },
    data: {
      studentCode: "A1BERLIN001",
      name: "Test Student",
      email: "student@example.com",
      level: "A1",
    },
  };

  test("builds an Admin-visible score row without making the mock certificate-bearing", () => {
    const artifacts = buildA1MockCompletionArtifacts({
      authedUser: { uid: "uid-1", email: "student@example.com" },
      studentProfile,
      attemptId: "attempt-1",
      attemptNumber: 1,
      firstAttempt: true,
      overall: { score: 68, passed: true },
      sectionScores: {
        lesen: 18,
        hoeren: 20,
        schreiben: 13,
        sprechen: 17,
      },
      now: new Date("2026-10-04T19:00:00.000Z"),
    });

    expect(artifacts.scoreDocument).toMatchObject({
      studentCode: "A1BERLIN001",
      assignment: "A1 Final Mock Exam",
      assignmentId: "A1-FINAL-MOCK",
      score: 68,
      status: "passed",
      attempt: 1,
      firstAttempt: true,
      certificateEligible: false,
      progressionEligible: false,
      strongestArea: "Hören",
      practiseNext: "Schreiben",
    });
    expect(artifacts.scoreDocument.date).toBe("2026-10-04T19:00:00.000Z");
  });

  test("puts the full score summary into a deterministic student announcement", () => {
    const artifacts = buildA1MockCompletionArtifacts({
      authedUser: { uid: "uid-1", email: "student@example.com" },
      studentProfile,
      attemptId: "attempt-1",
      attemptNumber: 1,
      firstAttempt: true,
      overall: { score: 68, passed: true },
      sectionScores: {
        lesen: 18,
        hoeren: 20,
        schreiben: 13,
        sprechen: 17,
      },
      now: new Date("2026-10-04T19:00:00.000Z"),
    });

    expect(artifacts.notificationId).toContain("attempt-1");
    expect(artifacts.notificationDocument.title).toBe("Your A1 Final Mock result is ready");
    expect(artifacts.notificationDocument.body).toContain("Overall: 68% — PASS");
    expect(artifacts.notificationDocument.body).toContain("Lesen 18/25");
    expect(artifacts.notificationDocument.body).toContain("Hören 20/25");
    expect(artifacts.notificationDocument.body).toContain("Schreiben 13/25");
    expect(artifacts.notificationDocument.body).toContain("Sprechen 17/25");
    expect(artifacts.notificationDocument.body).toContain("Practise next: Schreiben");
    expect(artifacts.notificationDocument.route).toBe("/campus/results");
  });

  test("keeps later practice attempts as separate Admin result rows", () => {
    expect(assignmentIdForAttempt({ attemptNumber: 1, firstAttempt: true })).toBe("A1-FINAL-MOCK");
    expect(assignmentIdForAttempt({ attemptNumber: 2, firstAttempt: false })).toBe("A1-FINAL-MOCK-PRACTICE-2");
    expect(assignmentIdForAttempt({ attemptNumber: 3, firstAttempt: false })).toBe("A1-FINAL-MOCK-PRACTICE-3");
  });

  test("derives strongest and next-practice areas from the four section scores", () => {
    expect(
      deriveMockInsights({
        lesen: 5,
        hoeren: 10,
        schreiben: 3,
        sprechen: 19,
      }),
    ).toMatchObject({
      strongest: "Sprechen",
      weakest: "Schreiben",
    });
  });
});
