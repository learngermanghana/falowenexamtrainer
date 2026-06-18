import React, { useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { styles } from "../styles";
import { buildWorkbookRouteIndex, normalizeInAppPath } from "../utils/courseWorkbookRoutes";
import CourseWorkbookSubmissionTabs from "./CourseWorkbookSubmissionTabs";
import WorkbookContextSync from "./WorkbookContextSync";
import WorkbookStartGuide from "./WorkbookStartGuide";

const workbookRouteIndex = buildWorkbookRouteIndex();
const SELF_MANAGED_WORKBOOK_SUBMISSION_PATHS = new Set([
  "/campus/course/a1-day-2-german-alphabet-reviewing-workbook",
  "/campus/course/a1-day-3-german-alphabet-reviewing-workbook",
]);

const AutoWorkbookStartGuide = () => {
  const { pathname } = useLocation();
  const hostRef = useRef(null);
  const normalizedPathname = normalizeInAppPath(pathname);
  const match = useMemo(() => workbookRouteIndex.get(normalizedPathname), [normalizedPathname]);
  const usesSelfManagedSubmissionTabs = SELF_MANAGED_WORKBOOK_SUBMISSION_PATHS.has(normalizedPathname);

  if (!match) return null;

  return (
    <div
      ref={hostRef}
      data-auto-workbook-start-guide="true"
      style={{
        ...styles.container,
        display: "grid",
        width: "100%",
        minHeight: 0,
        padding: "0 16px",
        marginBottom: 12,
        boxSizing: "border-box",
      }}
    >
      {usesSelfManagedSubmissionTabs ? <WorkbookContextSync match={match} /> : null}
      <WorkbookStartGuide level={match.level} day={match.day} entry={match.entry} />
      {usesSelfManagedSubmissionTabs ? null : <CourseWorkbookSubmissionTabs hostRef={hostRef} match={match} />}
    </div>
  );
};

export default AutoWorkbookStartGuide;
