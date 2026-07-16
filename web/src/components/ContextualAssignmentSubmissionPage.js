import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";

const normalizeLevel = (value) => String(value || "").trim().toUpperCase();
const normalizeAssignmentKey = (value) => String(value || "").trim().toUpperCase();

const ContextualAssignmentSubmissionPage = ({ submissionContext = {} }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search || "");
  const nextState = { ...(location.state || {}) };
  let shouldSyncUrl = false;

  const requestedLevel = normalizeLevel(submissionContext.level);
  const requestedAssignmentKey = normalizeAssignmentKey(
    submissionContext.canonicalAssignmentKey || submissionContext.assignmentKey
  );
  const requestedDay = Number(submissionContext.day);

  if (
    requestedLevel &&
    (normalizeLevel(params.get("level")) !== requestedLevel || normalizeLevel(nextState.level) !== requestedLevel)
  ) {
    params.set("level", requestedLevel);
    nextState.level = requestedLevel;
    shouldSyncUrl = true;
  }

  if (
    requestedAssignmentKey &&
    (
      normalizeAssignmentKey(params.get("assignmentKey")) !== requestedAssignmentKey ||
      normalizeAssignmentKey(params.get("assignmentId")) !== requestedAssignmentKey ||
      normalizeAssignmentKey(nextState.assignmentKey || nextState.canonicalAssignmentKey) !== requestedAssignmentKey
    )
  ) {
    params.set("assignmentKey", requestedAssignmentKey);
    params.set("assignmentId", requestedAssignmentKey);
    nextState.assignmentKey = requestedAssignmentKey;
    nextState.assignmentId = requestedAssignmentKey;
    nextState.canonicalAssignmentKey = requestedAssignmentKey;
    shouldSyncUrl = true;
  }

  if (Number.isFinite(requestedDay) && requestedDay > 0 && Number(nextState.day) !== requestedDay) {
    nextState.day = requestedDay;
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
