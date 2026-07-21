import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import A1CanonicalSubmissionPanel from "./A1CanonicalSubmissionPanel";
import {
  A1AssignmentNeighborLinks,
  A1SharedWorkbookTabBar,
  useA1WorkbookTabState,
} from "./A1SharedAssignmentWorkbookLayout";
import { getA1Assignment } from "../data/a1AssignmentRegistry";

const NAV_HOST_ATTRIBUTE = "data-a1-canonical-bridge-nav";
const SUBMISSION_HOST_ATTRIBUTE = "data-a1-canonical-bridge-submission";
const FOOTER_HOST_ATTRIBUTE = "data-a1-canonical-bridge-footer";
const ORIGINAL_DISPLAY_ATTRIBUTE = "data-a1-canonical-original-display";
const ORIGINAL_ARIA_ATTRIBUTE = "data-a1-canonical-original-aria-hidden";

const normalizeText = (value = "") => String(value || "").replace(/\s+/g, " ").trim();

const getTeilKey = (heading) => {
  const match = normalizeText(heading?.textContent).match(/^Teil\s*(\d+)\b/i);
  return match ? `teil-${Number(match[1])}` : "";
};

const getTopLevelChild = (root, element) => {
  let current = element;
  while (current?.parentElement && current.parentElement !== root) current = current.parentElement;
  return current?.parentElement === root ? current : null;
};

const findWorkbookPageRoot = (main) => {
  const direct = Array.from(main?.children || []).find(
    (element) => element.querySelector?.("h1") && element.querySelector?.("h2, h3, h4"),
  );
  if (direct) return direct;

  const heading = main?.querySelector?.("h1");
  if (!heading) return main || null;
  return getTopLevelChild(main, heading) || heading.parentElement || main;
};

const findSectionRoot = (pageRoot, heading) => {
  const explicit = heading.closest?.("[data-workbook-section]");
  if (explicit && pageRoot.contains(explicit)) return explicit;
  const semantic = heading.closest?.("section");
  if (semantic && semantic !== pageRoot && pageRoot.contains(semantic)) return semantic;
  return getTopLevelChild(pageRoot, heading) || heading.parentElement;
};

const rememberElement = (element) => {
  if (!element || element.hasAttribute(ORIGINAL_DISPLAY_ATTRIBUTE)) return;
  element.setAttribute(ORIGINAL_DISPLAY_ATTRIBUTE, element.style.display || "");
  element.setAttribute(ORIGINAL_ARIA_ATTRIBUTE, element.getAttribute("aria-hidden") || "");
};

const setElementVisible = (element, visible) => {
  if (!element) return;
  rememberElement(element);
  if (visible) {
    element.style.display = element.getAttribute(ORIGINAL_DISPLAY_ATTRIBUTE) || "";
    const originalAria = element.getAttribute(ORIGINAL_ARIA_ATTRIBUTE);
    if (originalAria) element.setAttribute("aria-hidden", originalAria);
    else element.removeAttribute("aria-hidden");
  } else {
    element.style.display = "none";
    element.setAttribute("aria-hidden", "true");
  }
};

const restoreElement = (element) => {
  if (!element?.hasAttribute?.(ORIGINAL_DISPLAY_ATTRIBUTE)) return;
  element.style.display = element.getAttribute(ORIGINAL_DISPLAY_ATTRIBUTE) || "";
  const originalAria = element.getAttribute(ORIGINAL_ARIA_ATTRIBUTE);
  if (originalAria) element.setAttribute("aria-hidden", originalAria);
  else element.removeAttribute("aria-hidden");
  element.removeAttribute(ORIGINAL_DISPLAY_ATTRIBUTE);
  element.removeAttribute(ORIGINAL_ARIA_ATTRIBUTE);
};

export const discoverA1BridgeSections = ({ pageRoot, assignment }) => {
  const declaredKeys = new Set(assignment.sections.map(({ key }) => key));
  const found = new Map();

  Array.from(pageRoot?.querySelectorAll?.("h1, h2, h3, h4, h5, h6") || []).forEach((heading) => {
    if (heading.closest?.(`[${NAV_HOST_ATTRIBUTE}], [${SUBMISSION_HOST_ATTRIBUTE}], [${FOOTER_HOST_ATTRIBUTE}]`)) return;
    const key = getTeilKey(heading);
    if (!key || !declaredKeys.has(key) || found.has(key)) return;
    const element = findSectionRoot(pageRoot, heading);
    if (element && element !== pageRoot) found.set(key, element);
  });

  return assignment.sections
    .filter(({ key }) => found.has(key))
    .map((section) => ({ ...section, element: found.get(section.key) }));
};

export default function A1SharedAssignmentWorkbookBridge({ assignmentKey }) {
  const assignment = getA1Assignment(assignmentKey);
  if (!assignment) throw new Error(`Unknown canonical A1 assignment: ${assignmentKey}`);

  const [mountState, setMountState] = useState({
    navHost: null,
    submissionHost: null,
    footerHost: null,
    sections: [],
  });
  const availableSections = useMemo(
    () => mountState.sections.map(({ element, ...section }) => section),
    [mountState.sections],
  );
  const { activeTab, openTab } = useA1WorkbookTabState({ assignment, sections: availableSections });

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    let cancelled = false;
    let frame = null;
    let attempts = 0;
    let installedSections = [];
    let createdHosts = [];

    const install = () => {
      if (cancelled) return;
      const main = document.querySelector("main.layout-main") || document.querySelector("main");
      const pageRoot = findWorkbookPageRoot(main);
      if (!main || !pageRoot) {
        attempts += 1;
        if (attempts < 120) frame = window.requestAnimationFrame(install);
        return;
      }

      const sections = discoverA1BridgeSections({ pageRoot, assignment });
      if (sections.length !== assignment.sections.length && attempts < 120) {
        attempts += 1;
        frame = window.requestAnimationFrame(install);
        return;
      }

      const existingHosts = Array.from(
        pageRoot.querySelectorAll(
          `[${NAV_HOST_ATTRIBUTE}="true"], [${SUBMISSION_HOST_ATTRIBUTE}="true"], [${FOOTER_HOST_ATTRIBUTE}="true"]`,
        ),
      );
      existingHosts.forEach((host) => host.remove());

      const navHost = document.createElement("div");
      navHost.setAttribute(NAV_HOST_ATTRIBUTE, "true");
      navHost.setAttribute("data-assignment-key", assignment.assignmentKey);
      const submissionHost = document.createElement("div");
      submissionHost.setAttribute(SUBMISSION_HOST_ATTRIBUTE, "true");
      submissionHost.setAttribute("data-assignment-key", assignment.assignmentKey);
      const footerHost = document.createElement("div");
      footerHost.setAttribute(FOOTER_HOST_ATTRIBUTE, "true");
      footerHost.setAttribute("data-assignment-key", assignment.assignmentKey);

      pageRoot.prepend(navHost, submissionHost);
      pageRoot.appendChild(footerHost);
      createdHosts = [navHost, submissionHost, footerHost];
      installedSections = sections;

      Array.from(pageRoot.querySelectorAll('[role="tablist"]')).forEach((tabList) => {
        const labels = Array.from(tabList.querySelectorAll("button")).map((button) => normalizeText(button.textContent).toLowerCase());
        if (labels.includes("assignment") && labels.includes("submit")) setElementVisible(tabList, false);
      });
      Array.from(pageRoot.querySelectorAll('[data-a1-teil-navigation="true"], [aria-label="A1 Day 21 workbook navigation"]'))
        .forEach((element) => setElementVisible(element, false));

      setMountState({ navHost, submissionHost, footerHost, sections });
    };

    frame = window.requestAnimationFrame(install);
    return () => {
      cancelled = true;
      if (frame !== null) window.cancelAnimationFrame(frame);
      installedSections.forEach(({ element }) => restoreElement(element));
      createdHosts.forEach((host) => host.remove());
    };
  }, [assignment.assignmentKey]);

  useEffect(() => {
    mountState.sections.forEach(({ key, element }) => setElementVisible(element, activeTab === key));
    if (mountState.submissionHost) {
      mountState.submissionHost.style.display = activeTab === "submit" ? "" : "none";
    }
  }, [activeTab, mountState.sections, mountState.submissionHost]);

  if (!mountState.navHost) return null;

  return (
    <>
      {createPortal(
        <A1SharedWorkbookTabBar
          assignment={assignment}
          sections={availableSections}
          activeTab={activeTab}
          onSelect={openTab}
        />,
        mountState.navHost,
      )}
      {mountState.submissionHost ? createPortal(
        <A1CanonicalSubmissionPanel assignment={assignment} />,
        mountState.submissionHost,
      ) : null}
      {mountState.footerHost ? createPortal(
        <A1AssignmentNeighborLinks assignmentKey={assignment.assignmentKey} />,
        mountState.footerHost,
      ) : null}
    </>
  );
}

export const __TESTING__ = {
  findSectionRoot,
  findWorkbookPageRoot,
  getTeilKey,
  getTopLevelChild,
  normalizeText,
};
