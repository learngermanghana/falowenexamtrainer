import { A1_COURSE_BOOK_CARDS, getA1CourseBookCard } from "./a1CourseBookCards";
import { getAssignmentDictionaryEntry } from "./germanAssignmentCatalog";

describe("authoritative A1 course-book cards", () => {
  it("contains one unique identity for every displayed card", () => {
    const dayChapters = A1_COURSE_BOOK_CARDS.map(
      (card) => `${card.displayDay}:${card.chapter}`
    );
    const assignmentIds = A1_COURSE_BOOK_CARDS.map((card) => card.assignmentId).filter(Boolean);

    expect(A1_COURSE_BOOK_CARDS).toHaveLength(27);
    expect(new Set(dayChapters).size).toBe(dayChapters.length);
    expect(new Set(assignmentIds).size).toBe(assignmentIds.length);
  });

  it("defines a single Day 18 assignment covering both preposition topics", () => {
    const chapter121 = getA1CourseBookCard({ displayDay: 18, chapter: "12.1" });
    const chapter122 = getA1CourseBookCard({ displayDay: 18, chapter: "12.2" });

    expect(chapter121).toEqual(
      expect.objectContaining({
        title: "Two-Way and Dative Prepositions",
        assignmentId: "A1-12.1",
        assessmentType: "tutor-marked",
        submissionRequired: true,
      })
    );
    expect(chapter122).toBeNull();
  });

  it("replaces the retired 12.2 slot with the required speaking lab and keeps 19 assignments", () => {
    expect(A1_COURSE_BOOK_CARDS.filter(card => card.submissionRequired)).toHaveLength(19);
    expect(getAssignmentDictionaryEntry({ level: "A1", assignmentId: "A1-5.9" })).toMatchObject({ assignment_id: "A1-5.9", submissionRequired: true });
  });
});
