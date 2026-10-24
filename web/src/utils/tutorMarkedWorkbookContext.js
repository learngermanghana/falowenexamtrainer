import { getConfiguredInAppWorkbookResourceRoute } from "../data/inAppWorkbookRoutes";
import { getInlineCourseAssignments } from "./courseLessonAssignments";
import { normalizeInAppPath } from "./courseWorkbookRoutes";

const routeMatchesLocation = (route = "", pathname = "", search = "") => {
  if (!route) return false;
  const target = new URL(route, "https://www.falowen.app");
  if (normalizeInAppPath(target.pathname) !== normalizeInAppPath(pathname)) return false;

  const currentParams = new URLSearchParams(search || "");
  for (const [key, value] of target.searchParams.entries()) {
    if (currentParams.get(key) !== value) return false;
  }
  return true;
};

export const resolveTutorMarkedWorkbookAssignment = ({
  level = "",
  day = null,
  pathname = "",
  search = "",
} = {}) => {
  const normalizedLevel = String(level || "").trim().toUpperCase();
  const numericDay = Number(day);
  if (!["A1", "A2", "B1"].includes(normalizedLevel) || !Number.isFinite(numericDay)) {
    return null;
  }

  const assignments = getInlineCourseAssignments(normalizedLevel, numericDay);
  return assignments.find((assignment) => {
    const route = getConfiguredInAppWorkbookResourceRoute({
      level: normalizedLevel,
      day: numericDay,
      chapter: assignment.chapter,
    });
    return routeMatchesLocation(route, pathname, search);
  }) || null;
};

export { routeMatchesLocation };
