import {
  A1_CANONICAL_LESSON_CATALOG,
  getA1CanonicalLesson,
  getA1CanonicalLessonForLegacyRoute,
  getA1CanonicalLessonsForChapter,
} from "./a1CanonicalLessonCatalog";

const EXPECTED_ROUTE_KEYS = [
  "0.1", "0.2", "1.1", "1.2", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11",
  "12.1", "12.2", "12.3", "13", "14.1",
  "1.1-practice", "1.3", "2.3", "3.5", "3.6", "4.7", "5.9", "14.2", "5.10",
];

describe("A1 canonical lesson catalog", () => {
  test("gives every current A1 Course Book chapter resource a permanent route", () => {
    expect(A1_CANONICAL_LESSON_CATALOG.map((lesson) => lesson.routeKey).sort()).toEqual(
      [...EXPECTED_ROUTE_KEYS].sort(),
    );
    expect(new Set(A1_CANONICAL_LESSON_CATALOG.map((lesson) => lesson.routeKey)).size).toBe(
      A1_CANONICAL_LESSON_CATALOG.length,
    );
    expect(
      A1_CANONICAL_LESSON_CATALOG.every(
        (lesson) => lesson.lessonRoute === `/campus/course/lesson/A1/chapter/${lesson.routeKey}`,
      ),
    ).toBe(true);
    expect(A1_CANONICAL_LESSON_CATALOG.every((lesson) => lesson.destination.startsWith("/campus/course/"))).toBe(true);
  });

  test("keeps graded Kapitel 1.1 and its later self-practice resource separate", () => {
    expect(getA1CanonicalLesson("1.1")).toMatchObject({
      routeKey: "1.1",
      day: 2,
      assignmentKey: "A1-1.1",
      destination: "/campus/course/a1-day-2-kapitel-1-1-workbook",
    });
    expect(getA1CanonicalLesson("A1-1.1-PRACTICE")).toMatchObject({
      routeKey: "1.1-practice",
      day: 3,
      assignmentKey: null,
      destination: "/campus/course/a1-day-3-schreiben-sprechen-kapitel-1-1-workbook",
    });
    expect(getA1CanonicalLessonsForChapter("1.1")).toHaveLength(2);
  });

  test("uses the legacy day to disambiguate repeated Kapitel 1.1 resources", () => {
    expect(getA1CanonicalLessonForLegacyRoute({ day: 2, identity: "1.1" })).toMatchObject({
      routeKey: "1.1",
      destination: "/campus/course/a1-day-2-kapitel-1-1-workbook",
    });
    expect(getA1CanonicalLessonForLegacyRoute({ day: 3, identity: "1.1" })).toMatchObject({
      routeKey: "1.1-practice",
      destination: "/campus/course/a1-day-3-schreiben-sprechen-kapitel-1-1-workbook",
    });
    expect(getA1CanonicalLessonForLegacyRoute({ day: 3, identity: "1.1-PRACTICE" })).toMatchObject({
      routeKey: "1.1-practice",
    });
  });

  test("resolves every permanent route identity to one deterministic catalog entry", () => {
    [
      ["0.2", "/campus/course/a1-day-2-german-alphabet-reviewing-workbook"],
      ["1.1", "/campus/course/a1-day-2-kapitel-1-1-workbook"],
      ["1.1-PRACTICE", "/campus/course/a1-day-3-schreiben-sprechen-kapitel-1-1-workbook"],
      ["1.3", "/campus/course/a1-day-5-introducing-yourself-and-articles-workbook"],
      ["14.2", "/campus/course/dative-and-accusative-verbs-14-2"],
    ].forEach(([identity, destination]) => {
      expect(getA1CanonicalLesson(identity)?.destination).toBe(destination);
    });
  });
});
