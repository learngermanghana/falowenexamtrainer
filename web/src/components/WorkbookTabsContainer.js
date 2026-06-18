import React from "react";
import CourseWorkbookSubmissionTabs from "./CourseWorkbookSubmissionTabs";
import WorkbookSubmitMount from "./WorkbookSubmitMount";

const WorkbookTabsContainer = ({ hostRef, match }) => (
  <>
    <CourseWorkbookSubmissionTabs hostRef={hostRef} match={match} />
    <WorkbookSubmitMount hostRef={hostRef} match={match} />
  </>
);

export default WorkbookTabsContainer;
