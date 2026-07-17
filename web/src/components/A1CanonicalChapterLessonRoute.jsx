import React from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { getA1CanonicalLesson } from "../data/a1CanonicalLessonCatalog";
import {
  mergeA1LessonSearchIntoWorkbookRoute,
  normalizeA1Chapter,
} from "../data/a1CanonicalLessonRoutes";

const mergeSearchIntoLessonDestination = (destination = "", search = "") => {
  const parsed = new URL(destination, "https://www.falowen.app");
  const incoming = new URLSearchParams(String(search || "").replace(/^\?/, ""));

  incoming.delete("chapter");
  incoming.delete("hub");
  incoming.forEach((value, key) => {
    if (!parsed.searchParams.has(key)) parsed.searchParams.set(key, value);
  });
  const query = parsed.searchParams.toString();
  return `${parsed.pathname}${query ? `?${query}` : ""}`;
};

export const getA1CanonicalChapterDestination = ({ chapter = "", search = "" } = {}) => {
  const lesson = getA1CanonicalLesson(chapter);
  if (!lesson) return "/campus/course";
  // Assignment chapters own a dedicated workbook URL. Going through the
  // shared day hub can select the first resource for that day (for example,
  // Day 2 Kapitel 0.2) instead of the chapter the student clicked.
  if (lesson.kind === "assignment") {
    return mergeA1LessonSearchIntoWorkbookRoute(lesson.destination, search);
  }
  return mergeSearchIntoLessonDestination(lesson.destination, search);
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
