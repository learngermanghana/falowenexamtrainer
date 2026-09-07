import { getCurriculumEntriesForLevel } from "./curriculumManifest";

const DEFAULT_COMPLETION_JOURNEY = {
  videoUrl: "",
  eyebrow: "Your next step",
  title: "Move from the Course Book to the Exams Room",
  completedTitle: "Congratulations — your course learning phase is complete",
  description:
    "The Course Book builds your language skills. The Exams Room now helps you practise the real exam structure, timing and task types.",
  completedDescription:
    "You have reached the end of the Course Book. Continue in the Exams Room to prepare with speaking, writing, reading and listening practice.",
  steps: [
    "Open the Exams Room and choose your current level.",
    "Start with the exam overview and study plan.",
    "Practise speaking, writing, reading and listening under exam conditions.",
    "Review weak areas and repeat practice until you feel ready.",
  ],
};

const COMPLETION_JOURNEYS = {
  A1: {
    ...DEFAULT_COMPLETION_JOURNEY,
    title: "After A1: prepare for the Goethe A1 exam",
    completedTitle: "You finished the A1 Course Book — now prepare for the exam",
  },
  A2: {
    ...DEFAULT_COMPLETION_JOURNEY,
    videoUrl: "https://youtu.be/Qw54j9GiMd4",
    title: "After A2: prepare for the Goethe A2 exam",
    completedTitle: "You finished the A2 Course Book — now prepare for the exam",
  },
  B1: {
    ...DEFAULT_COMPLETION_JOURNEY,
    title: "After B1: prepare for the Goethe B1 exam",
    completedTitle: "You finished the B1 Course Book — now prepare for the exam",
  },
  B2: {
    ...DEFAULT_COMPLETION_JOURNEY,
    title: "After B2: prepare for the Goethe B2 exam",
    completedTitle: "You finished the B2 Course Book — now prepare for the exam",
  },
  C1: {
    ...DEFAULT_COMPLETION_JOURNEY,
    title: "After C1: prepare for the Goethe C1 exam",
    completedTitle: "You finished the C1 Course Book — now prepare for the exam",
  },
};

export const COURSE_COMPLETION_TOTALS = Object.freeze({
  A1: 19,
  A2: 28,
  B1: 28,
  B2: 28,
  C1: 28,
});

export const COURSE_COMPLETION_MILESTONES = Object.freeze([25, 50, 75, 90, 100]);

const TUTOR_MARKED_LEVELS = new Set(["A1", "A2", "B1"]);
const SELF_LEARNING_LEVELS = new Set(["B2", "C1"]);
const TUTOR_COMPLETED_STATUSES = new Set([
  "submitted",
  "resubmitted",
  "pending",
  "pending_review",
  "awaiting_review",
  "passed",
  "failed",
  "needs_improvement",
  "needs_correction",
]);
const TUTOR_PASSED_STATUSES = new Set(["passed", "pass", "approved"]);
const TUTOR_FAILED_STATUSES = new Set([
  "failed",
  "fail",
  "needs_improvement",
  "needs_correction",
  "redo_required",
]);

const normalizeLevel = (value = "") => String(value || "").trim().toUpperCase();
const normalizeKey = (value = "") => String(value || "").trim().toUpperCase();
const normalizeStatus = (value = "") => String(value || "").trim().toLowerCase();
const numericDay = (entry = {}) => Number(entry.assignmentDay ?? entry.displayDay ?? entry.day ?? 0);
const chapterOf = (entry = {}) => String(entry.displayChapter || entry.chapter || "").trim();
const titleOf = (entry = {}) =>
  String(entry.topic || entry.lessonTitle || entry.title || entry.en || entry.de || "").trim();

const buildCourseRoute = ({ level, day, chapter }) => {
  if (!level || !day) return "/campus/course";
  const query = chapter ? `?chapter=${encodeURIComponent(chapter)}` : "";
  return `/campus/course/lesson/${level}/${day}${query}`;
};

const buildRequirementLabel = ({ chapter, day, title }) => {
  const prefix = chapter ? `Kapitel ${chapter}` : `Day ${day}`;
  return title ? `${prefix} – ${title}` : prefix;
};

const requirementFromEntry = (entry = {}, level = "") => {
  const normalizedLevel = normalizeLevel(level || entry.level);
  const day = numericDay(entry);
  const chapter = chapterOf(entry);
  const assignmentKey = normalizeKey(
    entry.assignment_id || entry.assignmentId || entry.canonicalAssignmentId || entry.assignmentKey ||
      (chapter ? `${normalizedLevel}-${chapter}` : `${normalizedLevel}-DAY-${day}`),
  );
  const title = titleOf(entry);
  return {
    level: normalizedLevel,
    day,
    chapter,
    title,
    assignmentKey,
    label: buildRequirementLabel({ chapter, day, title }),
    route: buildCourseRoute({ level: normalizedLevel, day, chapter }),
    kind: TUTOR_MARKED_LEVELS.has(normalizedLevel) ? "assignment" : "lesson",
  };
};

const sortRequirements = (left, right) => {
  const dayDiff = Number(left.day || 0) - Number(right.day || 0);
  if (dayDiff !== 0) return dayDiff;
  return String(left.chapter || "").localeCompare(String(right.chapter || ""), undefined, { numeric: true });
};

const dedupeByAssignmentKey = (requirements = []) => {
  const seen = new Set();
  return requirements.filter((item) => {
    const key = normalizeKey(item.assignmentKey);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const getTutorRequirements = (level) => {
  const entries = getCurriculumEntriesForLevel(level)
    .filter((entry) => numericDay(entry) > 0)
    .sort((a, b) => sortRequirements(requirementFromEntry(a, level), requirementFromEntry(b, level)));

  const canonicalAssignments = dedupeByAssignmentKey(
    entries
      .filter((entry) => entry.assignment === true)
      .map((entry) => requirementFromEntry(entry, level)),
  );

  if (level === "A1") return canonicalAssignments;

  // A2/B1 have one canonical course assignment per teaching day. Prefer the
  // explicit assignment rows, then fill any manifest gaps with that day's
  // canonical entry without counting extra page/practice rows.
  const byDay = new Map();
  canonicalAssignments.forEach((item) => {
    if (item.day && !byDay.has(item.day)) byDay.set(item.day, item);
  });

  for (let day = 1; day <= COURSE_COMPLETION_TOTALS[level]; day += 1) {
    if (byDay.has(day)) continue;
    const entry = entries.find((candidate) => numericDay(candidate) === day);
    if (entry) byDay.set(day, requirementFromEntry(entry, level));
  }

  return [...byDay.values()].sort(sortRequirements);
};

const getSelfLearningRequirements = (level) => {
  const entries = getCurriculumEntriesForLevel(level).filter((entry) => {
    const day = numericDay(entry);
    return day >= 1 && day <= COURSE_COMPLETION_TOTALS[level];
  });

  const requirements = [];
  for (let day = 1; day <= COURSE_COMPLETION_TOTALS[level]; day += 1) {
    const dayEntries = entries.filter((entry) => numericDay(entry) === day);
    const preferred = dayEntries.find((entry) => entry.progressionEligible === true) || dayEntries[0] || {};
    const base = requirementFromEntry({ ...preferred, assignmentDay: day }, level);
    requirements.push({
      ...base,
      day,
      assignmentKey: `${level}-DAY-${day}`,
      label: buildRequirementLabel({ chapter: base.chapter, day, title: base.title }),
      route: buildCourseRoute({ level, day, chapter: base.chapter }),
      kind: "lesson",
    });
  }
  return requirements;
};

export const getCanonicalCourseRequirements = (level = "") => {
  const normalizedLevel = normalizeLevel(level);
  if (TUTOR_MARKED_LEVELS.has(normalizedLevel)) return getTutorRequirements(normalizedLevel);
  if (SELF_LEARNING_LEVELS.has(normalizedLevel)) return getSelfLearningRequirements(normalizedLevel);
  return [];
};

const getTutorProgressRecord = (progressByAssignmentId = {}, requirement = {}) => {
  const candidates = [
    requirement.assignmentKey,
    requirement.chapter ? `${requirement.level}-${requirement.chapter}` : "",
  ].map(normalizeKey).filter(Boolean);

  for (const key of candidates) {
    if (progressByAssignmentId[key]) return progressByAssignmentId[key];
    const direct = Object.entries(progressByAssignmentId).find(([recordKey]) => normalizeKey(recordKey) === key);
    if (direct?.[1]) return direct[1];
  }
  return null;
};

const tutorRequirementState = (record = null) => {
  if (!record) return { completed: false, passed: false, needsImprovement: false, awaitingReview: false };
  const status = normalizeStatus(record.status || record.state || record.reviewStatus);
  const passed = record.passed === true || TUTOR_PASSED_STATUSES.has(status);
  const needsImprovement = record.failed === true || TUTOR_FAILED_STATUSES.has(status);
  const completed =
    record.submitted === true ||
    record.hasSubmission === true ||
    passed ||
    needsImprovement ||
    TUTOR_COMPLETED_STATUSES.has(status);
  return {
    completed,
    passed,
    needsImprovement,
    awaitingReview: completed && !passed && !needsImprovement,
  };
};

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object || {}, key);
const firstBoolean = (object, keys = []) => {
  for (const key of keys) {
    if (hasOwn(object, key)) return object[key] === true;
  }
  return false;
};

export const getSelfLearningSectionState = (progress = {}) => {
  const learnBase = firstBoolean(progress, ["learnDone", "learnNotesDone", "learningDone", "learnComplete"]);
  const quizExplicit = hasOwn(progress, "quizDone");
  const learn = learnBase && (!quizExplicit || progress.quizDone === true);
  const speak = firstBoolean(progress, ["speakDone", "speakingDone", "speakComplete"]);
  const write = firstBoolean(progress, ["writeDone", "writingDone", "writingComplete", "aiWritingDone"]);
  const finish = firstBoolean(progress, ["completed", "finishDone", "finished"]);
  return {
    learn,
    speak,
    write,
    finish,
    completed: learn && speak && write && finish,
  };
};

export const getSelfLearningProgressStorageKey = (level, day) =>
  `falowen:${normalizeLevel(level).toLowerCase()}:day${Number(day || 0)}:standard-journey:progress`;

export const readSelfLearningProgressByDay = (level = "", storage) => {
  const normalizedLevel = normalizeLevel(level);
  if (!SELF_LEARNING_LEVELS.has(normalizedLevel)) return {};
  const activeStorage = storage || (typeof window !== "undefined" ? window.localStorage : null);
  if (!activeStorage) return {};

  const result = {};
  for (let day = 1; day <= COURSE_COMPLETION_TOTALS[normalizedLevel]; day += 1) {
    try {
      const raw = activeStorage.getItem(getSelfLearningProgressStorageKey(normalizedLevel, day));
      result[day] = raw ? JSON.parse(raw) : {};
    } catch {
      result[day] = {};
    }
  }
  return result;
};

export const getCourseCompletionMilestone = (completionPercent = 0) => {
  const value = Math.max(0, Math.min(Number(completionPercent) || 0, 100));
  const achieved = COURSE_COMPLETION_MILESTONES.reduce(
    (current, milestone) => (value >= milestone ? milestone : current),
    0,
  );
  const next = COURSE_COMPLETION_MILESTONES.find((milestone) => milestone > value) || null;
  return { achieved, next };
};

export const buildCourseCompletionProgress = ({
  level = "",
  progressByAssignmentId = {},
  selfLearningProgressByDay = {},
} = {}) => {
  const normalizedLevel = normalizeLevel(level);
  const requirements = getCanonicalCourseRequirements(normalizedLevel);
  const isTutorMarked = TUTOR_MARKED_LEVELS.has(normalizedLevel);
  const states = requirements.map((requirement) => {
    if (isTutorMarked) {
      return {
        requirement,
        ...tutorRequirementState(getTutorProgressRecord(progressByAssignmentId, requirement)),
      };
    }
    const sectionState = getSelfLearningSectionState(selfLearningProgressByDay[requirement.day] || {});
    return {
      requirement,
      completed: sectionState.completed,
      passed: false,
      needsImprovement: false,
      awaitingReview: false,
      sections: sectionState,
    };
  });

  const completed = states.filter((item) => item.completed).length;
  const passed = states.filter((item) => item.passed).length;
  const needsImprovement = states.filter((item) => item.needsImprovement).length;
  const awaitingReview = states.filter((item) => item.awaitingReview).length;
  const total = requirements.length;
  const completionPercent = total ? Math.round((completed / total) * 100) : 0;
  const masteryAvailable = isTutorMarked;
  const masteryPercent = masteryAvailable && completed ? Math.round((passed / completed) * 100) : null;
  const nextState = states.find((item) => !item.completed) || null;
  const milestone = getCourseCompletionMilestone(completionPercent);

  return {
    level: normalizedLevel,
    mode: isTutorMarked ? "tutor-marked" : SELF_LEARNING_LEVELS.has(normalizedLevel) ? "self-learning" : "unsupported",
    completed,
    total,
    completionPercent,
    passed,
    needsImprovement,
    awaitingReview,
    masteryAvailable,
    masteryPercent,
    next: nextState?.requirement || null,
    milestone: milestone.achieved,
    nextMilestone: milestone.next,
    courseWorkCompleted: total > 0 && completed === total,
    requirements,
    states,
  };
};

export const findCourseBookEntryForRequirement = (entries = [], requirement = null) => {
  if (!requirement) return null;
  const targetKey = normalizeKey(requirement.assignmentKey);
  const byAssignment = entries.find((entry) => {
    const keys = [entry.assignmentKey, entry.assignmentId, entry.assignment_id, ...(entry.requiredAssignmentIds || [])]
      .map(normalizeKey)
      .filter(Boolean);
    return targetKey && keys.includes(targetKey);
  });
  if (byAssignment) return byAssignment;

  return entries.find((entry) => Number(entry.displayDay ?? entry.day) === Number(requirement.day)) || null;
};

export const getCourseCompletionJourney = (level = "") =>
  COMPLETION_JOURNEYS[normalizeLevel(level)] || DEFAULT_COMPLETION_JOURNEY;

export const __TESTING__ = {
  tutorMarkedLevels: TUTOR_MARKED_LEVELS,
  selfLearningLevels: SELF_LEARNING_LEVELS,
  tutorRequirementState,
};

export default COMPLETION_JOURNEYS;