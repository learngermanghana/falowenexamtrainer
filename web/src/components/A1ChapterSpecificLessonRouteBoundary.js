import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getA1CanonicalLessonForLegacyRoute } from "../data/a1CanonicalLessonCatalog";
import {
  getA1LegacyLessonDay,
  getA1RequestedChapterFromSearch,
  removeA1ChapterFromSearch,
} from "../data/a1CanonicalLessonRoutes";

export const getA1LegacyChapterLessonRedirect = ({ pathname = "", search = "" } = {}) => {
  const legacyDay = getA1LegacyLessonDay(pathname);
  const requestedChapter = getA1RequestedChapterFromSearch(search);
  if (!legacyDay || !requestedChapter) return null;

  const lesson = getA1CanonicalLessonForLegacyRoute({
    day: legacyDay,
    identity: requestedChapter,
  });
  if (!lesson) return null;

  return {
    pathname: lesson.lessonRoute,
    search: removeA1ChapterFromSearch(search),
  };
};

export default function A1ChapterSpecificLessonRouteBoundary({ children }) {
  const location = useLocation();
  const redirect = getA1LegacyChapterLessonRedirect({
    pathname: location.pathname,
    search: location.search,
  });

  if (redirect) {
    return <Navigate to={redirect} replace state={null} />;
  }

  return <>{children}</>;
}
