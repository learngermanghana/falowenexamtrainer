import { getInlineCourseAssignments } from "../utils/courseLessonAssignments";
import { getCurriculumEntriesForLevel } from "../data/germanAssignmentCatalog";

jest.mock("../data/germanAssignmentCatalog", () => ({
  getCurriculumEntriesForLevel: jest.fn(),
}));

jest.mock("../utils/assignmentIdentity", () => ({
  resolveAssignmentCanonicalKey: jest.fn(({ assignmentId }) => {
    const token = String(assignmentId || "").toUpperCase();
    return /^(A1|A2|B1)-\d+\.\d+$/.test(token) ? token : "";
  }),
}));

describe("getInlineCourseAssignments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns only tutor-marked assignments for the selected A1-B1 lesson day", () => {
    getCurriculumEntriesForLevel.mockReturnValue([
      { assignmentDay: 3, topic: "Self practice", assignment: false, chapter: "1.1", assignment_id: "A1-1.1" },
      { assignmentDay: 3, topic: "Tutor task", assignment: true, chapter: "1.2", assignment_id: "A1-1.2" },
      { assignmentDay: 4, topic: "Other day", assignment: true, chapter: "1.3", assignment_id: "A1-1.3" },
    ]);

    expect(getInlineCourseAssignments("a1", 3)).toEqual([
      expect.objectContaining({
        assignmentKey: "A1-1.2",
        chapter: "1.2",
        day: 3,
        level: "A1",
        title: "Tutor task",
      }),
    ]);
  });

  it("never returns null or invalid assignment keys and removes duplicate catalog entries", () => {
    getCurriculumEntriesForLevel.mockReturnValue([
      { assignmentDay: 8, topic: "Missing identity", assignment: true },
      { assignmentDay: 8, topic: "Invalid identity", assignment: true, assignment_id: "bad-id" },
      { assignmentDay: 8, topic: "First copy", assignment: true, chapter: "2.1", assignment_id: "A2-2.1" },
      { assignmentDay: 8, topic: "Second copy", assignment: true, chapter: "2.1", assignment_id: "A2-2.1" },
    ]);

    const assignments = getInlineCourseAssignments("A2", 8);

    expect(assignments).toHaveLength(1);
    expect(assignments[0].assignmentKey).toBe("A2-2.1");
    expect(assignments.every((assignment) => Boolean(assignment.assignmentKey))).toBe(true);
  });

  it("does not add inline submission to B2 or C1 self-learning lessons", () => {
    getCurriculumEntriesForLevel.mockReturnValue([
      { assignmentDay: 1, topic: "B2 task", assignment: true, assignment_id: "B2-1.1" },
    ]);

    expect(getInlineCourseAssignments("B2", 1)).toEqual([]);
    expect(getInlineCourseAssignments("C1", 1)).toEqual([]);
    expect(getCurriculumEntriesForLevel).not.toHaveBeenCalled();
  });
});
