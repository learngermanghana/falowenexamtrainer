import {
  mergeAssignmentProgress,
  resolveAssignmentIdWithFallback,
  resolveAssignmentStatus,
  toCourseTabStatus,
} from "./assignmentProgress";

describe("resolveAssignmentStatus", () => {
  test("draft only => in_progress", () => {
    const status = resolveAssignmentStatus({
      assignmentId: "A1-1.2",
      draftRecord: { updatedAt: "2026-03-14T10:00:00.000Z" },
    });

    expect(status.status).toBe("in_progress");
    expect(status.inProgress).toBe(true);
  });

  test("submission only => submitted", () => {
    const status = resolveAssignmentStatus({
      assignmentId: "A1-1.2",
      submissionRecord: { updatedAt: "2026-03-14T10:00:00.000Z" },
    });

    expect(status.status).toBe("submitted");
    expect(status.submitted).toBe(true);
  });

  test("one failed result => failed", () => {
    const status = resolveAssignmentStatus({
      assignmentId: "A1-1.2",
      resultRecords: [{ score: 45, updatedAt: "2026-03-14T10:00:00.000Z" }],
    });

    expect(status.status).toBe("failed");
    expect(status.failed).toBe(true);
    expect(status.bestScore).toBe(45);
  });

  test("one passed result => passed", () => {
    const status = resolveAssignmentStatus({
      assignmentId: "A1-1.2",
      resultRecords: [{ score: 81, updatedAt: "2026-03-14T10:00:00.000Z" }],
    });

    expect(status.status).toBe("passed");
    expect(status.passed).toBe(true);
    expect(status.bestScore).toBe(81);
  });

  test("duplicate attempts highest score wins", () => {
    const status = resolveAssignmentStatus({
      assignmentId: "A1-1.2",
      resultRecords: [
        { score: 52, updatedAt: "2026-03-10T10:00:00.000Z" },
        { score: 74, updatedAt: "2026-03-14T10:00:00.000Z" },
      ],
    });

    expect(status.status).toBe("passed");
    expect(status.bestScore).toBe(74);
    expect(status.latestScore).toBe(74);
  });

  test("result precedence over draft", () => {
    const status = resolveAssignmentStatus({
      assignmentId: "A1-1.2",
      draftRecord: { updatedAt: "2026-03-14T09:00:00.000Z" },
      resultRecords: [{ score: 58, updatedAt: "2026-03-14T10:00:00.000Z" }],
    });

    expect(status.status).toBe("failed");
    expect(status.inProgress).toBe(false);
  });

  test("passed result precedence over existing submission state", () => {
    const status = resolveAssignmentStatus({
      assignmentId: "A1-0.1",
      submissionRecord: { updatedAt: "2026-03-14T09:30:00.000Z" },
      resultRecords: [{ score: 82, updatedAt: "2026-03-14T10:30:00.000Z" }],
    });

    expect(status.status).toBe("passed");
    expect(status.passed).toBe(true);
    expect(status.submitted).toBe(true);
  });
});

describe("mergeAssignmentProgress", () => {
  test("merges by canonical assignment_id", () => {
    const merged = mergeAssignmentProgress({
      curriculumEntries: [
        {
          level: "A1",
          assignmentId: "1.2",
          chapter: "1.2",
          title: "Introducing Yourself",
          assignmentDay: 3,
          assignment: true,
        },
      ],
      firestoreDrafts: [{ level: "A1", assignmentId: "A1-1.2", updatedAt: "2026-03-14T09:00:00.000Z" }],
      firestoreSubmissions: [{ level: "A1", assignmentId: "1.2", updatedAt: "2026-03-14T09:30:00.000Z" }],
      sheetResults: [
        { level: "A1", assignmentId: "A1-1.2", score: 83, studentCode: "st-1", date: "2026-03-14T10:30:00.000Z" },
      ],
      studentCode: "st-1",
    });

    expect(merged).toHaveLength(1);
    expect(merged[0].assignmentId).toBe("A1-1.2");
    expect(merged[0].status).toBe("passed");
    expect(merged[0].bestScore).toBe(83);
  });

  test("missing assignment_id fallback is isolated", () => {
    const fallback = resolveAssignmentIdWithFallback({
      assignmentId: "",
      level: "A1",
      assignmentTitle: "",
      fallbackKey: "result-12",
    });

    expect(fallback).toBe("RESULT-12");
  });

  test("day 4 chapter 2 canonical id A1-2 keeps passed score", () => {
    const merged = mergeAssignmentProgress({
      curriculumEntries: [
        {
          level: "A1",
          assignmentId: "2",
          chapter: "2",
          title: "Numbers",
          assignmentDay: 4,
          assignment: true,
        },
      ],
      firestoreDrafts: [],
      firestoreSubmissions: [{ level: "A1", assignmentId: "A1-2", updatedAt: "2026-03-14T09:30:00.000Z" }],
      sheetResults: [{ level: "A1", assignmentId: "A1-2", score: 83, studentCode: "st-1", date: "2026-03-14T10:30:00.000Z" }],
      studentCode: "st-1",
    });

    expect(merged).toHaveLength(1);
    expect(merged[0].assignmentId).toBe("A1-2");
    expect(merged[0].status).toBe("passed");
    expect(merged[0].bestScore).toBe(83);
  });

  test("canonical merge resolves A2 and B1 assignment IDs as passed", () => {
    const a2Merged = mergeAssignmentProgress({
      curriculumEntries: [{ level: "A2", assignmentId: "1", chapter: "1", title: "A2 Intro", assignment: true }],
      firestoreDrafts: [],
      firestoreSubmissions: [],
      sheetResults: [{ level: "A2", assignmentId: "A2-1", score: 76, studentCode: "st-2" }],
      studentCode: "st-2",
    });
    const b1Merged = mergeAssignmentProgress({
      curriculumEntries: [{ level: "B1", assignmentId: "1", chapter: "1", title: "B1 Intro", assignment: true }],
      firestoreDrafts: [],
      firestoreSubmissions: [],
      sheetResults: [{ level: "B1", assignmentId: "B1-1", score: 78, studentCode: "st-3" }],
      studentCode: "st-3",
    });

    expect(a2Merged[0].status).toBe("passed");
    expect(b1Merged[0].status).toBe("passed");
  });
});

describe("toCourseTabStatus", () => {
  test("maps passed and failed without downgrading", () => {
    expect(toCourseTabStatus("passed")).toBe("passed");
    expect(toCourseTabStatus("failed")).toBe("failed");
    expect(toCourseTabStatus("submitted")).toBe("submitted");
    expect(toCourseTabStatus("in_progress")).toBe("inProgress");
    expect(toCourseTabStatus("not_started")).toBe("notStarted");
  });
});
