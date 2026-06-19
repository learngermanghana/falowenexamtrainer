import {
  GUARDED_LEVELS,
  getConfiguredInAppWorkbookRoute,
  normalizeFalowenCourseRoute,
} from "./inAppWorkbookRoutes";

const normalizeLevel = (value = "") => String(value || "").trim().toUpperCase();

export const resolveStrictInAppWorkbookRoute = ({ level, day, chapter, fallback } = {}) => {
  const normalizedLevel = normalizeLevel(level);
  const configured = getConfiguredInAppWorkbookRoute({ level: normalizedLevel, day, chapter });
  if (configured) return configured;

  const internalFallback = normalizeFalowenCourseRoute(fallback);
  if (internalFallback) return internalFallback;

  if (GUARDED_LEVELS.has(normalizedLevel)) return "";
  return String(fallback || "").trim();
};
