import { A1_COURSE_BOOK_CARDS } from "./a1CourseBookCards";
import { A1_ASSIGNMENT_ORDER, A1_ASSIGNMENT_REGISTRY } from "./a1AssignmentRegistry";
import { getA1TeacherVideoResources } from "./a1TeacherVideoResources";
import { alignA1CurriculumEntries } from "./a1RouteAlignment";

const expectedCardsPerDay = (day) => [2, 3, 16, 18].includes(day) ? 2 : 1;

describe("A1 all chapters audit", () => {
  test("covers every teaching day", () => {
    expect(A1_COURSE_BOOK_CARDS).toHaveLength(29);
    for (let day = 0; day <= 24; day += 1) {
      expect(A1_COURSE_BOOK_CARDS.filter((card) => Number(card.displayDay) === day)).toHaveLength(expectedCardsPerDay(day));
    }
  });

  test("keeps all displayed workbook routes inside Falowen", () => {
    A1_COURSE_BOOK_CARDS.forEach((card) => {
      expect(card.workbookRoute).toMatch(/^\/campus\/course\//);
      if (card.grammarPage) expect(card.grammarPage).toMatch(/^\/campus\/course\//);
    });
  });

  test("keeps all tutor-marked chapters in the assignment registry", () => {
    expect(Object.keys(A1_ASSIGNMENT_REGISTRY).sort()).toEqual([...A1_ASSIGNMENT_ORDER].sort());
    A1_ASSIGNMENT_ORDER.forEach((key) => {
      const assignment = A1_ASSIGNMENT_REGISTRY[key];
      expect(assignment).toBeTruthy();
      expect(assignment.workbookRoute).toMatch(/^\/campus\/course\//);
      expect(assignment.sections.length).toBeGreaterThan(0);
    });
  });

  test("keeps teacher resources for every teaching day", () => {
    for (let day = 1; day <= 24; day += 1) {
      expect(getA1TeacherVideoResources(day).length).toBeGreaterThan(0);
    }
  });

  test("normalizes modern route fields as well as legacy fields", () => {
    const [aligned] = alignA1CurriculumEntries([{
      level: "A1",
      displayDay: 18,
      chapter: "12.1",
      grammarNotesPage: "/campus/course/old-grammar",
      workbookPage: "/campus/course/old-workbook",
    }]);
    expect(aligned.grammarNotesPage).toBe(aligned.grammarPage);
    expect(aligned.workbookPage).toBe(aligned.workbookRoute);
  });
});
