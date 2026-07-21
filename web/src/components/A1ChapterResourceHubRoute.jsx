import React from "react";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
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
  const routeLevel = params.level || level;

  // The extracted resolver owns the hub contract: query.get("hub") === "1".
  const isResourceHubRequest = isA1ChapterResourceHubRequest({
    level: routeLevel,
    search: location.search,
  });

  if (isResourceHubRequest) {
    // The outer A1 route uses a literal /A1/ segment, so it does not expose a
    // `level` route parameter to CourseLessonPageLegacy. Re-match the current
    // location with a parameterized route so the canonical normalizer receives
    // A1 and can load the teacher lecture configured for every chapter.
    return (
      <Routes location={location}>
        <Route
          path="/campus/course/lesson/:level/:day"
          element={<CourseLessonPageLegacy />}
        />
      </Routes>
    );
  }

  return fallback;
}
