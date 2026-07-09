import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { styles } from "../styles";
import { A1_GRAMMAR_ROUTE_ENTRIES } from "../data/a1GrammarRoutes";
import { A2_GRAMMAR_ROUTE_ENTRIES } from "../data/a2GrammarRoutes";
import { getConfiguredInAppWorkbookRoute } from "../data/inAppWorkbookRoutes";
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
const GRAMMAR_BACK_HOST_ATTR = "data-grammar-back-to-workbook-host";

const GRAMMAR_ROUTE_ENTRIES = [
  ...A1_GRAMMAR_ROUTE_ENTRIES.map((entry) => ({ ...entry, level: "A1" })),
  ...A2_GRAMMAR_ROUTE_ENTRIES.map((entry) => ({ ...entry, level: "A2" })),
];

const normalizeRouteParts = (route = "") => {
  try {
    const url = new URL(route, "https://www.falowen.app");
    return {
      pathname: normalizeInAppPath(url.pathname),
      search: url.search,
      searchParams: url.searchParams,
    };
  } catch {
    return { pathname: "", search: "", searchParams: new URLSearchParams() };
  }
};

const routeMatchesCurrentPage = (route = "", pathname = "", search = "") => {
  const routeParts = normalizeRouteParts(route);
  if (!routeParts.pathname || routeParts.pathname !== normalizeInAppPath(pathname)) return false;
  if (!routeParts.search) return true;

  const currentParams = new URLSearchParams(search || "");
  for (const [key, value] of routeParts.searchParams.entries()) {
    if (currentParams.get(key) !== value) return false;
  }
  return true;
};

const findGrammarWorkbookTarget = ({ pathname = "", search = "" }) => {
  const normalizedPathname = normalizeInAppPath(pathname);
  const params = new URLSearchParams(search || "");
  if (params.get("view") === "workbook") return null;

  const b1Match = normalizedPathname.match(/^\/campus\/course\/lesson\/B1\/(\d+)$/i);
  if (b1Match && params.get("view") === "grammar") {
    const day = Number(b1Match[1]);
    const workbookUrl = getConfiguredInAppWorkbookRoute({ level: "B1", day }) || `/campus/course/lesson/B1/${day}?view=workbook`;
    return { level: "B1", day, chapter: "", workbookUrl };
  }

  const entry = GRAMMAR_ROUTE_ENTRIES.find((item) => routeMatchesCurrentPage(item.route, pathname, search));
  if (!entry) return null;

  const workbookUrl = getConfiguredInAppWorkbookRoute({
    level: entry.level,
    day: entry.day,
    chapter: entry.chapter,
  });
  if (!workbookUrl) return null;

  return {
    level: entry.level,
    day: entry.day,
    chapter: entry.chapter,
    workbookUrl,
  };
};

const getLessonLabel = (target) =>
  [target?.level, target?.day ? `Day ${target.day}` : "", target?.chapter ? `Kapitel ${target.chapter}` : ""]
    .filter(Boolean)
    .join(" · ");

const GrammarReturnActions = ({ target, compact = false }) => {
  if (!target?.workbookUrl) return null;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
      <a
        href={target.workbookUrl}
        style={{
          ...styles.primaryButton,
          textDecoration: "none",
          width: compact ? "auto" : "fit-content",
          minHeight: compact ? 36 : undefined,
          padding: compact ? "9px 14px" : undefined,
          fontWeight: 900,
        }}
      >
        Back to workbook ›
      </a>
      {!compact ? (
        <a href="/campus/course" style={{ ...styles.secondaryButton, textDecoration: "none", width: "fit-content" }}>
          Back to Course Book
        </a>
      ) : null}
    </div>
  );
};

const GrammarBackToWorkbookCard = ({ target }) => {
  if (!target?.workbookUrl) return null;
  const lessonLabel = getLessonLabel(target);

  return (
    <section
      data-grammar-back-to-workbook-card="true"
      style={{
        ...styles.card,
        margin: "18px auto 0",
        display: "grid",
        gap: 12,
        border: "2px solid #2563eb",
        background: "linear-gradient(135deg, #dbeafe 0%, #ffffff 72%)",
        width: "min(100%, 960px)",
        boxSizing: "border-box",
        boxShadow: "0 14px 34px rgba(37, 99, 235, 0.16)",
      }}
    >
      <div style={{ display: "grid", gap: 4 }}>
        <strong style={{ fontSize: "1.08rem" }}>Finished the grammar? Return to the workbook</strong>
        <p style={{ margin: 0, color: "#334155", lineHeight: 1.6 }}>
          Go straight back to the workbook for {lessonLabel}. You do not need to return to the Course Book first.
        </p>
      </div>
      <GrammarReturnActions target={target} />
    </section>
  );
};

const GrammarStickyWorkbookBar = ({ target }) => {
  if (!target?.workbookUrl) return null;
  const lessonLabel = getLessonLabel(target);

  return (
    <div
      data-grammar-back-to-workbook-sticky="true"
      style={{
        position: "fixed",
        left: "50%",
        bottom: 14,
        transform: "translateX(-50%)",
        zIndex: 80,
        width: "min(94vw, 760px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        border: "1px solid #bfdbfe",
        borderRadius: 18,
        background: "rgba(255, 255, 255, 0.96)",
        boxShadow: "0 18px 42px rgba(15, 23, 42, 0.18)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div style={{ display: "grid", gap: 2, minWidth: 0 }}>
        <strong style={{ fontSize: ".9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          Grammar page
        </strong>
        <span style={{ color: "#475569", fontSize: ".78rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {lessonLabel}
        </span>
      </div>
      <GrammarReturnActions target={target} compact />
    </div>
  );
};

const findExistingSupportGuideHost = (nav) => {
  const next = nav?.nextElementSibling;
  return next?.getAttribute?.(SUPPORT_GUIDE_HOST_ATTR) === "true" ? next : null;
};

const AutoWorkbookStartGuide = () => {
  const { pathname, search } = useLocation();
  const fallbackRef = useRef(null);
  const [portalHost, setPortalHost] = useState(null);
  const [grammarBackHost, setGrammarBackHost] = useState(null);
  const normalizedPathname = normalizeInAppPath(pathname);
  const match = useMemo(() => workbookRouteIndex.get(normalizedPathname), [normalizedPathname]);
  const grammarWorkbookTarget = useMemo(
    () => findGrammarWorkbookTarget({ pathname, search }),
    [pathname, search]
  );
  const usesSelfManagedSubmissionTabs =
    SELF_MANAGED_WORKBOOK_SUBMISSION_PATHS.has(normalizedPathname)
    || isSelfManagedB1LessonWorkbook(pathname, search);
  const shouldRenderGuide = shouldRenderWorkbookGuide({ pathname, search, match });

  useEffect(() => {
    if (!grammarWorkbookTarget || typeof document === "undefined") {
      setGrammarBackHost(null);
      return undefined;
    }

    const main = document.querySelector("main.layout-main") || document.querySelector(".layout-main");
    if (!main) return undefined;

    const host = document.createElement("div");
    host.setAttribute(GRAMMAR_BACK_HOST_ATTR, "true");
    host.style.display = "grid";
    host.style.padding = "0 16px 88px";
    host.style.boxSizing = "border-box";
    main.appendChild(host);
    setGrammarBackHost(host);

    return () => {
      setGrammarBackHost(null);
      if (host.parentNode) host.parentNode.removeChild(host);
    };
  }, [grammarWorkbookTarget, normalizedPathname, search]);

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

  const grammarReturn = grammarWorkbookTarget ? (
    <>
      {grammarBackHost ? createPortal(<GrammarBackToWorkbookCard target={grammarWorkbookTarget} />, grammarBackHost) : null}
      <GrammarStickyWorkbookBar target={grammarWorkbookTarget} />
    </>
  ) : null;

  if (
    normalizedPathname === A1_DAY18_CHAPTER122_WORKBOOK_PATH
    || (normalizedPathname === A1_DAY18_CHAPTER122_GRAMMAR_PATH
      && new URLSearchParams(search || "").get("view") === "workbook")
  ) return <A1Day18Kapitel122WorkbookPage />;

  if (!shouldRenderGuide) return grammarReturn;

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
      {grammarReturn}
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