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
  ])("resets stale state for split A1 lessons", (pathname, search, staleChapter) => {
    expect(
      shouldResetA1ChapterSpecificLessonState({
        pathname,
        search,
        state: { entry: { chapter: staleChapter } },
      }),
    ).toBe(true);
  });

  test.each([
    ["/campus/course/lesson/A1/2", "?chapter=1.1", "1.1", "0.2_1.1"],
    ["/campus/course/lesson/A1/16", "?chapter=10", "10", "9_10"],
    ["/campus/course/lesson/A1/18", "?chapter=12.2", "12.2", "12.1_12.2"],
  ])(
    "resets combined state on split A1 lessons because it can retain sibling content",
    (pathname, search, displayChapter, chapter) => {
      expect(
        shouldResetA1ChapterSpecificLessonState({
          pathname,
          search,
          state: { entry: { displayChapter, chapter } },
        }),
      ).toBe(true);
    },
  );

  it("corrects the exact reported Day 2 bug from chapter 1.1 back to the clicked A1-0.2 card", () => {
    expect(
      getA1CorrectedChapterSpecificLessonSearch({
        pathname: "/campus/course/lesson/A1/2",
        search: "?chapter=1.1",
        state: {
          assignmentKey: "A1-0.2",
          entry: {
            assignmentId: "A1-0.2",
            title: "German Alphabet",
            chapter: "0.2",
            lesen_hören: { chapter: "0.2" },
          },
        },
      }),
    ).toBe("?chapter=0.2");
  });

  it("keeps Kapitel 1.1 when the clicked card identity is A1-1.1", () => {
    expect(
      getA1CorrectedChapterSpecificLessonSearch({
        pathname: "/campus/course/lesson/A1/2",
        search: "?chapter=1.1",
        state: {
          assignmentKey: "A1-1.1",
          entry: { assignmentId: "A1-1.1", chapter: "1.1" },
        },
      }),
    ).toBe("");
  });

  it("preserves unrelated query parameters while correcting the chapter", () => {
    expect(
      getA1CorrectedChapterSpecificLessonSearch({
        pathname: "/campus/course/lesson/A1/2",
        search: "?chapter=1.1&source=coursebook",
        state: {
          entry: { lessonId: "A1-0.2", chapter: "0.2" },
        },
      }),
    ).toBe("?chapter=0.2&source=coursebook");
  });

  it("keeps correctly scoped Day 2 Chapter 0.2 state without remounting the page", () => {
    expect(
      shouldResetA1ChapterSpecificLessonState({
        pathname: "/campus/course/lesson/A1/2",
        search: "?chapter=0.2",
        state: {
          entry: {
            displayChapter: "0.2",
            chapter: "0.2",
            lesen_hören: { chapter: "0.2" },
          },
        },
      }),
    ).toBe(false);
  });

  it("keeps correctly scoped Day 2 Chapter 1.1 state without remounting the page", () => {
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
    ).toBe(false);
  });

  it("resets Chapter 1.1 state when its nested resource still belongs to Chapter 0.2", () => {
    expect(
      shouldResetA1ChapterSpecificLessonState({
        pathname: "/campus/course/lesson/A1/2",
        search: "?chapter=1.1",
        state: {
          entry: {
            displayChapter: "1.1",
            chapter: "1.1",
            lesen_hören: { chapter: "0.2" },
          },
        },
      }),
    ).toBe(true);
  });

  it("keeps matching state on a normal single-chapter A1 lesson", () => {
    expect(
      shouldResetA1ChapterSpecificLessonState({
        pathname: "/campus/course/lesson/A1/7",
        search: "?chapter=3",
        state: { entry: { displayChapter: "3", chapter: "3" } },
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

  it("normalizes requested, identity, state and nested resource chapters", () => {
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
