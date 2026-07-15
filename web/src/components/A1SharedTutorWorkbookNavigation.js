import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { styles } from "../styles";
import { buildA1WorkbookContentGroups, findA1WorkbookTeilSections } from "./A1WorkbookSectionTabs";
import { resolveA1UnifiedTutorWorkbookMatch } from "./A1UnifiedTutorWorkbookNavigation";

const STANDARD_HOST_ATTRIBUTE = "data-a1-shared-tutor-nav-host";
const STANDARD_NAV_ATTRIBUTE = "data-a1-shared-tutor-workbook-nav";
const HIDDEN_ATTRIBUTE = "data-a1-shared-nav-hidden";
const HIDDEN_DISPLAY_ATTRIBUTE = "data-a1-shared-nav-hidden-display";
const GROUP_DISPLAY_ATTRIBUTE = "data-a1-shared-nav-group-display";
const OLD_NAV_SELECTOR = '[data-a1-unified-tutor-workbook-nav="true"]';
const OLD_OVERVIEW_SELECTOR = '[data-a1-unified-tutor-workbook-overview="true"]';

const normalizeText = (value = "") => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
const getButtonLabel = (button) => normalizeText(button?.textContent);

const findButton = (root, label) =>
  Array.from(root?.querySelectorAll?.("button") || []).find(
    (button) => getButtonLabel(button) === normalizeText(label)
  ) || null;

const findAssignmentTabList = (root) =>
  Array.from(root?.querySelectorAll?.('[role="tablist"]') || []).find((tabList) => {
    const labels = Array.from(tabList.querySelectorAll("button")).map(getButtonLabel);
    return labels.includes("assignment") && labels.includes("submit");
  }) || null;

const isUtilityChild = (element) =>
  Boolean(
    element?.matches?.(
      `${OLD_NAV_SELECTOR}, ${OLD_OVERVIEW_SELECTOR}, [${STANDARD_HOST_ATTRIBUTE}], ` +
        '[data-workbook-inline-enhancements-anchor], [data-workbook-supporting-materials-host], ' +
        '[data-a1-workbook-submission-mount], [data-a1-unified-submission-host], ' +
        '[data-universal-workbook-lesson-navigator]'
    )
  );

export const findTutorWorkbookRoot = (main) => {
  if (!main?.children) return null;

  const candidates = Array.from(main.children)
    .filter((element) => !isUtilityChild(element))
    .map((element, index) => {
      const sections = findA1WorkbookTeilSections(element);
      const nativeTabs = findAssignmentTabList(element);
      const builtInSubmission = element.querySelector?.("[data-a1-built-in-submission]");
      return {
        element,
        index,
        sections,
        score: sections.length * 100 + (nativeTabs ? 30 : 0) + (builtInSubmission ? 10 : 0),
      };
    })
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score || left.index - right.index);

  return candidates[0]?.element || null;
};

const getRememberedGroupDisplay = (element) => {
  if (!element) return "";
  if (element.hasAttribute(GROUP_DISPLAY_ATTRIBUTE)) {
    return element.getAttribute(GROUP_DISPLAY_ATTRIBUTE) || "";
  }

  const previous =
    element.getAttribute("data-a1-unified-group-display") ||
    element.getAttribute("data-a1-tab-previous-display") ||
    (element.style.display === "none" ? "" : element.style.display) ||
    "";
  element.setAttribute(GROUP_DISPLAY_ATTRIBUTE, previous);
  return previous;
};

const hideGroup = (element) => {
  if (!element) return;
  getRememberedGroupDisplay(element);
  element.style.display = "none";
  element.setAttribute("aria-hidden", "true");
};

const showGroup = (element) => {
  if (!element) return;
  element.style.display = getRememberedGroupDisplay(element);
  element.removeAttribute("aria-hidden");
};

export const restoreSharedWorkbookGroups = (root = document) => {
  Array.from(root?.querySelectorAll?.(`[${GROUP_DISPLAY_ATTRIBUTE}]`) || []).forEach((element) => {
    element.style.display = element.getAttribute(GROUP_DISPLAY_ATTRIBUTE) || "";
    element.removeAttribute(GROUP_DISPLAY_ATTRIBUTE);
    element.removeAttribute("aria-hidden");
  });
};

export const applySharedWorkbookView = ({ groups = [], activeView = "overview" } = {}) => {
  const selectedTeil = /^teil-(\d+)$/i.exec(String(activeView || ""));
  const selectedNumber = selectedTeil ? Number(selectedTeil[1]) : null;
  const showFullAssignment = activeView === "assignment";

  groups.forEach((group) => {
    const visible = showFullAssignment || Number(group.number) === selectedNumber;
    group.elements.forEach((element) => (visible ? showGroup(element) : hideGroup(element)));
  });
};

export const getSharedTutorNavigationTabs = (groups = []) => [
  { key: "overview", label: "Overview" },
  ...groups.map((group) => ({ key: `teil-${group.number}`, label: `Teil ${group.number}` })),
  { key: "assignment", label: "Assignment" },
  { key: "submit", label: "Submit" },
];

const rememberAndHide = (element) => {
  if (!element) return;
  if (!element.hasAttribute(HIDDEN_ATTRIBUTE)) {
    element.setAttribute(HIDDEN_ATTRIBUTE, "true");
    element.setAttribute(HIDDEN_DISPLAY_ATTRIBUTE, element.style.display || "");
  }
  element.style.display = "none";
};

const restoreHiddenElements = (root = document) => {
  Array.from(root?.querySelectorAll?.(`[${HIDDEN_ATTRIBUTE}]`) || []).forEach((element) => {
    element.style.display = element.getAttribute(HIDDEN_DISPLAY_ATTRIBUTE) || "";
    element.removeAttribute(HIDDEN_ATTRIBUTE);
    element.removeAttribute(HIDDEN_DISPLAY_ATTRIBUTE);
  });
};

const groupSignature = (groups = []) =>
  groups
    .map((group) => `${group.number}:${normalizeText(group.heading?.textContent)}:${group.elements.length}`)
    .join("|");

const navigationButtonStyle = (selected, kind = "default") => ({
  ...styles.secondaryButton,
  background:
    kind === "submit"
      ? selected
        ? "#166534"
        : "#ecfdf5"
      : selected
        ? "#2563eb"
        : "#ffffff",
  borderColor: kind === "submit" ? "#86efac" : selected ? "#2563eb" : "#93c5fd",
  color: kind === "submit" ? (selected ? "#ffffff" : "#166534") : selected ? "#ffffff" : "#1d4ed8",
  flex: "0 0 auto",
  fontWeight: 900,
  minHeight: 44,
  padding: "9px 14px",
});

const findFirstMainChild = (main, elements = []) => {
  const direct = elements.filter((element) => element?.parentElement === main);
  if (!direct.length) return null;
  const children = Array.from(main.children);
  return direct.sort((left, right) => children.indexOf(left) - children.indexOf(right))[0] || null;
};

export default function A1SharedTutorWorkbookNavigation() {
  const location = useLocation();
  const match = useMemo(
    () => resolveA1UnifiedTutorWorkbookMatch({ pathname: location.pathname, search: location.search }),
    [location.pathname, location.search]
  );
  const routeKey = `${location.pathname}|${match?.resource?.assignmentKey || ""}`;
  const requestedTab = new URLSearchParams(location.search || "").get("workbookTab");
  const [activeView, setActiveView] = useState(requestedTab === "submit" ? "submit" : "overview");
  const [mountNode, setMountNode] = useState(null);
  const [groups, setGroups] = useState([]);
  const pageRootRef = useRef(null);
  const groupsRef = useRef([]);
  const signatureRef = useRef("");

  useEffect(() => {
    setActiveView(requestedTab === "submit" ? "submit" : "overview");
  }, [routeKey]);

  const refreshGroups = useCallback(() => {
    const main = document.querySelector("main.layout-main") || document.querySelector("main");
    const nextRoot = findTutorWorkbookRoot(main) || pageRootRef.current;
    if (!nextRoot) return [];

    const nextGroups = buildA1WorkbookContentGroups(nextRoot, findA1WorkbookTeilSections(nextRoot));
    if (!nextGroups.length) return groupsRef.current;

    pageRootRef.current = nextRoot;
    groupsRef.current = nextGroups;
    const nextSignature = groupSignature(nextGroups);
    if (nextSignature !== signatureRef.current) {
      signatureRef.current = nextSignature;
      setGroups(nextGroups);
    }
    return nextGroups;
  }, []);

  const clickUnderlying = useCallback((label) => {
    const main = document.querySelector("main.layout-main") || document.querySelector("main");
    const oldNavigation = main?.querySelector(OLD_NAV_SELECTOR);
    const oldButton = findButton(oldNavigation, label);
    if (oldButton) {
      oldButton.click();
      return true;
    }

    const pageRoot = pageRootRef.current || findTutorWorkbookRoot(main);
    const nativeButton = findButton(findAssignmentTabList(pageRoot), label);
    if (nativeButton) {
      nativeButton.click();
      return true;
    }

    const controller = main?.querySelector('[aria-label="Workbook assignment navigation"]');
    const controllerButton = findButton(controller, label);
    controllerButton?.click();
    return Boolean(controllerButton);
  }, []);

  const openAssignmentContent = useCallback(() => {
    clickUnderlying("overview");
    window.setTimeout(() => clickUnderlying("assignment"), 0);
  }, [clickUnderlying]);

  useEffect(() => {
    if (!match || typeof document === "undefined") return undefined;

    let disposed = false;
    let scheduled = false;
    let attempts = 0;

    const install = () => {
      scheduled = false;
      if (disposed) return;

      const main = document.querySelector("main.layout-main") || document.querySelector("main");
      if (!main) return;

      let pageRoot = findTutorWorkbookRoot(main);
      let nextGroups = pageRoot
        ? buildA1WorkbookContentGroups(pageRoot, findA1WorkbookTeilSections(pageRoot))
        : [];

      if (!nextGroups.length) {
        const fallbackRoot = pageRoot || pageRootRef.current;
        const nativeAssignment = findButton(findAssignmentTabList(fallbackRoot), "assignment");
        nativeAssignment?.click();
        attempts += 1;
        if (attempts < 120) scheduleInstall();
        return;
      }

      attempts = 0;
      pageRootRef.current = pageRoot;
      groupsRef.current = nextGroups;
      const nextSignature = groupSignature(nextGroups);
      if (nextSignature !== signatureRef.current) {
        signatureRef.current = nextSignature;
        setGroups(nextGroups);
      }

      const oldNavigation = main.querySelector(OLD_NAV_SELECTOR);
      const oldOverview = main.querySelector(OLD_OVERVIEW_SELECTOR);
      rememberAndHide(oldNavigation);
      rememberAndHide(oldOverview);

      let host = main.querySelector(`[${STANDARD_HOST_ATTRIBUTE}="true"]`);
      if (!host) {
        host = document.createElement("div");
        host.setAttribute(STANDARD_HOST_ATTRIBUTE, "true");
        const submissionHost = main.querySelector(
          '[data-a1-workbook-submission-mount="true"], [data-a1-unified-submission-host="true"]'
        );
        const firstAnchor = findFirstMainChild(main, [oldNavigation, oldOverview, submissionHost, pageRoot]);
        main.insertBefore(host, firstAnchor || pageRoot);
      }
      if (mountNode !== host) setMountNode(host);
    };

    const scheduleInstall = () => {
      if (scheduled || disposed) return;
      scheduled = true;
      const frame = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 0));
      frame(install);
    };

    scheduleInstall();
    const observer = new MutationObserver(scheduleInstall);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      disposed = true;
      observer.disconnect();
      document.querySelector(`[${STANDARD_HOST_ATTRIBUTE}="true"]`)?.remove();
      restoreHiddenElements(document);
      restoreSharedWorkbookGroups(document);
      pageRootRef.current = null;
      groupsRef.current = [];
      signatureRef.current = "";
      setMountNode(null);
      setGroups([]);
    };
  }, [match, routeKey]);

  useEffect(() => {
    if (!match || !mountNode) return undefined;

    if (activeView === "submit") {
      restoreSharedWorkbookGroups(pageRootRef.current || document);
      clickUnderlying("submit");
      return undefined;
    }

    openAssignmentContent();
    const apply = () => {
      const nextGroups = refreshGroups();
      applySharedWorkbookView({ groups: nextGroups, activeView });
    };
    const timers = [0, 80, 240, 650].map((delay) => window.setTimeout(apply, delay));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [activeView, clickUnderlying, match, mountNode, openAssignmentContent, refreshGroups]);

  if (!match || !mountNode || !groups.length) return null;

  const assignmentKey = match.resource.assignmentKey;
  const chapter = match.resource.chapter || "";
  const tabs = getSharedTutorNavigationTabs(groups);

  return createPortal(
    <div style={{ display: "grid", gap: 12, marginBottom: 12 }}>
      <section
        data-a1-shared-tutor-workbook-nav="true"
        aria-label="Shared A1 tutor-marked workbook navigation"
        style={{
          ...styles.card,
          position: "sticky",
          top: 8,
          zIndex: 36,
          display: "grid",
          gap: 10,
          border: "2px solid #2563eb",
          background: "linear-gradient(135deg, #dbeafe 0%, #ffffff 74%)",
          padding: 12,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <strong style={{ color: "#0f172a" }}>
              A1 · Day {match.day}{chapter ? ` · Kapitel ${chapter}` : ""}
            </strong>
            <p style={{ margin: "3px 0 0", color: "#475569", fontSize: 12 }}>
              Tutor Marked Assignment · {assignmentKey}
            </p>
          </div>
          <span style={{ color: "#1d4ed8", fontSize: 12, fontWeight: 900 }}>One shared navigation</span>
        </div>

        <div role="tablist" aria-label="Shared A1 workbook sections" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
          {tabs.map((tab) => {
            const selected = activeView === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveView(tab.key)}
                style={navigationButtonStyle(selected, tab.key === "submit" ? "submit" : "default")}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {activeView === "overview" ? (
        <section
          data-a1-shared-tutor-overview="true"
          style={{ ...styles.card, display: "grid", gap: 12, border: "1px solid #bfdbfe", background: "#f8fbff" }}
        >
          <div>
            <p style={{ margin: 0, color: "#1d4ed8", fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".05em" }}>
              Workbook overview
            </p>
            <h2 style={{ margin: "4px 0" }}>Choose a Teil or open the full assignment</h2>
            <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>
              Use one Teil at a time for focused study. Assignment shows every section together. Submit opens the tutor-marked answer box.
            </p>
          </div>
          <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            {groups.map((group) => (
              <button
                key={group.number}
                type="button"
                style={{ ...styles.secondaryButton, display: "grid", gap: 4, textAlign: "left", justifyItems: "start", borderColor: "#bfdbfe", background: "#ffffff", padding: 12 }}
                onClick={() => setActiveView(`teil-${group.number}`)}
              >
                <strong>Teil {group.number}</strong>
                <span style={{ color: "#475569", fontSize: 12 }}>
                  {String(group.heading?.textContent || "")
                    .replace(/^\s*Teil\s*\d+\s*[·:—-]?\s*/i, "")
                    .trim() || "Assignment section"}
                </span>
              </button>
            ))}
            <button
              type="button"
              style={{ ...styles.secondaryButton, display: "grid", gap: 4, textAlign: "left", justifyItems: "start", borderColor: "#93c5fd", background: "#eff6ff", padding: 12 }}
              onClick={() => setActiveView("assignment")}
            >
              <strong>Assignment</strong>
              <span style={{ color: "#475569", fontSize: 12 }}>Show every Teil together</span>
            </button>
          </div>
        </section>
      ) : null}
    </div>,
    mountNode
  );
}
