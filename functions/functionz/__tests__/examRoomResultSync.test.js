const {
  buildExamRoomResultArtifacts,
  normalizeResultInput,
} = require("../examRoomResultSync");

describe("Exams Room result sync", () => {
  const studentProfile = {
    snap: { id: "A1TEST001" },
    data: {
      studentCode: "A1TEST001",
      name: "Test Student",
      email: "student@example.com",
      level: "A1",
    },
  };

  test("builds a Firestore score for Hören practice", () => {
    const artifacts = buildExamRoomResultArtifacts({
      authedUser: { uid: "uid-1", email: "student@example.com" },
      studentProfile,
      input: {
        level: "A1",
        section: "hoeren",
        setId: "a1-hoeren-sample-3",
        title: "A1 Hören Sample 3",
        score: 11,
        total: 15,
        percent: 73,
        passed: true,
        attemptId: "attempt-1",
        attemptNumber: 1,
        resultType: "practice",
        route: "/exams/horen/a1/sample-3",
        sectionScores: { teil1: 5, teil2: 3, teil3: 3 },
      },
      now: new Date("2026-10-08T13:00:00.000Z"),
    });

    expect(artifacts.scoreDocument).toMatchObject({
      studentCode: "A1TEST001",
      email: "student@example.com",
      assignment: "A1 Hören Sample 3",
      rawScore: 11,
      total: 15,
      score: 73,
      finalScore: 73,
      source: "exam_room_practice",
      examSection: "hoeren",
      resultType: "practice",
      certificateEligible: false,
      progressionEligible: false,
      link: "/exams/horen/a1/sample-3",
    });
    expect(artifacts.scoreDocId).toContain("a1-hoeren-sample-3");
  });

  test("publishes B2 final mock with the final-mock source expected by Admin", () => {
    const normalized = normalizeResultInput({
      level: "B2",
      section: "mixed",
      setId: "b2-final-mock",
      title: "B2 Final Mock Exam",
      score: 72,
      total: 100,
      percent: 72,
      passed: true,
      attemptId: "b2-attempt-1",
      resultType: "final_mock",
      sectionScores: {
        lesen: 18,
        hoeren: 17,
        schreiben: 19,
        sprechen: 18,
      },
    });

    expect(normalized.source).toBe("b2_final_mock");
    expect(normalized.assignmentId).toBe("B2-FINAL-MOCK");
    expect(normalized.route).toBe("/campus/results");
    expect(normalized.sectionScores).toEqual({
      lesen: 18,
      hoeren: 17,
      schreiben: 19,
      sprechen: 18,
    });
  });

  test("rejects malformed result payloads", () => {
    expect(() =>
      normalizeResultInput({
        level: "A1",
        section: "hoeren",
        setId: "",
        score: 3,
        total: 5,
        attemptId: "attempt-1",
      }),
    ).toThrow(/setId is required/i);
  });
});
