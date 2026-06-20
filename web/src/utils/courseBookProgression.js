const COMPLETED_TUTOR_STATUSES = new Set(["passed", "submitted", "resubmitted"]);

const isMilestoneEntry = (entry = {}) =>
  Boolean(entry?.isMilestone || entry?.completion || /course completed/i.test(String(entry?.topic || "")));

const isTutorMarkedEntry = (entry = {}) => {
  if (entry?.isTutorMarked !== undefined) return Boolean(entry.isTutorMarked);
  if (entry?.tutorMarked !== undefined) return Boolean(entry.tutorMarked);
  if (entry?.submissionRequired !== undefined) return Boolean(entry.submissionRequired);
  if (entry?.assessmentType) return entry.assessmentType === "tutor-marked";
  return Boolean(entry?.assignment);
};

export const isCourseBookEntryComplete = (entry = {}, practiceProgress = {}) => {
  if (!entry || isMilestoneEntry(entry)) return false;
  if (isTutorMarkedEntry(entry)) return COMPLETED_TUTOR_STATUSES.has(entry.status);
  return Boolean(practiceProgress?.[entry.assignmentKey]?.completed);
};

export const getNextCourseBookEntry = (entries = [], practiceProgress = {}) =>
  entries.find((entry) => !isMilestoneEntry(entry) && !isCourseBookEntryComplete(entry, practiceProgress)) || null;
