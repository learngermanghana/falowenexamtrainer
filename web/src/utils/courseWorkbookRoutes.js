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

const resources = (entry = {}) => [entry, ...toArray(entry.lesen_hören), ...toArray(entry.schreiben_sprechen)];

export const buildWorkbookRouteIndex = (schedules = courseSchedules) => {
  const index = new Map();
  const resolver = schedules === courseSchedules ? resolveStrictInAppWorkbookRoute : resolveInAppWorkbookRoute;
  Object.entries(schedules).forEach(([level, entries]) => {
    toArray(entries).forEach((entry) => {
      resources(entry).forEach((item) => {
        const original = item?.workbook_link || item?.workbookRoute || "";
        const resolved = resolver({ level, day: entry?.day, chapter: item?.chapter || entry?.chapter, fallback: original });
        const pathname = normalizeInAppPath(resolved);
        if (!pathname || index.has(pathname)) return;
        const matched = normalizeInAppPath(original) === pathname ? item : { ...item, workbook_link: resolved, workbookRoute: resolved };
        index.set(pathname, { level, day: entry?.day, entry, resource: matched });
      });
    });
  });
  return index;
};
