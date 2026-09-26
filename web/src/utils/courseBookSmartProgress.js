const normalize = (value = "") => String(value || "").trim().toLowerCase();

export const COURSE_BOOK_VIEW_LABELS = Object.freeze({
  learn: "Learn",
  grammar: "Grammar",
  workbook: "Workbook",
  sprechen: "Sprechen",
  schreiben: "Schreiben",
  lesen: "Lesen",
  hoeren: "Hören",
  speak: "Speak",
  write: "Write",
  review: "Review",
  finish: "Finish",
  references: "Ref",
  submit: "Submit",
});

const STATUS_STYLES = Object.freeze({
  notStarted: {
    key: "not-started",
    label: "Not started",
    color: "#64748b",
    background: "#f8fafc",
    border: "#cbd5e1",
  },
  inProgress: {
    key: "in-progress",
    label: "In progress",
    color: "#1d4ed8",
    background: "#eff6ff",
    border: "#93c5fd",
  },
  waiting: {
    key: "waiting-for-tutor",
    label: "Waiting for tutor",
    color: "#92400e",
    background: "#fffbeb",
    border: "#fde68a",
  },
  needsImprovement: {
    key: "needs-improvement",
    label: "Needs improvement",
    color: "#c2410c",
    background: "#fff7ed",
    border: "#fdba74",
  },
  complete: {
    key: "complete",
    label: "Completed",
    color: "#166534",
    background: "#f0fdf4",
    border: "#86efac",
  },
});

export const getCourseBookViewLabel = (value = "") =>
  COURSE_BOOK_VIEW_LABELS[normalize(value)] || String(value || "").trim();

const normalizedChapter = (value = "") =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^chapter\s+/i, "");

export const resumeMatchesCourseBookEntry = ({
  entry = {},
  resume = null,
  dayTaskCount = 1,
} = {}) => {
  if (!resume) return false;
  const entryDay = Number(entry.displayDay ?? entry.day);
  const resumeDay = Number(resume.day);
  if (!Number.isInteger(entryDay) || entryDay !== resumeDay) return false;

  const entryChapter = normalizedChapter(entry.displayChapter || entry.chapter);
  const resumeChapter = normalizedChapter(resume.chapter);

  if (entryChapter && resumeChapter) return entryChapter === resumeChapter;
  if (Number(dayTaskCount || 1) > 1) return false;
  return true;
};

export const summarizeResumeSections = (sections = {}) =>
  Object.entries(sections || {})
    .filter(([, value]) => typeof value === "boolean")
    .map(([key, completed]) => ({
      key,
      label: getCourseBookViewLabel(key),
      completed,
    }));

const completedTutorStatuses = new Set(["passed", "milestonecomplete", "selfmarkedcomplete"]);
const waitingTutorStatuses = new Set(["submitted", "resubmitted"]);
const failedTutorStatuses = new Set(["failed", "needs_correction", "needs-improvement"]);
const inProgressTutorStatuses = new Set(["inprogress", "in_progress", "in-progress"]);

export const resolveCourseBookSmartProgress = ({
  entry = {},
  resume = null,
  dayTaskCount = 1,
  tutorStatus = "",
  selfLearningComplete = false,
  practiceComplete = false,
} = {}) => {
  const status = normalize(tutorStatus).replace(/\s+/g, "");
  const resumeMatches = resumeMatchesCourseBookEntry({ entry, resume, dayTaskCount });
  const activeView = resumeMatches ? normalize(resume?.activeView || "learn") : "";
  const activeViewLabel = getCourseBookViewLabel(activeView);
  const sections = resumeMatches ? summarizeResumeSections(resume?.sections) : [];
  const radioDone = resumeMatches && resume?.radioDone === true;
  const resumeCompleted = resumeMatches && resume?.completed === true;

  if (failedTutorStatuses.has(status)) {
    return {
      ...STATUS_STYLES.needsImprovement,
      detail: "Review the feedback and retry this lesson.",
      activeView,
      activeViewLabel,
      sections,
      radioDone,
      resumeMatches,
      continueLabel: "Review & retry",
      continueUrl: resumeMatches ? resume?.lastRoute || "" : "",
    };
  }

  if (waitingTutorStatuses.has(status)) {
    return {
      ...STATUS_STYLES.waiting,
      detail: "Submitted and waiting for tutor marking.",
      activeView,
      activeViewLabel,
      sections,
      radioDone,
      resumeMatches,
      continueLabel: "",
      continueUrl: "",
    };
  }

  if (
    completedTutorStatuses.has(status) ||
    resumeCompleted ||
    selfLearningComplete ||
    practiceComplete
  ) {
    return {
      ...STATUS_STYLES.complete,
      detail: radioDone ? "Lesson complete · Falowen Radio complete" : "Lesson complete",
      activeView,
      activeViewLabel,
      sections,
      radioDone,
      resumeMatches,
      continueLabel: "Review lesson",
      continueUrl: resumeMatches ? resume?.lastRoute || "" : "",
    };
  }

  if (resumeMatches || inProgressTutorStatuses.has(status)) {
    return {
      ...STATUS_STYLES.inProgress,
      label: activeViewLabel ? `In progress · ${activeViewLabel}` : STATUS_STYLES.inProgress.label,
      detail: resumeMatches
        ? (radioDone ? "Falowen Radio complete" : "Continue from your last synced section.")
        : "A saved draft or lesson activity is already in progress.",
      activeView,
      activeViewLabel,
      sections,
      radioDone,
      resumeMatches,
      continueLabel: activeViewLabel ? `Continue ${activeViewLabel}` : "Continue",
      continueUrl: resumeMatches ? resume?.lastRoute || "" : "",
    };
  }

  return {
    ...STATUS_STYLES.notStarted,
    detail: "",
    activeView: "",
    activeViewLabel: "",
    sections: [],
    radioDone: false,
    resumeMatches: false,
    continueLabel: "Start lesson",
    continueUrl: "",
  };
};
