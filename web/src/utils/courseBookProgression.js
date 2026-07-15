const COMPLETED_TUTOR_STATUSES = new Set(["passed", "submitted", "resubmitted"]);
const PINNED_ORIENTATION_LEVELS = new Set(["A1", "A2", "B1", "B2", "C1"]);

const isMilestoneEntry = (entry = {}) =>
  Boolean(entry?.isMilestone || entry?.completion || /course completed/i.test(String(entry?.topic || "")));

const isTutorMarkedEntry = (entry = {}) => {
  if (entry?.isTutorMarked !== undefined) return Boolean(entry.isTutorMarked);
  if (entry?.tutorMarked !== undefined) return Boolean(entry.tutorMarked);
  if (entry?.submissionRequired !== undefined) return Boolean(entry.submissionRequired);
  if (entry?.assessmentType) return entry.assessmentType === "tutor-marked";
  return Boolean(entry?.assignment);
};

const getEntryLevel = (entry = {}) => {
  const explicit = String(entry?.level || entry?.courseLevel || entry?.course || "").trim().toUpperCase();
  if (PINNED_ORIENTATION_LEVELS.has(explicit)) return explicit;
  const assignmentToken = `${entry?.assignmentKey || ""} ${entry?.assignmentId || ""} ${entry?.assignment_id || ""}`.toUpperCase();
  return assignmentToken.match(/\b(A1|A2|B1|B2|C1)\b/)?.[1] || "";
};

export const isPinnedCourseBookOrientationEntry = (entry = {}) => {
  const day = Number(entry?.displayDay ?? entry?.day);
  if (day !== 0) return false;
  const level = getEntryLevel(entry);
  return !level || PINNED_ORIENTATION_LEVELS.has(level);
};

export const isCourseBookEntryComplete = (entry = {}, practiceProgress = {}) => {
  if (!entry || isMilestoneEntry(entry)) return false;
  if (isTutorMarkedEntry(entry)) return COMPLETED_TUTOR_STATUSES.has(entry.status);
  return Boolean(practiceProgress?.[entry.assignmentKey]?.completed);
};

export const getNextCourseBookEntry = (entries = [], practiceProgress = {}) =>
  entries.find(
    (entry) =>
      !isPinnedCourseBookOrientationEntry(entry) &&
      !isMilestoneEntry(entry) &&
      !isCourseBookEntryComplete(entry, practiceProgress)
  ) || null;
