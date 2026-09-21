import { normalizeCourseAssignmentKey } from "./courseLessonAssignments";

const normalizeChapter = (value) => String(value || "").trim().toLowerCase();
const RADIO_COMPLETE_PARAM = "radio";
const RADIO_COMPLETE_VALUE = "done";

export const chooseWorkbookAssignment = ({ assignments = [], chapter = "" } = {}) => {
  if (!assignments.length) return null;
  const targetChapter = normalizeChapter(chapter);
  if (!targetChapter) return assignments[0];
  return assignments.find((assignment) => normalizeChapter(assignment?.chapter) === targetChapter) || assignments[0];
};

export const workbookContextMatches = ({ search = "", state = null, level = "", day = null, assignmentKey = "" } = {}) => {
  const params = new URLSearchParams(search || "");
  const key = normalizeCourseAssignmentKey(assignmentKey);
  const courseLevel = String(level || "").trim().toUpperCase();
  return (
    normalizeCourseAssignmentKey(params.get("assignmentKey")) === key &&
    normalizeCourseAssignmentKey(params.get("assignmentId")) === key &&
    String(params.get("level") || "").trim().toUpperCase() === courseLevel &&
    normalizeCourseAssignmentKey(state?.assignmentKey || state?.canonicalAssignmentKey) === key &&
    String(state?.level || "").trim().toUpperCase() === courseLevel &&
    Number(state?.day) === Number(day)
  );
};

export const buildWorkbookContextSearch = ({ search = "", level = "", assignmentKey = "" } = {}) => {
  const source = new URLSearchParams(search || "");
  const completedRadio = source.get(RADIO_COMPLETE_PARAM) === RADIO_COMPLETE_VALUE;
  const params = new URLSearchParams(source);
  params.set("assignmentKey", assignmentKey);
  params.set("assignmentId", assignmentKey);
  params.set("level", String(level || "").trim().toUpperCase());

  // radio=done is a durable workbook-journey marker. Never let submission
  // context synchronization send a learner back into Falowen Radio.
  if (completedRadio) params.set(RADIO_COMPLETE_PARAM, RADIO_COMPLETE_VALUE);

  return `?${params.toString()}`;
};
