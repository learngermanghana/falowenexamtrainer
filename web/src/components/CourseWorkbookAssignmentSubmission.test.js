import {
  doesWorkbookRecordMatchAssignment,
  resolveWorkbookRecordAssignmentKey,
} from "./CourseWorkbookAssignmentSubmission";

describe("course workbook canonical submission records", () => {
  test("normalizes a stored canonical assignment key", () => {
    expect(
      resolveWorkbookRecordAssignmentKey({
        record: { canonicalAssignmentKey: "a1_1.2" },
        fallbackLevel: "A1",
      })
    ).toBe("A1-1.2");
  });

  test("matches a legacy lock only to the same assignment", () => {
    expect(
      doesWorkbookRecordMatchAssignment({
        record: { assignmentKey: "A1-1.2", assignmentTitle: "Greetings" },
        assignmentKey: "A1-1.2",
        assignmentTitle: "Greetings",
        level: "A1",
      })
    ).toBe(true);

    expect(
      doesWorkbookRecordMatchAssignment({
        record: { assignmentKey: "A1-1.2", assignmentTitle: "Greetings" },
        assignmentKey: "A1-1.3",
        assignmentTitle: "Introductions",
        level: "A1",
      })
    ).toBe(false);
  });

  test("does not let an unidentified chapter lock block every assignment", () => {
    expect(
      doesWorkbookRecordMatchAssignment({
        record: { chapterKey: "chapter-1.2" },
        assignmentKey: "A1-1.2",
        assignmentTitle: "Greetings",
        level: "A1",
      })
    ).toBe(false);
  });
});
