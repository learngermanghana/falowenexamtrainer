import { getA1CanonicalChapterDestination } from "./A1CanonicalChapterLessonRoute";
import { getA1LegacyChapterLessonRedirect } from "./A1ChapterSpecificLessonRouteBoundary";

describe("A1 canonical chapter handoff", () => {
  test("sends Day 2 Kapitel 1.1 directly to its unique workbook", () => {
    expect(getA1CanonicalChapterDestination({ chapter: "1.1" })).toBe(
      "/campus/course/a1-day-2-kapitel-1-1-workbook",
    );
  });

  test("does not redirect the internal hub handoff back to the canonical route", () => {
    expect(
      getA1LegacyChapterLessonRedirect({
        pathname: "/campus/course/lesson/A1/2",
        search: "?chapter=1.1&hub=1",
      }),
    ).toBeNull();
  });
});
