import {
  mergeAssignmentProgress,
  resolveAssignmentIdWithFallback,
  resolveAssignmentStatus,
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
});
