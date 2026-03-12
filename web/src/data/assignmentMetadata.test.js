import { getCourseScheduleAssignmentMetadata } from "./assignmentMetadata";

describe("course schedule assignment metadata", () => {
  test("resolves A1 chapter metadata from course schedule", () => {
    const chapterThree = getCourseScheduleAssignmentMetadata({ level: "A1", assignmentId: "A1-3" });
    const chapterTwo = getCourseScheduleAssignmentMetadata({ level: "A1", chapter: "2" });

    expect(chapterThree).toMatchObject({ assignment: true, assignmentDay: 7 });
    expect(chapterTwo).toMatchObject({ assignment: true, assignmentDay: 4 });
  });
});
