const normalizeChapter = (value = "") => String(value || "").trim();

export const getA1RequestedLessonChapter = (search = "") =>
  normalizeChapter(new URLSearchParams(String(search || "")).get("chapter"));

export const getA1LessonStateChapter = (state = {}) =>
  normalizeChapter(
    state?.entry?.displayChapter ||
      state?.entry?.chapter ||
      state?.displayChapter ||
      state?.chapter,
  );

export const shouldResetA1ChapterSpecificLessonState = ({
  pathname = "",
  search = "",
  state,
} = {}) => {
  if (!/^\/campus\/course\/lesson\/A1\/\d+\/?$/i.test(String(pathname || ""))) {
    return false;
  }

  const requestedChapter = getA1RequestedLessonChapter(search);
  if (!requestedChapter || !state?.entry) return false;

  return getA1LessonStateChapter(state) !== requestedChapter;
};
