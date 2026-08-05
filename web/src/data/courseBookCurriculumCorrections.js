import { A1_COURSE_BOOK_CARDS, getA1CourseBookCard } from "./a1CourseBookCards.js";

export const A1_DAY3_FULL_PRONOUNS_GRAMMAR_ROUTE =
  "/campus/course/a1-day-3-kapitel-1-2-grammar-notes";

// Kept for backwards compatibility with callers that imported the old
// corrections array. The authoritative values now come from one source:
// the generated canonical A1 course-book cards.
export const COURSE_BOOK_CURRICULUM_CORRECTIONS = A1_COURSE_BOOK_CARDS;

const normalizeLevel = (value = "") => String(value || "").trim().toUpperCase();
const normalizeChapter = (value = "") => String(value || "").trim();
const normalizeAssignmentId = (value = "") => String(value || "").trim().toUpperCase();
const normalizeTitle = (value = "") =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

const getEntryTitle = (entry = {}) =>
  entry.lessonTitle || entry.topic || entry.title || entry.assignmentTitle || "";

const isTutorMarkedCard = (card) => card?.assessmentType === "tutor-marked";

const cardMatchesResource = (resource = {}, card = {}) => {
  const chapter = normalizeChapter(resource.displayChapter || resource.chapter);
  const assignmentId = normalizeAssignmentId(
    resource.assignmentId || resource.assignment_id || resource.assignmentKey
  );
  const title = normalizeTitle(getEntryTitle(resource));

  if (chapter === normalizeChapter(card.chapter)) return true;
  if (assignmentId && assignmentId === normalizeAssignmentId(card.assignmentId)) return true;

  return (card.legacyMatches || []).some(
    (match) =>
      chapter === normalizeChapter(match.chapter) &&
      (!match.title || title === normalizeTitle(match.title))
  );
};

const applyCardToResource = (resource = {}, card = {}) => {
  if (!resource || typeof resource !== "object") return resource;
  if (!cardMatchesResource(resource, card)) return resource;

  const assignment = isTutorMarkedCard(card);
  return {
    ...resource,
    assignment,
    progressionEligible: assignment,
    assignmentId: card.assignmentId,
    assignment_id: card.assignmentId,
    assignmentKey: card.assignmentId,
    chapter: card.chapter,
    displayChapter: card.chapter,
    ...(card.title ? { topic: card.title, title: card.title } : {}),
    ...(hasOwn(card, "grammarPage") ? { grammarPage: card.grammarPage || "" } : {}),
    ...(hasOwn(card, "workbookRoute") ? { workbookRoute: card.workbookRoute || "" } : {}),
  };
};

const applyCardToEntry = (entry = {}, card = {}) => {
  if (!entry || typeof entry !== "object") return entry;
  const level = normalizeLevel(entry.level || entry.courseLevel || entry.course);
  if (level && level !== "A1") return entry;
  if (!cardMatchesResource(entry, card)) return entry;

  const assignment = isTutorMarkedCard(card);
  const corrected = {
    ...entry,
    assignment,
    progressionEligible: assignment,
    assignmentId: card.assignmentId,
    assignment_id: card.assignmentId,
    assignmentKey: card.assignmentId,
    chapter: card.chapter,
    displayChapter: card.chapter,
    ...(card.title ? { topic: card.title, title: card.title } : {}),
    ...(hasOwn(card, "grammarPage") ? { grammarPage: card.grammarPage || "" } : {}),
    ...(hasOwn(card, "workbookRoute") ? { workbookRoute: card.workbookRoute || "" } : {}),
  };

  ["resources", "primaryResource", "lesen_hören", "schreiben_sprechen"].forEach((field) => {
    if (!hasOwn(entry, field)) return;
    const value = entry[field];
    corrected[field] = Array.isArray(value)
      ? value.map((resource) => applyCardToResource(resource, card))
      : applyCardToResource(value, card);
  });

  return corrected;
};

export const applyCourseBookCurriculumCorrection = (entry = {}) => {
  const level = normalizeLevel(entry.level || entry.courseLevel || entry.course);
  if (level && level !== "A1") return entry;

  const card = getA1CourseBookCard({
    chapter: entry.displayChapter || entry.chapter,
    assignmentId: entry.assignmentId || entry.assignment_id || entry.assignmentKey,
    title: getEntryTitle(entry),
  });

  return card ? applyCardToEntry(entry, card) : entry;
};

export const applyAssignmentCatalogCurriculumCorrections = (entries = []) => {
  if (!Array.isArray(entries)) return entries;
  entries.forEach((entry, index) => {
    entries[index] = applyCourseBookCurriculumCorrection(entry);
  });
  return entries;
};
