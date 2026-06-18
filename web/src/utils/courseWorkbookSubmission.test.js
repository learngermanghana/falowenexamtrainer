import {
  buildCanonicalAssignmentLockId,
  buildLegacyAssignmentLockId,
  buildLegacyChapterKey,
  buildWorkbookStudentScopeKey,
  getWorkbookNativeTabKey,
  getWorkbookNavigationTabs,
} from "./courseWorkbookSubmission";

describe("course workbook submission identities", () => {
  test("builds a canonical lock from the student scope and canonical assignment key", () => {
    const studentScopeKey = buildWorkbookStudentScopeKey({
      userId: "User 123",
      studentCode: "A1-009",
      studentEmail: "student@example.com",
    });

    expect(buildCanonicalAssignmentLockId({ studentScopeKey, assignmentKey: "A1-1.2" })).toBe(
      "user_123__a1-009__student_example.com__a1-1.2"
    );
  });

  test("keeps the old chapter lock identity available as a compatibility alias", () => {
    const chapterKey = buildLegacyChapterKey({ chapter: "1.2", day: 3 });
    expect(chapterKey).toBe("chapter-1.2");
    expect(
      buildLegacyAssignmentLockId({
        studentScopeKey: "student-1",
        level: "A1",
        chapterKey,
      })
    ).toBe("student-1__a1__chapter-1.2");
  });

  test("uses task occurrence when a lesson has multiple assignments without chapters", () => {
    expect(buildLegacyChapterKey({ day: 8, occurrence: 2 })).toBe("day-8-task-2");
  });
});

describe("course workbook tabs", () => {
  test("uses Assignment and Submit for A1", () => {
    expect(getWorkbookNavigationTabs("A1").map((tab) => tab.label)).toEqual(["Assignment", "Submit"]);
  });

  test("uses Teil 1 to 4, Ref and Submit for A2 and B1", () => {
    const expected = ["Teil 1", "Teil 2", "Teil 3", "Teil 4", "Ref", "Submit"];
    expect(getWorkbookNavigationTabs("A2").map((tab) => tab.label)).toEqual(expected);
    expect(getWorkbookNavigationTabs("B1").map((tab) => tab.label)).toEqual(expected);
  });

  test("recognizes existing workbook tab labels", () => {
    expect(getWorkbookNativeTabKey("Teil 1 · Sprechen")).toBe("teil1");
    expect(getWorkbookNativeTabKey("Teil 4 · Hören")).toBe("teil4");
    expect(getWorkbookNativeTabKey("5. Ref")).toBe("ref");
  });
});
