import {
  A1_DAY20_CHAPTER123_GRAMMAR_ROUTE,
  A1_DAY20_CHAPTER123_WORKBOOK_ROUTE,
} from "../data/a1Day20LetterWritingRoutes";

export const A1_WRITING_PRACTICE_AUTO_MOUNT_PATHS = new Set([
  "/campus/course/a1-day-21-weather-workbook",
  "/campus/course/a1-day-22-health-and-body-parts-workbook",
]);

export const normalizeA1CoursePracticePath = (pathname = "") =>
  String(pathname || "")
    .toLowerCase()
    .replace(/\/+$/, "") || "/";

export const shouldAutoMountA1WritingPractice = (pathname = "") =>
  A1_WRITING_PRACTICE_AUTO_MOUNT_PATHS.has(
    normalizeA1CoursePracticePath(pathname),
  );

export const isA1LetterWritingCourseBookPath = (pathname = "") =>
  normalizeA1CoursePracticePath(pathname) ===
  normalizeA1CoursePracticePath(A1_DAY20_CHAPTER123_WORKBOOK_ROUTE);

export const isA1LetterWritingGrammarPath = (pathname = "") =>
  normalizeA1CoursePracticePath(pathname) ===
  normalizeA1CoursePracticePath(A1_DAY20_CHAPTER123_GRAMMAR_ROUTE);
