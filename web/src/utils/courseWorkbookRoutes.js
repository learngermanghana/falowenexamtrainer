import { courseSchedules } from "../data/courseSchedule";
import { resolveInAppWorkbookRoute } from "../data/inAppWorkbookRoutes";
import { resolveStrictInAppWorkbookRoute } from "../data/strictInAppWorkbookRoutes";

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

export const normalizeInAppPath = (link = "") => {
  const value = String(link || "").trim();
  if (!value) return "";

  try {
    const url = new URL(value, "https://www.falowen.app");
    if (!["falowen.app", "www.falowen.app"].includes(url.hostname)) return "";
    return url.pathname.replace(/\/+$/, "") || "/";
  } catch {
    return "";
  }
};

const getWorkbookResources = (entry = {}) => [
  entry,
  ...toArray(entry.lesen_hören),
  ...toArray(entry.schreiben_sprechen),
];

export const buildWorkbookRouteIndex = (schedules = courseSchedules) => {
  const index = new Map();
  const resolveRoute = schedules === courseSchedules
    ? resolveStrictInAppWorkbookRoute
    : resolveInAppWorkbookRoute;

  Object.entries(schedules).forEach(([level, entries]) => {
    toArray(entries).forEach((entry) => {
      getWorkbookResources(entry).forEach((resource) => {
        const originalRoute = resource?.workbook_link || resource?.workbookRoute || "";
        const originalPath = normalizeInAppPath(originalRoute);
        const resolvedRoute = resolveRoute({
          level,
          day: entry?.day,
          chapter: resource?.chapter || entry?.chapter,
          fallback: originalRoute,
        });
        const pathname = normalizeInAppPath(resolvedRoute);
        if (!pathname || index.has(pathname)) return;
        const matchedResource = originalPath === pathname
          ? resource
          : { ...resource, workbook_link: resolvedRoute, workbookRoute: resolvedRoute };
        index.set(pathname, { level, day: entry?.day, entry, resource: matchedResource });
      });
    });
  });

  return index;
};
