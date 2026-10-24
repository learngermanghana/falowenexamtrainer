import {
  GUARDED_LEVELS,
  getConfiguredInAppWorkbookResourceRoute,
  normalizeFalowenCourseRoute,
} from "./inAppWorkbookRoutes";

const FALOWEN_ORIGIN = "https://www.falowen.app";
const normalizeLevel = (value = "") => String(value || "").trim().toUpperCase();

export const carryCompletedRadioQuery = (route = "", fallback = "") => {
  if (!route) return route;

  try {
    const fallbackUrl = new URL(String(fallback || ""), FALOWEN_ORIGIN);
    const preserveCompletedRadio = fallbackUrl.searchParams.get("radio") === "done";
    const preserveWorkbookView = fallbackUrl.searchParams.get("view") === "workbook";
    if (!preserveCompletedRadio && !preserveWorkbookView) return route;

    const routeUrl = new URL(route, FALOWEN_ORIGIN);
    if (routeUrl.origin !== FALOWEN_ORIGIN) return route;
    if (preserveCompletedRadio) routeUrl.searchParams.set("radio", "done");
    if (preserveWorkbookView) routeUrl.searchParams.set("view", "workbook");
    const query = routeUrl.searchParams.toString();
    return `${routeUrl.pathname}${query ? `?${query}` : ""}${routeUrl.hash || ""}`;
  } catch (_error) {
    return route;
  }
};

export const resolveStrictInAppWorkbookRoute = ({ level, day, chapter, fallback } = {}) => {
  const normalizedLevel = normalizeLevel(level);
  const configured = getConfiguredInAppWorkbookResourceRoute({ level: normalizedLevel, day, chapter });
  if (configured) return carryCompletedRadioQuery(configured, fallback);
  const internalFallback = normalizeFalowenCourseRoute(fallback);
  if (internalFallback) return internalFallback;
  if (GUARDED_LEVELS.has(normalizedLevel)) return "";
  return String(fallback || "").trim();
};
