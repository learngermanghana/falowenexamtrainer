import React from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import CourseLessonPageLegacy from "./CourseLessonPageLegacy";

const normalizeLevel = (value = "") => String(value || "").trim().toUpperCase();
const normalizeDay = (value = "") => String(value ?? "").trim();

export const isA1ChapterResourceHubRequest = ({ level = "", search = "" } = {}) => {
  const query = new URLSearchParams(String(search || ""));
  return (
    normalizeLevel(level) === "A1" &&
    query.get("hub") === "1" &&
    Boolean(String(query.get("chapter") || "").trim())
  );
};

export const buildA1ChapterResourceHubState = ({ level = "A1", day = "" } = {}) => ({
  level: normalizeLevel(level) || "A1",
  day: normalizeDay(day),
});

export const shouldNormalizeA1ChapterResourceHubState = ({
  level = "",
  day = "",
  search = "",
  state = null,
} = {}) => {
  if (!isA1ChapterResourceHubRequest({ level, search })) return false;

  const expectedState = buildA1ChapterResourceHubState({ level, day });
  return (
    !state ||
    Boolean(state.entry) ||
    normalizeLevel(state.level) !== expectedState.level ||
    normalizeDay(state.day) !== expectedState.day
  );
};

export default function A1ChapterResourceHubRoute({ fallback = null, level = "" }) {
  const location = useLocation();
  const params = useParams();
  const routeLevel = params.level || level;
  const routeDay = params.day;
  const isResourceHubRequest = isA1ChapterResourceHubRequest({
    level: routeLevel,
    search: location.search,
  });

  // The chapter in the URL is authoritative. Course Book navigation can carry a
  // stale Day 2 entry for Kapitel 0.2. Replace that state with only the A1/day
  // context required by the legacy lesson page, then resolve Kapitel 1.1 from the URL.
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
        state={buildA1ChapterResourceHubState({ level: routeLevel, day: routeDay })}
      />
    );
  }

  if (isResourceHubRequest) {
    return <CourseLessonPageLegacy />;
  }

  return fallback;
}
