import { getCurriculumEntriesForLevel } from "./curriculumManifest";

export const A1_DAY3_FULL_PRONOUNS_GRAMMAR_ROUTE =
  "/campus/course/a1-day-3-kapitel-1-2-grammar-notes";

export const COURSE_BOOK_CURRICULUM_CORRECTIONS = Object.freeze([
  Object.freeze({
    level: "A1",
    displayDay: 3,
    chapter: "1.1",
    assignmentId: "A1-1.1-practice",
    title: "Personal Pronouns and Verb Conjugation self-practice",
    grammarPage: "",
  }),
  Object.freeze({
    level: "A1",
    displayDay: 3,
    chapter: "1.2",
    assignmentId: "A1-1.2",
    title: "Introducing Yourself",
    grammarPage: A1_DAY3_FULL_PRONOUNS_GRAMMAR_ROUTE,
  }),
]);

const normalizeLevel = (value = "") => String(value || "").trim().toUpperCase();
const normalizeChapter = (value = "") => String(value || "").trim();
const normalizeAssignmentId = (value = "") => String(value || "").trim().toUpperCase();

const toTaskCount = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).length;
  return value && typeof value === "object" ? 1 : 0;
};

const isCombinedCourseBookEntry = (entry = {}) =>
  toTaskCount(entry.lesen_hören) + toTaskCount(entry.schreiben_sprechen) > 1;

export const getCourseBookCurriculumCorrection = ({
  level,
  displayDay,
  chapter,
  assignmentId,
} = {}) => {
  const normalizedLevel = normalizeLevel(level);
  const normalizedChapter = normalizeChapter(chapter);
  const normalizedAssignmentId = normalizeAssignmentId(assignmentId);
  const normalizedDisplayDay = Number(displayDay);

  return (
    COURSE_BOOK_CURRICULUM_CORRECTIONS.find((correction) => {
      if (correction.level !== normalizedLevel) return false;

      const assignmentMatches =
        normalizedAssignmentId &&
        normalizeAssignmentId(correction.assignmentId) === normalizedAssignmentId;
      const locationMatches =
        Number(correction.displayDay) === normalizedDisplayDay &&
        correction.chapter === normalizedChapter;

      return assignmentMatches || locationMatches;
    }) || null
  );
};

const getCanonicalCourseBookEntry = ({
  level,
  displayDay,
  chapter,
  assignmentId,
} = {}) => {
  const normalizedLevel = normalizeLevel(level);
  if (!normalizedLevel) return null;

  const entries = getCurriculumEntriesForLevel(normalizedLevel).filter(
    (entry) =>
      entry.displayDay !== undefined ||
      entry.displayChapter !== undefined ||
      entry.displayLabel
  );
  if (!entries.length) return null;

  const normalizedAssignmentId = normalizeAssignmentId(assignmentId);
  if (normalizedAssignmentId) {
    const assignmentMatch = entries.find(
      (entry) =>
        normalizeAssignmentId(entry.assignment_id || entry.assignmentId) ===
        normalizedAssignmentId
    );
    if (assignmentMatch) return assignmentMatch;
  }

  const normalizedDisplayDay = Number(displayDay);
  const dayMatches = entries.filter(
    (entry) => Number(entry.displayDay ?? entry.day) === normalizedDisplayDay
  );
  if (!dayMatches.length) return null;

  const normalizedChapter = normalizeChapter(chapter);
  if (normalizedChapter) {
    const chapterMatch = dayMatches.find(
      (entry) =>
        normalizeChapter(entry.displayChapter || entry.chapter) === normalizedChapter
    );
    if (chapterMatch) return chapterMatch;
  }

  return dayMatches.length === 1 ? dayMatches[0] : null;
};

const applyCorrectionFields = (entry, correction) => {
  if (!entry || typeof entry !== "object" || !correction) return entry;

  return {
    ...entry,
    chapter: correction.chapter,
    displayChapter: correction.chapter,
    title: correction.title,
    topic: correction.title,
    lessonTitle: correction.title,
    assignmentTitle: correction.title,
    assignmentId: correction.assignmentId,
    assignment_id: correction.assignmentId,
    grammarPage: correction.grammarPage,
    grammarbook_link: correction.grammarPage || null,
    grammar_link: correction.grammarPage || null,
  };
};

const applyCanonicalIdentity = (entry, canonical) => {
  if (!entry || typeof entry !== "object" || !canonical) return entry;

  const assignmentId =
    canonical.assignment_id || canonical.assignmentId || entry.assignmentId || entry.assignment_id;
  const grammarPage = canonical.grammarPage || entry.grammarPage || "";
  const workbookRoute = canonical.workbookRoute || entry.workbookRoute || entry.workbook_link || "";
  const video = canonical.video || entry.video || entry.youtube_link || "";

  return {
    ...entry,
    day: Number(canonical.day),
    assignmentDay: Number(canonical.day),
    displayDay: canonical.displayDay ?? entry.displayDay ?? canonical.day,
    chapter: canonical.chapter || entry.chapter,
    displayChapter:
      canonical.displayChapter || canonical.chapter || entry.displayChapter || entry.chapter,
    displayLabel: canonical.displayLabel || entry.displayLabel,
    title: canonical.title || entry.title,
    topic: canonical.title || entry.topic,
    lessonTitle: canonical.title || entry.lessonTitle,
    assignmentTitle: canonical.title || entry.assignmentTitle,
    assignmentId,
    assignment_id: assignmentId,
    canonicalAssignmentId: canonical.canonicalAssignmentId || assignmentId,
    grammarPage,
    grammarbook_link: grammarPage || null,
    grammar_link: grammarPage || null,
    workbookRoute,
    workbook_link: workbookRoute || null,
    video,
    youtube_link: video || null,
    progressionEligible:
      canonical.progressionEligible ?? entry.progressionEligible,
  };
};

const patchResource = (resource, correction) => {
  if (!resource || typeof resource !== "object" || !correction) return resource;

  return {
    ...resource,
    chapter: correction.chapter,
    title: correction.title,
    topic: correction.title,
    assignmentTitle: correction.title,
    grammarPage: correction.grammarPage,
    grammarbook_link: correction.grammarPage || null,
    grammar_link: correction.grammarPage || null,
    assignmentId: correction.assignmentId,
    assignment_id: correction.assignmentId,
  };
};

export const applyCourseBookCurriculumCorrection = (entry = {}, context = {}) => {
  if (!entry || typeof entry !== "object") return entry;

  const correction = getCourseBookCurriculumCorrection({
    level: context.level || entry.level || entry.courseLevel || entry.course,
    displayDay: context.displayDay ?? entry.displayDay ?? entry.day,
    chapter: context.chapter || entry.displayChapter || entry.chapter,
    assignmentId:
      context.assignmentId || entry.assignmentId || entry.assignment_id || entry.assignmentKey,
  });

  const correctedEntry = applyCorrectionFields(entry, correction);
  if (isCombinedCourseBookEntry(correctedEntry)) return correctedEntry;

  const canonical = getCanonicalCourseBookEntry({
    level: context.level || correctedEntry.level || correctedEntry.courseLevel || correctedEntry.course,
    displayDay:
      context.displayDay ?? correctedEntry.displayDay ?? correctedEntry.day,
    chapter:
      correction?.chapter ||
      context.chapter ||
      correctedEntry.displayChapter ||
      correctedEntry.chapter,
    assignmentId:
      correction?.assignmentId ||
      context.assignmentId ||
      correctedEntry.assignmentId ||
      correctedEntry.assignment_id ||
      correctedEntry.assignmentKey,
  });

  return applyCorrectionFields(
    applyCanonicalIdentity(correctedEntry, canonical),
    correction
  );
};

export const applyAssignmentCatalogCurriculumCorrections = (entries = []) => {
  COURSE_BOOK_CURRICULUM_CORRECTIONS.forEach((correction) => {
    const entry = entries.find(
      (candidate) =>
        normalizeAssignmentId(candidate.assignment_id || candidate.assignmentId) ===
          normalizeAssignmentId(correction.assignmentId) ||
        (Number(candidate.displayDay) === Number(correction.displayDay) &&
          normalizeChapter(candidate.chapter) === correction.chapter)
    );

    if (!entry) return;

    Object.assign(entry, {
      title: correction.title,
      topic: correction.title,
      grammarPage: correction.grammarPage,
    });
    if (Array.isArray(entry.resources)) {
      entry.resources = entry.resources.map((resource) => patchResource(resource, correction));
    }

    if (entry.primaryResource && typeof entry.primaryResource === "object") {
      entry.primaryResource = patchResource(entry.primaryResource, correction);
    }

    if (entry.lesen_hören) {
      entry.lesen_hören = Array.isArray(entry.lesen_hören)
        ? entry.lesen_hören.map((resource) => patchResource(resource, correction))
        : patchResource(entry.lesen_hören, correction);
    }

    if (entry.schreiben_sprechen) {
      entry.schreiben_sprechen = Array.isArray(entry.schreiben_sprechen)
        ? entry.schreiben_sprechen.map((resource) => patchResource(resource, correction))
        : patchResource(entry.schreiben_sprechen, correction);
    }
  });

  return entries;
};
