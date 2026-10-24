import {
  getA1CorrectedChapterSpecificLessonSearch,
  getA1LessonStateChapter,
  getA1LessonStateIdentityChapter,
  getA1LessonStateResourceChapters,
  getA1RequestedLessonChapter,
  shouldResetA1ChapterSpecificLessonState,
} from "./a1ChapterSpecificLessonState";

describe("A1 chapter-specific lesson state", () => {
  test.each([
    ["/campus/course/lesson/A1/2", "?chapter=1.1", "0.2"],
    ["/campus/course/lesson/A1/16", "?chapter=10", "9"],
    ["/campus/course/lesson/A1/18", "?chapter=12.2", "12.1"],
  ])("clears navigation state whenever an old A1 day URL declares a chapter", (pathname, search, staleChapter) => {
    expect(
      shouldResetA1ChapterSpecificLessonState({
        pathname,
        search,
        state: { entry: { chapter: staleChapter } },
      }),
    ).toBe(true);
  });

  test("never rewrites a requested chapter from browser navigation state", () => {
    expect(
      getA1CorrectedChapterSpecificLessonSearch({
        pathname: "/campus/course/lesson/A1/2",
        search: "?chapter=1.1",
        state: {
          assignmentKey: "A1-0.2",
          entry: { assignmentId: "A1-0.2", chapter: "0.2" },
        },
      }),
    ).toBe("");
  });

  test("clears even matching state because the URL is now the only lesson identity", () => {
    expect(
      shouldResetA1ChapterSpecificLessonState({
        pathname: "/campus/course/lesson/A1/2",
        search: "?chapter=1.1",
        state: {
          entry: {
            displayChapter: "1.1",
            chapter: "1.1",
            lesen_hören: { chapter: "1.1" },
          },
        },
      }),
    ).toBe(true);
  });

  test("does not reset old day URLs that do not identify a chapter", () => {
    expect(
      shouldResetA1ChapterSpecificLessonState({
        pathname: "/campus/course/lesson/A1/2",
        search: "",
        state: { entry: { chapter: "0.2" } },
      }),
    ).toBe(false);
  });

  test("does not affect canonical chapter URLs", () => {
    expect(
      shouldResetA1ChapterSpecificLessonState({
        pathname: "/campus/course/lesson/A1/chapter/1.1",
        search: "",
        state: { entry: { chapter: "0.2" } },
      }),
    ).toBe(false);
  });

  test("does not affect A2 lesson routes", () => {
    expect(
      shouldResetA1ChapterSpecificLessonState({
        pathname: "/campus/course/lesson/A2/2",
        search: "?chapter=1.1",
        state: { entry: { chapter: "0.2" } },
      }),
    ).toBe(false);
  });

  test("normalizes requested, identity, state and nested resource chapters for diagnostics", () => {
    expect(getA1RequestedLessonChapter("?chapter=12.2")).toBe("12.2");
    expect(getA1LessonStateChapter({ entry: { displayChapter: "10" } })).toBe("10");
    expect(getA1LessonStateIdentityChapter({ entry: { assignmentId: "A1-0.2" } })).toBe("0.2");
    expect(
      getA1LessonStateResourceChapters({
        entry: {
          lesen_hören: [{ chapter: "0.2" }, { displayChapter: "1.1" }],
        },
      }),
    ).toEqual(["0.2", "1.1"]);
  });
});
