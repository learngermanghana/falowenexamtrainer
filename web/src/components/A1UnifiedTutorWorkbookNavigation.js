import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { styles } from "../styles";
import { getInlineCourseAssignments, normalizeCourseAssignmentKey } from "../utils/courseLessonAssignments";
import CourseWorkbookSubmissionTabs from "./CourseWorkbookSubmissionTabs";
import {
  A1_TUTOR_MARKED_ASSIGNMENT_KEYS,
  findWorkbookPageRoot,
  resolveA1WorkbookSubmissionMatch,
} from "./WorkbookInlineEnhancements";

const NAV_MOUNT_ATTRIBUTE = "data-a1-unified-tutor-workbook-nav";
const CREATED_SUBMISSION_HOST_ATTRIBUTE = "data-a1-unified-submission-host";
const SUBMISSION_CONTROLLER_ATTRIBUTE = "data-a1-unified-submission-controller";
const NATIVE_TABS_HIDDEN_ATTRIBUTE = "data-a1-unified-native-tabs-hidden";
const NATIVE_TABS_DISPLAY_ATTRIBUTE = "data-a1-unified-native-tabs-display";
const GROUP_DISPLAY_ATTRIBUTE = "data-a1-unified-group-display";
const CONTROLLER_DISPLAY_ATTRIBUTE = "data-a1-unified-controller-display";
const LEGACY_NAV_DISPLAY_ATTRIBUTE = "data-a1-native-tabs-legacy-nav-display";
const LEGACY_META_DISPLAY_ATTRIBUTE = "data-a1-native-tabs-legacy-meta-display";

const tutorMarkedKeySet = new Set(A1_TUTOR_MARKED_ASSIGNMENT_KEYS.map(normalizeCourseAssignmentKey));

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";
const normalizeText = (value = "") => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
const getButtonLabel = (button) => normalizeText(button?.textContent);

export const findA1NativeAssignmentTabList = (pageRoot) =>
  Array.from(pageRoot?.querySelectorAll?.('[role="tablist"]') || []).find((tabList) => {
    const labels = Array.from(tabList.querySelectorAll("button")).map(getButtonLabel);
    return labels.includes("assignment") && labels.includes("submit");
  }) || null;

export const shouldPreserveA1NativeAssignmentTabs = (pageRoot) =>
  Boolean(findA1NativeAssignmentTabList(pageRoot));

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

export const applyA1UnifiedWorkbookView = ({ groups = [], activeView = "assignment" } = {}) => {
  if (activeView === "assignment" || activeView === "overview") {
    groups.forEach((group) => group.elements.forEach(showGroupElement));
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

const navButtonStyle = (selected, submit = false) => ({
  ...styles.secondaryButton,
  background: selected ? (submit ? "#166534" : "#2563eb") : submit ? "#ecfdf5" : "#ffffff",
  borderColor: submit ? "#86efac" : selected ? "#2563eb" : "#93c5fd",
  color: selected ? "#ffffff" : submit ? "#166534" : "#1d4ed8",
  flex: "1 1 150px",
  fontWeight: 900,
  minHeight: 46,
  padding: "10px 16px",
});

const suppressLegacyChromeForNativeTabs = (main) => {
  Array.from(main?.querySelectorAll?.('[data-a1-teil-navigation="true"]') || []).forEach((element) => {
    rememberDisplay(element, LEGACY_NAV_DISPLAY_ATTRIBUTE);
    element.style.display = "none";
  });
  Array.from(main?.querySelectorAll?.('[data-a1-lesson-meta="true"]') || []).forEach((element) => {
    rememberDisplay(element, LEGACY_META_DISPLAY_ATTRIBUTE);
    element.style.display = "none";
  });
};

const restoreLegacyChrome = (main) => {
  Array.from(main?.querySelectorAll?.(`[${LEGACY_NAV_DISPLAY_ATTRIBUTE}]`) || []).forEach((element) =>
    restoreDisplay(element, LEGACY_NAV_DISPLAY_ATTRIBUTE),
  );
  Array.from(main?.querySelectorAll?.(`[${LEGACY_META_DISPLAY_ATTRIBUTE}]`) || []).forEach((element) =>
    restoreDisplay(element, LEGACY_META_DISPLAY_ATTRIBUTE),
  );
};

export default function A1UnifiedTutorWorkbookNavigation() {
  const location = useLocation();
  const match = useMemo(
    () => resolveA1UnifiedTutorWorkbookMatch({ pathname: location.pathname, search: location.search }),
    [location.pathname, location.search],
  );
  const routeKey = `${normalizePath(location.pathname)}|${match?.resource?.assignmentKey || ""}`;
  const requestedTab = new URLSearchParams(location.search || "").get("workbookTab");
  const [activeView, setActiveView] = useState(requestedTab === "submit" ? "submit" : "assignment");
  const [navMount, setNavMount] = useState(null);
  const [submissionHost, setSubmissionHost] = useState(null);
  const [ownsSubmissionHost, setOwnsSubmissionHost] = useState(false);
  const pageRootRef = useRef(null);
  const createdNodesRef = useRef({ nav: null, submission: null });

  useEffect(() => {
    setActiveView(requestedTab === "submit" ? "submit" : "assignment");
  }, [requestedTab, routeKey]);

  const activateAssignmentContent = useCallback(() => {
    const pageRoot = pageRootRef.current;
    if (!pageRoot) return;
    restoreA1UnifiedWorkbookGroups(pageRoot);

    const controller = submissionHost?.querySelector?.('[aria-label="Workbook assignment navigation"]');
    const sharedAssignment = findTabButton(controller, "assignment");
    sharedAssignment?.click();
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

    const clearCreatedNodes = () => {
      Object.values(createdNodesRef.current).forEach((node) => node?.remove?.());
      createdNodesRef.current = { nav: null, submission: null };
    };

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
      if (shouldPreserveA1NativeAssignmentTabs(pageRoot)) {
        restoreA1NativeAssignmentTabs(pageRoot);
        suppressLegacyChromeForNativeTabs(main);
        clearCreatedNodes();
        setNavMount(null);
        setSubmissionHost(null);
        setOwnsSubmissionHost(false);
        return;
      }

      restoreLegacyChrome(main);
      let host = main.querySelector('[data-a1-workbook-submission-mount="true"]');
      let ownsHost = false;

      if (!host && attempts > 24) {
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
      restoreLegacyChrome(main);
      const controller = submissionHost?.querySelector?.('[aria-label="Workbook assignment navigation"]');
      restoreDisplay(controller, CONTROLLER_DISPLAY_ATTRIBUTE);
      submissionHost?.removeAttribute?.(SUBMISSION_CONTROLLER_ATTRIBUTE);
      clearCreatedNodes();
      pageRootRef.current = null;
      setNavMount(null);
      setSubmissionHost(null);
      setOwnsSubmissionHost(false);
    };
  }, [match, routeKey]);

  useEffect(() => {
    if (!match || !pageRootRef.current || !navMount) return undefined;

    const applyView = () => {
      if (activeView === "submit") {
        activateSubmit();
      } else {
        activateAssignmentContent();
      }
    };

    applyView();
    const timers = [60, 220, 700].map((delay) => window.setTimeout(applyView, delay));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [activeView, activateAssignmentContent, activateSubmit, match, navMount, routeKey]);

  if (!match || !navMount) return null;

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
        [${NATIVE_TABS_HIDDEN_ATTRIBUTE}="true"] { display: none !important; }
        [${SUBMISSION_CONTROLLER_ATTRIBUTE}="true"] > [aria-label="Workbook assignment navigation"] > div:first-child {
          display: none !important;
        }
      `}</style>
      <div
        role="tablist"
        aria-label="A1 workbook Assignment and Submit"
        style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeView === "assignment"}
          style={navButtonStyle(activeView === "assignment")}
          onClick={() => setActiveView("assignment")}
        >
          Assignment
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeView === "submit"}
          style={navButtonStyle(activeView === "submit", true)}
          onClick={() => setActiveView("submit")}
        >
          Submit
        </button>
      </div>
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
