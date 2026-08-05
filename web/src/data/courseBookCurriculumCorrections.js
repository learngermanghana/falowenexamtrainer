import { A1_COURSE_BOOK_CARDS, getA1CourseBookCard } from "./a1CourseBookCards";

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

const applyCardIdentity = (entry = {}, card = {}) => {
  if (!entry || typeof entry !== "object" || !card) return entry;

  const tutorMarked = isTutorMarkedCard(card);
  const patched = {
    ...entry,
    level: entry.level || "A1",
    lessonId: card.lessonId,
    courseBookId: card.lessonId,
    chapter: card.chapter,
    displayChapter: card.chapter,
    displayDay: Number(card.displayDay),
    displayLabel: card.displayLabel,
    title: card.title,
    topic: card.title,
    lessonTitle: card.title,
    assignmentTitle: card.title,
    assignmentId: card.assignmentId,
    assignment_id: card.assignmentId,
    resourceSection: card.resourceSection,
    courseBookTaskSection: card.resourceSection,
    assessmentType: card.assessmentType,
    assignment: tutorMarked,
    tutorMarked,
    selfPractice: !tutorMarked,
    submissionRequired: Boolean(card.submissionRequired),
    progressionEligible: Boolean(card.progressionEligible),
  };

  ["grammarPage", "workbookRoute", "video"].forEach((field) => {
    if (hasOwn(card, field)) patched[field] = card[field];
  });

  if (hasOwn(card, "grammarPage")) {
    patched.grammarbook_link = card.grammarPage || null;
    patched.grammar_link = card.grammarPage || null;
  }
  if (hasOwn(card, "workbookRoute")) {
    patched.workbook_link = card.workbookRoute || null;
  }

  return patched;
};

const patchResourceCollection = (value, card) => {
  if (!value) return value;
  if (Array.isArray(value)) {
    const matchingIndexes = value
      .map((resource, index) => (cardMatchesResource(resource, card) ? index : -1))
      .filter((index) => index >= 0);
    if (!matchingIndexes.length && value.length === 1) return [applyCardIdentity(value[0], card)];
    return value.map((resource, index) =>
      matchingIndexes.includes(index) ? applyCardIdentity(resource, card) : resource
    );
  }
  return cardMatchesResource(value, card) ? applyCardIdentity(value, card) : value;
};

export const getCourseBookCurriculumCorrection = ({
  level,
  displayDay,
  chapter,
  assignmentId,
  title,
} = {}) => {
  if (normalizeLevel(level) !== "A1") return null;
  return getA1CourseBookCard({ displayDay, chapter, assignmentId, title });
};

export const applyCourseBookCurriculumCorrection = (entry = {}, context = {}) => {
  if (!entry || typeof entry !== "object") return entry;

  const level = normalizeLevel(context.level || entry.level || entry.courseLevel || entry.course);
  if (level !== "A1") return entry;

  const card = getA1CourseBookCard({
    displayDay: context.displayDay ?? entry.displayDay ?? entry.day,
    chapter: context.chapter || entry.displayChapter || entry.chapter,
    assignmentId:
      context.assignmentId || entry.assignmentId || entry.assignment_id || entry.assignmentKey,
    title: context.title || getEntryTitle(entry),
  });

  return card ? applyCardIdentity(entry, card) : entry;
};

const createCatalogEntry = (card) => {
  const tutorMarked = isTutorMarkedCard(card);
  const resource = applyCardIdentity(
    {
      kind: card.resourceSection,
      grammarPage: card.grammarPage || "",
      workbookRoute: card.workbookRoute || "",
      video: card.video || "",
    },
    card
  );

  return applyCardIdentity(
    {
      level: "A1",
      day: Number(card.displayDay),
      assignmentDay: Number(card.displayDay),
      resources: [resource],
      lesen_hören: card.resourceSection === "lesen_hören" ? [resource] : [],
      schreiben_sprechen: card.resourceSection === "schreiben_sprechen" ? [resource] : [],
      primaryResource: resource,
      mode: card.resourceSection === "lesen_hören" ? "Lesen & Hören" : "Schreiben & Sprechen",
      type: card.resourceSection === "lesen_hören" ? "Lesen & Hören" : "Schreiben & Sprechen",
      assignmentType:
        card.resourceSection === "lesen_hören" ? "Lesen & Hören" : "Schreiben & Sprechen",
      assignment: tutorMarked,
    },
    card
  );
};

export const applyAssignmentCatalogCurriculumCorrections = (entries = []) => {
  A1_COURSE_BOOK_CARDS.forEach((card) => {
    const entry = entries.find((candidate) => {
      const level = normalizeLevel(candidate.level || candidate.courseLevel || candidate.course);
      if (level && level !== "A1") return false;

      const candidateDay = Number(
        candidate.displayDay ?? candidate.assignmentDay ?? candidate.day
      );
      const candidateChapter = normalizeChapter(
        candidate.displayChapter || candidate.chapter
      );
      const candidateAssignmentId = normalizeAssignmentId(
        candidate.assignment_id || candidate.assignmentId
      );

      return (
        (candidateDay === Number(card.displayDay) && candidateChapter === card.chapter) ||
        (candidateAssignmentId &&
          candidateAssignmentId === normalizeAssignmentId(card.assignmentId) &&
          (!Number.isFinite(candidateDay) || candidateDay === Number(card.displayDay))) ||
        (candidateDay === Number(card.displayDay) &&
          (card.legacyMatches || []).some(
            (match) =>
              candidateChapter === normalizeChapter(match.chapter) &&
              (!match.title || normalizeTitle(getEntryTitle(candidate)) === normalizeTitle(match.title))
          ))
      );
    });

    if (!entry) {
      entries.push(createCatalogEntry(card));
      return;
    }

    Object.assign(entry, applyCardIdentity(entry, card));

    if (Array.isArray(entry.resources)) {
      entry.resources = patchResourceCollection(entry.resources, card);
    }
    if (entry.primaryResource && typeof entry.primaryResource === "object") {
      entry.primaryResource = applyCardIdentity(entry.primaryResource, card);
    }
    if (entry.lesen_hören) {
      entry.lesen_hören = patchResourceCollection(entry.lesen_hören, card);
    }
    if (entry.schreiben_sprechen) {
      entry.schreiben_sprechen = patchResourceCollection(entry.schreiben_sprechen, card);
    }
  });

  return entries;
};
