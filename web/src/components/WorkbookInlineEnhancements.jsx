import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import routeConfig from "../data/inAppWorkbookRoutes.json";
import { getInlineCourseAssignments, normalizeCourseAssignmentKey } from "../utils/courseLessonAssignments";
import ClassWorkbookShareBox from "./ClassWorkbookShareBox";
import CourseWorkbookSubmissionTabs from "./CourseWorkbookSubmissionTabs";

const FAMILY_WORKBOOK_PATH = "/campus/course/a1-day-6-family-and-hobbies-workbook";
const SUBMISSION_MOUNT_ATTRIBUTE = "data-a1-workbook-submission-mount";

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
  {
    pathname: "/campus/course/letter-writing-intro-12-3",
    day: 20,
    chapter: "12.3",
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

    const assignments = getInlineCourseAssignments("A1", candidate.day);
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
    if (!assignmentKey) continue;

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

export const hasExistingA1SubmissionTabs = (pageRoot) => {
  if (!pageRoot) return false;

  return Array.from(pageRoot.querySelectorAll('[role="tablist"]')).some((tabList) => {
    const labels = Array.from(tabList.querySelectorAll("button"))
      .map((button) => String(button.textContent || "").replace(/\s+/g, " ").trim().toLowerCase())
      .filter(Boolean);

    return labels.some((label) => label === "assignment") && labels.some((label) => label === "submit");
  });
};

const findWorkbookPageRoot = (anchor) => {
  if (!anchor) return null;
  const main = anchor.closest("main.layout-main") || anchor.closest("main");
  if (!main) return null;

  let current = anchor;
  while (current?.parentElement && current.parentElement !== main) {
    current = current.parentElement;
  }

  return current?.parentElement === main ? current : null;
};

const CourseBookSubmissionPortal = ({ mountNode, match }) => {
  const hostRef = useMemo(() => ({ current: mountNode }), [mountNode]);
  return <CourseWorkbookSubmissionTabs hostRef={hostRef} match={match} />;
};

const WorkbookInlineEnhancements = ({ pathname }) => {
  const location = useLocation();
  const anchorRef = useRef(null);
  const [classShareMountNode, setClassShareMountNode] = useState(null);
  const [submissionMountNode, setSubmissionMountNode] = useState(null);

  const activePathname = pathname || location.pathname;
  const submissionMatch = useMemo(
    () => resolveA1WorkbookSubmissionMatch({ pathname: activePathname, search: location.search }),
    [activePathname, location.search]
  );

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
        if (attempts < 30) frameId = window.requestAnimationFrame(install);
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
    if (!submissionMatch || typeof document === "undefined") {
      setSubmissionMountNode(null);
      return undefined;
    }

    let frameId = null;
    let observer = null;
    let mountedNode = null;
    let attempts = 0;

    const removeMount = () => {
      if (mountedNode?.parentNode) mountedNode.parentNode.removeChild(mountedNode);
      mountedNode = null;
      setSubmissionMountNode(null);
    };

    const install = () => {
      const pageRoot = findWorkbookPageRoot(anchorRef.current);
      if (!pageRoot) {
        attempts += 1;
        if (attempts < 30) frameId = window.requestAnimationFrame(install);
        return;
      }

      if (hasExistingA1SubmissionTabs(pageRoot)) {
        removeMount();
        return;
      }

      if (!mountedNode) {
        mountedNode = document.createElement("div");
        mountedNode.setAttribute(SUBMISSION_MOUNT_ATTRIBUTE, "true");
        mountedNode.setAttribute("data-assignment-key", submissionMatch.resource.assignmentKey || "");
        pageRoot.parentElement?.insertBefore(mountedNode, pageRoot);
        setSubmissionMountNode(mountedNode);
      }

      observer = new MutationObserver(() => {
        if (hasExistingA1SubmissionTabs(pageRoot)) removeMount();
      });
      observer.observe(pageRoot, { childList: true, subtree: true });
    };

    install();

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      observer?.disconnect();
      removeMount();
    };
  }, [submissionMatch]);

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
      {submissionMountNode && submissionMatch
        ? createPortal(
            <CourseBookSubmissionPortal mountNode={submissionMountNode} match={submissionMatch} />,
            submissionMountNode
          )
        : null}
    </>
  );
};

export default WorkbookInlineEnhancements;
