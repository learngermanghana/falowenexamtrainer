import {
  COURSE_COMPLETION_ENGINE_VERSION,
  buildCourseCompletionSnapshot,
  getCourseCompletionSnapshotId,
} from "./courseCompletionSnapshotService";

describe("course completion snapshot service", () => {
  const user = { uid: "student-123", email: "student@example.com", displayName: "Ama Student" };
  const studentProfile = {
    studentCode: "AmaStudent123",
    className: "A2 Bonn Klasse",
    level: "A2",
  };

  test("builds the compact server-side source-of-truth snapshot", () => {
    const snapshot = buildCourseCompletionSnapshot({
      level: "A2",
      user,
      studentProfile,
      progress: {
        level: "A2",
        mode: "tutor-marked",
        completed: 11,
        total: 28,
        completionPercent: 39,
        passed: 9,
        needsImprovement: 2,
        awaitingReview: 0,
        masteryAvailable: true,
        masteryPercent: 82,
        milestone: 25,
        nextMilestone: 50,
        courseWorkCompleted: false,
        next: {
          assignmentKey: "A2-5.12",
          day: 12,
          chapter: "5.12",
          label: "Kapitel 5.12 – Freizeit",
          route: "/campus/course/lesson/A2/12?chapter=5.12",
        },
      },
    });

    expect(snapshot).toEqual(
      expect.objectContaining({
        studentId: "student-123",
        studentCode: "AmaStudent123",
        level: "A2",
        completed: 11,
        total: 28,
        completionPercent: 39,
        passed: 9,
        needsImprovement: 2,
        masteryPercent: 82,
        nextAssignmentKey: "A2-5.12",
        nextDay: 12,
        nextChapter: "5.12",
        engineVersion: COURSE_COMPLETION_ENGINE_VERSION,
      })
    );
    expect(snapshot.requirements).toBeUndefined();
    expect(snapshot.states).toBeUndefined();
  });

  test("uses a deterministic student and level document id", () => {
    expect(getCourseCompletionSnapshotId({ user, level: "A2" })).toBe("student-123__a2");
  });

  test("does not create unsupported or anonymous snapshots", () => {
    expect(buildCourseCompletionSnapshot({ progress: { total: 28 }, level: "A2", user: null })).toBeNull();
    expect(buildCourseCompletionSnapshot({ progress: { total: 0 }, level: "A2", user })).toBeNull();
  });
});
