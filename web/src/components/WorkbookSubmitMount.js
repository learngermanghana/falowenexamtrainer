import React from "react";
import useLegacySubmissionVisibility from "../hooks/useLegacySubmissionVisibility";
import useWorkbookSubmissionIdentity from "../hooks/useWorkbookSubmissionIdentity";
import WorkbookSubmitPanel from "./WorkbookSubmitPanel";

const WorkbookSubmitMount = ({ hostRef, match }) => {
  const visible = useLegacySubmissionVisibility(hostRef);
  const identity = useWorkbookSubmissionIdentity(match);
  if (!visible || !identity.assignmentKey) return null;
  return <WorkbookSubmitPanel {...identity} />;
};

export default WorkbookSubmitMount;
