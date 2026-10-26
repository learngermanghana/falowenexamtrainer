import React, { memo } from "react";
import { useLocation } from "react-router-dom";
import A1Day20LetterWritingWorkbookPage from "./A1Day20LetterWritingWorkbookPage";
import A1Day20GoetheWritingGrammarPage from "./A1Day20GoetheWritingGrammarPage";
export { A1_DAY20_CHAPTER123_GRAMMAR_ROUTE, A1_DAY20_CHAPTER123_WORKBOOK_ROUTE, A1_DAY20_CHAPTER123_LESSON_ROUTE } from "../data/a1Day20LetterWritingRoutes";
import { A1_DAY20_CHAPTER123_GRAMMAR_ROUTE } from "../data/a1Day20LetterWritingRoutes";
// A1-12.3-FORM-EMAIL-V1: legacy URLs share the canonical revised lesson.
export const resolveLetterWritingPageMode = (pathname = "") => {
  const normalized = String(pathname || "").replace(/\/+$/, "");
  return normalized === A1_DAY20_CHAPTER123_GRAMMAR_ROUTE ? "grammar" : "workbook";
};
export const LetterWritingGrammarNotesPage = A1Day20GoetheWritingGrammarPage;
const LetterWritingIntroPage = () => {
  const { pathname } = useLocation();
  return resolveLetterWritingPageMode(pathname) === "grammar"
    ? <A1Day20GoetheWritingGrammarPage /> : <A1Day20LetterWritingWorkbookPage />;
};
export default memo(LetterWritingIntroPage);
