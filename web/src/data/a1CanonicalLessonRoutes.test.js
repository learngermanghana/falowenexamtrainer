import {
  buildA1CanonicalChapterLessonRoute,
  buildA1ShortChapterLessonRoute,
  getA1CanonicalLessonChapter,
  getA1LegacyLessonDay,
  getA1RequestedChapterFromSearch,
  mergeA1LessonSearchIntoWorkbookRoute,
  normalizeA1Chapter,
  removeA1ChapterFromSearch,
} from "./a1CanonicalLessonRoutes";

describe("canonical A1 chapter lesson routes", () => {
  test("builds one stable chapter-owned URL", () => {
    expect(buildA1CanonicalChapterLessonRoute("0.2")).toBe(
      "/campus/course/lesson/A1/chapter/0.2",
    );
    expect(buildA1CanonicalChapterLessonRoute("A1-1.1")).toBe(
      "/campus/course/lesson/A1/chapter/1.1",
    );
    expect(buildA1CanonicalChapterLessonRoute("A1-1.1-PRACTICE")).toBe(
      "/campus/course/lesson/A1/chapter/1.1-practice",
    );
    expect(buildA1CanonicalChapterLessonRoute("2")).toBe(
      "/campus/course/lesson/A1/chapter/2",
    );
  });

  test("offers the requested short alias only when it cannot collide with an integer day", () => {
    expect(buildA1ShortChapterLessonRoute("0.2")).toBe(
      "/campus/course/lesson/A1/0.2",
    );
    expect(buildA1ShortChapterLessonRoute("1.1")).toBe(
      "/campus/course/lesson/A1/1.1",
    );
    expect(buildA1ShortChapterLessonRoute("1.1-practice")).toBe(
      "/campus/course/lesson/A1/1.1-practice",
    );
    expect(buildA1ShortChapterLessonRoute("2")).toBe("");
  });

  test("parses canonical and legacy route identities without navigation state", () => {
    expect(getA1CanonicalLessonChapter("/campus/course/lesson/A1/chapter/12.2")).toBe("12.2");
    expect(getA1LegacyLessonDay("/campus/course/lesson/A1/18")).toBe("18");
    expect(getA1RequestedChapterFromSearch("?chapter=12.2&source=coursebook")).toBe("12.2");
    expect(normalizeA1Chapter("A1-1.1-PRACTICE")).toBe("1.1-practice");
  });

  test("removes the legacy chapter query while preserving unrelated parameters", () => {
    expect(removeA1ChapterFromSearch("?chapter=1.1&source=coursebook&radio=done")).toBe(
      "?source=coursebook&radio=done",
    );
  });

  test("preserves required workbook parameters and forwards optional lesson state in the URL", () => {
    expect(
      mergeA1LessonSearchIntoWorkbookRoute(
        "/campus/course/two-case-prepositions-wechselpraepositionen-day-18?view=workbook",
        "?source=coursebook&radio=done&chapter=12.1",
      ),
    ).toBe(
      "/campus/course/two-case-prepositions-wechselpraepositionen-day-18?view=workbook&source=coursebook&radio=done",
    );
  });
});
