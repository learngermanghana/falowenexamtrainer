import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { styles } from "../styles";
import { getInlineCourseAssignments, normalizeCourseAssignmentKey } from "../utils/courseLessonAssignments";
import { buildA1WorkbookContentGroups, findA1WorkbookTeilSections } from "./A1WorkbookSectionTabs";
import CourseWorkbookSubmissionTabs from "./CourseWorkbookSubmissionTabs";
import {
  A1_TUTOR_MARKED_ASSIGNMENT_KEYS,
  findWorkbookPageRoot,
  resolveA1WorkbookSubmissionMatch,
} from "./WorkbookInlineEnhancements";

const NAV_MOUNT_ATTRIBUTE = "data-a1-unified-tutor-workbook-nav";
const OVERVIEW_MOUNT_ATTRIBUTE = "data-a1-unified-tutor-workbook-overview";
const CREATED_SUBMISSION_HOST_ATTRIBUTE = "data-a1-unified-submission-host";
const SUBMISSION_CONTROLLER_ATTRIBUTE = "data-a1-unified-submission-controller";
const NATIVE_TABS_HIDDEN_ATTRIBUTE = "data-a1-unified-native-tabs-hidden";
const NATIVE_TABS_DISPLAY_ATTRIBUTE = "data-a1-unified-native-tabs-display";
const GROUP_DISPLAY_ATTRIBUTE = "data-a1-unified-group-display";
const CONTROLLER_DISPLAY_ATTRIBUTE = "data-a1-unified-controller-display";

const tutorMarkedKeySet = new Set(A1_TUTOR_MARKED_ASSIGNMENT_KEYS.map(normalizeCourseAssignmentKey));

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";
const normalizeText = (value = "") => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();

const getButtonLabel = (button) => normalizeText(button?.textContent);

export const findA1NativeAssignmentTabList = (pageRoot) =>
  Array.from(pageRoot?.querySelectorAll?.('[role="tablist"]') || []).find((tabList) => {
    const labels = Array.from(tabList.querySelectorAll("button")).map(getButtonLabel);
    return labels.includes("assignment") && labels.includes("submit");
  }) || null;

const findTabButton = (root, label) =>
  Array.from(root?.querySelectorAll?.("button") || []).find((button) => getButtonLabel(button) === label) || null;

const rememberDisplay = (element, attribute) => {
  if (!element || element.hasAttribute(attribute)) return;
  element.setAttribute(attribute, element.style.display || "");
};

const restoreDisplay = (element, attribute) => {
  if (!element?.hasAttribute(attribute)) return;
  element.style.display = element.getAttribute(attribute) || "";
  element.removeAttribute(attribute);
};

export const hideA1NativeAssignmentTabs = (pageRoot) => {
  const tabList = findA1NativeAssignmentTabList(pageRoot);
  if (!tabList) return null;

  const assignmentButton = findTabButton(tabList, "assignment");
  if (assignmentButton && assignmentButton.getAttribute("aria-selected") !== "true") {
    assignmentButton.click();
  }

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

const rememberGroupDisplay = (element) => rememberDisplay(element, GROUP_DISPLAY_ATTRIBUTE);
const hideGroupElement = (element) => {
  rememberGroupDisplay(element);
  element.style.display = "none";
};
const showGroupElement = (element) => restoreDisplay(element, GROUP_DISPLAY_ATTRIBUTE);

export const restoreA1UnifiedWorkbookGroups = (pageRoot) => {
  Array.from(pageRoot?.querySelectorAll?.(`[${GROUP_DISPLAY_ATTRIBUTE}]`) || []).forEach(showGroupElement);
};

export const applyA1UnifiedWorkbookView = ({ groups = [], activeView = "overview" } = {}) => {
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

const buildDynamicA1Match = ({ pathname = "", search = "" } = {}) => {
  const match = normalizePath(pathname).match(/^\/campus\/course\/lesson\/A1\/(\d+)$/i);
  if (!match) return null;

  const params = new URLSearchParams(search || "");
  const requestedView = normalizeText(params.get("view"));
  if (requestedView === "grammar" || requestedView === "learn") return null;

  const day = Number(match[1]);
  const chapter = String(params.get("chapter") || "").trim();
  const assignments = getInlineCourseAssignments("A1", day).filter((assignment) =>
    tutorMarkedKeySet.has(normalizeCourseAssignmentKey(assignment?.assignmentKey)),
  );
  if (!assignments.length) return null;

  const selectedAssignment = chapter
    ? assignments.find((assignment) => String(assignment?.chapter || "").trim() === chapter)
    : assignments.length === 1
      ? assignments[0]
      : null;
  if (!selectedAssignment?.assignmentKey) return null;

  const assignmentKey = normalizeCourseAssignmentKey(selectedAssignment.assignmentKey);
  return {
    level: "A1",
    day,
    resource: {
      ...selectedAssignment,
      assignment: true,
      assignmentId: assignmentKey,
      assignment_id: assignmentKey,
      assignmentKey,
      canonicalAssignmentKey: assignmentKey,
      progressionEligible: true,
      resourceRole: "assignment",
    },
  };
};

export const resolveA1UnifiedTutorWorkbookMatch = ({ pathname = "", search = "" } = {}) =>
  resolveA1WorkbookSubmissionMatch({ pathname, search }) || buildDynamicA1Match({ pathname, search });

const getGroupSignature = (groups = []) =>
  groups
    .map((group) => `${group.number}:${normalizeText(group.heading?.textContent)}:${group.elements.length}`)
    .join("|");

const getTeilLabel = (group) => {
  const suffix = String(group?.heading?.textContent || "")
    .replace(/^\s*Teil\s*\d+\s*[·:—-]?\s*/i, "")
    .trim();
  return suffix ? `Teil ${group.number} · ${suffix}` : `Teil ${group.number}`;
};

const navButtonStyle = (selected) => ({
  ...styles.secondaryButton,
  background: selected ? "#2563eb" : "#ffffff",
  borderColor: selected ? "#2563eb" : "#93c5fd",
  color: selected ? "#ffffff" : "#1d4ed8",
  flex: "0 0 auto",
  fontWeight: 900,
  minHeight: 44,
  padding: "9px 14px",
});

export default function A1UnifiedTutorWorkbookNavigation() {
  const location = useLocation();
  const match = useMemo(
    () => resolveA1UnifiedTutorWorkbookMatch({ pathname: location.pathname, search: location.search }),
    [location.pathname, location.search],
  );
  const routeKey = `${normalizePath(location.pathname)}|${match?.resource?.assignmentKey || ""}`;
  const requestedTab = new URLSearchParams(location.search || "").get("workbookTab");
  const [activeView, setActiveView] = useState(requestedTab === "submit" ? "submit" : "overview");
  const [navMount, setNavMount] = useState(null);
  const [overviewMount, setOverviewMount] = useState(null);
  const [submissionHost, setSubmissionHost] = useState(null);
  const [ownsSubmissionHost, setOwnsSubmissionHost] = useState(false);
  const [groups, setGroups] = useState([]);
  const pageRootRef = useRef(null);
  const groupSignatureRef = useRef("");
  const createdNodesRef = useRef({ nav: null, overview: null, submission: null });

  useEffect(() => {
    setActiveView(requestedTab === "submit" ? "submit" : "overview");
  }, [routeKey]);

  const activateAssignmentContent = useCallback(() => {
    const pageRoot = pageRootRef.current;
    if (!pageRoot) return;

    const nativeTabList = findA1NativeAssignmentTabList(pageRoot);
    const nativeAssignment = findTabButton(nativeTabList, "assignment");
    if (nativeAssignment && nativeAssignment.getAttribute("aria-selected") !== "true") nativeAssignment.click();

    const controller = submissionHost?.querySelector?.('[aria-label="Workbook assignment navigation"]');
    const sharedAssignment = findTabButton(controller, "assignment");
    if (sharedAssignment) sharedAssignment.click();
    if (controller) {
      rememberDisplay(controller, CONTROLLER_DISPLAY_ATTRIBUTE);
      controller.style.display = "none";
    }
  }, [submissionHost]);

  const activateSubmit = useCallback(() => {
    const controller = submissionHost?.querySelector?.('[aria-label="Workbook assignment navigation"]');
    if (!controller) return false;
    rememberDisplay(controller, CONTROLLER_DISPLAY_ATTRIBUTE);
    controller.style.display = "grid";
    const submitButton = findTabButton(controller, "submit");
    submitButton?.click();
    return Boolean(submitButton);
  }, [submissionHost]);

  useEffect(() => {
    if (!match || typeof document === "undefined") return undefined;

    let disposed = false;
    let scheduled = false;
    let attempts = 0;

    const install = () => {
      scheduled = false;
      if (disposed) return;

      const main = document.querySelector("main.layout-main") || document.querySelector("main");
      const anchor = main?.querySelector?.('[data-workbook-inline-enhancements-anchor]');
      const pageRoot = findWorkbookPageRoot(anchor);
      if (!main || !anchor || !pageRoot) {
        attempts += 1;
        if (attempts < 120) scheduleInstall();
        return;
      }

      pageRootRef.current = pageRoot;
      const nativeTabList = hideA1NativeAssignmentTabs(pageRoot);
      let host = main.querySelector('[data-a1-workbook-submission-mount="true"]');
      let ownsHost = false;

      if (!host && (nativeTabList || attempts > 24)) {
        host = main.querySelector(`[${CREATED_SUBMISSION_HOST_ATTRIBUTE}="true"]`);
        if (!host) {
          host = document.createElement("div");
          host.setAttribute(CREATED_SUBMISSION_HOST_ATTRIBUTE, "true");
          host.setAttribute("data-assignment-key", match.resource.assignmentKey);
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

      host.setAttribute(SUBMISSION_CONTROLLER_ATTRIBUTE, "true");
      let nextNavMount = main.querySelector(`[${NAV_MOUNT_ATTRIBUTE}="true"]`);
      if (!nextNavMount) {
        nextNavMount = document.createElement("div");
        nextNavMount.setAttribute(NAV_MOUNT_ATTRIBUTE, "true");
        host.parentElement?.insertBefore(nextNavMount, host);
        createdNodesRef.current.nav = nextNavMount;
      }

      let nextOverviewMount = main.querySelector(`[${OVERVIEW_MOUNT_ATTRIBUTE}="true"]`);
      if (!nextOverviewMount) {
        nextOverviewMount = document.createElement("div");
        nextOverviewMount.setAttribute(OVERVIEW_MOUNT_ATTRIBUTE, "true");
        host.parentElement?.insertBefore(nextOverviewMount, host);
        createdNodesRef.current.overview = nextOverviewMount;
      }

      const nextGroups = buildA1WorkbookContentGroups(pageRoot, findA1WorkbookTeilSections(pageRoot));
      const nextSignature = getGroupSignature(nextGroups);
      if (nextSignature !== groupSignatureRef.current) {
        groupSignatureRef.current = nextSignature;
        setGroups(nextGroups);
      }

      if (navMount !== nextNavMount) setNavMount(nextNavMount);
      if (overviewMount !== nextOverviewMount) setOverviewMount(nextOverviewMount);
      if (submissionHost !== host) setSubmissionHost(host);
      if (ownsSubmissionHost !== ownsHost) setOwnsSubmissionHost(ownsHost);
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
      const controller = submissionHost?.querySelector?.('[aria-label="Workbook assignment navigation"]');
      restoreDisplay(controller, CONTROLLER_DISPLAY_ATTRIBUTE);
      submissionHost?.removeAttribute?.(SUBMISSION_CONTROLLER_ATTRIBUTE);
      Object.values(createdNodesRef.current).forEach((node) => node?.remove?.());
      createdNodesRef.current = { nav: null, overview: null, submission: null };
      pageRootRef.current = null;
      groupSignatureRef.current = "";
      setNavMount(null);
      setOverviewMount(null);
      setSubmissionHost(null);
      setOwnsSubmissionHost(false);
      setGroups([]);
    };
  }, [match, routeKey]);

  useEffect(() => {
    if (!match || !pageRootRef.current) return undefined;

    const applyView = () => {
      if (activeView === "submit") {
        restoreA1UnifiedWorkbookGroups(pageRootRef.current);
        activateSubmit();
        return;
      }

      activateAssignmentContent();
      window.setTimeout(() => {
        const pageRoot = pageRootRef.current;
        if (!pageRoot) return;
        const nextGroups = buildA1WorkbookContentGroups(pageRoot, findA1WorkbookTeilSections(pageRoot));
        const nextSignature = getGroupSignature(nextGroups);
        if (nextSignature !== groupSignatureRef.current) {
          groupSignatureRef.current = nextSignature;
          setGroups(nextGroups);
        }
        applyA1UnifiedWorkbookView({ groups: nextGroups, activeView });
      }, 0);
    };

    applyView();
    const timers = [60, 220, 700].map((delay) => window.setTimeout(applyView, delay));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [activeView, activateAssignmentContent, activateSubmit, match, routeKey]);

  if (!match || !navMount) return null;

  const assignmentKey = match.resource.assignmentKey;
  const chapter = match.resource.chapter || "";
  const navigation = createPortal(
    <section
      aria-label="Unified A1 tutor-marked workbook navigation"
      style={{
        ...styles.card,
        position: "sticky",
        top: 8,
        zIndex: 35,
        display: "grid",
        gap: 10,
        border: "2px solid #2563eb",
        background: "linear-gradient(135deg, #dbeafe 0%, #ffffff 74%)",
        margin: "0 0 12px",
        padding: 12,
      }}
    >
      <style>{`
        [data-a1-teil-navigation="true"],
        [data-a1-workbook-overview="true"],
        [${NATIVE_TABS_HIDDEN_ATTRIBUTE}="true"] { display: none !important; }
        [${SUBMISSION_CONTROLLER_ATTRIBUTE}="true"] > [aria-label="Workbook assignment navigation"] > div:first-child {
          display: none !important;
        }
      `}</style>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <strong style={{ color: "#0f172a" }}>A1 · Day {match.day}{chapter ? ` · Kapitel ${chapter}` : ""}</strong>
          <p style={{ margin: "3px 0 0", color: "#475569", fontSize: 12 }}>
            Tutor Marked Assignment · {assignmentKey}
          </p>
        </div>
        <span style={{ color: "#1d4ed8", fontSize: 12, fontWeight: 900 }}>One section at a time</span>
      </div>
      <div role="tablist" aria-label="A1 workbook sections" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
        <button type="button" role="tab" aria-selected={activeView === "overview"} style={navButtonStyle(activeView === "overview")} onClick={() => setActiveView("overview")}>
          Overview
        </button>
        {groups.map((group) => {
          const key = `teil-${group.number}`;
          return (
            <button key={key} type="button" role="tab" aria-selected={activeView === key} style={navButtonStyle(activeView === key)} onClick={() => setActiveView(key)}>
              Teil {group.number}
            </button>
          );
        })}
        <button type="button" role="tab" aria-selected={activeView === "submit"} style={{ ...navButtonStyle(activeView === "submit"), background: activeView === "submit" ? "#166534" : "#ecfdf5", borderColor: "#86efac", color: activeView === "submit" ? "#ffffff" : "#166534" }} onClick={() => setActiveView("submit")}>
          Submit
        </button>
      </div>
    </section>,
    navMount,
  );

  const overview = overviewMount
    ? createPortal(
        activeView === "overview" ? (
          <section
            data-a1-unified-overview-card="true"
            style={{ ...styles.card, display: "grid", gap: 12, border: "1px solid #bfdbfe", background: "#f8fbff", marginBottom: 12 }}
          >
            <div>
              <p style={{ margin: 0, color: "#1d4ed8", fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".05em" }}>
                Workbook overview
              </p>
              <h2 style={{ margin: "4px 0" }}>Complete every Teil, then submit once</h2>
              <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>
                Open one Teil at a time. Your lesson content and questions remain unchanged. When all sections are complete, use Submit for the final tutor-marked answer.
              </p>
            </div>
            <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
              {groups.map((group) => (
                <button key={group.number} type="button" style={{ ...styles.secondaryButton, display: "grid", gap: 4, textAlign: "left", justifyItems: "start", borderColor: "#bfdbfe", background: "#ffffff", padding: 12 }} onClick={() => setActiveView(`teil-${group.number}`)}>
                  <strong>Teil {group.number}</strong>
                  <span style={{ color: "#475569", fontSize: 12 }}>{getTeilLabel(group).replace(/^Teil\s*\d+\s*[·:—-]?\s*/i, "") || "Assignment section"}</span>
                </button>
              ))}
            </div>
          </section>
        ) : null,
        overviewMount,
      )
    : null;

  const submissionController = ownsSubmissionHost && submissionHost
    ? createPortal(
        <CourseWorkbookSubmissionTabs hostRef={{ current: submissionHost }} match={match} />,
        submissionHost,
      )
    : null;

  return (
    <>
      {navigation}
      {overview}
      {submissionController}
    </>
  );
}
