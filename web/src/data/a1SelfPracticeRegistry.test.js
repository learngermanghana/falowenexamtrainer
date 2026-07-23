import {
  A1_CANONICAL_LESSON_CATALOG,
  getA1CanonicalLesson,
  getA1CanonicalLessonForLegacyRoute,
} from "./a1CanonicalLessonCatalog";
import { getA1RadioResource } from "./a1RadioResources";

const practices = A1_CANONICAL_LESSON_CATALOG.filter((lesson) => lesson.kind === "practice");

test("A1 has ten explicit self-practice lessons with no tutor assignment identity", () => {
  expect(practices).toHaveLength(10);
  expect(practices.every((lesson) => lesson.assignmentKey === null)).toBe(true);
  expect(practices.map((lesson) => `${lesson.day}:${lesson.chapter}`)).toEqual([
    "3:1.1",
    "3:1.2",
    "5:1.3",
    "6:2.3",
    "13:3.5",
    "14:3.6",
    "15:4.7",
    "19:5.9",
    "23:14.2",
    "24:5.10",
  ]);
});

test("Day 3 Kapitel 1.2 self-practice has its own route and legacy identity", () => {
  expect(getA1CanonicalLesson("1.2-practice")).toEqual(
    expect.objectContaining({
      kind: "practice",
      assignmentKey: null,
      day: 3,
      chapter: "1.2",
      destination: "/campus/course/a1-day-3-kapitel-1-2-workbook",
      legacyLessonRoute: "/campus/course/lesson/A1/3?chapter=1.2-PRACTICE",
    }),
  );
  expect(getA1CanonicalLessonForLegacyRoute({ day: 3, identity: "1.2-PRACTICE" })).toEqual(
    expect.objectContaining({ routeKey: "1.2-practice", kind: "practice" }),
  );
});

test("Day 3 Kapitel 1.1 Radio does not leak into Kapitel 1.2 self-practice", () => {
  expect(getA1RadioResource(3, "1.1")).toEqual(
    expect.objectContaining({ chapter: "1.1", youtubeId: "y9LhKQkjsqM" }),
  );
  expect(getA1RadioResource(3, "1.2")).toBeNull();
});
