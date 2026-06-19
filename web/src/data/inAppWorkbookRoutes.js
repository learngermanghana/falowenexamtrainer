import routeConfig from "../../../shared/inAppWorkbookRoutes.json";

const GUARDED_LEVELS = new Set(["A1", "A2"]);

const normalizeLevel = (value = "") => String(value || "").trim().toUpperCase();
const normalizeChapter = (value = "") => String(value || "").trim();

export const isGoogleDriveWorkbookLink = (value = "") =>
  /(^|\.)drive\.google\.com$/i.test((() => {
    try {
      return new URL(String(value || "").trim(), "https://www.falowen.app").hostname;
    } catch {
      return "";
    }
  })());

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
  const dayConfig = routeConfig?.[normalizedLevel]?.[String(Number(day))];
  if (!dayConfig) return "";

  const chapterToken = normalizeChapter(chapter);
  return dayConfig[chapterToken] || dayConfig["*"] || "";
};

export const resolveInAppWorkbookRoute = ({ level, day, chapter, fallback } = {}) => {
  const normalizedLevel = normalizeLevel(level);
  const configured = getConfiguredInAppWorkbookRoute({ level: normalizedLevel, day, chapter });
  if (configured) return configured;

  const normalizedFallback = normalizeFalowenCourseRoute(fallback);
  if (normalizedFallback) return normalizedFallback;

  if (GUARDED_LEVELS.has(normalizedLevel)) return "";
  return String(fallback || "").trim();
};

export const hasOnlyInAppWorkbookRoutesForLevel = (level) => {
  const normalizedLevel = normalizeLevel(level);
  const levelConfig = routeConfig?.[normalizedLevel] || {};
  return Object.values(levelConfig).every((dayConfig) =>
    Object.values(dayConfig || {}).every((route) => Boolean(normalizeFalowenCourseRoute(route)))
  );
};

export { GUARDED_LEVELS, routeConfig as IN_APP_WORKBOOK_ROUTES };
