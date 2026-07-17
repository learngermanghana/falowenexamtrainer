import { getA1CanonicalChapterDestination } from "./A1CanonicalChapterLessonRoute";
import {
  isA1ChapterResourceHubRequest,
  shouldClearA1ChapterResourceHubState,
} from "./A1ChapterResourceHubRoute";
import { getA1LegacyChapterLessonRedirect } from "./A1ChapterSpecificLessonRouteBoundary";


describe("A1 canonical resource hub handoff", () => {
  test("sends Day 2 Kapitel 1.1 to its chapter-scoped lesson hub", () => {
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

  test("recognizes the Day 2 Kapitel 1.1 resource hub request", () => {
    expect(
      isA1ChapterResourceHubRequest({
        level: "A1",
        search: "?chapter=1.1&hub=1",
      }),
    ).toBe(true);
  });

  test("clears stale Kapitel 0.2 route state before Kapitel 1.1 is rendered", () => {
    expect(
      shouldClearA1ChapterResourceHubState({
        level: "A1",
        search: "?chapter=1.1&hub=1",
        state: {
          day: 2,
          entry: { day: 2, chapter: "0.2", topic: "German Alphabet" },
        },
      }),
    ).toBe(true);

    expect(
      shouldClearA1ChapterResourceHubState({
        level: "A1",
        search: "?chapter=1.1&hub=1",
        state: null,
      }),
    ).toBe(false);
  });
});
