import React from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { getA1CanonicalLesson } from "../data/a1CanonicalLessonCatalog";
import {
  mergeA1LessonSearchIntoWorkbookRoute,
  normalizeA1Chapter,
} from "../data/a1CanonicalLessonRoutes";

export const getA1CanonicalChapterDestination = ({ chapter = "", search = "" } = {}) => {
  const lesson = getA1CanonicalLesson(chapter);
  if (!lesson) return "/campus/course";
  return mergeA1LessonSearchIntoWorkbookRoute(lesson.destination, search);
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
