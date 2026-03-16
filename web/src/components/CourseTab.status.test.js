import {
  aggregateUnresolvedTutorDiagnostics,
  collectUnresolvedTutorAssignmentDiagnostics,
  getAutoStatusForEntry,
  getScoreBadgeForEntry,
  getStatusForEntry,
  mergeCourseProgressStatuses,
} from "./CourseTab";

describe("getStatusForEntry", () => {
  it("reads canonical day aliases saved in profile progress", () => {
    const status = getStatusForEntry(
      {
        "A1-DAY-2": { assignmentKey: "A1-DAY-2", value: "submitted" },
      },
      {
        day: 2,
        topic: "Alphabets and Personal Pronouns",
        chapter: "0.2_1.1",
      },
      "A1",
      1
    );

    expect(status).toBe("submitted");
  });

  it("falls back to plain day index when present", () => {
    const status = getStatusForEntry(
      {
        "2": { value: "inProgress" },
      },
      { day: 2, topic: "Test" },
      "A1",
      1
    );

    expect(status).toBe("inProgress");
  });
  it("maps shared resolver status names", () => {
    const status = getStatusForEntry(
      {
        "A1-DAY-2": { assignmentKey: "A1-DAY-2", status: "in_progress" },
      },
      { day: 2, topic: "Test" },
      "A1",
      1
    );

    expect(status).toBe("inProgress");
  });

  it("prefers canonical curriculum assignment IDs over synthetic day keys", () => {
    const status = getStatusForEntry(
      {
        "A1-1.1": { assignmentKey: "A1-1.1", value: "submitted" },
      },
      {
        day: 2,
        chapter: "1.1",
        topic: "Personal Pronouns and Verb Conjugation",
        lesen_hören: [{ assignment: true, chapter: "1.1" }],
      },
      "A1",
      1
    );

    expect(status).toBe("submitted");
  });

});


describe("mergeCourseProgressStatuses", () => {
  it("keeps the most recently updated local status over older profile data", () => {
    const merged = mergeCourseProgressStatuses(
      {
        "A1-DAY-2": { value: "submitted", updatedAt: 200, assignmentKey: "A1-DAY-2" },
      },
      {
        "A1-DAY-2": { value: "inProgress", updatedAt: 100, assignmentKey: "A1-DAY-2" },
      }
    );

    expect(merged["A1-DAY-2"].value).toBe("submitted");
  });

  it("keeps newer profile status when local value is stale", () => {
    const merged = mergeCourseProgressStatuses(
      {
        "A1-DAY-3": { value: "inProgress", updatedAt: 100, assignmentKey: "A1-DAY-3" },
      },
      {
        "A1-DAY-3": { value: "submitted", updatedAt: 200, assignmentKey: "A1-DAY-3" },
      }
    );

    expect(merged["A1-DAY-3"].value).toBe("submitted");
  });

  it("adds local status when profile has no matching entry", () => {
    const merged = mergeCourseProgressStatuses(
      {
        "A1-DAY-4": { value: "submitted", updatedAt: 150, assignmentKey: "A1-DAY-4" },
      },
      {}
    );

    expect(merged["A1-DAY-4"].value).toBe("submitted");
  });
});

describe("unresolved tutor assignment diagnostics", () => {
  it("groups repeated unresolved diagnostics by signature", () => {
    const summary = aggregateUnresolvedTutorDiagnostics([
      {
        level: "A1",
        day: 14,
        occurrence: 1,
        chapter: "3.6",
        topic: "Modal Verbs",
        fallbackAssignmentId: "A1-DAY-14",
        fallbackReason: "syntheticAssignmentId",
        tutorLessons: [{ chapter: "3.6", title: "Modal Verbs" }],
      },
      {
        level: "A1",
        day: 14,
        occurrence: 1,
        chapter: "3.6",
        topic: "Modal Verbs",
        fallbackAssignmentId: "A1-DAY-14",
        fallbackReason: "syntheticAssignmentId",
        tutorLessons: [{ chapter: "3.6", title: "Modal Verbs" }],
      },
    ]);

    expect(summary).toHaveLength(1);
    expect(summary[0]).toMatchObject({
      occurrences: 2,
      fallbackAssignmentIds: ["A1-DAY-14"],
      fallbackReasonCounts: { syntheticAssignmentId: 2 },
    });
  });

  it("extracts unresolved tutor diagnostics for schedule rows", () => {
    const unresolved = collectUnresolvedTutorAssignmentDiagnostics(
      [
        {
          day: 14,
          occurrence: 1,
          topic: "Modal Verbs",
          assignment: true,
          chapter: "",
        },
      ],
      "A1"
    );

    expect(unresolved).toHaveLength(1);
    expect(unresolved[0]).toMatchObject({
      issue: "missingCanonicalAssignmentId",
      fallbackReason: "syntheticAssignmentId",
      fallbackAssignmentId: "A1-DAY-14",
    });
  });
});


describe("getAutoStatusForEntry", () => {
  const entry = {
    day: 4,
    chapter: "2",
    topic: "Numbers",
    assignment: true,
    lesen_hören: [{ assignment: true, chapter: "2" }],
  };

  it("uses merged passed flag to produce passed final badge status", () => {
    const statusInfo = getAutoStatusForEntry({
      progressByAssignmentId: {
        "A1-2": { assignmentId: "A1-2", status: "not_started", passed: true, failed: false, submitted: true, inProgress: false },
      },
      entry,
      level: "A1",
      occurrence: 1,
    });

    expect(statusInfo.assignmentId).toBe("A1-2");
    expect(statusInfo.finalStatus).toBe("passed");
    expect(statusInfo.statusDebug).toMatchObject({
      mergedStatus: "not_started",
      mergedPassed: true,
      mergedFailed: false,
      mergedSubmitted: true,
      mergedInProgress: false,
      statusFromStatusField: "notStarted",
      statusFromFlags: "passed",
      finalStatus: "passed",
    });
  });

  it("maps failed/submitted/inProgress statuses from merged flags", () => {
    const failedStatus = getAutoStatusForEntry({
      progressByAssignmentId: {
        "A1-2": { assignmentId: "A1-2", status: "not_started", passed: false, failed: true, submitted: true, inProgress: false },
      },
      entry,
      level: "A1",
      occurrence: 1,
    });

    const submittedStatus = getAutoStatusForEntry({
      progressByAssignmentId: {
        "A1-2": { assignmentId: "A1-2", status: "not_started", passed: false, failed: false, submitted: true, inProgress: false },
      },
      entry,
      level: "A1",
      occurrence: 1,
    });

    const inProgressStatus = getAutoStatusForEntry({
      progressByAssignmentId: {
        "A1-2": { assignmentId: "A1-2", status: "not_started", passed: false, failed: false, submitted: false, inProgress: true },
      },
      entry,
      level: "A1",
      occurrence: 1,
    });

    expect(failedStatus.finalStatus).toBe("failed");
    expect(submittedStatus.finalStatus).toBe("submitted");
    expect(inProgressStatus.finalStatus).toBe("inProgress");
  });

  it("requires all assignment chapters in a combined day entry before marking complete", () => {
    const multiAssignmentEntry = {
      day: 16,
      chapter: "9_10",
      topic: "Food and Negation",
      lesen_hören: [
        { assignment: true, chapter: "9" },
        { assignment: true, chapter: "10" },
      ],
    };

    const partlySubmitted = getAutoStatusForEntry({
      progressByAssignmentId: {
        "A1-9": { assignmentId: "A1-9", status: "submitted", passed: false, failed: false, submitted: true, inProgress: false },
      },
      entry: multiAssignmentEntry,
      level: "A1",
      occurrence: 1,
    });

    const fullySubmitted = getAutoStatusForEntry({
      progressByAssignmentId: {
        "A1-9": { assignmentId: "A1-9", status: "submitted", passed: false, failed: false, submitted: true, inProgress: false },
        "A1-10": { assignmentId: "A1-10", status: "submitted", passed: false, failed: false, submitted: true, inProgress: false },
      },
      entry: multiAssignmentEntry,
      level: "A1",
      occurrence: 1,
    });

    expect(partlySubmitted.finalStatus).toBe("inProgress");
    expect(fullySubmitted.finalStatus).toBe("submitted");
    expect(fullySubmitted.requiredAssignmentIds).toEqual(["A1-9", "A1-10"]);
  });

  it("applies the same all-required rule to other two-chapter assignment days", () => {
    const day18Entry = {
      day: 18,
      chapter: "12.1_12.2",
      topic: "Two Case Preposition",
      lesen_hören: [
        { assignment: true, chapter: "12.1" },
        { assignment: true, chapter: "12.2" },
      ],
    };

    const statusInfo = getAutoStatusForEntry({
      progressByAssignmentId: {
        "A1-12.1": { assignmentId: "A1-12.1", status: "passed", passed: true, failed: false, submitted: true, inProgress: false },
      },
      entry: day18Entry,
      level: "A1",
      occurrence: 1,
    });

    expect(statusInfo.finalStatus).toBe("inProgress");
    expect(statusInfo.requiredAssignmentIds).toEqual(["A1-12.1", "A1-12.2"]);
  });

});


describe("getScoreBadgeForEntry", () => {
  it("shows latest scored badge when score data exists", () => {
    const badge = getScoreBadgeForEntry({
      statusInfo: {
        status: "submitted",
        finalStatus: "submitted",
        assignmentId: "A1-2",
        requiredAssignmentIds: ["A1-2"],
      },
      progressByAssignmentId: {
        "A1-2": { bestScore: 82, latestScore: 82, lastUpdatedAt: "2024-10-01T10:00:00.000Z" },
      },
    });

    expect(badge).toEqual({
      tone: "scored",
      text: "Latest score: 82/100",
    });
  });

  it("shows awaiting badge when entry is submitted but score is not available yet", () => {
    const badge = getScoreBadgeForEntry({
      statusInfo: {
        status: "submitted",
        finalStatus: "submitted",
        assignmentId: "A1-2",
      },
      progressByAssignmentId: {
        "A1-2": { bestScore: null, latestScore: null, lastUpdatedAt: "2024-10-01T10:00:00.000Z" },
      },
    });

    expect(badge).toEqual({
      tone: "awaiting",
      text: "Awaiting score",
    });
  });


  it("shows awaiting score when latestScore defaults to 0 but no best score exists", () => {
    const badge = getScoreBadgeForEntry({
      statusInfo: {
        status: "submitted",
        finalStatus: "submitted",
        assignmentId: "A1-2",
      },
      progressByAssignmentId: {
        "A1-2": { bestScore: null, latestScore: 0, lastUpdatedAt: "2024-10-01T10:00:00.000Z" },
      },
    });

    expect(badge).toEqual({
      tone: "awaiting",
      text: "Awaiting score",
    });
  });

  it("uses the highest score across required assignments", () => {
    const badge = getScoreBadgeForEntry({
      statusInfo: {
        status: "submitted",
        finalStatus: "submitted",
        assignmentId: "A1-9",
        requiredAssignmentIds: ["A1-9", "A1-10"],
      },
      progressByAssignmentId: {
        "A1-9": { bestScore: 82, latestScore: 82, lastUpdatedAt: "2024-10-05T10:00:00.000Z" },
        "A1-10": { bestScore: 78.5, latestScore: 78.5, lastUpdatedAt: "2024-10-06T08:00:00.000Z" },
      },
    });

    expect(badge).toEqual({
      tone: "scored",
      text: "Latest score: 82/100",
    });
  });
});
