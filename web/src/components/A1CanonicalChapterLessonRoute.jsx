import React from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { getA1AssignmentByChapter } from "../data/a1AssignmentRegistry";
import {
  mergeA1LessonSearchIntoWorkbookRoute,
  normalizeA1Chapter,
} from "../data/a1CanonicalLessonRoutes";

export const getA1CanonicalChapterDestination = ({ chapter = "", search = "" } = {}) => {
  const assignment = getA1AssignmentByChapter(chapter);
  if (!assignment) return "/campus/course";
  return mergeA1LessonSearchIntoWorkbookRoute(assignment.workbookRoute, search);
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
