import { getA1CanonicalChapterDestination } from "./A1CanonicalChapterLessonRoute";
import {
  buildA1ChapterResourceHubState,
  getRequestedA1Chapter,
  isA1ChapterResourceHubRequest,
  resolveA1ChapterResourceHubEntry,
  shouldNormalizeA1ChapterResourceHubState,
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
        search: "?chapter=1.1&hub=1&radio=done",
      }),
    ).toBe(true);
    expect(getRequestedA1Chapter("?chapter=1.1&hub=1&radio=done")).toBe("1.1");
  });

  test("resolves the exact Day 2 Kapitel 1.1 entry instead of falling back to 0.2", () => {
    expect(resolveA1ChapterResourceHubEntry({ day: 2, chapter: "1.1" })).toEqual(
      expect.objectContaining({
        day: 2,
        chapter: "1.1",
        topic: expect.stringContaining("Personal Pronouns"),
      }),
    );
  });

  test("replaces stale Kapitel 0.2 state with the exact Kapitel 1.1 entry", () => {
    const search = "?chapter=1.1&hub=1&radio=done";
    expect(
      shouldNormalizeA1ChapterResourceHubState({
        level: "A1",
        day: "2",
        search,
        state: {
          level: "A1",
          day: 2,
          entry: { day: 2, chapter: "0.2", topic: "German Alphabet" },
        },
      }),
    ).toBe(true);

    expect(buildA1ChapterResourceHubState({ level: "a1", day: 2, search })).toEqual(
      expect.objectContaining({
        level: "A1",
        day: "2",
        entry: expect.objectContaining({ chapter: "1.1" }),
      }),
    );
  });

  test("seeds missing route context once and then renders without another redirect", () => {
    const search = "?chapter=1.1&hub=1&radio=done";
    expect(
      shouldNormalizeA1ChapterResourceHubState({
        level: "A1",
        day: "2",
        search,
        state: null,
      }),
    ).toBe(true);

    const normalizedState = buildA1ChapterResourceHubState({ level: "A1", day: "2", search });
    expect(
      shouldNormalizeA1ChapterResourceHubState({
        level: "A1",
        day: "2",
        search,
        state: normalizedState,
      }),
    ).toBe(false);
  });
});
