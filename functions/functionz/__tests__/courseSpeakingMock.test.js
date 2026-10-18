jest.mock('../googleSheetsClient', () => ({ getSheetsClient: jest.fn() }));
const {
  COURSE_MOCKS, evaluateResults, buildScoreDocument, findSavedSpeakingParts,
  courseSpeakingMockStatus, startCourseSpeakingAttempt, requireCourseSpeakingAttempt,
  synchronizeSheet,
} = require("../courseSpeakingMock");

describe('speaking results use the shared background export', () => {
  test('queues once, preserves workbook identity and retries without recording again', async () => {
    const rows = new Map([['scores/mock', { studentCode: 'student', assignmentId: 'A2-8.22', score: 69, sheetSyncStatus: 'pending' }]]);
    const ref = path => ({ path, id: path.split('/').at(-1) });
    const db = { collection: name => ({ doc: id => ref(`${name}/${id}`) }), runTransaction: async work => {
      const writes = [];
      const result = await work({
        get: async r => ({ exists: rows.has(r.path), data: () => rows.get(r.path) }),
        set: (r, value, options) => writes.push(() => rows.set(r.path, options?.merge ? { ...rows.get(r.path), ...value } : value)),
        create: (r, value) => writes.push(() => { expect(rows.has(r.path)).toBe(false); rows.set(r.path, value); }),
      }); writes.forEach(write => write()); return result;
    } };
    const args = { db, scoreRef: ref('scores/mock'), row: rows.get('scores/mock') };
    await synchronizeSheet(args); await synchronizeSheet(args);
    expect(rows.size).toBe(2);
    expect(rows.get('scores/mock').dedupe_id).toBe('student__A2-8.22__course_speaking_mock');
    expect(rows.get('automaticScoreSync/speaking-mock').source).toBe('course_speaking_mock');
    rows.get('automaticScoreSync/speaking-mock').status = 'synced';
    expect(await synchronizeSheet(args)).toEqual({ ok: true });
    expect(rows.get('scores/mock').sheetSyncStatus).toBe('complete');
    expect(rows.get('scores/mock').score).toBe(69);
  });
});

const ATTEMPT_A = "11111111-1111-4111-8111-111111111111";
const ATTEMPT_B = "22222222-2222-4222-8222-222222222222";

const makeSnapshots = (level = "A2", assignmentId = "A2-8.22", uid = "student-uid", attemptId = ATTEMPT_A) =>
  [1, 2, 3].map((part, index) => ({
    id: `11111111-1111-4111-8111-00000000000${part}`,
    exists: true,
    data: () => ({
      uid, level, source: "exam-speaking-practice", examFlowKey: `${level}-${part}`,
      ownerAssignment: `${uid}:${assignmentId}`, mockAttemptId: attemptId,
      sessionId: `11111111-1111-4111-8111-00000000000${part}`,
      teil: `Teil ${part}`, completed: true,
      task: { id: `${level}-task-${part}`, teil: `Teil ${part}`, courseAssignmentKey: assignmentId, mockAttemptId: attemptId },
      answers: [`German answer ${part}`],
      feedback: `Part ${part} feedback`,
      assessment: { practiceOnly: true, score: [6, 7, 8][index], maxScore: 10,
        tasks: [{step: 1, score: 2, maxScore: 2, answer: "German answer"}],
        summary: `Summary ${part}`, strength: "I can respond", priority: "Improve grammar" },
    }),
  }));

function firestore(rows, { attemptId = ATTEMPT_A, uid = "student-uid", assignmentId = "A2-8.22" } = {}) {
  const queries = [];
  const db = {
    collection: name => {
      if (name === "scores") return { doc: () => ({ get: async () => ({ data: () => undefined }) }) };
      if (name === "courseSpeakingMockAttempts") return { doc: () => ({
        get: async () => ({ data: () => ({ uid, assignmentId, attemptId, status: "in_progress" }) }),
      }) };
      if (name === "liveSpeakExamResults") return {
        where: (...args) => {
          queries.push(args);
          return { get: async () => ({ docs: rows.filter(snap => snap.data().ownerAssignment === args[2]) }) };
        },
      };
      throw new Error("Unexpected collection: " + name);
    },
  };
  return { db, queries };
}

describe("Graded Goethe-style speaking coursework", () => {
  test.each([["A1-5.9", "A1"], ["A2-8.22", "A2"], ["B1-7.23", "B1"]])("%s verifies all three parts share one attempt", (assignmentId, level) => {
    const outcome = evaluateResults({ assignmentId, uid: "student-uid", attemptId: ATTEMPT_A,
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

  test("rejects incomplete parts, incorrect ownership and a different exam flow", () => {
    const cases = [
      (item) => ({ ...item, completed: false }),
      (item) => ({ ...item, uid: "other-uid" }),
      (item) => ({ ...item, examFlowKey: "B1-2" }),
      (item) => ({ ...item, task: { ...item.task, courseAssignmentKey: "B1-7.23" } }),
    ];
    for (const change of cases) {
      const parts = makeSnapshots();
      const second = parts[1].data();
      parts[1].data = () => change(second);
      expect(() => evaluateResults({ assignmentId: "A2-8.22", uid: "student-uid",
        attemptId: ATTEMPT_A, snapshots: parts })).toThrow(/three complete/);
    }
  });

  test("rejects combining Teil snapshots belonging to different attempts (P1)", () => {
    const parts = makeSnapshots();
    parts[2] = makeSnapshots("A2", "A2-8.22", "student-uid", ATTEMPT_B)[2];
    expect(() => evaluateResults({ assignmentId: "A2-8.22", uid: "student-uid",
      attemptId: ATTEMPT_A, snapshots: parts })).toThrow(/three complete/);
  });

  test("rejects duplicate parts, absent assessments and missing attempt IDs", () => {
    const duplicate = makeSnapshots();
    duplicate[1].data = () => ({ ...makeSnapshots()[1].data(), teil: "Teil 1", examFlowKey: "A2-1" });
    expect(() => evaluateResults({ assignmentId: "A2-8.22", uid: "student-uid",
      attemptId: ATTEMPT_A, snapshots: duplicate })).toThrow(/three complete/);
    const noAssessment = makeSnapshots();
    noAssessment[2].data = () => ({ ...makeSnapshots()[2].data(), assessment: null });
    expect(() => evaluateResults({ assignmentId: "A2-8.22", uid: "student-uid",
      attemptId: ATTEMPT_A, snapshots: noAssessment })).toThrow(/three complete/);
    expect(() => evaluateResults({ assignmentId: "A2-8.22", uid: "student-uid",
      snapshots: makeSnapshots() })).toThrow(/attempt ID/);
  });

  test("rejects missing part and unknown assignment", () => {
    expect(() => evaluateResults({ assignmentId: "A2-8.22", uid: "student-uid",
      attemptId: ATTEMPT_A, snapshots: makeSnapshots().slice(0, 2) })).toThrow(/all three/i);
    expect(() => evaluateResults({ assignmentId: "B1-10.28", uid: "student-uid",
      attemptId: ATTEMPT_A, snapshots: makeSnapshots("B1", "B1-10.28") })).toThrow(/not a graded speaking/i);
  });
});

describe("Secure attempt recovery", () => {
  test("returns three parts from this student, assignment and attempt only", async () => {
    const { db, queries } = firestore(makeSnapshots());
    const recovered = await findSavedSpeakingParts({ db, uid: "student-uid",
      assignmentId: "A2-8.22", attemptId: ATTEMPT_A });
    expect(queries).toEqual([["ownerAssignment", "==", "student-uid:A2-8.22"]]);
    expect(recovered.parts.map(part => part.teil)).toEqual(["Teil 1", "Teil 2", "Teil 3"]);
    expect(recovered.snapshots).toHaveLength(3);
    const status = await courseSpeakingMockStatus({ db, uid: "student-uid", assignmentId: "A2-8.22" });
    expect(status).toMatchObject({ completed: false, attemptId: ATTEMPT_A,
      recovery: { allPartsGraded: true } });
  });

  test("does not auto-combine most recent Teils from different abandoned attempts (P1)", async () => {
    const first = makeSnapshots().slice(0, 2);
    const second = makeSnapshots("A2", "A2-8.22", "student-uid", ATTEMPT_B).slice(2);
    const { db } = firestore([...first, ...second]);
    const status = await courseSpeakingMockStatus({ db, uid: "student-uid", assignmentId: "A2-8.22" });
    expect(status.recovery.parts).toHaveLength(2);
    expect(status.recovery.allPartsGraded).toBe(false);
  });

  test("assignment-key query returns relevant parts despite 300 unrelated prior results (P2)", async () => {
    const unrelated = Array.from({length: 300}, (_, i) => ({
      id: "unrelated-" + i, exists: true,
      data: () => ({ uid: "student-uid", ownerAssignment: "student-uid:A2-OLD",
        mockAttemptId: ATTEMPT_A, teil: "Teil 1" }),
    }));
    const { db, queries } = firestore([...unrelated, ...makeSnapshots()]);
    const found = await findSavedSpeakingParts({ db, uid: "student-uid",
      assignmentId: "A2-8.22", attemptId: ATTEMPT_A });
    expect(found.parts).toHaveLength(3);
    expect(queries).toEqual([["ownerAssignment", "==", "student-uid:A2-8.22"]]);
  });

  test("legacy snapshots without an attempt ID are never auto-graded", async () => {
    const old = makeSnapshots().map(snap => ({
      ...snap, data: () => ({ ...snap.data(), mockAttemptId: "", task: {
        ...snap.data().task, mockAttemptId: "" } }),
    }));
    const { db } = firestore(old);
    const found = await findSavedSpeakingParts({ db, uid: "student-uid",
      assignmentId: "A2-8.22", attemptId: ATTEMPT_A });
    expect(found.parts).toHaveLength(0);
    const noAttempt = await findSavedSpeakingParts({ db, uid: "student-uid",
      assignmentId: "A2-8.22", attemptId: "" });
    expect(noAttempt.parts).toHaveLength(0);
  });

  test("validates attempt ownership on new examiner sessions", async () => {
    const { db } = firestore([]);
    await expect(requireCourseSpeakingAttempt({ db, uid: "student-uid",
      assignmentId: "A2-8.22", attemptId: ATTEMPT_A })).resolves.toMatchObject({ attemptId: ATTEMPT_A });
    await expect(requireCourseSpeakingAttempt({ db, uid: "student-uid",
      assignmentId: "A2-8.22", attemptId: ATTEMPT_B })).rejects.toThrow(/belongs to another/i);
  });

  test("server creates one stable attempt ID and resumes it rather than minting per part", async () => {
    let stored = null;
    const db = { collection: name => ({ doc: () => ({ kind: name }) }),
      runTransaction: async fn => fn({
        get: async ref => ({ data: () => ref.kind === "courseSpeakingMockAttempts" ? stored : null }),
        set: (_ref, doc) => { stored = doc; },
      }) };
    const admin = { firestore: { FieldValue: { serverTimestamp: () => "timestamp" } } };
    const first = await startCourseSpeakingAttempt({ db, admin, uid: "student-uid", assignmentId: "A2-8.22" });
    const second = await startCourseSpeakingAttempt({ db, admin, uid: "student-uid", assignmentId: "A2-8.22" });
    expect(first.attemptId).toEqual(second.attemptId);
    expect(first.resumed).toBe(false);
    expect(second.resumed).toBe(true);
  });
});
