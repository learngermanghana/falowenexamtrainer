const normalizeChapter = (value = "") => String(value || "").trim();
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

/**
 * Deprecated compatibility helper.
 *
 * Chapter URLs are authoritative. Navigation state must never rewrite the
 * requested chapter, even when that state belongs to a sibling assignment.
 */
export const getA1CorrectedChapterSpecificLessonSearch = () => "";

/**
 * Old day-based routes may still arrive with React Router state from a Course
 * Book card. Clear that state whenever the URL already declares a chapter so
 * the rendered lesson cannot inherit sibling content from browser history.
 */
export const shouldResetA1ChapterSpecificLessonState = ({
  pathname = "",
  search = "",
  state,
} = {}) => {
  const routeDay = getA1LessonRouteDay(pathname);
  if (!routeDay) return false;

  const requestedChapter = getA1RequestedLessonChapter(search);
  return Boolean(requestedChapter && state?.entry);
};
