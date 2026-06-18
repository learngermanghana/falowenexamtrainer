import { courseSchedules } from "../data/courseSchedule";

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

  Object.entries(schedules).forEach(([level, entries]) => {
    toArray(entries).forEach((entry) => {
      getWorkbookResources(entry).forEach((resource) => {
        const pathname = normalizeInAppPath(resource?.workbook_link);
        if (!pathname || index.has(pathname)) return;
        index.set(pathname, { level, day: entry?.day, entry, resource });
      });
    });
  });

  return index;
};
