const { COURSE_MOCKS, evaluateResults, buildScoreDocument, findSavedSpeakingParts, courseSpeakingMockStatus } = require("../courseSpeakingMock");

const makeSnapshots = (level = "A2", assignmentId = "A2-8.22", uid = "student-uid") =>
  [1, 2, 3].map((part, index) => ({
    id: `11111111-1111-4111-8111-00000000000${part}`,
    exists: true,
    data: () => ({
      uid, level, source: "exam-speaking-practice", examFlowKey: `${level}-${part}`,
      sessionId: `11111111-1111-4111-8111-00000000000${part}`,
      teil: `Teil ${part}`, completed: true,
      task: { id: `${level}-task-${part}`, teil: `Teil ${part}`, courseAssignmentKey: assignmentId },
      answers: [`German answer ${part}`],
      feedback: `Part ${part} feedback`,
      assessment: { practiceOnly: true, score: [6, 7, 8][index], maxScore: 10,
        tasks: [{step: 1, score: 2, maxScore: 2, answer: "German answer"}],
        summary: `Summary ${part}`, strength: "I can respond", priority: "Improve grammar" },
    }),
  }));

describe("Graded Goethe-style speaking coursework", () => {
  test.each([["A2-8.22", "A2"], ["B1-7.23", "B1"]])("%s uses verified three-part scores", (assignmentId, level) => {
    const outcome = evaluateResults({ assignmentId, uid: "student-uid",
      snapshots: makeSnapshots(level, assignmentId) });
    expect(outcome.score).toBe(70);
    expect(outcome.config).toEqual(COURSE_MOCKS[assignmentId]);
    expect(Object.keys(outcome.parts)).toEqual(["teil1", "teil2", "teil3"]);
    const row = buildScoreDocument({ assignmentId, uid: "student-uid", outcome,
      auth: { email: "student@example.org" }, profile: { studentCode: "STUDENT123", name: "Test Student" } });
    expect(row).toMatchObject({
      studentCode: "STUDENT123", assignmentId, score: 70, passed: true,
      source: "course_speaking_mock", progressionEligible: true,
      practiceEstimate: true, pronunciationScored: false,
      sheetSyncStatus: "pending",
      sectionScores: { sprechen: 70, teil1: 60, teil2: 70, teil3: 80 },
    });
  });

  test("rejects any incomplete part", () => {
    const parts = makeSnapshots();
    parts[2].data = () => ({ ...makeSnapshots()[2].data(), completed: false });
    expect(() => evaluateResults({ assignmentId: "A2-8.22", uid: "student-uid", snapshots: parts }))
      .toThrow(/three complete/i);
  });

  test("rejects replacing another student's assessment", () => {
    const parts = makeSnapshots();
    parts[1].data = () => ({ ...makeSnapshots()[1].data(), uid: "not-this-student" });
    expect(() => evaluateResults({ assignmentId: "A2-8.22", uid: "student-uid", snapshots: parts }))
      .toThrow(/student/i);
  });

  test("rejects mismatched level, part source and assignment identity", () => {
    const parts = makeSnapshots();
    parts[1].data = () => ({ ...makeSnapshots()[1].data(), examFlowKey: "B1-2" });
    expect(() => evaluateResults({ assignmentId: "A2-8.22", uid: "student-uid", snapshots: parts }))
      .toThrow(/three complete/i);
    const wrongAssignment = makeSnapshots();
    wrongAssignment[1].data = () => ({ ...makeSnapshots()[1].data(), task: { courseAssignmentKey: "B1-7.23" } });
    expect(() => evaluateResults({ assignmentId: "A2-8.22", uid: "student-uid", snapshots: wrongAssignment }))
      .toThrow(/three complete/i);
  });

  test("rejects duplicate exam parts and missing verified assessments", () => {
    const duplicate = makeSnapshots();
    duplicate[1].data = () => ({ ...makeSnapshots()[1].data(), teil: "Teil 1", examFlowKey: "A2-1" });
    expect(() => evaluateResults({ assignmentId: "A2-8.22", uid: "student-uid", snapshots: duplicate }))
      .toThrow(/three complete/i);
    const noAssessment = makeSnapshots();
    noAssessment[2].data = () => ({ ...makeSnapshots()[2].data(), assessment: null });
    expect(() => evaluateResults({ assignmentId: "A2-8.22", uid: "student-uid", snapshots: noAssessment }))
      .toThrow(/three complete/i);
  });

  test("does not accept two-part submission or unknown assignment", () => {
    expect(() => evaluateResults({ assignmentId: "A2-8.22", uid: "student-uid",
      snapshots: makeSnapshots().slice(0, 2) })).toThrow(/all three/i);
    expect(() => evaluateResults({ assignmentId: "B1-10.28", uid: "student-uid",
      snapshots: makeSnapshots("B1", "B1-10.28") })).toThrow(/not a graded speaking/i);
  });
});

describe("Resume and score-sheet recovery", () => {
  const firestore = rows => ({
    collection: name => {
      if (name === "scores") return { doc: () => ({ get: async () => ({ data: () => undefined }) }) };
      if (name === "liveSpeakExamResults") return {
        where: (key, op, uid) => {
          expect([key, op, uid]).toEqual(["uid", "==", "student-uid"]);
          return { limit: max => ({
            get: async () => ({ docs: rows.slice(0, max) }),
          }) };
        },
      };
      throw new Error("Unexpected collection: " + name);
    },
  });
  test("restores three scored parts from server when browser storage is lost", async () => {
    const db = firestore(makeSnapshots());
    const found = await findSavedSpeakingParts({ db, uid: "student-uid", assignmentId: "A2-8.22" });
    expect(found.parts.map(part => part.teil)).toEqual(["Teil 1", "Teil 2", "Teil 3"]);
    expect(found.snapshots).toHaveLength(3);
    const status = await courseSpeakingMockStatus({ db, uid: "student-uid", assignmentId: "A2-8.22" });
    expect(status).toMatchObject({ completed: false, recovery: { allPartsGraded: true } });
    expect(status.recovery.parts).toHaveLength(3);
  });
  test("does not mark missing or unrelated parts as complete", async () => {
    const others = makeSnapshots("B1", "B1-7.23");
    const db = firestore([...makeSnapshots().slice(0, 2), ...others]);
    const status = await courseSpeakingMockStatus({ db, uid: "student-uid", assignmentId: "A2-8.22" });
    expect(status.recovery.parts).toHaveLength(2);
    expect(status.recovery.allPartsGraded).toBe(false);
  });
  test("ignores scores belonging to another student or without completed AI assessment", async () => {
    const parts = makeSnapshots();
    parts[1].data = () => ({ ...makeSnapshots()[1].data(), completed: false });
    parts[2].data = () => ({ ...makeSnapshots()[2].data(), uid: "another-account" });
    const found = await findSavedSpeakingParts({ db: firestore(parts), uid: "student-uid", assignmentId: "A2-8.22" });
    expect(found.parts.map(part => part.teil)).toEqual(["Teil 1"]);
  });
});
