import {
  getA1LessonStateChapter,
  getA1RequestedLessonChapter,
  shouldResetA1ChapterSpecificLessonState,
} from "./a1ChapterSpecificLessonState";

describe("A1 chapter-specific lesson state", () => {
  test.each([
    ["/campus/course/lesson/A1/2", "?chapter=1.1", "0.2"],
    ["/campus/course/lesson/A1/16", "?chapter=10", "9"],
    ["/campus/course/lesson/A1/18", "?chapter=12.2", "12.1"],
  ])("resets stale state for split A1 lessons", (pathname, search, staleChapter) => {
    expect(
      shouldResetA1ChapterSpecificLessonState({
        pathname,
        search,
        state: { entry: { chapter: staleChapter } },
      }),
    ).toBe(true);
  });

  it("keeps state when it already matches the requested chapter", () => {
    expect(
      shouldResetA1ChapterSpecificLessonState({
        pathname: "/campus/course/lesson/A1/2",
        search: "?chapter=1.1",
        state: { entry: { displayChapter: "1.1", chapter: "0.2_1.1" } },
      }),
    ).toBe(false);
  });

  it("does not reset direct URLs without navigation state", () => {
    expect(
      shouldResetA1ChapterSpecificLessonState({
        pathname: "/campus/course/lesson/A1/2",
        search: "?chapter=1.1",
        state: null,
      }),
    ).toBe(false);
  });

  it("does not affect A2 lesson routes", () => {
    expect(
      shouldResetA1ChapterSpecificLessonState({
        pathname: "/campus/course/lesson/A2/2",
        search: "?chapter=1.1",
        state: { entry: { chapter: "0.2" } },
      }),
    ).toBe(false);
  });

  it("normalizes requested and state chapters", () => {
    expect(getA1RequestedLessonChapter("?chapter=12.2")).toBe("12.2");
    expect(getA1LessonStateChapter({ entry: { displayChapter: "10" } })).toBe("10");
  });
});
