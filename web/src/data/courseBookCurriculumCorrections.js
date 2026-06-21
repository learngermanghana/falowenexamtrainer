export const A1_DAY3_FULL_PRONOUNS_GRAMMAR_ROUTE =
  "/campus/course/a1-day-3-kapitel-1-2-grammar-notes";

export const COURSE_BOOK_CURRICULUM_CORRECTIONS = Object.freeze([
  Object.freeze({
    level: "A1",
    displayDay: 2,
    chapter: "0.2",
    assignmentId: "A1-0.2",
    title: "German Alphabet",
    grammarPage: "https://www.falowen.app/campus/course/german-alphabet-grammar-notes-day-2",
  }),
  Object.freeze({
    level: "A1",
    displayDay: 2,
    chapter: "1.1",
    assignmentId: "A1-1.1",
    title: "Personal Pronouns and Verb Conjugation",
    grammarPage: "/campus/course/singular-pronouns-verb-conjugation-day-2",
  }),
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

  // Day 16 appeared in older course-book data as chapter 7 with unrelated
  // titles. Match those stale labels and move each card to its real chapter.
  Object.freeze({
    level: "A1",
    displayDay: 16,
    matchChapter: "7",
    matchTitle: "Basic Prepositions",
    chapter: "9",
    assignmentId: "A1-9",
    title: "Negation",
  }),
  Object.freeze({
    level: "A1",
    displayDay: 16,
    matchChapter: "7",
    matchTitle: "Separable Verbs",
    chapter: "10",
    assignmentId: "A1-10",
    title: "Food",
  }),
  // Also correct the current source shape, where the chapters are right but
  // both child cards can inherit the parent title "Food and Negation".
  Object.freeze({
    level: "A1",
    displayDay: 16,
    matchChapter: "9",
    chapter: "9",
    assignmentId: "A1-9",
    title: "Negation",
  }),
  Object.freeze({
    level: "A1",
    displayDay: 16,
    matchChapter: "10",
    chapter: "10",
    assignmentId: "A1-10",
    title: "Food",
  }),

  // Day 18 also had stale chapter-9 labels. Correct both the stale and current
  // shapes while preserving each task's own practice/tutor-marked status.
  Object.freeze({
    level: "A1",
    displayDay: 18,
    matchChapter: "9",
    matchTitle: "The Imperative in German",
    chapter: "12.1",
    assignmentId: "A1-12.1",
    title: "Two Case Prepositions",
  }),
  Object.freeze({
    level: "A1",
    displayDay: 18,
    matchChapter: "9",
    matchTitle: "Transport and Giving Directions",
    chapter: "12.2",
    assignmentId: "A1-12.2",
    title: "Dative Prepositions",
  }),
  Object.freeze({
    level: "A1",
    displayDay: 18,
    matchChapter: "12.1",
    chapter: "12.1",
    assignmentId: "A1-12.1",
    title: "Two Case Prepositions",
  }),
  Object.freeze({
    level: "A1",
    displayDay: 18,
    matchChapter: "12.2",
    chapter: "12.2",
    assignmentId: "A1-12.2",
    title: "Dative Prepositions",
  }),
]);

const normalizeLevel = (value = "") => String(value || "").trim().toUpperCase();
const normalizeChapter = (value = "") => String(value || "").trim();
const normalizeAssignmentId = (value = "") => String(value || "").trim().toUpperCase();
const normalizeTitle = (value = "") =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

const getCorrectionMatchChapter = (correction = {}) =>
  normalizeChapter(correction.matchChapter || correction.chapter);

const correctionTitleMatches = (correction = {}, title = "") =>
  !correction.matchTitle || normalizeTitle(correction.matchTitle) === normalizeTitle(title);

export const getCourseBookCurriculumCorrection = ({
  level,
  displayDay,
  chapter,
  assignmentId,
  title,
} = {}) => {
  const normalizedLevel = normalizeLevel(level);
  const normalizedChapter = normalizeChapter(chapter);
  const normalizedAssignmentId = normalizeAssignmentId(assignmentId);
  const normalizedDisplayDay = Number(displayDay);
  const candidates = COURSE_BOOK_CURRICULUM_CORRECTIONS.filter(
    (correction) => correction.level === normalizedLevel
  );

  const locationMatch = candidates.find(
    (correction) =>
      Number(correction.displayDay) === normalizedDisplayDay &&
      getCorrectionMatchChapter(correction) === normalizedChapter &&
      correctionTitleMatches(correction, title)
  );
  if (locationMatch) return locationMatch;

  return (
    candidates.find(
      (correction) =>
        normalizedAssignmentId &&
        correction.assignmentId &&
        normalizeAssignmentId(correction.assignmentId) === normalizedAssignmentId &&
        (!Number.isFinite(normalizedDisplayDay) ||
          !Number.isFinite(Number(correction.displayDay)) ||
          Number(correction.displayDay) === normalizedDisplayDay)
    ) || null
  );
};

const taskIsPractice = (entry = {}) =>
  entry.assignment === false ||
  entry.tutorMarked === false ||
  entry.selfPractice === true ||
  entry.assessmentType === "self-practice" ||
  entry.submissionRequired === false;

const correctedAssignmentId = (entry, correction) => {
  if (!correction?.assignmentId) return null;
  if (!taskIsPractice(entry)) return correction.assignmentId;
  return /-practice$/i.test(correction.assignmentId)
    ? correction.assignmentId
    : `${correction.assignmentId}-practice`;
};

const patchResource = (resource, correction) => {
  if (!resource || typeof resource !== "object" || !correction) return resource;

  const patched = {
    ...resource,
    chapter: correction.chapter,
    displayChapter: correction.chapter,
    title: correction.title,
    topic: correction.title,
    assignmentTitle: correction.title,
  };

  if (hasOwn(correction, "grammarPage")) {
    patched.grammarPage = correction.grammarPage;
    patched.grammarbook_link = correction.grammarPage || null;
    patched.grammar_link = correction.grammarPage || null;
  }

  const assignmentId = correctedAssignmentId(resource, correction);
  if (assignmentId) {
    patched.assignmentId = assignmentId;
    patched.assignment_id = assignmentId;
  }

  return patched;
};

export const applyCourseBookCurriculumCorrection = (entry = {}, context = {}) => {
  if (!entry || typeof entry !== "object") return entry;

  const correction = getCourseBookCurriculumCorrection({
    level: context.level || entry.level || entry.courseLevel || entry.course,
    displayDay: context.displayDay ?? entry.displayDay ?? entry.day,
    chapter: context.chapter || entry.displayChapter || entry.chapter,
    assignmentId:
      context.assignmentId || entry.assignmentId || entry.assignment_id || entry.assignmentKey,
    title:
      context.title ||
      entry.lessonTitle ||
      entry.topic ||
      entry.title ||
      entry.assignmentTitle,
  });

  if (!correction) return entry;

  const patched = {
    ...entry,
    chapter: correction.chapter,
    displayChapter: correction.chapter,
    title: correction.title,
    topic: correction.title,
    lessonTitle: correction.title,
    assignmentTitle: correction.title,
  };

  const assignmentId = correctedAssignmentId(entry, correction);
  if (assignmentId) {
    patched.assignmentId = assignmentId;
    patched.assignment_id = assignmentId;
  }

  if (hasOwn(correction, "grammarPage")) {
    patched.grammarPage = correction.grammarPage;
    patched.grammarbook_link = correction.grammarPage || null;
    patched.grammar_link = correction.grammarPage || null;
  }

  return patched;
};

export const applyAssignmentCatalogCurriculumCorrections = (entries = []) => {
  COURSE_BOOK_CURRICULUM_CORRECTIONS.forEach((correction) => {
    const entry = entries.find((candidate) => {
      const candidateDay = Number(candidate.displayDay ?? candidate.assignmentDay ?? candidate.day);
      const candidateChapter = normalizeChapter(candidate.displayChapter || candidate.chapter);
      const candidateTitle =
        candidate.lessonTitle || candidate.topic || candidate.title || candidate.assignmentTitle;
      const assignmentMatches =
        correction.assignmentId &&
        normalizeAssignmentId(candidate.assignment_id || candidate.assignmentId) ===
          normalizeAssignmentId(correction.assignmentId) &&
        (!Number.isFinite(candidateDay) || candidateDay === Number(correction.displayDay));
      const locationMatches =
        candidateDay === Number(correction.displayDay) &&
        candidateChapter === getCorrectionMatchChapter(correction) &&
        correctionTitleMatches(correction, candidateTitle);

      return locationMatches || assignmentMatches;
    });

    if (!entry) return;

    const updates = {
      chapter: correction.chapter,
      displayChapter: correction.chapter,
      title: correction.title,
      topic: correction.title,
    };

    if (hasOwn(correction, "grammarPage")) {
      updates.grammarPage = correction.grammarPage;
    }

    const assignmentId = correctedAssignmentId(entry, correction);
    if (assignmentId) {
      updates.assignment_id = assignmentId;
      updates.assignmentId = assignmentId;
    }

    Object.assign(entry, updates);

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
