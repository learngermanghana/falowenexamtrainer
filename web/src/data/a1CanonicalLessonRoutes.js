const A1_LESSON_ROOT = "/campus/course/lesson/A1";
const A1_CANONICAL_CHAPTER_SEGMENT = "chapter";

export const normalizeA1Chapter = (value = "") =>
  String(value || "")
    .trim()
    .replace(/^A1-/i, "")
    .toLowerCase();

export const buildA1CanonicalChapterLessonRoute = (chapter = "") => {
  const normalizedChapter = normalizeA1Chapter(chapter);
  if (!normalizedChapter) return "";
  return `${A1_LESSON_ROOT}/${A1_CANONICAL_CHAPTER_SEGMENT}/${encodeURIComponent(normalizedChapter)}`;
};

export const buildA1ShortChapterLessonRoute = (chapter = "") => {
  const normalizedChapter = normalizeA1Chapter(chapter);
  if (!normalizedChapter || !normalizedChapter.includes(".")) return "";
  return `${A1_LESSON_ROOT}/${encodeURIComponent(normalizedChapter)}`;
};

export const getA1LegacyLessonDay = (pathname = "") =>
  String(pathname || "").match(/^\/campus\/course\/lesson\/A1\/(\d+)\/?$/i)?.[1] || "";

export const getA1CanonicalLessonChapter = (pathname = "") => {
  const match = String(pathname || "").match(
    /^\/campus\/course\/lesson\/A1\/chapter\/([^/]+)\/?$/i,
  );
  if (!match?.[1]) return "";
  try {
    return normalizeA1Chapter(decodeURIComponent(match[1]));
  } catch (_error) {
    return normalizeA1Chapter(match[1]);
  }
};

export const getA1RequestedChapterFromSearch = (search = "") =>
  normalizeA1Chapter(new URLSearchParams(String(search || "")).get("chapter"));

export const removeA1ChapterFromSearch = (search = "") => {
  const params = new URLSearchParams(String(search || "").replace(/^\?/, ""));
  params.delete("chapter");
  const value = params.toString();
  return value ? `?${value}` : "";
};

export const mergeA1LessonSearchIntoWorkbookRoute = (workbookRoute = "", search = "") => {
  if (!workbookRoute) return "";
  const parsed = new URL(workbookRoute, "https://www.falowen.app");
  const incoming = new URLSearchParams(String(search || "").replace(/^\?/, ""));
  incoming.delete("chapter");

  incoming.forEach((value, key) => {
    if (!parsed.searchParams.has(key)) parsed.searchParams.set(key, value);
  });

  const query = parsed.searchParams.toString();
  return `${parsed.pathname}${query ? `?${query}` : ""}`;
};

export const isA1CanonicalChapterLessonRoute = (pathname = "") =>
  Boolean(getA1CanonicalLessonChapter(pathname));

export const __TESTING__ = {
  A1_CANONICAL_CHAPTER_SEGMENT,
  A1_LESSON_ROOT,
};
