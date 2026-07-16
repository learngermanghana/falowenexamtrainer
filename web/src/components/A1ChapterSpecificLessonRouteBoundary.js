import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getA1CorrectedChapterSpecificLessonSearch } from "../utils/a1ChapterSpecificLessonState";

export default function A1ChapterSpecificLessonRouteBoundary({ children }) {
  const location = useLocation();
  const correctedSearch = getA1CorrectedChapterSpecificLessonSearch({
    pathname: location.pathname,
    search: location.search,
    state: location.state,
  });

  if (correctedSearch && correctedSearch !== location.search) {
    return (
      <Navigate
        to={{ pathname: location.pathname, search: correctedSearch }}
        replace
        state={location.state}
      />
    );
  }

  return children;
}
