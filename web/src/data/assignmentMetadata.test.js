import { getCourseScheduleAssignmentMetadata } from "./assignmentMetadata";

describe("course schedule assignment metadata", () => {
  test("resolves canonical metadata from shared curriculum manifest", () => {
    const chapterThree = getCourseScheduleAssignmentMetadata({ level: "A1", assignmentId: "A1-3" });
    const chapterTwo = getCourseScheduleAssignmentMetadata({ level: "A1", chapter: "2" });

    expect(chapterThree).toMatchObject({ assignment: true, assignmentDay: 7, progressionEligible: true });
    expect(chapterTwo).toMatchObject({ assignment: true, assignmentDay: 4, progressionEligible: true });
  });

  test("prefers assignment metadata when a chapter also has self-practice entries", () => {
    const chapterOnePointTwo = getCourseScheduleAssignmentMetadata({ level: "A1", assignmentId: "A1-1.2" });

    expect(chapterOnePointTwo).toMatchObject({
      assignment: true,
      progressionEligible: true,
      assignmentDay: 3,
      topic: "Introducing Yourself",
    });
  });

  test("keeps practical-only entries visible but not progression-eligible", () => {
    const practical = getCourseScheduleAssignmentMetadata({ level: "A1", assignmentId: "A1-5.9" });

    expect(practical).toMatchObject({
      assignment: false,
      progressionEligible: false,
      assignmentDay: 19,
    });
  });
});
