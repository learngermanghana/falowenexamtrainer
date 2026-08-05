import { getA1GrammarRoute } from "./a1GrammarRoutes.js";
import {
  getConfiguredInAppWorkbookResourceRoute,
  normalizeFalowenCourseRoute,
} from "./inAppWorkbookRoutes.js";

const normalizeLevel = (value = "") => String(value || "").trim().toUpperCase();
const normalizeChapter = (value = "") => String(value || "").trim();
const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object || {}, key);
const firstPresent = (...values) =>
  values.find((value) => value !== undefined && value !== null && String(value).trim() !== "");

const alignCollection = (value, context) => {
  if (Array.isArray(value)) {
    return value.map((entry) => alignA1CurriculumEntry(entry, context));
  }
  if (value && typeof value === "object") {
    return alignA1CurriculumEntry(value, context);
  }
  return value;
};

export const resolveA1GrammarRoute = ({ day, chapter, fallback } = {}) => {
  const configured = getA1GrammarRoute({ day, chapter });
  if (configured) return configured;
  return normalizeFalowenCourseRoute(fallback);
};

export const resolveA1WorkbookRoute = ({ day, chapter, fallback } = {}) => {
  const configured = getConfiguredInAppWorkbookResourceRoute({
    level: "A1",
    day,
    chapter,
  });
  if (configured) return configured;
  return normalizeFalowenCourseRoute(fallback);
};

export const alignA1CurriculumEntry = (entry = {}, parentContext = {}) => {
  if (!entry || typeof entry !== "object") return entry;

  const level = normalizeLevel(
    firstPresent(entry.level, entry.courseLevel, entry.course, parentContext.level, "A1"),
  );
  if (level !== "A1") return entry;

  const day = Number(
    firstPresent(
      entry.displayDay,
      entry.assignmentDay,
      entry.day,
      parentContext.day,
    ),
  );
  const chapter = normalizeChapter(
    firstPresent(
      entry.displayChapter,
      entry.chapter,
      parentContext.chapter,
    ),
  );
  const context = { level: "A1", day, chapter };

  const grammarFallback = firstPresent(
    entry.grammarPage,
    entry.grammarbook_link,
    entry.grammar_link,
  );
  const workbookFallback = firstPresent(
    entry.workbookRoute,
    entry.workbook_link,
  );
  const grammarRoute = resolveA1GrammarRoute({
    day,
    chapter,
    fallback: grammarFallback,
  });
  const workbookRoute = resolveA1WorkbookRoute({
    day,
    chapter,
    fallback: workbookFallback,
  });

  const aligned = { ...entry };
  const hadGrammarField = ["grammarPage", "grammarbook_link", "grammar_link"].some((field) =>
    hasOwn(entry, field),
  );
  const hadWorkbookField = ["workbookRoute", "workbook_link"].some((field) =>
    hasOwn(entry, field),
  );

  if (grammarRoute || hadGrammarField) {
    aligned.grammarPage = grammarRoute || "";
    aligned.grammarbook_link = grammarRoute || null;
    aligned.grammar_link = grammarRoute || null;
  }
  if (workbookRoute || hadWorkbookField) {
    aligned.workbookRoute = workbookRoute || "";
    aligned.workbook_link = workbookRoute || null;
  }

  if (hasOwn(entry, "resources")) {
    aligned.resources = alignCollection(entry.resources, context);
  }
  if (hasOwn(entry, "primaryResource")) {
    aligned.primaryResource = alignCollection(entry.primaryResource, context);
  }
  if (hasOwn(entry, "lesen_hören")) {
    aligned.lesen_hören = alignCollection(entry.lesen_hören, context);
  }
  if (hasOwn(entry, "schreiben_sprechen")) {
    aligned.schreiben_sprechen = alignCollection(entry.schreiben_sprechen, context);
  }

  return aligned;
};

export const alignA1CurriculumEntries = (entries = []) =>
  (Array.isArray(entries) ? entries : []).map((entry) => {
    const level = normalizeLevel(entry?.level || entry?.courseLevel || entry?.course);
    return level === "A1" ? alignA1CurriculumEntry(entry) : entry;
  });
