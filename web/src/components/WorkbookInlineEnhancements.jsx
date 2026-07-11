import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import routeConfig from "../data/inAppWorkbookRoutes.json";
import { getInlineCourseAssignments, normalizeCourseAssignmentKey } from "../utils/courseLessonAssignments";
import ClassWorkbookShareBox from "./ClassWorkbookShareBox";
import CourseWorkbookSubmissionTabs from "./CourseWorkbookSubmissionTabs";

const FAMILY_WORKBOOK_PATH = "/campus/course/a1-day-6-family-and-hobbies-workbook";
const SUBMISSION_MOUNT_ATTRIBUTE = "data-a1-workbook-submission-mount";
const LEGACY_SUBMIT_HIDDEN_ATTRIBUTE = "data-a1-legacy-submit-hidden";
const LEGACY_SUBMIT_DISPLAY_ATTRIBUTE = "data-a1-legacy-submit-display";
const INLINE_ENHANCEMENTS_ANCHOR_ATTRIBUTE = "data-workbook-inline-enhancements-anchor";

export const A1_TUTOR_MARKED_ASSIGNMENT_KEYS = Object.freeze([
  "A1-0.1",
  "A1-0.2",
  "A1-1.1",
  "A1-1.2",
  "A1-2",
  "A1-3",
  "A1-4",
  "A1-5",
  "A1-6",
  "A1-7",
  "A1-8",
  "A1-9",
  "A1-10",
  "A1-11",
  "A1-12.1",
  "A1-12.2",
  "A1-13",
  "A1-14.1",
]);

const A1_TUTOR_MARKED_ASSIGNMENT_KEY_SET = new Set(A1_TUTOR_MARKED_ASSIGNMENT_KEYS);

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";
const normalizeChapter = (value = "") => String(value || "").trim().toLowerCase();

const A1_WORKBOOK_ROUTE_ALIASES = [
  {
    pathname: "/campus/course/a1-day-3-german-alphabet-reviewing-workbook",
    day: 2,
    chapter: "0.2",
  },
  {
    pathname: "/campus/course/a1-day-3-kapitel-1-2-workbook",
    day: 3,
    chapter: "1.2",
  },
];

const configuredA1WorkbookRoutes = Object.entries(routeConfig?.A1 || {}).flatMap(([dayKey, routesByChapter]) =>
  Object.entries(routesByChapter || {}).map(([chapterKey, route]) => {
    const parsed = new URL(String(route || ""), "https://www.falowen.app");
    return {
      pathname: normalizePath(parsed.pathname),
      day: Number(dayKey),
      chapter: chapterKey === "*" ? "" : String(chapterKey),
      requiredView: parsed.searchParams.get("view") || "",
    };
  })
);

const A1_WORKBOOK_ROUTE_CANDIDATES = [...A1_WORKBOOK_ROUTE_ALIASES, ...configuredA1WorkbookRoutes].sort(
  (left, right) => Number(Boolean(right.chapter)) - Number(Boolean(left.chapter))
);

export const resolveA1WorkbookSubmissionMatch = ({ pathname = "", search = "" } = {}) => {
  const normalizedPathname = normalizePath(pathname);
  const searchParams = new URLSearchParams(search || "");
  const candidates = A1_WORKBOOK_ROUTE_CANDIDATES.filter(
    (candidate) => normalizePath(candidate.pathname) === normalizedPathname
  );

  for (const candidate of candidates) {
    if (candidate.requiredView && searchParams.get("view") !== candidate.requiredView) continue;

    const assignments = getInlineCourseAssignments("A1", candidate.day).filter((assignment) =>
      A1_TUTOR_MARKED_ASSIGNMENT_KEY_SET.has(normalizeCourseAssignmentKey(assignment?.assignmentKey))
    );
    if (!assignments.length) continue;

    const selectedAssignment = candidate.chapter
      ? assignments.find(
          (assignment) => normalizeChapter(assignment?.chapter) === normalizeChapter(candidate.chapter)
        )
      : assignments.length === 1
      ? assignments[0]
      : null;

    if (!selectedAssignment?.assignmentKey) continue;

    const assignmentKey = normalizeCourseAssignmentKey(selectedAssignment.assignmentKey);
    if (!A1_TUTOR_MARKED_ASSIGNMENT_KEY_SET.has(assignmentKey)) continue;

    return {
      level: "A1",
      day: Number(candidate.day),
      resource: {
        ...selectedAssignment,
        assignment: true,
        assignmentId: assignmentKey,
        assignment_id: assignmentKey,
        assignmentKey,
        canonicalAssignmentKey: assignmentKey,
        chapter: selectedAssignment.chapter || candidate.chapter || "",
        progressionEligible: true,
        resourceRole: "assignment",
      },
    };
  }

  return null;
};

export const isA1SubmissionContextReady = ({ search = "", assignmentKey = "", level = "A1" } = {}) => {
  const normalizedAssignmentKey = normalizeCourseAssignmentKey(assignmentKey);
  if (!normalizedAssignmentKey) return false;

  const searchParams = new URLSearchParams(search || "");
  const currentAssignmentKey = normalizeCourseAssignmentKey(
    searchParams.get("assignmentKey") || searchParams.get("assignmentId")
  );
  const currentLevel = String(searchParams.get("level") || "").trim().toUpperCase();

  return currentAssignmentKey === normalizedAssignmentKey && currentLevel === String(level || "").trim().toUpperCase();
};

export const hasExistingA1SubmissionTabs = (pageRoot) => {
  if (!pageRoot) return false;

  return Array.from(pageRoot.querySelectorAll('[role="tablist"]')).some((tabList) => {
    const labels = Array.from(tabList.querySelectorAll("button"))
      .map((button) => String(button.textContent || "").replace(/\s+/g, " ").trim().toLowerCase())
      .filter(Boolean);

    return labels.some((label) => label === "assignment") && labels.some((label) => label === "submit");
  });
};

const isLegacyA1SubmitControl = (element) => {
  const href = String(element?.getAttribute?.("href") || "");
  const label = String(element?.textContent || "").replace(/\s+/g, " ").trim();

  if (/submitWork=1/i.test(href)) return true;
  return /^(submit assignment|submit workbook answers|submit kapitel\b.*|open submit area)$/i.test(label);
};

export const hideLegacyA1SubmitControls = (pageRoot) => {
  if (!pageRoot) return;

  Array.from(pageRoot.querySelectorAll("a, button")).forEach((element) => {
    if (!isLegacyA1SubmitControl(element) || element.hasAttribute(LEGACY_SUBMIT_HIDDEN_ATTRIBUTE)) return;
    element.setAttribute(LEGACY_SUBMIT_HIDDEN_ATTRIBUTE, "true");
    element.setAttribute(LEGACY_SUBMIT_DISPLAY_ATTRIBUTE, element.style.display || "");
    element.style.display = "none";
  });
};

export const restoreLegacyA1SubmitControls = (pageRoot) => {
  if (!pageRoot) return;

  Array.from(pageRoot.querySelectorAll(`[${LEGACY_SUBMIT_HIDDEN_ATTRIBUTE}]`)).forEach((element) => {
    element.style.display = element.getAttribute(LEGACY_SUBMIT_DISPLAY_ATTRIBUTE) || "";
    element.removeAttribute(LEGACY_SUBMIT_HIDDEN_ATTRIBUTE);
    element.removeAttribute(LEGACY_SUBMIT_DISPLAY_ATTRIBUTE);
  });
};

const isEnhancementUtilityNode = (element) =>
  Boolean(
    element?.hasAttribute?.(INLINE_ENHANCEMENTS_ANCHOR_ATTRIBUTE) ||
      element?.hasAttribute?.(SUBMISSION_MOUNT_ATTRIBUTE) ||
      element?.hasAttribute?.("data-workbook-supporting-materials-host") ||
      element?.hasAttribute?.("data-grammar-back-to-workbook-host")
  );

const findSiblingWorkbookRoot = (anchor, direction) => {
  let sibling = direction === "next" ? anchor?.nextElementSibling : anchor?.previousElementSibling;
  while (sibling && isEnhancementUtilityNode(sibling)) {
    sibling = direction === "next" ? sibling.nextElementSibling : sibling.previousElementSibling;
  }
  return sibling || null;
};

export const findWorkbookPageRoot = (anchor) => {
  if (!anchor) return null;
  const main = anchor.closest("main.layout-main") || anchor.closest("main");
  if (!main) return null;

  if (anchor.parentElement === main) {
    return findSiblingWorkbookRoot(anchor, "next") || findSiblingWorkbookRoot(anchor, "previous");
  }

  let current = anchor;
  while (current?.parentElement && current.parentElement !== main) {
    current = current.parentElement;
  }

  return current?.parentElement === main ? current : null;
};

const A1SubmissionDebugPanel = ({ mountNode, match, contextReady }) => {
  const [diagnostics, setDiagnostics] = useState({
    textareaFound: false,
    textareaDisabled: null,
    textareaReadOnly: null,
    textareaFocused: false,
    valueLength: 0,
    selectValues: [],
    inputEvents: 0,
  });
  const inputEventsRef = useRef(0);

  useEffect(() => {
    if (!mountNode || typeof document === "undefined") return undefined;

    const inspect = () => {
      const textarea = mountNode.querySelector("textarea");
      const selectValues = Array.from(mountNode.querySelectorAll("select")).map((select) => select.value || "");
      setDiagnostics({
        textareaFound: Boolean(textarea),
        textareaDisabled: textarea ? Boolean(textarea.disabled) : null,
        textareaReadOnly: textarea ? Boolean(textarea.readOnly) : null,
        textareaFocused: textarea ? document.activeElement === textarea : false,
        valueLength: textarea ? String(textarea.value || "").length : 0,
        selectValues,
        inputEvents: inputEventsRef.current,
      });
    };

    const handleInput = () => {
      inputEventsRef.current += 1;
      inspect();
    };

    inspect();
    const observer = new MutationObserver(inspect);
    observer.observe(mountNode, { childList: true, subtree: true, attributes: true });
    mountNode.addEventListener("input", handleInput, true);
    mountNode.addEventListener("focusin", inspect, true);
    mountNode.addEventListener("focusout", inspect, true);

    return () => {
      observer.disconnect();
      mountNode.removeEventListener("input", handleInput, true);
      mountNode.removeEventListener("focusin", inspect, true);
      mountNode.removeEventListener("focusout", inspect, true);
    };
  }, [mountNode]);

  const assignmentKey = normalizeCourseAssignmentKey(match?.resource?.assignmentKey);

  return (
    <aside
      data-a1-submit-debug
      style={{
        background: "#fff7ed",
        border: "1px solid #fdba74",
        borderRadius: 12,
        color: "#7c2d12",
        fontSize: 12,
        margin: "8px 0",
        overflowWrap: "anywhere",
        padding: 10,
      }}
    >
      <strong>A1 Submit Debug</strong>
      <pre style={{ margin: "6px 0 0", whiteSpace: "pre-wrap" }}>
        {JSON.stringify(
          {
            assignmentKey,
            contextReady,
            day: match?.day,
            path: typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "",
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
            ...diagnostics,
          },
          null,
          2
        )}
      </pre>
    </aside>
  );
};

const CourseBookSubmissionPortal = ({ mountNode, match, debugEnabled, contextReady }) => {
  const hostRef = useMemo(() => ({ current: mountNode }), [mountNode]);

  return (
    <>
      {debugEnabled ? (
        <A1SubmissionDebugPanel mountNode={mountNode} match={match} contextReady={contextReady} />
      ) : null}
      <CourseWorkbookSubmissionTabs hostRef={hostRef} match={match} />
    </>
  );
};

const WorkbookInlineEnhancements = ({ pathname }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const anchorRef = useRef(null);
  const [classShareMountNode, setClassShareMountNode] = useState(null);
  const [submissionMountNode, setSubmissionMountNode] = useState(null);

  const activePathname = pathname || location.pathname;
  const submissionMatch = useMemo(
    () => resolveA1WorkbookSubmissionMatch({ pathname: activePathname, search: location.search }),
    [activePathname, location.search]
  );
  const submissionAssignmentKey = normalizeCourseAssignmentKey(submissionMatch?.resource?.assignmentKey);
  const submissionContextReady = useMemo(
    () =>
      isA1SubmissionContextReady({
        search: location.search,
        assignmentKey: submissionAssignmentKey,
        level: "A1",
      }),
    [location.search, submissionAssignmentKey]
  );
  const submitDebugEnabled = useMemo(
    () => new URLSearchParams(location.search || "").get("submitDebug") === "1",
    [location.search]
  );

  useEffect(() => {
    if (!submissionMatch || !submissionAssignmentKey || submissionContextReady) return undefined;

    const nextSearch = new URLSearchParams(location.search || "");
    nextSearch.set("assignmentKey", submissionAssignmentKey);
    nextSearch.set("assignmentId", submissionAssignmentKey);
    nextSearch.set("level", "A1");

    navigate(
      {
        pathname: location.pathname,
        search: `?${nextSearch.toString()}`,
        hash: location.hash,
      },
      {
        replace: true,
        state: {
          ...(location.state || {}),
          level: "A1",
          day: Number(submissionMatch.day),
          assignmentKey: submissionAssignmentKey,
          assignmentId: submissionAssignmentKey,
          canonicalAssignmentKey: submissionAssignmentKey,
          inlineCourseSubmission: true,
        },
      }
    );

    return undefined;
  }, [
    location.hash,
    location.pathname,
    location.search,
    location.state,
    navigate,
    submissionAssignmentKey,
    submissionContextReady,
    submissionMatch,
  ]);

  useEffect(() => {
    if (normalizePath(activePathname) !== FAMILY_WORKBOOK_PATH || typeof document === "undefined") {
      setClassShareMountNode(null);
      return undefined;
    }

    let frameId = null;
    let mountedNode = null;
    let attempts = 0;
    const hiddenElements = [];

    const hideElement = (element) => {
      if (!element || hiddenElements.some((item) => item.element === element)) return;
      hiddenElements.push({ element, display: element.style.display });
      element.style.display = "none";
    };

    const install = () => {
      const writingSection = document.getElementById("writing");
      if (!writingSection) {
        attempts += 1;
        if (attempts < 120) frameId = window.requestAnimationFrame(install);
        return;
      }

      const directChildren = Array.from(writingSection.children);
      const finalTaskCard = directChildren.find((element) =>
        String(element.textContent || "").includes("Final writing task")
      );
      const oldSubmitCard = directChildren.find((element) =>
        String(element.textContent || "").includes("Where to write and submit")
      );
      const oldDiscussionBox = writingSection.querySelector('[data-a1-day6-family-writing-box="true"]');

      hideElement(finalTaskCard);
      hideElement(oldSubmitCard);
      hideElement(oldDiscussionBox);

      mountedNode = document.createElement("div");
      mountedNode.setAttribute("data-workbook-class-share", "family-and-hobbies");

      const insertionPoint = finalTaskCard || oldSubmitCard;
      if (insertionPoint?.parentNode === writingSection) {
        writingSection.insertBefore(mountedNode, insertionPoint);
      } else {
        const helpCard = directChildren.find((element) =>
          String(element.textContent || "").includes("Need help?")
        );
        if (helpCard?.parentNode === writingSection) writingSection.insertBefore(mountedNode, helpCard);
        else writingSection.appendChild(mountedNode);
      }

      setClassShareMountNode(mountedNode);
    };

    install();

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      hiddenElements.forEach(({ element, display }) => {
        if (element) element.style.display = display;
      });
      if (mountedNode?.parentNode) mountedNode.parentNode.removeChild(mountedNode);
      setClassShareMountNode(null);
    };
  }, [activePathname]);

  useEffect(() => {
    if (!submissionMatch || !submissionContextReady || typeof document === "undefined") {
      setSubmissionMountNode(null);
      return undefined;
    }

    let frameId = null;
    let observer = null;
    let mountedNode = null;
    let pageRoot = null;
    let attempts = 0;

    const removeMount = () => {
      if (mountedNode?.parentNode) mountedNode.parentNode.removeChild(mountedNode);
      mountedNode = null;
      setSubmissionMountNode(null);
    };

    const install = () => {
      pageRoot = findWorkbookPageRoot(anchorRef.current);
      if (!pageRoot) {
        attempts += 1;
        if (attempts < 120) frameId = window.requestAnimationFrame(install);
        return;
      }

      hideLegacyA1SubmitControls(pageRoot);

      if (hasExistingA1SubmissionTabs(pageRoot)) {
        removeMount();
      } else if (!mountedNode) {
        mountedNode = document.createElement("div");
        mountedNode.setAttribute(SUBMISSION_MOUNT_ATTRIBUTE, "true");
        mountedNode.setAttribute("data-assignment-key", submissionAssignmentKey);
        mountedNode.setAttribute("data-submit-context-ready", "true");
        pageRoot.parentElement?.insertBefore(mountedNode, pageRoot);
        setSubmissionMountNode(mountedNode);
      }

      observer = new MutationObserver(() => {
        hideLegacyA1SubmitControls(pageRoot);
        if (hasExistingA1SubmissionTabs(pageRoot)) removeMount();
      });
      observer.observe(pageRoot, { childList: true, subtree: true });
    };

    install();

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      observer?.disconnect();
      restoreLegacyA1SubmitControls(pageRoot);
      removeMount();
    };
  }, [submissionAssignmentKey, submissionContextReady, submissionMatch]);

  return (
    <>
      <span ref={anchorRef} data-workbook-inline-enhancements-anchor hidden />
      {classShareMountNode
        ? createPortal(
            <ClassWorkbookShareBox
              lessonId="a1-day-6-family-and-hobbies-workbook"
              prompt="Write 6–8 sentences about yourself and your family. Include your name, country, age, family, one hobby, and languages."
            />,
            classShareMountNode
          )
        : null}
      {submissionMountNode && submissionMatch && submissionContextReady
        ? createPortal(
            <CourseBookSubmissionPortal
              mountNode={submissionMountNode}
              match={submissionMatch}
              debugEnabled={submitDebugEnabled}
              contextReady={submissionContextReady}
            />,
            submissionMountNode
          )
        : null}
    </>
  );
};

export default WorkbookInlineEnhancements;
