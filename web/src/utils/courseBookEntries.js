import { applyCourseBookCurriculumCorrection } from "../data/courseBookCurriculumCorrections";

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const TASK_SECTIONS = ["schreiben_sprechen", "lesen_hören"];
const SELF_LEARNING_LEVELS = new Set(["B2", "C1"]);

export const COURSE_BOOK_RESOURCE_TYPES = {
  lesson: "lesson",
  mixed: "mixed",
  readingListening: "reading-listening",
  writingSpeaking: "writing-speaking",
};

export const COURSE_BOOK_ASSESSMENT_TYPES = {
  tutorMarked: "tutor-marked",
  selfPractice: "self-practice",
};

const normalizeToken = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "");

const firstPresent = (...values) =>
  values.find((value) => value !== undefined && value !== null && String(value).trim() !== "");

const normalizeDay = (...values) => {
  const value = firstPresent(...values);
  if (value === undefined) return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : value;
};

const normalizeChapter = (...values) => {
  const value = firstPresent(...values);
  return value === undefined ? null : String(value).trim() || null;
};

const getAssignmentId = (entry = {}, parentEntry = {}) => {
  const direct = firstPresent(entry.assignmentId, entry.assignment_id, entry.assignmentKey);
  if (direct !== undefined) return String(direct).trim() || null;

  // A self-practice task must not inherit the assignment ID of a tutor-marked sibling.
  if (entry.assignment === false) return null;

  const inherited = firstPresent(
    parentEntry.assignmentId,
    parentEntry.assignment_id,
    parentEntry.assignmentKey
  );
  return inherited === undefined ? null : String(inherited).trim() || null;
};

const getEntryLevel = (entry = {}, parentEntry = {}, requestedLevel = "") => {
  const explicit = firstPresent(
    requestedLevel,
    entry.courseLevel,
    entry.level,
    entry.course,
    parentEntry.courseLevel,
    parentEntry.level,
    parentEntry.course
  );
  const assignmentId = firstPresent(
    entry.assignmentId,
    entry.assignment_id,
    entry.assignmentKey,
    parentEntry.assignmentId,
    parentEntry.assignment_id,
    parentEntry.assignmentKey
  );
  const source = `${explicit || ""} ${assignmentId || ""}`.toUpperCase();
  return source.match(/\b(A1|A2|B1|B2|C1|C2)\b/)?.[1] || null;
};

const collectionHasTutorMarkedWork = (value) =>
  toArray(value).some(
    (lesson) =>
      lesson?.assignment === true ||
      lesson?.tutorMarked === true ||
      lesson?.submissionRequired === true ||
      lesson?.assessmentType === COURSE_BOOK_ASSESSMENT_TYPES.tutorMarked
  );

const getTutorMarkedState = (entry = {}, parentEntry = {}, level = null) => {
  const explicitAssignment = entry.assignment;
  const hasTutorMarkedWork =
    explicitAssignment === true ||
    entry.tutorMarked === true ||
    entry.submissionRequired === true ||
    entry.assessmentType === COURSE_BOOK_ASSESSMENT_TYPES.tutorMarked ||
    collectionHasTutorMarkedWork(entry.lesen_hören) ||
    collectionHasTutorMarkedWork(entry.schreiben_sprechen);

  const inheritedTutorMarked =
    explicitAssignment === undefined &&
    !entry.assessmentType &&
    (parentEntry.assignment === true ||
      parentEntry.tutorMarked === true ||
      parentEntry.submissionRequired === true ||
      parentEntry.assessmentType === COURSE_BOOK_ASSESSMENT_TYPES.tutorMarked);

  if (level && SELF_LEARNING_LEVELS.has(level)) return false;
  if (explicitAssignment === false) return false;
  return hasTutorMarkedWork || inheritedTutorMarked;
};

const getResourceType = (entry = {}, requestedType = "") => {
  const explicit = firstPresent(requestedType, entry.resourceType, entry.courseBookTaskSection);
  if (explicit === "lesen_hören" || explicit === COURSE_BOOK_RESOURCE_TYPES.readingListening) {
    return COURSE_BOOK_RESOURCE_TYPES.readingListening;
  }
  if (explicit === "schreiben_sprechen" || explicit === COURSE_BOOK_RESOURCE_TYPES.writingSpeaking) {
    return COURSE_BOOK_RESOURCE_TYPES.writingSpeaking;
  }
  if (explicit === COURSE_BOOK_RESOURCE_TYPES.mixed || explicit === COURSE_BOOK_RESOURCE_TYPES.lesson) {
    return explicit;
  }

  const hasReadingListening = toArray(entry.lesen_hören).length > 0;
  const hasWritingSpeaking = toArray(entry.schreiben_sprechen).length > 0;
  if (hasReadingListening && hasWritingSpeaking) return COURSE_BOOK_RESOURCE_TYPES.mixed;
  if (hasReadingListening) return COURSE_BOOK_RESOURCE_TYPES.readingListening;
  if (hasWritingSpeaking) return COURSE_BOOK_RESOURCE_TYPES.writingSpeaking;
  return COURSE_BOOK_RESOURCE_TYPES.lesson;
};

const getLessonTitle = (entry = {}, parentEntry = {}, day = null) =>
  String(
    firstPresent(
      entry.lessonTitle,
      entry.topic,
      entry.title,
      entry.assignmentTitle,
      parentEntry.lessonTitle,
      parentEntry.topic,
      parentEntry.title,
      parentEntry.assignmentTitle,
      day === null ? "Lesson" : `Day ${day}`
    )
  ).trim();

const normalizeLessonCollection = (value, parentEntry, section, level) => {
  if (Array.isArray(value)) {
    return value.map((lesson) =>
      normalizeCourseBookEntry(lesson, {
        parentEntry,
        resourceType: section,
        level,
        normalizeResources: false,
      })
    );
  }
  if (value && typeof value === "object") {
    return normalizeCourseBookEntry(value, {
      parentEntry,
      resourceType: section,
      level,
      normalizeResources: false,
    });
  }
  return value;
};

/**
 * Converts old and new curriculum records into one stable Course Book shape.
 * Legacy aliases are retained so existing assignment and route lookups continue to work.
 */
export const normalizeCourseBookEntry = (entry = {}, options = {}) => {
  if (!entry || typeof entry !== "object") return entry;

  const parentEntry = options.parentEntry || {};
  const day = normalizeDay(entry.day, entry.assignmentDay, parentEntry.day, parentEntry.assignmentDay);
  const displayDay = normalizeDay(
    entry.displayDay,
    parentEntry.displayDay,
    day
  );
  const chapter = normalizeChapter(
    entry.chapter,
    entry.displayChapter,
    parentEntry.chapter,
    parentEntry.displayChapter
  );
  const displayChapter = normalizeChapter(entry.displayChapter, chapter);
  const assignmentId = getAssignmentId(entry, parentEntry);
  const level = getEntryLevel(entry, parentEntry, options.level);
  const tutorMarked = getTutorMarkedState(entry, parentEntry, level);
  const assessmentType = tutorMarked
    ? COURSE_BOOK_ASSESSMENT_TYPES.tutorMarked
    : COURSE_BOOK_ASSESSMENT_TYPES.selfPractice;
  const lessonTitle = getLessonTitle(entry, parentEntry, displayDay);
  const resourceType = getResourceType(entry, options.resourceType);

  const normalized = applyCourseBookCurriculumCorrection(
    {
      ...entry,
      day,
      displayDay,
      chapter,
      displayChapter,
      assignmentId,
      assignment_id: assignmentId,
      lessonTitle,
      resourceType,
      assessmentType,
      tutorMarked,
      selfPractice: !tutorMarked,
      submissionRequired: tutorMarked,
    },
    { level, displayDay, chapter, assignmentId }
  );

  if (options.normalizeResources === false) return normalized;

  return {
    ...normalized,
    lesen_hören: normalizeLessonCollection(normalized.lesen_hören, normalized, "lesen_hören", level),
    schreiben_sprechen: normalizeLessonCollection(
      normalized.schreiben_sprechen,
      normalized,
      "schreiben_sprechen",
      level
    ),
  };
};

export const normalizeCourseBookEntries = (entries = [], options = {}) =>
  toArray(entries).map((entry) => normalizeCourseBookEntry(entry, options));

const getTaskChapter = (task = {}, entry = {}) =>
  normalizeChapter(task.chapter, task.displayChapter, entry.displayChapter, entry.chapter);

const getTaskAssignmentId = (task = {}, entry = {}) =>
  getAssignmentId(task, entry);

const getTaskTitle = (task = {}, entry = {}) =>
  getLessonTitle(task, entry, entry.displayDay ?? entry.day);

export const expandCourseBookEntry = (entry = {}, options = {}) => {
  const normalizedEntry = normalizeCourseBookEntry(entry, options);
  const tasks = TASK_SECTIONS.flatMap((section) =>
    toArray(normalizedEntry?.[section]).filter(Boolean).map((task) => ({ section, task }))
  );

  if (tasks.length <= 1) return [normalizedEntry];

  return tasks.map(({ section, task }, index) => {
    const chapter = getTaskChapter(task, normalizedEntry);
    const assignmentId = getTaskAssignmentId(task, normalizedEntry);
    const assignment = task.assignment === undefined ? Boolean(normalizedEntry.assignment) : Boolean(task.assignment);

    return normalizeCourseBookEntry(
      {
        ...normalizedEntry,
        topic: getTaskTitle(task, normalizedEntry),
        title: task.title || task.topic || normalizedEntry.title,
        lessonTitle: getTaskTitle(task, normalizedEntry),
        chapter,
        displayChapter: chapter,
        assignment,
        progressionEligible:
          task.progressionEligible === undefined
            ? normalizedEntry.progressionEligible
            : task.progressionEligible,
        assignmentId,
        assignment_id: assignmentId,
        lesen_hören: section === "lesen_hören" ? task : undefined,
        schreiben_sprechen: section === "schreiben_sprechen" ? task : undefined,
        courseBookTaskIndex: index + 1,
        courseBookTaskSection: section,
      },
      {
        ...options,
        parentEntry: normalizedEntry,
        resourceType: section,
      }
    );
  });
};

export const expandCourseBookEntries = (entries = [], options = {}) =>
  toArray(entries).flatMap((entry) => expandCourseBookEntry(entry, options));

export const findCourseBookEntry = ({ entries = [], day, chapter = "", level = "" } = {}) => {
  const requestedDay = Number(day);
  const requestedChapter = normalizeToken(chapter);
  const matches = expandCourseBookEntries(entries, { level }).filter(
    (entry) => Number(entry?.displayDay ?? entry?.day) === requestedDay
  );

  if (!requestedChapter) return matches[0] || null;

  return (
    matches.find((entry) => {
      const tokens = [
        entry?.displayChapter,
        entry?.chapter,
        entry?.assignmentId,
        entry?.assignment_id,
        entry?.assignmentKey,
      ].map(normalizeToken);
      return tokens.includes(requestedChapter) || tokens.some((token) => token.endsWith(`-${requestedChapter}`));
    }) ||
    matches[0] ||
    null
  );
};
