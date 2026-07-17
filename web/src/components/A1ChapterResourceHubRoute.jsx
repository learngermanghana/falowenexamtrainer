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

export default function A1ChapterResourceHubRoute({ fallback = null }) {
  const location = useLocation();
  const params = useParams();

  if (isA1ChapterResourceHubRequest({ level: params.level, search: location.search })) {
    return <CourseLessonPageLegacy />;
  }

  return fallback;
}
