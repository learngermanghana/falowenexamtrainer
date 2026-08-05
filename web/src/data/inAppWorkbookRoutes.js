import routeConfig from "./inAppWorkbookRoutes.json" with { type: "json" };

const GUARDED_LEVELS = new Set(["A1", "A2"]);
const normalizeLevel = (value = "") => String(value || "").trim().toUpperCase();
const normalizeChapter = (value = "") => String(value || "").trim();
const A1_DAY18_CHAPTER122_WORKBOOK_ROUTE = "/campus/course/a1-12-2-dative-articles-mit-bei-zu?view=workbook";
const A1_DAY23_CHAPTER142_GRAMMAR_ROUTE = "/campus/course/dative-and-accusative-verbs-14-2";

const b1WorkbookLessonRoute = (day) => `/campus/course/lesson/B1/${day}?view=workbook`;

const B1_WORKBOOK_ROUTES = {
  "1": { "*": b1WorkbookLessonRoute(1) },
  "2": { "*": b1WorkbookLessonRoute(2) },
  "3": { "*": b1WorkbookLessonRoute(3) },
  "4": { "*": "/campus/course/b1-day-4-wohnung-suchen-workbook" },
  "5": { "*": b1WorkbookLessonRoute(5) },
  "6": { "*": b1WorkbookLessonRoute(6) },
  "7": { "*": b1WorkbookLessonRoute(7) },
  "8": { "*": b1WorkbookLessonRoute(8) },
  "9": { "*": b1WorkbookLessonRoute(9) },
  "10": { "*": b1WorkbookLessonRoute(10) },
  "11": { "*": b1WorkbookLessonRoute(11) },
  "12": { "4.12": b1WorkbookLessonRoute(12), "*": b1WorkbookLessonRoute(12) },
  "13": { "4.13": b1WorkbookLessonRoute(13), "*": b1WorkbookLessonRoute(13) },
  "14": { "5.14": b1WorkbookLessonRoute(14), "*": b1WorkbookLessonRoute(14) },
  "15": { "5.15": b1WorkbookLessonRoute(15), "*": b1WorkbookLessonRoute(15) },
  "16": { "5.16": b1WorkbookLessonRoute(16), "*": b1WorkbookLessonRoute(16) },
  "17": { "5.17": b1WorkbookLessonRoute(17), "*": b1WorkbookLessonRoute(17) },
  "18": { "6.18": b1WorkbookLessonRoute(18), "*": b1WorkbookLessonRoute(18) },
  "19": { "*": b1WorkbookLessonRoute(19) },
  "20": { "*": b1WorkbookLessonRoute(20) },
  "21": { "*": b1WorkbookLessonRoute(21) },
  "22": { "*": b1WorkbookLessonRoute(22) },
  "23": { "*": b1WorkbookLessonRoute(23) },
  "24": { "*": b1WorkbookLessonRoute(24) },
  "25": { "*": b1WorkbookLessonRoute(25) },
  "26": { "*": b1WorkbookLessonRoute(26) },
  "27": { "*": b1WorkbookLessonRoute(27) },
  "28": { "*": b1WorkbookLessonRoute(28) },
};

const stripFalowenOrigin = (value = "") => {
  const input = String(value || "").trim();
  if (!input) return "";
  try {
    const parsed = new URL(input, "https://www.falowen.app");
    if (/^(www\.)?falowen\.app$/i.test(parsed.hostname)) {
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
  } catch {
    return input;
  }
  return input;
};

export const normalizeFalowenCourseRoute = (value = "") => {
  const input = stripFalowenOrigin(value);
  if (!input) return "";
  if (!input.startsWith("/")) return input;
  return input.replace(/\/{2,}/g, "/");
};

const configuredRoutes = routeConfig?.routes || routeConfig || {};

const getConfiguredLevelRoutes = (level) => {
  const normalizedLevel = normalizeLevel(level);
  if (normalizedLevel === "B1") return B1_WORKBOOK_ROUTES;
  return configuredRoutes?.[normalizedLevel] || {};
};

export const getConfiguredInAppWorkbookResourceRoute = ({ level, day, chapter } = {}) => {
  const normalizedLevel = normalizeLevel(level);
  const dayKey = String(Number(day || 0));
  const chapterKey = normalizeChapter(chapter);
  const levelRoutes = getConfiguredLevelRoutes(normalizedLevel);
  const dayRoutes = levelRoutes?.[dayKey] || {};
  const configured = dayRoutes?.[chapterKey] || dayRoutes?.["*"] || "";
  if (normalizedLevel === "A1" && Number(day) === 18 && chapterKey === "12.2") {
    return A1_DAY18_CHAPTER122_WORKBOOK_ROUTE;
  }
  return normalizeFalowenCourseRoute(configured);
};

export const getConfiguredInAppGrammarResourceRoute = ({ level, day, chapter } = {}) => {
  const normalizedLevel = normalizeLevel(level);
  if (normalizedLevel === "A1" && Number(day) === 23 && normalizeChapter(chapter) === "14.2") {
    return A1_DAY23_CHAPTER142_GRAMMAR_ROUTE;
  }
  return "";
};

export const isGuardedWorkbookLevel = (level) => GUARDED_LEVELS.has(normalizeLevel(level));

export {
  A1_DAY18_CHAPTER122_WORKBOOK_ROUTE,
  A1_DAY23_CHAPTER142_GRAMMAR_ROUTE,
  B1_WORKBOOK_ROUTES,
};
