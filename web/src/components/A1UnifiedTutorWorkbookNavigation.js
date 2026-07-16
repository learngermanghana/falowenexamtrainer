import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import routeConfig from "../data/inAppWorkbookRoutes.json";
import { styles } from "../styles";
import { getInlineCourseAssignments, normalizeCourseAssignmentKey } from "../utils/courseLessonAssignments";
import CourseWorkbookSubmissionTabs from "./CourseWorkbookSubmissionTabs";
import {
  buildA1WorkbookContentGroups,
  findA1WorkbookTeilSections,
} from "./A1WorkbookSectionTabs";
import { findWorkbookPageRoot } from "./WorkbookInlineEnhancements";

const NAV_MOUNT_ATTRIBUTE = "data-a1-unified-tutor-workbook-nav";
const CREATED_SUBMISSION_HOST_ATTRIBUTE = "data-a1-unified-submission-host";
const SUBMISSION_CONTROLLER_ATTRIBUTE = "data-a1-unified-submission-controller";
const NATIVE_TABS_HIDDEN_ATTRIBUTE = "data-a1-unified-native-tabs-hidden";
const NATIVE_TABS_DISPLAY_ATTRIBUTE = "data-a1-unified-native-tabs-display";
const GROUP_DISPLAY_ATTRIBUTE = "data-a1-unified-group-display";
const LEGACY_NAV_DISPLAY_ATTRIBUTE = "data-a1-unified-legacy-nav-display";
const SHARED_VIEW_PARAM = "workbookTab";

const A1_WORKBOOK_ROUTE_ALIASES = Object.freeze([
  Object.freeze({
    pathname: "/campus/course/a1-day-3-german-alphabet-reviewing-workbook",
    day: 2,
    chapter: "0.2",
  }),
  Object.freeze({
    pathname: "/campus/course/a1-day-3-kapitel-1-2-workbook",
    day: 3,
    chapter: "1.2",
  }),
]);

const A1_SHARED_SECTION_OVERRIDES = Object.freeze({
  "A1-13": Object.freeze([
    Object.freeze({ key: "teil-1", number: 1, label: "Teil 1 · Anzeigen" }),
    Object.freeze({ key: "teil-2", number: 2, label: "Teil 2 · Nachricht" }),
    Object.freeze({ key: "teil-3", number: 3, label: "Teil 3 · Schreiben" }),
  ]),
});

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";
const normalizeText = (value = "") => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
const normalizeChapter = (value = "") => String(value || "").trim().toLowerCase();
const getButtonLabel = (button) => normalizeText(button?.textContent);

const configuredA1WorkbookRoutes = Object.entries(routeConfig?.A1 || {}).flatMap(([dayKey, routesByChapter]) =>
  Object.entries(routesByChapter || {}).map(([chapterKey, route]) => {
    const parsed = new URL(String(route || ""), "https://www.falowen.app");
    return {
      pathname: normalizePath(parsed.pathname),
      day: Number(dayKey),
      chapter: chapterKey === "*" ? "" : String(chapterKey),
      requiredView: parsed.searchParams.get("view") || "",
    };
  }),
);

const A1_WORKBOOK_ROUTE_CANDIDATES = [...A1_WORKBOOK_ROUTE_ALIASES, ...configuredA1WorkbookRoutes].sort(
  (left, right) => Number(Boolean(right.chapter)) - Number(Boolean(left.chapter)),
);

const buildMatch = ({ day, chapter = "" } = {}) => {
  const assignments = getInlineCourseAssignments("A1", Number(day));
  if (!assignments.length) return null;

  const selectedAssignment = chapter
    ? assignments.find((assignment) => normalizeChapter(assignment?.chapter) === normalizeChapter(chapter))
    : assignments.length === 1
      ? assignments[0]
      : null;
  if (!selectedAssignment?.assignmentKey) return null;

  const assignmentKey = normalizeCourseAssignmentKey(selectedAssignment.assignmentKey);
  return {
    level: "A1",
    day: Number(day),
    resource: {
      ...selectedAssignment,
      assignment: true,
      assignmentId: assignmentKey,
      assignment_id: assignmentKey,
      assignmentKey,
      canonicalAssignmentKey: assignmentKey,
      chapter: selectedAssignment.chapter || chapter || "",
      progressionEligible: true,
      resourceRole: "assignment",
    },
  };
};

const buildDynamicA1Match = ({ pathname = "", search = "" } = {}) => {
  const match = normalizePath(pathname).match(/^\/campus\/course\/lesson\/A1\/(\d+)$/i);
  if (!match) return null;

  const params = new URLSearchParams(search || "");
  const requestedView = normalizeText(params.get("view"));
  if (requestedView === "grammar" || requestedView === "learn") return null;

  return buildMatch({ day: Number(match[1]), chapter: String(params.get("chapter") || "").trim() });
};

export const resolveA1UnifiedTutorWorkbookMatch = ({ pathname = "", search = "" } = {}) => {
  const normalizedPathname = normalizePath(pathname);
  const searchParams = new URLSearchParams(search || "");

  for (const candidate of A1_WORKBOOK_ROUTE_CANDIDATES) {
    if (candidate.pathname !== normalizedPathname) continue;
    if (candidate.requiredView && searchParams.get("view") !== candidate.requiredView) continue;
    const match = buildMatch({ day: candidate.day, chapter: candidate.chapter });
    if (match) return match;
  }

  return buildDynamicA1Match({ pathname, search });
};

export const findA1NativeAssignmentTabList = (pageRoot) =>
  Array.from(pageRoot?.querySelectorAll?.('[role="tablist"]') || []).find((tabList) => {
    if (tabList.closest?.(`[${NAV_MOUNT_ATTRIBUTE}="true"]`)) return false;
    const labels = Array.from(tabList.querySelectorAll("button")).map(getButtonLabel);
    return labels.includes("assignment") && labels.includes("submit");
  }) || null;

export const shouldPreserveA1NativeAssignmentTabs = (pageRoot) =>
  Boolean(findA1NativeAssignmentTabList(pageRoot));

const findTabButton = (root, label) =>
  Array.from(root?.querySelectorAll?.("button") || []).find((button) => getButtonLabel(button) === label) || null;

export const hideA1NativeAssignmentTabs = (pageRoot) => {
  const tabList = findA1NativeAssignmentTabList(pageRoot);
  if (!tabList) return null;

  if (!tabList.hasAttribute(NATIVE_TABS_HIDDEN_ATTRIBUTE)) {
    tabList.setAttribute(NATIVE_TABS_HIDDEN_ATTRIBUTE, "true");
    tabList.setAttribute(NATIVE_TABS_DISPLAY_ATTRIBUTE, tabList.style.display || "");
  }
  tabList.style.display = "none";
  return tabList;
};

export const restoreA1NativeAssignmentTabs = (pageRoot) => {
  Array.from(pageRoot?.querySelectorAll?.(`[${NATIVE_TABS_HIDDEN_ATTRIBUTE}]`) || []).forEach((tabList) => {
    tabList.style.display = tabList.getAttribute(NATIVE_TABS_DISPLAY_ATTRIBUTE) || "";
    tabList.removeAttribute(NATIVE_TABS_HIDDEN_ATTRIBUTE);
    tabList.removeAttribute(NATIVE_TABS_DISPLAY_ATTRIBUTE);
  });
};

const rememberGroupDisplay = (element) => {
  if (!element || element.hasAttribute(GROUP_DISPLAY_ATTRIBUTE)) return;
  element.setAttribute(GROUP_DISPLAY_ATTRIBUTE, element.style.display || "");
};

const hideGroupElement = (element) => {
  rememberGroupDisplay(element);
  element.style.display = "none";
  element.setAttribute("aria-hidden", "true");
};

const showGroupElement = (element) => {
  if (!element) return;
  if (element.hasAttribute(GROUP_DISPLAY_ATTRIBUTE)) {
    element.style.display = element.getAttribute(GROUP_DISPLAY_ATTRIBUTE) || "";
  } else {
    element.style.display = "";
  }
  element.removeAttribute("aria-hidden");
};

export const restoreA1UnifiedWorkbookGroups = (pageRoot) => {
  Array.from(pageRoot?.querySelectorAll?.(`[${GROUP_DISPLAY_ATTRIBUTE}]`) || []).forEach((element) => {
    showGroupElement(element);
    element.removeAttribute(GROUP_DISPLAY_ATTRIBUTE);
  });
};

export const applyA1UnifiedWorkbookView = ({ groups = [], activeView = "assignment" } = {}) => {
  if (activeView === "assignment") {
    groups.forEach((group) => group.elements.forEach(showGroupElement));
    return;
  }

  if (activeView === "overview") {
    groups.forEach((group) => group.elements.forEach(hideGroupElement));
    return;
  }

  const selectedTeil = /^teil-(\d+)$/i.exec(String(activeView || ""));
  const selectedNumber = selectedTeil ? Number(selectedTeil[1]) : null;
  groups.forEach((group) => {
    const shouldShow = Number(group.number) === selectedNumber;
    group.elements.forEach((element) => {
      if (shouldShow) showGroupElement(element);
      else hideGroupElement(element);
    });
  });
};

export const resolveA1SharedSectionState = ({ pageRoot, assignmentKey = "" } = {}) => {
  const normalizedKey = normalizeCourseAssignmentKey(assignmentKey);
  const override = A1_SHARED_SECTION_OVERRIDES[normalizedKey];
  if (override) {
    return {
      groups: [],
      pageManaged: true,
      tabs: override.map((tab) => ({ ...tab })),
    };
  }

  const groups = buildA1WorkbookContentGroups(pageRoot, findA1WorkbookTeilSections(pageRoot));
  return {
    groups,
    pageManaged: false,
    tabs: groups.map((group) => ({
      key: `teil-${group.number}`,
      number: group.number,
      label: group.label || `Teil ${group.number}`,
    })),
  };
};

const navButtonStyle = (selected, submit = false) => ({
  ...styles.secondaryButton,
  background: selected ? (submit ? "#166534" : "#2563eb") : submit ? "#ecfdf5" : "#ffffff",
  borderColor: submit ? "#86efac" : selected ? "#2563eb" : "#93c5fd",
  color: selected ? "#ffffff" : submit ? "#166534" : "#1d4ed8",
  flex: "1 1 120px",
  fontWeight: 900,
  minHeight: 46,
  padding: "10px 14px",
});

const rememberLegacyDisplay = (element) => {
  if (!element || element.hasAttribute(LEGACY_NAV_DISPLAY_ATTRIBUTE)) return;
  element.setAttribute(LEGACY_NAV_DISPLAY_ATTRIBUTE, element.style.display || "");
};

const suppressLegacyNavigation = (main) => {
  const selectors = [
    '[data-a1-teil-navigation="true"]',
    '[aria-label="A1 Day 21 workbook navigation"]',
  ];
  selectors.forEach((selector) => {
    Array.from(main?.querySelectorAll?.(selector) || []).forEach((element) => {
      rememberLegacyDisplay(element);
      element.style.display = "none";
    });
  });
};

const restoreLegacyNavigation = (main) => {
  Array.from(main?.querySelectorAll?.(`[${LEGACY_NAV_DISPLAY_ATTRIBUTE}]`) || []).forEach((element) => {
    element.style.display = element.getAttribute(LEGACY_NAV_DISPLAY_ATTRIBUTE) || "";
    element.removeAttribute(LEGACY_NAV_DISPLAY_ATTRIBUTE);
  });
};

const findFallbackPageRoot = (main) =>
  Array.from(main?.children || []).find((element) => {
    if (element.hasAttribute?.(NAV_MOUNT_ATTRIBUTE)) return false;
    if (element.hasAttribute?.(CREATED_SUBMISSION_HOST_ATTRIBUTE)) return false;
    if (element.hasAttribute?.("data-workbook-inline-enhancements-anchor")) return false;
    return Boolean(element.querySelector?.("h1, h2"));
  }) || null;

const getRequestedSharedView = (search = "") => {
  const value = String(new URLSearchParams(search || "").get(SHARED_VIEW_PARAM) || "").trim().toLowerCase();
  if (value === "submit" || value === "overview" || value === "assignment") return value;
  return /^teil-\d+$/.test(value) ? value : "";
};

const sameTabs = (left = [], right = []) =>
  left.length === right.length && left.every((tab, index) => tab.key === right[index]?.key && tab.label === right[index]?.label);

export default function A1UnifiedTutorWorkbookNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const match = useMemo(
    () => resolveA1UnifiedTutorWorkbookMatch({ pathname: location.pathname, search: location.search }),
    [location.pathname, location.search],
  );
  const assignmentKey = normalizeCourseAssignmentKey(match?.resource?.assignmentKey);
  const routeKey = `${normalizePath(location.pathname)}|${assignmentKey}`;
  const requestedView = getRequestedSharedView(location.search);
  const [activeView, setActiveView] = useState(requestedView || "overview");
  const [navMount, setNavMount] = useState(null);
  const [submissionHost, setSubmissionHost] = useState(null);
  const [ownsSubmissionHost, setOwnsSubmissionHost] = useState(false);
  const [sectionTabs, setSectionTabs] = useState([]);
  const pageRootRef = useRef(null);
  const groupsRef = useRef([]);
  const pageManagedRef = useRef(false);
  const createdNodesRef = useRef({ nav: null, submission: null });

  const syncLocation = useCallback(
    (view) => {
      if (!match || !assignmentKey) return;
      const nextSearch = new URLSearchParams(location.search || "");
      nextSearch.set(SHARED_VIEW_PARAM, view);
      nextSearch.set("assignmentKey", assignmentKey);
      nextSearch.set("assignmentId", assignmentKey);
      nextSearch.set("level", "A1");
      const nextSearchText = `?${nextSearch.toString()}`;
      if (nextSearchText === location.search) return;

      navigate(
        { pathname: location.pathname, search: nextSearchText, hash: location.hash },
        {
          replace: true,
          state: {
            ...(location.state || {}),
            level: "A1",
            day: Number(match.day),
            assignmentKey,
            assignmentId: assignmentKey,
            canonicalAssignmentKey: assignmentKey,
            inlineCourseSubmission: true,
          },
        },
      );
    },
    [assignmentKey, location.hash, location.pathname, location.search, location.state, match, navigate],
  );

  const refreshSectionState = useCallback(() => {
    const pageRoot = pageRootRef.current;
    if (!pageRoot) return { groups: [], pageManaged: false, tabs: [] };
    const nextState = resolveA1SharedSectionState({ pageRoot, assignmentKey });
    groupsRef.current = nextState.groups;
    pageManagedRef.current = nextState.pageManaged;
    setSectionTabs((current) => (sameTabs(current, nextState.tabs) ? current : nextState.tabs));
    return nextState;
  }, [assignmentKey]);

  const activateUnderlyingView = useCallback(
    (view) => {
      const label = view === "submit" ? "submit" : "assignment";
      const pageRoot = pageRootRef.current;
      const nativeTabs = findA1NativeAssignmentTabList(pageRoot);
      const nativeButton = findTabButton(nativeTabs, label);
      if (nativeButton && nativeButton.getAttribute("aria-selected") !== "true") nativeButton.click();
      if (nativeTabs) hideA1NativeAssignmentTabs(pageRoot);

      const controller = submissionHost?.querySelector?.('[aria-label="Workbook assignment navigation"]');
      const controllerButton = findTabButton(controller, label);
      if (!nativeButton && controllerButton && controllerButton.getAttribute("aria-selected") !== "true") {
        controllerButton.click();
      }
    },
    [submissionHost],
  );

  useEffect(() => {
    if (requestedView === "submit" || requestedView === "overview" || /^teil-\d+$/.test(requestedView)) {
      setActiveView(requestedView);
      return;
    }
    if (requestedView === "assignment" && sectionTabs.length === 0) setActiveView("assignment");
  }, [requestedView, routeKey, sectionTabs.length]);

  useEffect(() => {
    if (sectionTabs.length > 0 && (!requestedView || requestedView === "assignment")) {
      setActiveView("overview");
    } else if (sectionTabs.length === 0 && activeView === "overview") {
      setActiveView("assignment");
    }
  }, [activeView, requestedView, sectionTabs.length]);

  useEffect(() => {
    if (!match || typeof document === "undefined") return undefined;

    let disposed = false;
    let scheduled = false;
    let attempts = 0;

    const clearCreatedNodes = () => {
      Object.values(createdNodesRef.current).forEach((node) => node?.remove?.());
      createdNodesRef.current = { nav: null, submission: null };
    };

    const install = () => {
      scheduled = false;
      if (disposed) return;

      const main = document.querySelector("main.layout-main") || document.querySelector("main");
      const anchor = main?.querySelector?.('[data-workbook-inline-enhancements-anchor]');
      const pageRoot = findWorkbookPageRoot(anchor) || findFallbackPageRoot(main);
      if (!main || !pageRoot) {
        attempts += 1;
        if (attempts < 120) scheduleInstall();
        return;
      }

      pageRootRef.current = pageRoot;
      suppressLegacyNavigation(main);
      const nativeTabs = hideA1NativeAssignmentTabs(pageRoot);

      let host = nativeTabs ? pageRoot : main.querySelector('[data-a1-workbook-submission-mount="true"]');
      let ownsHost = false;
      if (!host && attempts > 24) {
        host = main.querySelector(`[${CREATED_SUBMISSION_HOST_ATTRIBUTE}="true"]`);
        if (!host) {
          host = document.createElement("div");
          host.setAttribute(CREATED_SUBMISSION_HOST_ATTRIBUTE, "true");
          host.setAttribute("data-assignment-key", assignmentKey);
          pageRoot.parentElement?.insertBefore(host, pageRoot);
          createdNodesRef.current.submission = host;
        }
        ownsHost = true;
      }

      if (!host) {
        attempts += 1;
        scheduleInstall();
        return;
      }

      if (!nativeTabs) host.setAttribute(SUBMISSION_CONTROLLER_ATTRIBUTE, "true");
      let nextNavMount = main.querySelector(`[${NAV_MOUNT_ATTRIBUTE}="true"]`);
      if (!nextNavMount) {
        nextNavMount = document.createElement("div");
        nextNavMount.setAttribute(NAV_MOUNT_ATTRIBUTE, "true");
        pageRoot.parentElement?.insertBefore(nextNavMount, pageRoot);
        createdNodesRef.current.nav = nextNavMount;
      }

      refreshSectionState();
      setNavMount((current) => (current === nextNavMount ? current : nextNavMount));
      setSubmissionHost((current) => (current === host ? current : host));
      setOwnsSubmissionHost(ownsHost);
    };

    const scheduleInstall = () => {
      if (scheduled || disposed) return;
      scheduled = true;
      const schedule = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 0));
      schedule(install);
    };

    scheduleInstall();
    const observer = new MutationObserver(scheduleInstall);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      disposed = true;
      observer.disconnect();
      restoreA1UnifiedWorkbookGroups(pageRootRef.current);
      restoreA1NativeAssignmentTabs(pageRootRef.current);
      const main = document.querySelector("main.layout-main") || document.querySelector("main");
      restoreLegacyNavigation(main);
      submissionHost?.removeAttribute?.(SUBMISSION_CONTROLLER_ATTRIBUTE);
      clearCreatedNodes();
      pageRootRef.current = null;
      groupsRef.current = [];
      pageManagedRef.current = false;
      setNavMount(null);
      setSubmissionHost(null);
      setOwnsSubmissionHost(false);
      setSectionTabs([]);
    };
  }, [assignmentKey, match, refreshSectionState, routeKey]);

  useEffect(() => {
    if (!match || !pageRootRef.current || !navMount) return undefined;

    const applyView = () => {
      activateUnderlyingView(activeView);
      const nextState = refreshSectionState();
      if (activeView !== "submit" && !nextState.pageManaged) {
        applyA1UnifiedWorkbookView({ groups: nextState.groups, activeView });
      }
      hideA1NativeAssignmentTabs(pageRootRef.current);
      suppressLegacyNavigation(document.querySelector("main.layout-main") || document.querySelector("main"));
      syncLocation(activeView);
    };

    applyView();
    const timers = [60, 220, 700].map((delay) => window.setTimeout(applyView, delay));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [activeView, activateUnderlyingView, match, navMount, refreshSectionState, routeKey, syncLocation]);

  const selectView = useCallback((view) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!match || !navMount) return null;

  const hasSections = sectionTabs.length > 0;
  const navItems = [
    ...(hasSections
      ? [{ key: "overview", label: "Overview" }, ...sectionTabs.map((tab) => ({ key: tab.key, label: `Teil ${tab.number}` }))]
      : [{ key: "assignment", label: "Assignment" }]),
    { key: "submit", label: "Submit", submit: true },
  ];

  const navigation = createPortal(
    <section
      aria-label="Unified A1 tutor-marked workbook navigation"
      style={{
        ...styles.card,
        position: "sticky",
        top: 8,
        zIndex: 35,
        border: "2px solid #2563eb",
        background: "linear-gradient(135deg, #dbeafe 0%, #ffffff 74%)",
        margin: "0 0 12px",
        padding: 12,
      }}
    >
      <style>{`
        [data-a1-teil-navigation="true"],
        [aria-label="A1 Day 21 workbook navigation"],
        [${NATIVE_TABS_HIDDEN_ATTRIBUTE}="true"] { display: none !important; }
      `}</style>
      <div
        role="tablist"
        aria-label="A1 shared Overview, Teil and Submit navigation"
        style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
      >
        {navItems.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={activeView === item.key}
            style={navButtonStyle(activeView === item.key, item.submit)}
            onClick={() => selectView(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {hasSections && activeView === "overview" ? (
        <div
          data-a1-shared-workbook-overview="true"
          style={{
            background: "rgba(255,255,255,.88)",
            border: "1px solid #bfdbfe",
            borderRadius: 14,
            display: "grid",
            gap: 10,
            marginTop: 12,
            padding: 12,
          }}
        >
          <strong style={{ color: "#0f172a" }}>Assignment overview</strong>
          <p style={{ color: "#475569", lineHeight: 1.6, margin: 0 }}>
            Complete each Teil separately, then open Submit to send all final answers for tutor marking.
          </p>
          <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            {sectionTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                style={{ ...styles.secondaryButton, textAlign: "left" }}
                onClick={() => selectView(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>,
    navMount,
  );

  const submissionController = ownsSubmissionHost && submissionHost
    ? createPortal(
        <CourseWorkbookSubmissionTabs hostRef={{ current: submissionHost }} match={match} />,
        submissionHost,
      )
    : null;

  return (
    <>
      {navigation}
      {submissionController}
    </>
  );
}

export const __TESTING__ = {
  A1_SHARED_SECTION_OVERRIDES,
  A1_WORKBOOK_ROUTE_CANDIDATES,
  getRequestedSharedView,
  normalizePath,
  normalizeText,
};
