import { getAssignmentDictionaryEntry } from "./germanAssignmentCatalog";

describe("A1 multi-chapter assignment dictionary separation", () => {
  test.each([
    ["9", "A1-9", "Negation"],
    ["10", "A1-10", "Food"],
    ["12.1", "A1-12.1", "Two Case Prepositions"],
    ["12.2", "A1-12.2", "Dative Prepositions"],
  ])("resolves A1 chapter %s to %s", (chapter, assignmentId, title) => {
    const entry = getAssignmentDictionaryEntry({
      level: "A1",
      assignmentId: chapter,
      chapter,
    });

    expect(entry).toEqual(expect.objectContaining({
      assignment_id: assignmentId,
      chapter,
      topic: title,
      assignment: true,
    }));
  });

  test.each([
    ["A1-9", "9"],
    ["A1-10", "10"],
    ["A1-12.1", "12.1"],
    ["A1-12.2", "12.2"],
  ])("does not let a generated parent probe %s collapse a multi-chapter parent", (assignmentId, chapter) => {
    const entry = getAssignmentDictionaryEntry({
      level: "A1",
      assignmentId,
      chapter,
    });

    expect(entry).toBeNull();
  });

  test.each([
    ["A1-9", "9", 16, "Negation"],
    ["A1-10", "10", 16, "Food"],
    ["A1-12.1", "12.1", 18, "Two Case Prepositions"],
    ["A1-12.2", "12.2", 18, "Dative Prepositions"],
  ])("still resolves explicit %s when the assignment day is known", (assignmentId, chapter, assignmentDay, title) => {
    const entry = getAssignmentDictionaryEntry({
      level: "A1",
      assignmentId,
      chapter,
      assignmentDay,
    });

    expect(entry).toEqual(expect.objectContaining({
      assignment_id: assignmentId,
      chapter,
      topic: title,
      assignment: true,
    }));
  });
});
