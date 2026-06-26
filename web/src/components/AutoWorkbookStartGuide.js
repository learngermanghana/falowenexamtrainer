import React, { useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { styles } from "../styles";
import { buildWorkbookRouteIndex, normalizeInAppPath } from "../utils/courseWorkbookRoutes";
import A1Day18Kapitel122WorkbookPage from "./A1Day18Kapitel122WorkbookPage";
import CourseWorkbookSubmissionTabs from "./CourseWorkbookSubmissionTabs";
import WorkbookContextSync from "./WorkbookContextSync";
import WorkbookStartGuide from "./WorkbookStartGuide";

const A1_DAY18_CHAPTER121_PATH = "/campus/course/two-case-prepositions-wechselpraepositionen-day-18";
const A1_DAY18_CHAPTER122_GRAMMAR_PATH = "/campus/course/a1-12-2-dative-articles-mit-bei-zu";
const A1_DAY18_CHAPTER122_WORKBOOK_PATH = "/campus/course/a1-day-18-kapitel-12-2-workbook";
const A2_DAY20_WORKBOOK_PATH = "/campus/course/a2-day-20-typische-reklamationssituationen-workbook";
const A2_DAY21_WORKBOOK_PATH = "/campus/course/a2-day-21-ein-wochenende-planen-workbook";
const B1_DAY4_WORKBOOK_PATH = "/campus/course/b1-day-4-wohnung-suchen-workbook";
const workbookRouteIndex = buildWorkbookRouteIndex();

export const SELF_MANAGED_WORKBOOK_SUBMISSION_PATHS = new Set([
  "/campus/course/a1-day-2-german-alphabet-reviewing-workbook",
  "/campus/course/a1-day-2-kapitel-1-1-workbook",
  "/campus/course/a1-day-3-german-alphabet-reviewing-workbook",
  "/campus/course/a1-day-16-food-and-negation-kapitel-10-workbook",
  A1_DAY18_CHAPTER121_PATH,
  A1_DAY18_CHAPTER122_WORKBOOK_PATH,
  A2_DAY20_WORKBOOK_PATH,
  A2_DAY21_WORKBOOK_PATH,
  B1_DAY4_WORKBOOK_PATH,
]);

const isSelfManagedB1LessonWorkbook = (pathname = "", search = "") => {
  const normalizedPathname = normalizeInAppPath(pathname);
  const requestedView = new URLSearchParams(search || "").get("view");
  return requestedView === "workbook"
    && /^\/campus\/course\/lesson\/b1\/(4|5)$/i.test(normalizedPathname);
};

export const shouldRenderWorkbookGuide = ({ pathname = "", search = "", match } = {}) => {
  if (!match) return false;
  const normalizedPathname = normalizeInAppPath(pathname);
  const requestedView = new URLSearchParams(search || "").get("view");

  if (normalizedPathname === A1_DAY18_CHAPTER121_PATH) return requestedView === "workbook";
  if (normalizedPathname === A1_DAY18_CHAPTER122_GRAMMAR_PATH) return false;

  const isB1LessonRoute = normalizedPathname.toLowerCase().startsWith("/campus/course/lesson/b1/");
  if (!isB1LessonRoute) return true;
  return requestedView === "workbook";
};

const AutoWorkbookStartGuide = () => {
  const { pathname, search } = useLocation();
  const hostRef = useRef(null);
  const normalizedPathname = normalizeInAppPath(pathname);
  const match = useMemo(() => workbookRouteIndex.get(normalizedPathname), [normalizedPathname]);
  const usesSelfManagedSubmissionTabs =
    SELF_MANAGED_WORKBOOK_SUBMISSION_PATHS.has(normalizedPathname)
    || isSelfManagedB1LessonWorkbook(pathname, search);

  if (normalizedPathname === A1_DAY18_CHAPTER122_WORKBOOK_PATH) return <A1Day18Kapitel122WorkbookPage />;
  if (!shouldRenderWorkbookGuide({ pathname, search, match })) return null;

  return (
    <div
      ref={hostRef}
      data-auto-workbook-start-guide="true"
      style={{
        ...styles.container,
        display: "grid",
        width: "100%",
        minHeight: 0,
        padding: "0 16px",
        marginBottom: 12,
        boxSizing: "border-box",
      }}
    >
      {usesSelfManagedSubmissionTabs ? <WorkbookContextSync match={match} /> : null}
      <WorkbookStartGuide level={match.level} day={match.day} entry={match.entry} />
      {usesSelfManagedSubmissionTabs ? null : <CourseWorkbookSubmissionTabs hostRef={hostRef} match={match} />}
    </div>
  );
};

export default AutoWorkbookStartGuide;

export const __TESTING__ = {
  A1_DAY18_CHAPTER121_PATH,
  A1_DAY18_CHAPTER122_GRAMMAR_PATH,
  A1_DAY18_CHAPTER122_WORKBOOK_PATH,
  A2_DAY20_WORKBOOK_PATH,
  A2_DAY21_WORKBOOK_PATH,
  B1_DAY4_WORKBOOK_PATH,
  isSelfManagedB1LessonWorkbook,
};
