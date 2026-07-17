import React from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import CourseLessonPageLegacy from "./CourseLessonPageLegacy";

export const isA1ChapterResourceHubRequest = ({ level = "", search = "" } = {}) => {
  const query = new URLSearchParams(String(search || ""));
  return (
    String(level || "").trim().toUpperCase() === "A1" &&
    query.get("hub") === "1" &&
    Boolean(String(query.get("chapter") || "").trim())
  );
};

export const shouldClearA1ChapterResourceHubState = ({ level = "", search = "", state = null } = {}) =>
  isA1ChapterResourceHubRequest({ level, search }) && Boolean(state);

export default function A1ChapterResourceHubRoute({ fallback = null, level = "" }) {
  const location = useLocation();
  const params = useParams();
  const routeLevel = params.level || level;
  const isResourceHubRequest = isA1ChapterResourceHubRequest({
    level: routeLevel,
    search: location.search,
  });

  // The chapter in the URL is authoritative. Course Book navigation can carry a
  // stale Day 2 entry in location.state, which previously made Kapitel 1.1 render
  // the first Day 2 card (Kapitel 0.2). Clear that state before loading the hub.
  if (
    shouldClearA1ChapterResourceHubState({
      level: routeLevel,
      search: location.search,
      state: location.state,
    })
  ) {
    return (
      <Navigate
        to={{ pathname: location.pathname, search: location.search, hash: location.hash }}
        replace
        state={null}
      />
    );
  }

  if (isResourceHubRequest) {
    return <CourseLessonPageLegacy />;
  }

  return fallback;
}
