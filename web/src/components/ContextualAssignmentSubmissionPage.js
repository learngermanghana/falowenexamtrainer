import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";

const ContextualAssignmentSubmissionPage = ({ submissionContext = {} }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search || "");
  const nextState = { ...(location.state || {}) };
  let shouldSyncUrl = false;

  const requestedLevel = String(submissionContext.level || "").trim().toUpperCase();
  const requestedAssignmentKey = String(
    submissionContext.canonicalAssignmentKey || submissionContext.assignmentKey || ""
  ).trim();

  if (requestedLevel && params.get("level") !== requestedLevel) {
    params.set("level", requestedLevel);
    nextState.level = requestedLevel;
    shouldSyncUrl = true;
  }

  if (requestedAssignmentKey && params.get("assignmentKey") !== requestedAssignmentKey) {
    params.set("assignmentKey", requestedAssignmentKey);
    nextState.assignmentKey = requestedAssignmentKey;
    nextState.canonicalAssignmentKey = requestedAssignmentKey;
    shouldSyncUrl = true;
  }

  if (shouldSyncUrl) {
    const query = params.toString();
    return (
      <Navigate
        replace
        to={`${location.pathname}${query ? `?${query}` : ""}${location.hash || ""}`}
        state={nextState}
      />
    );
  }

  return <AssignmentSubmissionPage submissionContext={submissionContext} />;
};

export default ContextualAssignmentSubmissionPage;
