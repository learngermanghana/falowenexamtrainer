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
  const routeLevel = params.level || level;
  const routeDay = params.day;

  // The extracted resolver owns the hub contract: query.get("hub") === "1".
  const isResourceHubRequest = isA1ChapterResourceHubRequest({
    level: routeLevel,
    search: location.search,
  });

  // The chapter in the URL is authoritative. Replace any stale Day 2 state with
  // the exact chapter entry before the legacy lesson page renders its resources.
  if (
    shouldNormalizeA1ChapterResourceHubState({
      level: routeLevel,
      day: routeDay,
      search: location.search,
      state: location.state,
    })
  ) {
    return (
      <Navigate
        to={{ pathname: location.pathname, search: location.search, hash: location.hash }}
        replace
        state={buildA1ChapterResourceHubState({
          level: routeLevel,
          day: routeDay,
          search: location.search,
        })}
      />
    );
  }

  if (isResourceHubRequest) {
    return <CourseLessonPageLegacy />;
  }

  return fallback;
}
