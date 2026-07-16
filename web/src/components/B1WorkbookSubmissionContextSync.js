import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resolveB1WorkbookSubmissionContext } from "../utils/b1WorkbookSubmissionContext";
import { buildWorkbookContextSearch, workbookContextMatches } from "../utils/workbookContext";

export default function B1WorkbookSubmissionContextSync() {
  const location = useLocation();
  const navigate = useNavigate();
  const context = useMemo(
    () =>
      resolveB1WorkbookSubmissionContext({
        pathname: location.pathname,
        search: location.search,
      }),
    [location.pathname, location.search]
  );

  useEffect(() => {
    if (!context?.assignmentKey) return;

    const nextContext = {
      search: location.search,
      state: location.state,
      level: context.level,
      day: context.day,
      assignmentKey: context.assignmentKey,
    };
    if (workbookContextMatches(nextContext)) return;

    navigate(
      {
        pathname: location.pathname,
        search: buildWorkbookContextSearch(nextContext),
        hash: location.hash,
      },
      {
        replace: true,
        state: {
          ...(location.state || {}),
          level: context.level,
          day: context.day,
          assignmentKey: context.assignmentKey,
          assignmentId: context.assignmentKey,
          canonicalAssignmentKey: context.assignmentKey,
          inlineCourseSubmission: true,
        },
      }
    );
  }, [context, location.hash, location.pathname, location.search, location.state, navigate]);

  return null;
}
