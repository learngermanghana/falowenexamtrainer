import { getA1CanonicalChapterDestination } from "./A1CanonicalChapterLessonRoute";
import {
  buildA1ChapterResourceHubState,
  getRequestedA1Chapter,
  isA1ChapterResourceHubRequest,
  resolveA1ChapterResourceHubEntry,
  shouldNormalizeA1ChapterResourceHubState,
} from "./A1ChapterResourceHubRoute";
import { getA1LegacyChapterLessonRedirect } from "./A1ChapterSpecificLessonRouteBoundary";
import { normalizeLesson } from "../data/lessonModel";
import {
  A1_DAY20_CHAPTER123_GRAMMAR_ROUTE,
  A1_DAY20_CHAPTER123_WORKBOOK_ROUTE,
} from "../data/a1Day20LetterWritingRoutes";


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

  test("preserves completed radio on tutor-marked workbook links from the teacher lecture hub", () => {
    const state = buildA1ChapterResourceHubState({
      level: "A1",
      day: "1",
      search: "?chapter=0.1&hub=1&radio=done",
    });
    const lesson = normalizeLesson(state.entry, "A1");

    expect(state.entry.workbookRoute).toBe(
      "/campus/course/a1-day-1-greetings-workbook?radio=done",
    );
    expect(lesson.resources.workbook?.url).toBe(
      "/campus/course/a1-day-1-greetings-workbook?radio=done",
    );
  });

  test("preserves the Day 20 workbook-only view through strict route normalization", () => {
    const state = buildA1ChapterResourceHubState({
      level: "A1",
      day: "20",
      search: "?chapter=12.3&hub=1&radio=done",
    });
    const lesson = normalizeLesson(state.entry, "A1");

    expect(state.entry.workbookRoute).toBe(
      `${A1_DAY20_CHAPTER123_WORKBOOK_ROUTE}?view=workbook&radio=done`,
    );
    expect(lesson.resources.workbook?.url).toBe(
      `${A1_DAY20_CHAPTER123_WORKBOOK_ROUTE}?radio=done&view=workbook`,
    );
  });

  test("keeps Day 20 Kapitel 12.3 grammar notes on the lesson resource hub", () => {
    const entry = resolveA1ChapterResourceHubEntry({ day: 20, chapter: "12.3" });
    const lesson = normalizeLesson(entry, "A1");

    expect(entry).toEqual(
      expect.objectContaining({ day: 20, chapter: "12.3" }),
    );
    expect(lesson.resources.grammarBook?.url).toBe(
      A1_DAY20_CHAPTER123_GRAMMAR_ROUTE,
    );
    expect(lesson.resources.workbook?.url).toBe(
      A1_DAY20_CHAPTER123_WORKBOOK_ROUTE,
    );
  });
});
