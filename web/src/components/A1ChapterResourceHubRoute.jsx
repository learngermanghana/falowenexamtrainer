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

  // The outer route contains a literal /A1/ segment, so CourseLessonPageLegacy
  // cannot read a `level` URL param. Normalize the route identity into location
  // state once, then render the lesson page directly. This avoids mounting a
  // descendant <Routes> tree, which could disappear after the Radio Continue
  // reload and leave the A1 hub on a blank/frozen page.
  if (
    shouldNormalizeA1ChapterResourceHubState({
      level: routeLevel,
      day: params.day,
      search: location.search,
      state: location.state,
    })
  ) {
    const normalizedState = buildA1ChapterResourceHubState({
      level: routeLevel,
      day: params.day,
      search: location.search,
    });

    return (
      <Navigate
        replace
        to={`${location.pathname}${location.search}${location.hash || ""}`}
        state={{ ...(location.state || {}), ...normalizedState }}
      />
    );
  }

  return <CourseLessonPageLegacy />;
}
