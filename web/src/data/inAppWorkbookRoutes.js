import routeConfig from "./inAppWorkbookRoutes.json";

const GUARDED_LEVELS = new Set(["A1", "A2"]);
const normalizeLevel = (value = "") => String(value || "").trim().toUpperCase();
const normalizeChapter = (value = "") => String(value || "").trim();
const A1_DAY18_CHAPTER122_WORKBOOK_ROUTE = "/campus/course/a1-12-2-dative-articles-mit-bei-zu?view=workbook";

const b1WorkbookLessonRoute = (day) => `/campus/course/lesson/B1/${day}?view=workbook&radio=done`;

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

export const normalizeFalowenCourseRoute = (value = "") => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    const url = new URL(raw, "https://www.falowen.app");
    if (!["falowen.app", "www.falowen.app"].includes(url.hostname)) return "";
    if (!url.pathname.startsWith("/campus/course/")) return "";
    return `${url.pathname}${url.search}`;
  } catch {
    return "";
  }
};

export const getConfiguredInAppWorkbookRoute = ({ level, day, chapter } = {}) => {
  const normalizedLevel = normalizeLevel(level);
  const normalizedDay = String(Number(day));
  const normalizedChapter = normalizeChapter(chapter);

  if (normalizedLevel === "A1" && normalizedDay === "18" && normalizedChapter === "12.2") {
    return A1_DAY18_CHAPTER122_WORKBOOK_ROUTE;
  }

  if (normalizedLevel === "B1" && B1_WORKBOOK_ROUTES[normalizedDay]) {
    const dayRoutes = B1_WORKBOOK_ROUTES[normalizedDay];
    return dayRoutes[normalizedChapter] || dayRoutes["*"] || "";
  }

  const config = routeConfig?.[normalizedLevel]?.[normalizedDay];
  if (!config) return "";
  return config[normalizedChapter] || config["*"] || "";
};

export const resolveInAppWorkbookRoute = ({ level, day, chapter, fallback } = {}) => {
  const normalizedLevel = normalizeLevel(level);
  const internalFallback = normalizeFalowenCourseRoute(fallback);
  if (internalFallback) return internalFallback;
  const configured = getConfiguredInAppWorkbookRoute({ level: normalizedLevel, day, chapter });
  if (configured) return configured;
  if (GUARDED_LEVELS.has(normalizedLevel)) return "";
  return String(fallback || "").trim();
};

export const hasOnlyInAppWorkbookRoutesForLevel = (level) => {
  const config = routeConfig?.[normalizeLevel(level)] || {};
  return Object.values(config).every((dayConfig) =>
    Object.values(dayConfig || {}).every((route) => Boolean(normalizeFalowenCourseRoute(route)))
  );
};

export { A1_DAY18_CHAPTER122_WORKBOOK_ROUTE, GUARDED_LEVELS };
