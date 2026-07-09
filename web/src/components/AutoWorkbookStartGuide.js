import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
import WorkbookContextSync from "./WorkbookContextSync";
import WorkbookStartGuide from "./WorkbookStartGuide";

export {
  SELF_MANAGED_WORKBOOK_SUBMISSION_PATHS,
  shouldRenderWorkbookGuide,
} from "../utils/autoWorkbookGuideRouting";

const workbookRouteIndex = buildWorkbookRouteIndex();
const SUPPORT_GUIDE_HOST_ATTR = "data-workbook-supporting-materials-host";

const findExistingSupportGuideHost = (nav) => {
  const next = nav?.nextElementSibling;
  return next?.getAttribute?.(SUPPORT_GUIDE_HOST_ATTR) === "true" ? next : null;
};

const AutoWorkbookStartGuide = () => {
  const { pathname, search } = useLocation();
  const fallbackRef = useRef(null);
  const [portalHost, setPortalHost] = useState(null);
  const normalizedPathname = normalizeInAppPath(pathname);
  const match = useMemo(() => workbookRouteIndex.get(normalizedPathname), [normalizedPathname]);
  const usesSelfManagedSubmissionTabs =
    SELF_MANAGED_WORKBOOK_SUBMISSION_PATHS.has(normalizedPathname)
    || isSelfManagedB1LessonWorkbook(pathname, search);
  const shouldRenderGuide = shouldRenderWorkbookGuide({ pathname, search, match });

  useEffect(() => {
    if (!shouldRenderGuide || typeof document === "undefined") {
      setPortalHost(null);
      return undefined;
    }

    let cancelled = false;
    let createdHost = null;

    const placeGuideBelowSharedTabs = () => {
      if (cancelled) return false;
      const nav = document.querySelector("[data-workbook-tab-navigation]");
      if (!nav || nav.closest("[data-auto-workbook-start-guide]") || nav.closest(`[${SUPPORT_GUIDE_HOST_ATTR}]`)) {
        return false;
      }

      let host = findExistingSupportGuideHost(nav);
      if (!host) {
        host = document.createElement("div");
        host.setAttribute(SUPPORT_GUIDE_HOST_ATTR, "true");
        host.style.display = "grid";
        host.style.gap = "8px";
        host.style.margin = "12px 0 0";
        nav.insertAdjacentElement("afterend", host);
        createdHost = host;
      }

      setPortalHost(host);
      return true;
    };

    const delays = [0, 50, 150, 400, 900];
    const timers = delays.map((delay) => window.setTimeout(placeGuideBelowSharedTabs, delay));
    const observer = new MutationObserver(placeGuideBelowSharedTabs);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
      observer.disconnect();
      setPortalHost(null);
      if (createdHost?.parentNode) createdHost.parentNode.removeChild(createdHost);
    };
  }, [normalizedPathname, search, shouldRenderGuide]);

  if (
    normalizedPathname === A1_DAY18_CHAPTER122_WORKBOOK_PATH
    || (normalizedPathname === A1_DAY18_CHAPTER122_GRAMMAR_PATH
      && new URLSearchParams(search || "").get("view") === "workbook")
  ) return <A1Day18Kapitel122WorkbookPage />;

  if (!shouldRenderGuide) return null;

  const guide = <WorkbookStartGuide level={match.level} day={match.day} entry={match.entry} />;

  return (
    <>
      {usesSelfManagedSubmissionTabs ? <WorkbookContextSync match={match} /> : null}
      {portalHost ? (
        createPortal(guide, portalHost)
      ) : (
        <div
          ref={fallbackRef}
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
          {guide}
        </div>
      )}
    </>
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