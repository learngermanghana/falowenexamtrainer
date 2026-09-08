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

  // Always rebuild the authoritative hub state from the URL. Besides avoiding
  // stale state from another chapter, this applies the same canonical workbook
  // routing rules used by the resource hub and preserves radio=done on the
  // final workbook destination.
  const resolvedRouteState = buildA1ChapterResourceHubState({
    level: routeLevel,
    day: params.day,
    search: location.search,
  });
  const query = new URLSearchParams(location.search);
  const completedRadio = query.get("radio") === "done";
  const completedWorkbookRoute =
    resolvedRouteState?.entry?.workbookRoute || resolvedRouteState?.entry?.workbook_link || "";

  // A canonical A1 link with hub=1 is intercepted by this outer route before
  // CourseLessonPage can run. Once Radio is complete, redirect here so the
  // learner goes straight to the Course Book instead of seeing the legacy hub.
  if (completedRadio && completedWorkbookRoute) {
    return <Navigate to={completedWorkbookRoute} replace />;
  }

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
    ? resolvedRouteState
    : location.state;

  return (
    <CourseLessonPageLegacy
      routeLevel={routeLevel}
      routeDay={params.day}
      routeState={routeState}
    />
  );
}
