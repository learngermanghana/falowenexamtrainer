import { A1_COURSE_BOOK_CARDS } from "./a1CourseBookCards";
import { A1_LESSON_TITLE_OVERRIDES, applyA1LessonTitleOverride } from "./a1LessonTitleOverrides";
import { A1_ASSIGNMENT_REGISTRY } from "./a1AssignmentRegistry";

describe("A1 lesson title corrections", () => {
  test("restores the historical Kapitel 1.2 title", () => {
    expect(A1_LESSON_TITLE_OVERRIDES["A1-1.2"]).toBe("Introducing Yourself");
    expect(
      applyA1LessonTitleOverride({ id: "A1-1.2", title: "Personal Pronouns and Verb Conjugation" }),
    ).toMatchObject({ title: "Introducing Yourself", topic: "Introducing Yourself" });
  });

  test("uses the corrected title in the Course Book and assignment registry", () => {
    expect(A1_COURSE_BOOK_CARDS.find((card) => card.assignmentId === "A1-1.2"))
      .toMatchObject({ displayDay: 3, chapter: "1.2", title: "Introducing Yourself" });
    expect(A1_ASSIGNMENT_REGISTRY["A1-1.2"])
      .toMatchObject({ day: 3, chapter: "1.2", title: "Introducing Yourself" });
  });
});
