import { getInlineCourseAssignments, normalizeCourseAssignmentKey } from "./courseLessonAssignments";
import { buildWorkbookRouteIndex, normalizeInAppPath } from "./courseWorkbookRoutes";
import { chooseWorkbookAssignment } from "./workbookContext";

const workbookRouteIndex = buildWorkbookRouteIndex();

const getRequestedAssignment = (assignments = [], searchParams = new URLSearchParams()) => {
  const requestedKey = normalizeCourseAssignmentKey(
    searchParams.get("assignmentKey") || searchParams.get("assignmentId")
  );
  if (!requestedKey) return null;
  return (
    assignments.find(
      (assignment) => normalizeCourseAssignmentKey(assignment?.assignmentKey) === requestedKey
    ) || null
  );
};

const buildResolvedContext = ({ day, chapter = "", searchParams }) => {
  const assignments = getInlineCourseAssignments("B1", day);
  if (!assignments.length) return null;

  const assignment =
    getRequestedAssignment(assignments, searchParams) ||
    chooseWorkbookAssignment({ assignments, chapter });
  if (!assignment?.assignmentKey) return null;

  return {
    level: "B1",
    day: Number(day),
    chapter: assignment.chapter || chapter || "",
    assignmentKey: assignment.assignmentKey,
  };
};

export const resolveB1WorkbookSubmissionContext = ({ pathname = "", search = "" } = {}) => {
  const normalizedPathname = normalizeInAppPath(pathname);
  const searchParams = new URLSearchParams(search || "");

  const dynamicMatch = normalizedPathname.match(/^\/campus\/course\/lesson\/b1\/(\d+)$/i);
  if (dynamicMatch) {
    if (String(searchParams.get("view") || "").toLowerCase() !== "workbook") return null;
    return buildResolvedContext({
      day: Number(dynamicMatch[1]),
      chapter: String(searchParams.get("chapter") || "").trim(),
      searchParams,
    });
  }

  const routeMatch = workbookRouteIndex.get(normalizedPathname);
  if (String(routeMatch?.level || "").toUpperCase() !== "B1") return null;

  return buildResolvedContext({
    day: Number(routeMatch?.day),
    chapter: String(routeMatch?.resource?.chapter || routeMatch?.entry?.chapter || "").trim(),
    searchParams,
  });
};

export default resolveB1WorkbookSubmissionContext;
