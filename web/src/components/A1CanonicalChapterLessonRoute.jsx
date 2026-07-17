import React from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { getA1CanonicalLesson } from "../data/a1CanonicalLessonCatalog";
import { normalizeA1Chapter } from "../data/a1CanonicalLessonRoutes";

const mergeSearchIntoDestination = (
  destination = "",
  search = "",
  { resourceHub = false } = {},
) => {
  const parsed = new URL(destination, "https://www.falowen.app");
  const incoming = new URLSearchParams(String(search || "").replace(/^\?/, ""));

  incoming.delete("chapter");
  incoming.delete("hub");
  incoming.forEach((value, key) => {
    if (!parsed.searchParams.has(key)) parsed.searchParams.set(key, value);
  });
  if (resourceHub) parsed.searchParams.set("hub", "1");

  const query = parsed.searchParams.toString();
  return `${parsed.pathname}${query ? `?${query}` : ""}`;
};

export const getA1CanonicalChapterDestination = ({ chapter = "", search = "" } = {}) => {
  const lesson = getA1CanonicalLesson(chapter);
  if (!lesson) return "/campus/course";

  // Tutor-marked chapters must open their chapter-scoped lesson hub first so
  // students can use the grammar book, teacher video and AI video before the workbook.
  if (lesson.kind === "assignment") {
    return mergeSearchIntoDestination(lesson.legacyLessonRoute, search, { resourceHub: true });
  }

  // Practice and grammar-only chapters keep their dedicated destination.
  return mergeSearchIntoDestination(lesson.destination, search);
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
