const normalizeChapter = (value = "") => String(value || "").trim();

const SPLIT_A1_LESSON_DAYS = new Set(["2", "16", "18"]);
const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

export const getA1RequestedLessonChapter = (search = "") =>
  normalizeChapter(new URLSearchParams(String(search || "")).get("chapter"));

export const getA1LessonStateChapter = (state = {}) =>
  normalizeChapter(
    state?.entry?.displayChapter ||
      state?.entry?.chapter ||
      state?.displayChapter ||
      state?.chapter,
  );

export const getA1LessonStateResourceChapters = (state = {}) => {
  const entry = state?.entry;
  if (!entry || typeof entry !== "object") return [];

  const resources = [
    ...toArray(entry.primaryResource),
    ...toArray(entry.resources),
    ...toArray(entry.lesen_hören),
    ...toArray(entry.schreiben_sprechen),
  ];

  return [
    ...new Set(
      resources
        .map((resource) => normalizeChapter(resource?.displayChapter || resource?.chapter))
        .filter(Boolean),
    ),
  ];
};

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

  const stateChapter = getA1LessonStateChapter(state);
  if (!SPLIT_A1_LESSON_DAYS.has(routeDay)) {
    return stateChapter !== requestedChapter;
  }

  // Split A1 days contain more than one chapter under the same day route. Keep a
  // correctly scoped card in place so opening it does not cause a visible remount.
  // Clear only stale or combined state that could display a sibling chapter's content.
  const entryChapter = normalizeChapter(state.entry.chapter);
  if (entryChapter && entryChapter !== requestedChapter) return true;
  if (stateChapter !== requestedChapter) return true;

  const resourceChapters = getA1LessonStateResourceChapters(state);
  if (!resourceChapters.length) return false;

  return resourceChapters.length !== 1 || resourceChapters[0] !== requestedChapter;
};
