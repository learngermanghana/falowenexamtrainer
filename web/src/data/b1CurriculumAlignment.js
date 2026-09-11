import { getB1LessonResourceOverride } from "./b1LessonResourceOverrides";
import { getB1Days23To28LessonMetadata } from "./b1Days23To28LessonMetadata";

const FIRST_B1_CLEANUP_DAYS = new Set([
  ...Array.from({ length: 12 }, (_, index) => index + 1),
  ...Array.from({ length: 12 }, (_, index) => index + 17),
]);
const normalizeLevel = (value = "") => String(value || "").trim().toUpperCase();
const firstPresent = (...values) =>
  values.find((value) => value !== undefined && value !== null && String(value).trim() !== "");

const alignCollection = (value, context) => {
  if (Array.isArray(value)) return value.map((entry) => alignB1CurriculumEntry(entry, context));
  if (value && typeof value === "object") return alignB1CurriculumEntry(value, context);
  return value;
};

export const alignB1CurriculumEntry = (entry = {}, parentContext = {}) => {
  if (!entry || typeof entry !== "object") return entry;

  const level = normalizeLevel(
    firstPresent(entry.level, entry.courseLevel, entry.course, parentContext.level, "B1"),
  );
  if (level !== "B1") return entry;

  const day = Number(
    firstPresent(entry.displayDay, entry.assignmentDay, entry.day, parentContext.day),
  );
  if (!FIRST_B1_CLEANUP_DAYS.has(day)) return entry;

  const override = getB1LessonResourceOverride(day);
  if (!override) return entry;

  const lessonMetadata = getB1Days23To28LessonMetadata(day);
  const isTopLevel = parentContext.day === undefined || parentContext.day === null;
  const aligned = { ...entry };
  const grammarRoute = String(override.grammarBook || "").trim();
  const workbookRoute = String(override.workbook || "").trim();

  if (grammarRoute) {
    aligned.grammarNotesPage = grammarRoute;
    aligned.grammarPage = grammarRoute;
    aligned.grammarbook_link = grammarRoute;
    aligned.grammar_link = grammarRoute;
  } else if (
    Object.prototype.hasOwnProperty.call(override, "grammarBook") ||
    lessonMetadata?.workbookOnly
  ) {
    aligned.grammarNotesPage = null;
    aligned.grammarPage = null;
    aligned.grammarbook_link = null;
    aligned.grammar_link = null;
  }
  if (workbookRoute) {
    aligned.workbookPage = workbookRoute;
    aligned.workbookRoute = workbookRoute;
    aligned.workbook_link = workbookRoute;
  }

  if (isTopLevel && lessonMetadata) {
    aligned.topic = lessonMetadata.title;
    aligned.goal = lessonMetadata.goal;
    aligned.instruction = lessonMetadata.instruction;
    if (!aligned.chapter) aligned.chapter = lessonMetadata.chapter;
  }

  const context = { level: "B1", day };
  ["resources", "primaryResource", "lesen_hören", "schreiben_sprechen"].forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(entry, field)) {
      aligned[field] = alignCollection(entry[field], context);
    }
  });

  return aligned;
};

export const alignB1CurriculumEntries = (entries = []) =>
  (Array.isArray(entries) ? entries : []).map((entry) => {
    const level = normalizeLevel(entry?.level || entry?.courseLevel || entry?.course);
    return level === "B1" ? alignB1CurriculumEntry(entry) : entry;
  });

export { FIRST_B1_CLEANUP_DAYS };
