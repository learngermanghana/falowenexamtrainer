import { normalizeCourseAssignmentKey } from "./courseLessonAssignments";

export const workbookRouteContextMatches = ({ search, state, assignmentKey, level, day }) => {
  const params = new URLSearchParams(search || "");
  const normalizedKey = normalizeCourseAssignmentKey(assignmentKey);
  return (
    normalizeCourseAssignmentKey(params.get("assignmentKey")) === normalizedKey &&
    normalizeCourseAssignmentKey(params.get("assignmentId")) === normalizedKey &&
    String(params.get("level") || "").toUpperCase() === level &&
    normalizeCourseAssignmentKey(state?.assignmentKey || state?.canonicalAssignmentKey) === normalizedKey &&
    String(state?.level || "").toUpperCase() === level &&
    Number(state?.day) === Number(day)
  );
};

export const buildWorkbookRouteSearch = ({ search, assignmentKey, level }) => {
  const params = new URLSearchParams(search || "");
  params.set("assignmentKey", assignmentKey);
  params.set("assignmentId", assignmentKey);
  params.set("level", level);
  return `?${params.toString()}`;
};
