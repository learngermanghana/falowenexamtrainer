import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getInlineCourseAssignments } from "../utils/courseLessonAssignments";
import {
  buildWorkbookContextSearch,
  chooseWorkbookAssignment,
  workbookContextMatches,
} from "../utils/workbookContext";

const WorkbookContextSync = ({ match }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const level = String(match?.level || "").trim().toUpperCase();
  const day = Number(match?.day);
  const assignment = useMemo(
    () =>
      chooseWorkbookAssignment({
        assignments: getInlineCourseAssignments(level, day),
        chapter: match?.resource?.chapter,
      }),
    [day, level, match?.resource?.chapter]
  );
  const assignmentKey = assignment?.assignmentKey || "";

  useEffect(() => {
    if (!assignmentKey) return;

    const context = {
      search: location.search,
      state: location.state,
      level,
      day,
      assignmentKey,
    };

    if (workbookContextMatches(context)) return;

    navigate(
      {
        pathname: location.pathname,
        search: buildWorkbookContextSearch(context),
        hash: location.hash,
      },
      {
        replace: true,
        state: {
          ...(location.state || {}),
          level,
          day,
          assignmentKey,
          assignmentId: assignmentKey,
          canonicalAssignmentKey: assignmentKey,
          inlineCourseSubmission: true,
        },
      }
    );
  }, [assignmentKey, day, level, location.hash, location.pathname, location.search, location.state, navigate]);

  return null;
};

export default WorkbookContextSync;
