import React from "react";
import { useLocation } from "react-router-dom";
import CourseLessonPageLegacy from "./CourseLessonPageLegacy";

export const isA1ChapterResourceHubRequest = (search = "") => {
  const query = new URLSearchParams(String(search || ""));
  return query.get("hub") === "1" && Boolean(String(query.get("chapter") || "").trim());
};

export default function A1ChapterResourceHubRoute({ fallback = null }) {
  const location = useLocation();

  if (isA1ChapterResourceHubRequest(location.search)) {
    return <CourseLessonPageLegacy />;
  }

  return fallback;
}
