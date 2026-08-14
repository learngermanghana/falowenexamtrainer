import React from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import {
  buildA1ChapterResourceHubState,
  getRequestedA1Chapter,
  isA1ChapterResourceHubRequest,
  resolveA1ChapterResourceHubEntry,
  shouldNormalizeA1ChapterResourceHubState,
} from "../utils/a1ChapterResourceHubState";
import CourseLessonPageLegacy from "./CourseLessonPageLegacy";

export const A1_CHAPTER_RESOURCE_HUB_PARENT_PATH = "/campus/course/lesson/A1/:day/*";

export {
  buildA1ChapterResourceHubState,
  getRequestedA1Chapter,
  isA1ChapterResourceHubRequest,
  resolveA1ChapterResourceHubEntry,
  shouldNormalizeA1ChapterResourceHubState,
};

const hasCompletedRadio = (search = "") => {
  try {
    return new URLSearchParams(String(search || "")).get("radio") === "done";
  } catch (_error) {
    return false;
  }
};

export default function A1ChapterResourceHubRoute({ fallback = null, level = "" }) {
  const location = useLocation();
  const params = useParams();
  const routeLevel = params.level || level || "A1";

  // The extracted resolver owns the hub contract: query.get("hub") === "1".
  const isResourceHubRequest = isA1ChapterResourceHubRequest({
    level: routeLevel,
    search: location.search,
  });

  if (!isResourceHubRequest) return fallback;

  // The outer route contains a literal /A1/ segment, so CourseLessonPageLegacy
  // cannot read a `level` URL param. Build the route identity in memory instead
  // of replacing the current history entry; Firefox can throw
  // `DOMException: The operation is insecure` during startup when an immediate
  // same-URL <Navigate replace> tries to normalize only history.state.
  const routeState = shouldNormalizeA1ChapterResourceHubState({
    level: routeLevel,
    day: params.day,
    search: location.search,
    state: location.state,
  })
    ? buildA1ChapterResourceHubState({
        level: routeLevel,
        day: params.day,
        search: location.search,
      })
    : location.state;

  // Once Falowen Radio is complete, do not render the legacy hub again. The
  // normalized state already contains the direct workbook route with
  // `radio=done`; navigating there avoids DOM injectors racing while React is
  // replacing the hub tree and makes pasted completed-radio URLs deterministic.
  const completedWorkbookRoute = routeState?.entry?.workbookRoute || routeState?.entry?.workbook_link || "";
  if (hasCompletedRadio(location.search) && completedWorkbookRoute) {
    return <Navigate to={completedWorkbookRoute} replace />;
  }

  return (
    <CourseLessonPageLegacy
      routeLevel={routeLevel}
      routeDay={params.day}
      routeState={routeState}
    />
  );
}
