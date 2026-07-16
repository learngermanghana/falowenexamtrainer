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

const parseA1IdentityChapter = (value = "") => {
  const match = String(value || "")
    .trim()
    .match(/^A1-(\d+(?:\.\d+)?)(?:-practice)?$/i);
  return normalizeChapter(match?.[1]);
};

export const getA1LessonStateIdentityChapter = (state = {}) => {
  const entry = state?.entry || {};
  const identities = [
    state?.canonicalAssignmentKey,
    state?.assignmentKey,
    state?.assignmentId,
    entry?.canonicalAssignmentId,
    entry?.canonicalAssignmentKey,
    entry?.assignmentId,
    entry?.assignment_id,
    entry?.assignmentKey,
    entry?.lessonId,
    entry?.courseBookId,
    entry?.id,
  ];

  for (const identity of identities) {
    const chapter = parseA1IdentityChapter(identity);
    if (chapter) return chapter;
  }

  return "";
};

export const getA1CorrectedChapterSpecificLessonSearch = ({
  pathname = "",
  search = "",
  state,
} = {}) => {
  const routeDay = getA1LessonRouteDay(pathname);
  if (!routeDay || !SPLIT_A1_LESSON_DAYS.has(routeDay) || !state?.entry) return "";

  const requestedChapter = getA1RequestedLessonChapter(search);
  const identityChapter = getA1LessonStateIdentityChapter(state);
  if (!requestedChapter || !identityChapter || identityChapter === requestedChapter) return "";

  const nextParams = new URLSearchParams(String(search || "").replace(/^\?/, ""));
  nextParams.set("chapter", identityChapter);
  const nextSearch = nextParams.toString();
  return nextSearch ? `?${nextSearch}` : "";
};

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
