import { A1_COURSE_BOOK_CARDS, getA1CourseBookCard } from "./a1CourseBookCards";
import { getAssignmentDictionaryEntry } from "./germanAssignmentCatalog";

describe("authoritative A1 course-book cards", () => {
  it("contains one unique identity for every displayed card", () => {
    const dayChapters = A1_COURSE_BOOK_CARDS.map(
      (card) => `${card.displayDay}:${card.chapter}`
    );
    const assignmentIds = A1_COURSE_BOOK_CARDS.map((card) => card.assignmentId).filter(Boolean);

    expect(A1_COURSE_BOOK_CARDS).toHaveLength(29);
    expect(new Set(dayChapters).size).toBe(dayChapters.length);
    expect(new Set(assignmentIds).size).toBe(assignmentIds.length);
  });

  it("defines both Day 18 cards as tutor-marked assignments", () => {
    const chapter121 = getA1CourseBookCard({ displayDay: 18, chapter: "12.1" });
    const chapter122 = getA1CourseBookCard({ displayDay: 18, chapter: "12.2" });

    expect(chapter121).toEqual(
      expect.objectContaining({
        title: "Two Case Prepositions",
        assignmentId: "A1-12.1",
        assessmentType: "tutor-marked",
        submissionRequired: true,
      })
    );
    expect(chapter122).toEqual(
      expect.objectContaining({
        title: "Dative Prepositions",
        assignmentId: "A1-12.2",
        assessmentType: "tutor-marked",
        submissionRequired: true,
      })
    );
  });

  it("adds the missing Day 18 12.2 assignment to the assignment dictionary", () => {
    expect(getAssignmentDictionaryEntry({ level: "A1", assignmentId: "A1-12.2" })).toEqual(
      expect.objectContaining({
        title: "Dative Prepositions",
        assignment_id: "A1-12.2",
        assignment: true,
        submissionRequired: true,
      })
    );
  });
});
