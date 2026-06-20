export const A1_DAY3_FULL_PRONOUNS_GRAMMAR_ROUTE =
  "/campus/course/a1-day-3-kapitel-1-2-grammar-notes";

export const COURSE_BOOK_CURRICULUM_CORRECTIONS = Object.freeze([
  Object.freeze({
    level: "A1",
    displayDay: 3,
    chapter: "1.1",
    assignmentId: "A1-1.1-practice",
    title: "Personal Information, Articles, Adjectives and W-Questions",
    grammarPage: "",
  }),
  Object.freeze({
    level: "A1",
    displayDay: 3,
    chapter: "1.2",
    assignmentId: "A1-1.2",
    title: "Personal Pronouns and Verb Conjugation",
    grammarPage: A1_DAY3_FULL_PRONOUNS_GRAMMAR_ROUTE,
  }),
]);

const normalizeLevel = (value = "") => String(value || "").trim().toUpperCase();
const normalizeChapter = (value = "") => String(value || "").trim();
const normalizeAssignmentId = (value = "") => String(value || "").trim().toUpperCase();

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

  if (!correction) return entry;

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
