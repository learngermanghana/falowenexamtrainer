import {
  getLessonDisplayData,
  getLessonsByLevel,
  lessonCatalog,
  toLegacyResource,
  validateLessonCatalog,
} from "./lessonCatalog";

const findLesson = (id) => lessonCatalog.find((lesson) => lesson.id === id);

describe("lessonCatalog canonical curriculum", () => {
  test("keeps A1 early lessons in original student-facing order without display duplicates", () => {
    expect(getLessonsByLevel("A1").slice(0, 6).map(({ id, day, chapter, title, sequence }) => ({ id, day, chapter, title, sequence }))).toEqual([
      { id: "A1-Tutorial", sequence: 1, day: 0, chapter: "Tutorial", title: "Tutorial" },
      { id: "A1-0.1", sequence: 2, day: 1, chapter: "0.1", title: "Greetings and Asking About Well-being" },
      { id: "A1-0.2", sequence: 3, day: 2, chapter: "0.2", title: "German Alphabet" },
      { id: "A1-1.1", sequence: 4, day: 2, chapter: "1.1", title: "Personal Pronouns and Verb Conjugation" },
      { id: "A1-1.1-practice", sequence: 5, day: 3, chapter: "1.1", title: "Personal Information, Articles, Adjectives and W-Questions" },
      { id: "A1-1.2", sequence: 6, day: 3, chapter: "1.2", title: "Personal Pronouns and Verb Conjugation" },
    ]);
  });

  test("generates display fields and legacy resources from canonical A1 lessons", () => {
    const alphabet = findLesson("A1-0.2");
    expect(getLessonDisplayData(alphabet)).toEqual({ displayDay: 2, displayChapter: "0.2", displayLabel: "Day 2 0.2" });
    expect(toLegacyResource(alphabet)).toMatchObject({
      chapter: "0.2",
      title: "German Alphabet",
      workbookRoute: "/campus/course/a1-day-2-german-alphabet-reviewing-workbook",
      submissionRequired: true,
      assignmentId: "A1-0.2",
    });
  });

  test("keeps required and self-practice A1 assignment identities distinct", () => {
    expect(findLesson("A1-1.1")).toMatchObject({
      day: 2,
      chapter: "1.1",
      title: "Personal Pronouns and Verb Conjugation",
      assignmentId: "A1-1.1",
      submissionRequired: true,
      progressionEligible: true,
    });
    expect(findLesson("A1-1.1-practice")).toMatchObject({
      day: 3,
      chapter: "1.1",
      assignmentId: "A1-1.1-practice",
      workbookRoute: "/campus/course/a1-day-3-schreiben-sprechen-kapitel-1-1-workbook",
      submissionRequired: false,
      progressionEligible: false,
    });
  });

  test("preserves final assignment IDs for A2 and B1", () => {
    expect(getLessonsByLevel("A2").at(-1)).toMatchObject({ assignmentId: "A2-10.28", chapter: "10.28", day: 28 });
    expect(getLessonsByLevel("B1").at(-1)).toMatchObject({ assignmentId: "B1-10.28", chapter: "10.28", day: 28 });
  });

  test("validator catches duplicate IDs and duplicate progression assignment IDs", () => {
    expect(validateLessonCatalog([findLesson("A1-0.1"), { ...findLesson("A1-0.1") }])).toEqual(expect.arrayContaining([
      "Duplicate lesson id: A1-0.1",
      "Duplicate progression assignmentId: A1-0.1",
    ]));
  });

  test("canonical catalogue has no duplicate ids or conflicting generated display data", () => {
    const errors = validateLessonCatalog(lessonCatalog).filter((error) => !error.startsWith("Required lesson has no workbookRoute or grammarPage:"));
    expect(errors).toEqual([]);
  });
});
