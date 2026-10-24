import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { styles } from "../styles";
import { getInlineCourseAssignments } from "../utils/courseLessonAssignments";
import ContextualAssignmentSubmissionPage from "./ContextualAssignmentSubmissionPage";
import { getA2B1WorkbookSectionProfile } from "./a2B1WorkbookSectionProfile";

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";

const A2_LATE_NATIVE_SUBMISSION_ROUTES = Object.freeze({
  "/campus/course/a2-day-24-einen-urlaub-planen-workbook": Object.freeze({
    day: 24,
    fallbackChapter: "9.24",
    workbookId: "A2Day24EinenUrlaubPlanen",
  }),
  "/campus/course/a2-day-25-tagesablauf-workbook": Object.freeze({
    day: 25,
    fallbackChapter: "9.25",
    workbookId: "A2Day25Tagesablauf",
  }),
  "/campus/course/a2-day-26-gefuehle-in-verschiedenen-situationen-workbook": Object.freeze({
    day: 26,
    fallbackChapter: "10.26",
    workbookId: "A2Day26GefuehleInVerschiedenenSituationen",
  }),
});

export const resolveA2LateWorkbookSubmissionContext = (pathname = "") => {
  const route = A2_LATE_NATIVE_SUBMISSION_ROUTES[normalizePath(pathname)] || null;
  if (!route) return null;

  const assignment = getInlineCourseAssignments("A2", route.day)[0] || null;
  const chapter = assignment?.chapter || route.fallbackChapter;
  const assignmentKey = assignment?.assignmentKey || `A2-${chapter}`;

  return {
    level: "A2",
    day: route.day,
    chapter,
    assignmentKey,
    canonicalAssignmentKey: assignmentKey,
    workbookId: route.workbookId,
  };
};

const A2LateWorkbookSubmissionPanel = ({ pathname = "" }) => {
  const location = useLocation();
  const activePathname = pathname || location.pathname;
  const submissionContext = useMemo(
    () => resolveA2LateWorkbookSubmissionContext(activePathname),
    [activePathname],
  );
  const profile = useMemo(
    () =>
      submissionContext
        ? getA2B1WorkbookSectionProfile("A2", submissionContext.day)
        : null,
    [submissionContext],
  );

  if (!submissionContext || !profile) return null;

  const part4Label = profile.part4 === "reading" ? "Teil 4 · Lesen" : "Teil 4 · Hören";
  const part4Copy =
    profile.part4Submission === "self-check"
      ? `${part4Label} is self-check practice and is not submitted.`
      : `${part4Label} is part of the submitted workbook.`;

  return (
    <section
      data-a2-late-native-submission={submissionContext.day}
      style={{
        ...styles.card,
        margin: "12px auto",
        width: "min(100%, 980px)",
        boxSizing: "border-box",
        border: "1px solid #bfdbfe",
        background: "#f8fbff",
        display: "grid",
        gap: 10,
      }}
    >
      <h2 style={{ margin: 0, fontSize: "1.1rem" }}>
        Submit Workbook · Day {submissionContext.day}
      </h2>
      <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
        Submit Teil 2 · Schreiben and Teil 3 · Lesen. {part4Copy}
      </p>
      <ContextualAssignmentSubmissionPage submissionContext={submissionContext} />
    </section>
  );
};

export default A2LateWorkbookSubmissionPanel;

export const __TESTING__ = {
  routes: A2_LATE_NATIVE_SUBMISSION_ROUTES,
};
