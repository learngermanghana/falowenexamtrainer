import { A1_COURSE_BOOK_CARDS } from "./a1CourseBookCards";
import { A1_LESSON_TITLE_OVERRIDES, applyA1LessonTitleOverride } from "./a1LessonTitleOverrides";
import { A1_ASSIGNMENT_REGISTRY } from "./a1AssignmentRegistry";

const EXPECTED_EARLY_TITLES = [
  ["A1-1.1", 2, "1.1", "Personal Pronouns and Verb Conjugation"],
  ["A1-1.1-practice", 3, "1.1", "Personal Information, Articles, Adjectives and W-Questions"],
  ["A1-1.2", 3, "1.2", "Present-Tense Verb Conjugation Practice"],
  ["A1-1.3", 5, "1.3", "Introducing Yourself and Articles"],
];

describe("A1 lesson title corrections", () => {
  test("restores the distinct Kapitel 1.2 conjugation-practice title", () => {
    expect(A1_LESSON_TITLE_OVERRIDES["A1-1.2"]).toBe("Present-Tense Verb Conjugation Practice");
    expect(
      applyA1LessonTitleOverride({ id: "A1-1.2", title: "Introducing Yourself" }),
    ).toMatchObject({
      title: "Present-Tense Verb Conjugation Practice",
      topic: "Present-Tense Verb Conjugation Practice",
    });
  });

  test("keeps the four visible early A1 Course Book cards clearly distinct", () => {
    EXPECTED_EARLY_TITLES.forEach(([assignmentId, displayDay, chapter, title]) => {
      expect(A1_COURSE_BOOK_CARDS.find((card) => card.assignmentId === assignmentId))
        .toMatchObject({ displayDay, chapter, title });
    });

    const titles = EXPECTED_EARLY_TITLES.map(([, , , title]) => title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  test("uses the same Kapitel 1.2 title in the tutor-marked assignment registry", () => {
    expect(A1_ASSIGNMENT_REGISTRY["A1-1.1"])
      .toMatchObject({ day: 2, chapter: "1.1", title: "Personal Pronouns and Verb Conjugation" });
    expect(A1_ASSIGNMENT_REGISTRY["A1-1.2"])
      .toMatchObject({ day: 3, chapter: "1.2", title: "Present-Tense Verb Conjugation Practice" });
  });
});
