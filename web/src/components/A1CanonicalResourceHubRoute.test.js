import { getA1CanonicalChapterDestination } from "./A1CanonicalChapterLessonRoute";
import { getA1LegacyChapterLessonRedirect } from "./A1ChapterSpecificLessonRouteBoundary";

describe("A1 canonical resource hub handoff", () => {
  test("sends Day 2 Kapitel 1.1 to the hub instead of the workbook", () => {
    expect(getA1CanonicalChapterDestination({ chapter: "1.1" })).toBe(
      "/campus/course/lesson/A1/2?chapter=1.1&hub=1",
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
