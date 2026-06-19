import routeConfig from "./inAppWorkbookRoutes.json";

const GUARDED_LEVELS = new Set(["A1", "A2"]);
const normalizeLevel = (value = "") => String(value || "").trim().toUpperCase();
const normalizeChapter = (value = "") => String(value || "").trim();

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
  const config = routeConfig?.[normalizeLevel(level)]?.[String(Number(day))];
  if (!config) return "";
  return config[normalizeChapter(chapter)] || config["*"] || "";
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

export { GUARDED_LEVELS };
