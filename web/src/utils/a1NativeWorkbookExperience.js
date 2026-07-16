const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";

export const A1_NATIVE_STABLE_WORKBOOK_PATHS = new Set([
  "/campus/course/a1-day-2-german-alphabet-reviewing-workbook",
]);

export const shouldUseNativeA1WorkbookExperience = (pathname = "") =>
  A1_NATIVE_STABLE_WORKBOOK_PATHS.has(normalizePath(pathname));

export const __TESTING__ = { normalizePath };
