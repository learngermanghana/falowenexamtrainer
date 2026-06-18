import { buildInlineCourseAssignments } from "../utils/courseLessonAssignments";

const resolveCanonicalKey = ({ assignmentId }) => {
  const token = String(assignmentId || "").toUpperCase();
  return /^(A1|A2|B1)-\d+\.\d+$/.test(token) ? token : "";
};

const buildAssignments = (level, day, entries) =>
  buildInlineCourseAssignments({ level, day, entries, resolveCanonicalKey });

describe("buildInlineCourseAssignments", () => {
  it("returns only tutor-marked assignments for the selected A1-B1 lesson day", () => {
    const entries = [
      { assignmentDay: 3, topic: "Self practice", assignment: false, chapter: "1.1", assignment_id: "A1-1.1" },
      { assignmentDay: 3, topic: "Tutor task", assignment: true, chapter: "1.2", assignment_id: "A1-1.2" },
      { assignmentDay: 4, topic: "Other day", assignment: true, chapter: "1.3", assignment_id: "A1-1.3" },
    ];

    expect(buildAssignments("a1", 3, entries)).toEqual([
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
    const entries = [
      { assignmentDay: 8, topic: "Missing identity", assignment: true },
      { assignmentDay: 8, topic: "Invalid identity", assignment: true, assignment_id: "bad-id" },
      { assignmentDay: 8, topic: "First copy", assignment: true, chapter: "2.1", assignment_id: "A2-2.1" },
      { assignmentDay: 8, topic: "Second copy", assignment: true, chapter: "2.1", assignment_id: "A2-2.1" },
    ];

    const assignments = buildAssignments("A2", 8, entries);

    expect(assignments).toHaveLength(1);
    expect(assignments[0].assignmentKey).toBe("A2-2.1");
    expect(assignments.every((assignment) => Boolean(assignment.assignmentKey))).toBe(true);
  });

  it("does not add inline submission to B2 or C1 self-learning lessons", () => {
    const entries = [
      { assignmentDay: 1, topic: "B2 task", assignment: true, assignment_id: "B2-1.1" },
    ];

    expect(buildAssignments("B2", 1, entries)).toEqual([]);
    expect(buildAssignments("C1", 1, entries)).toEqual([]);
  });
});
