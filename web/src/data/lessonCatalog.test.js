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
  test("keeps A1 Days 1–4 as one student-facing card per day", () => {
    expect(getLessonsByLevel("A1").slice(0, 5).map(({ id, day, chapter }) => ({ id, day, chapter }))).toEqual([
      { id: "A1-Tutorial", day: 0, chapter: "Tutorial" },
      { id: "A1-0.1", day: 1, chapter: "0.1" },
      { id: "A1-0.2_1.1", day: 2, chapter: "0.2" },
      { id: "A1-1.2", day: 3, chapter: "1.2" },
      { id: "A1-2", day: 4, chapter: "2" },
    ]);
    expect(getLessonsByLevel("A1").filter(({ day }) => day === 3)).toHaveLength(1);
    expect(findLesson("A1-1.1-practice")).toBeNull();
  });

  test("generates display fields and legacy resources from active Day 2", () => {
    const lesson = findLesson("A1-0.2_1.1");
    expect(getLessonDisplayData(lesson)).toEqual({ displayDay: 2, displayChapter: "0.2", displayLabel: "Day 2 0.2" });
    expect(toLegacyResource(lesson)).toMatchObject({
      chapter: "0.2",
      title: "German Alphabet, Personal Pronouns and First Verbs",
      workbookRoute: "/campus/course/a1-day-2-foundations-workbook",
      submissionRequired: true,
      assignmentId: "A1-0.2_1.1",
    });
  });

  test("keeps the Day 3 graded assignment but excludes retired practice from active catalog", () => {
    expect(findLesson("A1-1.2")).toMatchObject({
      day: 3,
      chapter: "1.2",
      assignmentId: "A1-1.2",
      submissionRequired: true,
      progressionEligible: true,
    });
    expect(getLessonsByLevel("A1").map(({id}) => id)).not.toContain("A1-1.1-practice");
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

  test("verifies the single active Day 3 chapter, workbook and grammar routes", () => {
    expect(findLesson("A1-0.2_1.1")).toMatchObject({ assignmentId: "A1-0.2_1.1", chapter: "0.2" });
    expect(findLesson("A1-1.2")).toMatchObject({
      day: 3,
      chapter: "1.2",
      assignmentId: "A1-1.2",
      grammarPage: "/campus/course/a1-day-3-kapitel-1-2-grammar-notes",
      workbookRoute: "/campus/course/a1-day-3-pronouns-introducing-yourself-workbook",
      submissionRequired: true,
      progressionEligible: true,
    });
    const lessonForRoute = (route) => getLessonsByLevel("A1").find(
      (lesson) => lesson.workbookRoute === route || lesson.grammarPage === route
    );
    expect(lessonForRoute("/campus/course/a1-day-3-schreiben-sprechen-kapitel-1-1-workbook")).toBeUndefined();
    expect(lessonForRoute("/campus/course/a1-day-3-kapitel-1-2-grammar-notes")?.id).toBe("A1-1.2");
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
    ["A1-0.2_1.1", "A1-1.2", "A2-10.28", "B1-10.28"].forEach((assignmentId) => {
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
