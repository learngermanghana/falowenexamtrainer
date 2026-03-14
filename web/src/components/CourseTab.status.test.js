import {
  aggregateUnresolvedTutorDiagnostics,
  collectUnresolvedTutorAssignmentDiagnostics,
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
