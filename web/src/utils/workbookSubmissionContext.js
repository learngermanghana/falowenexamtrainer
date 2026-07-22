const WORKBOOK_SUBMISSION_LEVELS = new Set(["A1", "A2", "B1"]);

const normalizeLevel = (value) => String(value || "").trim().toUpperCase();
const normalizeAssignmentKey = (value) =>
  String(value || "")
    .trim()
    .toUpperCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "");
const normalizeChapter = (value) => String(value || "").trim().toLowerCase();

const chapterFromAssignmentKey = (assignmentKey) =>
  normalizeAssignmentKey(assignmentKey).match(/-(\d+(?:\.\d+)?)$/)?.[1] || "";

export const resolveWorkbookSubmissionContext = ({
  submissionContext = null,
  locationState = null,
  search = "",
} = {}) => {
  const params = new URLSearchParams(search || "");
  const level = normalizeLevel(
    submissionContext?.level || locationState?.level || params.get("level"),
  );
  const assignmentKey = normalizeAssignmentKey(
    submissionContext?.canonicalAssignmentKey ||
      submissionContext?.assignmentKey ||
      locationState?.canonicalAssignmentKey ||
      locationState?.assignmentKey ||
      params.get("assignmentKey") ||
      params.get("assignmentId"),
  );
  const day = Number(submissionContext?.day || locationState?.day || 0);
  const chapter = normalizeChapter(
    submissionContext?.chapter || locationState?.chapter || chapterFromAssignmentKey(assignmentKey),
  );

  return {
    assignmentKey,
    chapter,
    day: Number.isFinite(day) ? day : 0,
    level,
    locked: Boolean(
      submissionContext &&
        WORKBOOK_SUBMISSION_LEVELS.has(level) &&
        assignmentKey &&
        Number.isFinite(day) &&
        day > 0,
    ),
  };
};

export const findWorkbookContextAssignment = ({
  assignmentDictionary = [],
  assignmentKey = "",
  day = 0,
  chapter = "",
} = {}) => {
  const entries = Array.isArray(assignmentDictionary) ? assignmentDictionary : [];
  if (!entries.length) return null;

  const normalizedKey = normalizeAssignmentKey(assignmentKey);
  const exactMatch = normalizedKey
    ? entries.find(
        (entry) =>
          normalizeAssignmentKey(
            entry?.assignmentKey || entry?.canonicalAssignmentId || entry?.assignmentId,
          ) === normalizedKey,
      )
    : null;
  if (exactMatch) return exactMatch;

  const numericDay = Number(day);
  const dayMatches = Number.isFinite(numericDay) && numericDay > 0
    ? entries.filter((entry) => Number(entry?.day) === numericDay)
    : [];
  const normalizedChapter = normalizeChapter(chapter || chapterFromAssignmentKey(normalizedKey));

  if (normalizedChapter) {
    const chapterMatch = dayMatches.find(
      (entry) => normalizeChapter(entry?.chapter) === normalizedChapter,
    );
    if (chapterMatch) return chapterMatch;

    const globalChapterMatch = entries.find(
      (entry) => normalizeChapter(entry?.chapter) === normalizedChapter,
    );
    if (globalChapterMatch) return globalChapterMatch;
  }

  return dayMatches.length === 1 ? dayMatches[0] : null;
};

export const isWorkbookSubmissionLevel = (level) =>
  WORKBOOK_SUBMISSION_LEVELS.has(normalizeLevel(level));
