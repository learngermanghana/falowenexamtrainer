const normalizeChapter = (value = "") => String(value || "").trim();

const SPLIT_A1_LESSON_DAYS = new Set(["2", "16", "18"]);

export const getA1RequestedLessonChapter = (search = "") =>
  normalizeChapter(new URLSearchParams(String(search || "")).get("chapter"));

export const getA1LessonStateChapter = (state = {}) =>
  normalizeChapter(
    state?.entry?.displayChapter ||
      state?.entry?.chapter ||
      state?.displayChapter ||
      state?.chapter,
  );

const getA1LessonRouteDay = (pathname = "") =>
  String(pathname || "").match(/^\/campus\/course\/lesson\/A1\/(\d+)\/?$/i)?.[1] || "";

export const shouldResetA1ChapterSpecificLessonState = ({
  pathname = "",
  search = "",
  state,
} = {}) => {
  const routeDay = getA1LessonRouteDay(pathname);
  if (!routeDay) return false;

  const requestedChapter = getA1RequestedLessonChapter(search);
  if (!requestedChapter || !state?.entry) return false;

  // Split A1 days contain more than one chapter under the same day route. A card can
  // carry the requested displayChapter while still retaining the first chapter's
  // topic and resources in navigation state. Clear that state and let the URL chapter
  // resolve the canonical entry instead.
  if (SPLIT_A1_LESSON_DAYS.has(routeDay)) return true;

  return getA1LessonStateChapter(state) !== requestedChapter;
};
