import React, { useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { styles } from "../styles";
import { buildWorkbookRouteIndex, normalizeInAppPath } from "../utils/courseWorkbookRoutes";
import CourseWorkbookSubmissionTabs from "./CourseWorkbookSubmissionTabs";
import WorkbookStartGuide from "./WorkbookStartGuide";

const workbookRouteIndex = buildWorkbookRouteIndex();

const AutoWorkbookStartGuide = () => {
  const { pathname } = useLocation();
  const hostRef = useRef(null);
  const match = useMemo(() => workbookRouteIndex.get(normalizeInAppPath(pathname)), [pathname]);

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
      <WorkbookStartGuide level={match.level} day={match.day} entry={match.entry} />
      <CourseWorkbookSubmissionTabs hostRef={hostRef} match={match} />
    </div>
  );
};

export default AutoWorkbookStartGuide;
