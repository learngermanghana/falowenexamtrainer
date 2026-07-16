import React from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { getA1CanonicalLesson } from "../data/a1CanonicalLessonCatalog";
import { normalizeA1Chapter } from "../data/a1CanonicalLessonRoutes";

const mergeSearchIntoLegacyHubRoute = (legacyLessonRoute = "", search = "") => {
  const parsed = new URL(legacyLessonRoute, "https://www.falowen.app");
  const incoming = new URLSearchParams(String(search || "").replace(/^\?/, ""));

  incoming.delete("chapter");
  incoming.delete("hub");
  incoming.forEach((value, key) => {
    if (!parsed.searchParams.has(key)) parsed.searchParams.set(key, value);
  });
  parsed.searchParams.set("hub", "1");

  const query = parsed.searchParams.toString();
  return `${parsed.pathname}${query ? `?${query}` : ""}`;
};

export const getA1CanonicalChapterDestination = ({ chapter = "", search = "" } = {}) => {
  const lesson = getA1CanonicalLesson(chapter);
  if (!lesson) return "/campus/course";
  return mergeSearchIntoLegacyHubRoute(lesson.legacyLessonRoute, search);
};

export default function A1CanonicalChapterLessonRoute({ chapter: fixedChapter = "" }) {
  const params = useParams();
  const location = useLocation();
  const chapter = normalizeA1Chapter(fixedChapter || params.chapter);
  const destination = getA1CanonicalChapterDestination({
    chapter,
    search: location.search,
  });

  return <Navigate to={destination} replace state={null} />;
}
