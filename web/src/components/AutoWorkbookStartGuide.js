import React, { useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { styles } from "../styles";
import { buildWorkbookRouteIndex, normalizeInAppPath } from "../utils/courseWorkbookRoutes";
import CourseWorkbookSubmissionTabs from "./CourseWorkbookSubmissionTabs";
import WorkbookContextSync from "./WorkbookContextSync";
import WorkbookStartGuide from "./WorkbookStartGuide";

const A1_DAY18_CHAPTER122_PATH = "/campus/course/a1-12-2-dative-articles-mit-bei-zu";
const workbookRouteIndex = buildWorkbookRouteIndex();
export const SELF_MANAGED_WORKBOOK_SUBMISSION_PATHS = new Set([
  "/campus/course/a1-day-2-german-alphabet-reviewing-workbook",
  "/campus/course/a1-day-2-kapitel-1-1-workbook",
  "/campus/course/a1-day-3-german-alphabet-reviewing-workbook",
  "/campus/course/a1-day-16-food-and-negation-kapitel-10-workbook",
  A1_DAY18_CHAPTER122_PATH,
]);

export const shouldRenderWorkbookGuide = ({ pathname = "", search = "", match } = {}) => {
  if (!match) return false;
  const normalizedPathname = normalizeInAppPath(pathname);
  const requestedView = new URLSearchParams(search || "").get("view");

  if (normalizedPathname === A1_DAY18_CHAPTER122_PATH) {
    return requestedView === "workbook";
  }

  const isB1LessonRoute = /^\/campus\/course\/lesson\/B1\/\d+$/i.test(normalizedPathname);
  if (!isB1LessonRoute) return true;
  return requestedView === "workbook";
};

const AutoWorkbookStartGuide = () => {
  const { pathname, search } = useLocation();
  const hostRef = useRef(null);
  const normalizedPathname = normalizeInAppPath(pathname);
  const match = useMemo(() => workbookRouteIndex.get(normalizedPathname), [normalizedPathname]);
  const usesSelfManagedSubmissionTabs = SELF_MANAGED_WORKBOOK_SUBMISSION_PATHS.has(normalizedPathname);

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

export const __TESTING__ = { A1_DAY18_CHAPTER122_PATH };
