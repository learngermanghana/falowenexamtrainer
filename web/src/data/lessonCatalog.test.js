import {
  getLessonById,
  getLessonDisplayData,
  getLessonsByLevel,
  lessonCatalog,
  toLegacyResource,
  validateLessonCatalog,
} from "./lessonCatalog";

const findLesson = (id) => getLessonById(id);

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
      title: "Personal Information, Articles, Adjectives and W-Questions",
      workbookRoute: "/campus/course/a1-day-3-schreiben-sprechen-kapitel-1-1-workbook",
      submissionRequired: false,
      progressionEligible: false,
    });
  });

  test("orders the distinct A1 Day 2 and Day 3 records by explicit sequence", () => {
    const ids = getLessonsByLevel("A1").map((lesson) => lesson.id);
    expect(ids.slice(ids.indexOf("A1-1.1"), ids.indexOf("A1-1.2") + 1)).toEqual([
      "A1-1.1",
      "A1-1.1-practice",
      "A1-1.2",
    ]);
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

  test("verifies exact early A1 canonical records", () => {
    expect(findLesson("A1-0.2")).toMatchObject({ assignmentId: "A1-0.2", chapter: "0.2", title: "German Alphabet" });
    expect(findLesson("A1-1.1")).toMatchObject({ assignmentId: "A1-1.1", day: 2, chapter: "1.1", title: "Personal Pronouns and Verb Conjugation", submissionRequired: true, progressionEligible: true });
    expect(findLesson("A1-1.1-practice")).toMatchObject({
      day: 3,
      chapter: "1.1",
      title: "Personal Information, Articles, Adjectives and W-Questions",
      assignmentId: "A1-1.1-practice",
      grammarPage: "",
      workbookRoute: "/campus/course/a1-day-3-schreiben-sprechen-kapitel-1-1-workbook",
      submissionRequired: false,
      progressionEligible: false,
    });
    expect(findLesson("A1-1.2")).toMatchObject({
      day: 3,
      chapter: "1.2",
      title: "Personal Pronouns and Verb Conjugation",
      assignmentId: "A1-1.2",
      grammarPage: "/campus/course/a1-day-3-kapitel-1-2-grammar-notes",
      workbookRoute: "/campus/course/a1-day-3-pronouns-introducing-yourself-workbook",
      submissionRequired: true,
      progressionEligible: true,
    });
  });

  test("resolves direct Day 3 workbook and grammar routes to the correct canonical lesson", () => {
    const lessonForRoute = (route) => getLessonsByLevel("A1").find(
      (lesson) => lesson.workbookRoute === route || lesson.grammarPage === route
    );

    expect(lessonForRoute("/campus/course/a1-day-3-schreiben-sprechen-kapitel-1-1-workbook")).toMatchObject({
      id: "A1-1.1-practice",
      title: "Personal Information, Articles, Adjectives and W-Questions",
    });
    expect(lessonForRoute("/campus/course/a1-day-3-pronouns-introducing-yourself-workbook")).toMatchObject({
      id: "A1-1.2",
      title: "Personal Pronouns and Verb Conjugation",
    });
    expect(lessonForRoute("/campus/course/a1-day-3-kapitel-1-2-grammar-notes")).toMatchObject({
      id: "A1-1.2",
      title: "Personal Pronouns and Verb Conjugation",
    });
  });

  test("display fields are generated from canonical day and chapter", () => {
    lessonCatalog.forEach((lesson) => {
      expect(lesson.displayDay).toBeUndefined();
      expect(lesson.displayChapter).toBeUndefined();
      expect(lesson.displayLabel).toBeUndefined();
      expect(getLessonDisplayData(lesson)).toEqual({ displayDay: lesson.day, displayChapter: lesson.chapter, displayLabel: `Day ${lesson.day} ${lesson.chapter}` });
    });
  });

  test("planned lessons may have placeholder routes but published lessons may not", () => {
    expect(validateLessonCatalog([{ ...findLesson("B2-1.5"), workbookRoute: "", grammarPage: "", contentStatus: "planned" }])).toEqual([]);
    expect(validateLessonCatalog([{ ...findLesson("B2-1.5"), workbookRoute: "", grammarPage: "", contentStatus: undefined }])).toEqual(expect.arrayContaining(["Published required lesson has no workbookRoute or grammarPage: B2-1.5"]));
  });

  test("legacy records resolve with assignmentId or assignment_id naming", () => {
    ["A1-0.2", "A1-1.1", "A1-1.2", "A2-10.28", "B1-10.28"].forEach((assignmentId) => {
      const lesson = lessonCatalog.find((candidate) => candidate.assignmentId === assignmentId);
      expect(lesson).toBeTruthy();
      expect([lesson.assignmentId, lesson.assignment_id].filter(Boolean)).toContain(assignmentId);
      expect((lesson.assignmentId || lesson.assignment_id)).toBe(assignmentId);
    });
  });

  test("sequence sorting is stable even when dictionary insertion order is shuffled", () => {
    const sortedIds = getLessonsByLevel("A1").map((lesson) => lesson.id);
    const shuffledDictionary = Object.fromEntries([...getLessonsByLevel("A1")].reverse().map((lesson) => [lesson.id, lesson]));
    const restoredOrder = Object.values(shuffledDictionary).sort((a, b) => Number(a.sequence) - Number(b.sequence)).map((lesson) => lesson.id);
    expect(restoredOrder).toEqual(sortedIds);
    expect(Object.values(shuffledDictionary).map((lesson) => lesson.id)).not.toEqual(sortedIds);
  });

  test("canonical catalogue has no duplicate ids or conflicting generated display data", () => {
    expect(validateLessonCatalog(lessonCatalog)).toEqual([]);
  });
});
