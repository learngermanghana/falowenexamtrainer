import React from "react";
import { useLocation, useParams } from "react-router-dom";
import CourseLessonPageLegacy from "./CourseLessonPageLegacy";

export const isA1ChapterResourceHubRequest = ({ level = "", search = "" } = {}) => {
  const query = new URLSearchParams(String(search || ""));
  return (
    String(level || "").trim().toUpperCase() === "A1" &&
    query.get("hub") === "1" &&
    Boolean(String(query.get("chapter") || "").trim())
  );
};

export default function A1ChapterResourceHubRoute({ fallback = null, level = "" }) {
  const location = useLocation();
  const params = useParams();
  const routeLevel = params.level || level;

  if (isA1ChapterResourceHubRequest({ level: routeLevel, search: location.search })) {
    return <CourseLessonPageLegacy />;
  }

  return fallback;
}
