import { normalizeInAppPath } from "./courseWorkbookRoutes";

export const A1_DAY6_WORKBOOK_PATH =
  "/campus/course/a1-day-6-family-and-hobbies-workbook";
export const A1_DAY12_WORKBOOK_PATH =
  "/campus/course/a1-day-12-24-hour-clock-and-dates-workbook";
export const A1_DAY16_CHAPTER9_WORKBOOK_PATH =
  "/campus/course/a1-day-16-food-and-negation-food-and-daily-life-workbook";
export const A1_DAY20_CHAPTER123_WORKBOOK_PATH =
  "/campus/course/letter-writing-intro-german-a1-day-12-3";
export const A1_DAY18_CHAPTER121_PATH =
  "/campus/course/two-case-prepositions-wechselpraepositionen-day-18";
export const A1_DAY18_CHAPTER122_GRAMMAR_PATH =
  "/campus/course/a1-12-2-dative-articles-mit-bei-zu";
export const A1_DAY18_CHAPTER122_WORKBOOK_PATH =
  "/campus/course/a1-day-18-kapitel-12-2-workbook";
export const A2_DAY20_WORKBOOK_PATH =
  "/campus/course/a2-day-20-typische-reklamationssituationen-workbook";
export const A2_DAY21_WORKBOOK_PATH =
  "/campus/course/a2-day-21-ein-wochenende-planen-workbook";
export const B1_DAY4_WORKBOOK_PATH =
  "/campus/course/b1-day-4-wohnung-suchen-workbook";

export const SELF_MANAGED_WORKBOOK_SUBMISSION_PATHS = new Set([
  "/campus/course/a1-day-2-german-alphabet-reviewing-workbook",
  "/campus/course/a1-day-2-kapitel-1-1-workbook",
  "/campus/course/a1-day-3-german-alphabet-reviewing-workbook",
  "/campus/course/a1-day-16-food-and-negation-kapitel-10-workbook",
  A1_DAY6_WORKBOOK_PATH,
  A1_DAY12_WORKBOOK_PATH,
  A1_DAY16_CHAPTER9_WORKBOOK_PATH,
  A1_DAY20_CHAPTER123_WORKBOOK_PATH,
  A1_DAY18_CHAPTER121_PATH,
  A1_DAY18_CHAPTER122_GRAMMAR_PATH,
  A1_DAY18_CHAPTER122_WORKBOOK_PATH,
  A2_DAY20_WORKBOOK_PATH,
  A2_DAY21_WORKBOOK_PATH,
  B1_DAY4_WORKBOOK_PATH,
]);

const GENERIC_GUIDE_SUPPRESSED_PATHS = new Set([
  A1_DAY12_WORKBOOK_PATH,
  A1_DAY16_CHAPTER9_WORKBOOK_PATH,
  A1_DAY20_CHAPTER123_WORKBOOK_PATH,
]);

export const shouldSuppressGenericWorkbookGuide = (pathname = "") =>
  GENERIC_GUIDE_SUPPRESSED_PATHS.has(normalizeInAppPath(pathname));

export const isSelfManagedB1LessonWorkbook = (pathname = "", search = "") => {
  const normalizedPathname = normalizeInAppPath(pathname);
  const requestedView = new URLSearchParams(search || "").get("view");
  return requestedView === "workbook"
    && /^\/campus\/course\/lesson\/b1\/(4|5)$/i.test(normalizedPathname);
};

export const shouldRenderWorkbookGuide = ({
  pathname = "",
  search = "",
  match,
} = {}) => {
  if (!match) return false;
  const normalizedPathname = normalizeInAppPath(pathname);
  const searchParams = new URLSearchParams(search || "");
  const requestedView = searchParams.get("view");

  if (shouldSuppressGenericWorkbookGuide(normalizedPathname)) return false;

  if (normalizedPathname === A1_DAY18_CHAPTER121_PATH) {
    return requestedView === "workbook";
  }
  if (normalizedPathname === A1_DAY18_CHAPTER122_GRAMMAR_PATH) {
    return requestedView === "workbook";
  }

  const isB1LessonRoute = normalizedPathname
    .toLowerCase()
    .startsWith("/campus/course/lesson/b1/");
  if (!isB1LessonRoute) return true;
  if (requestedView === "workbook") return true;

  const requestedChapter = String(searchParams.get("chapter") || "").trim();
  const matchedChapter = String(match?.resource?.chapter || match?.entry?.chapter || "").trim();
  return Boolean(requestedChapter && matchedChapter && requestedChapter === matchedChapter);
};
