import React, { useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { styles } from "../styles";
import { buildWorkbookRouteIndex, normalizeInAppPath } from "../utils/courseWorkbookRoutes";
import {
  A1_DAY6_WORKBOOK_PATH,
  A1_DAY18_CHAPTER121_PATH,
  A1_DAY18_CHAPTER122_GRAMMAR_PATH,
  A1_DAY18_CHAPTER122_WORKBOOK_PATH,
  A2_DAY20_WORKBOOK_PATH,
  A2_DAY21_WORKBOOK_PATH,
  B1_DAY4_WORKBOOK_PATH,
  SELF_MANAGED_WORKBOOK_SUBMISSION_PATHS,
  isSelfManagedB1LessonWorkbook,
  shouldRenderWorkbookGuide,
} from "../utils/autoWorkbookGuideRouting";
import A1Day18Kapitel122WorkbookPage from "./A1Day18Kapitel122WorkbookPage";
import WorkbookTopSubmissionTabs from "./WorkbookTopSubmissionTabs";
import WorkbookContextSync from "./WorkbookContextSync";
import WorkbookStartGuide from "./WorkbookStartGuide";

export {
  SELF_MANAGED_WORKBOOK_SUBMISSION_PATHS,
  shouldRenderWorkbookGuide,
} from "../utils/autoWorkbookGuideRouting";

const workbookRouteIndex = buildWorkbookRouteIndex();

const AutoWorkbookStartGuide = () => {
  const { pathname, search } = useLocation();
  const hostRef = useRef(null);
  const normalizedPathname = normalizeInAppPath(pathname);
  const match = useMemo(() => workbookRouteIndex.get(normalizedPathname), [normalizedPathname]);
  const usesSelfManagedSubmissionTabs =
    SELF_MANAGED_WORKBOOK_SUBMISSION_PATHS.has(normalizedPathname)
    || isSelfManagedB1LessonWorkbook(pathname, search);

  if (
    normalizedPathname === A1_DAY18_CHAPTER122_WORKBOOK_PATH
    || (normalizedPathname === A1_DAY18_CHAPTER122_GRAMMAR_PATH
      && new URLSearchParams(search || "").get("view") === "workbook")
  ) return <A1Day18Kapitel122WorkbookPage />;

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
      {usesSelfManagedSubmissionTabs ? null : <WorkbookTopSubmissionTabs hostRef={hostRef} match={match} />}
    </div>
  );
};

export default AutoWorkbookStartGuide;

export const __TESTING__ = {
  A1_DAY6_WORKBOOK_PATH,
  A1_DAY18_CHAPTER121_PATH,
  A1_DAY18_CHAPTER122_GRAMMAR_PATH,
  A1_DAY18_CHAPTER122_WORKBOOK_PATH,
  A2_DAY20_WORKBOOK_PATH,
  A2_DAY21_WORKBOOK_PATH,
  B1_DAY4_WORKBOOK_PATH,
  isSelfManagedB1LessonWorkbook,
};