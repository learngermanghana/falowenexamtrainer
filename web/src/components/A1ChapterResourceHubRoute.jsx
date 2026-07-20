import React from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  buildA1ChapterResourceHubState,
  getRequestedA1Chapter,
  isA1ChapterResourceHubRequest,
  resolveA1ChapterResourceHubEntry,
  shouldNormalizeA1ChapterResourceHubState,
} from "../utils/a1ChapterResourceHubState";
import { getA1TeacherVideoResources } from "../data/a1TeacherVideoResources";
import CourseLessonPageLegacy from "./CourseLessonPageLegacy";
import TeacherLectureSupportingMaterials from "./selfLearning/TeacherLectureSupportingMaterials";

export {
  buildA1ChapterResourceHubState,
  getRequestedA1Chapter,
  isA1ChapterResourceHubRequest,
  resolveA1ChapterResourceHubEntry,
  shouldNormalizeA1ChapterResourceHubState,
};

const getPinnedTeacherLectures = ({ level = "", day = 0, chapter = "" } = {}) => {
  const normalizedLevel = String(level || "").trim().toUpperCase();
  const normalizedDay = Number(day);
  const normalizedChapter = String(chapter || "").trim();
  if (normalizedLevel !== "A1" || !normalizedDay || !normalizedChapter) return [];

  return getA1TeacherVideoResources(normalizedDay).filter(
    (resource) => String(resource.chapter || "").trim() === normalizedChapter,
  );
};

const getPinnedTeacherLecture = (options = {}) => getPinnedTeacherLectures(options)[0] || null;

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

  if (isResourceHubRequest) {
    const requestedChapter = new URLSearchParams(location.search || "").get("chapter") || "";
    const teacherLectures = getPinnedTeacherLectures({
      level: routeLevel,
      day: routeDay,
      chapter: requestedChapter,
    });

    // CourseLessonPageLegacy resolves the URL chapter authoritatively. Rendering it
    // directly avoids a replace-navigation/remount cycle when another service
    // clears or rewrites transient location state (the Day 7 blinking bug).
    return (
      <>
        {teacherLectures.length ? (
          <TeacherLectureSupportingMaterials
            lesson={{ resources: { videos: teacherLectures } }}
          />
        ) : null}
        <CourseLessonPageLegacy />
      </>
    );
  }

  return fallback;
}

export { getPinnedTeacherLecture, getPinnedTeacherLectures };
