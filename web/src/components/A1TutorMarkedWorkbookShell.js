import React, { Children, useMemo } from "react";
import AppBackButton from "./navigation/AppBackButton";
import VerifiedCloudDraftSubmissionPage from "./VerifiedCloudDraftSubmissionPage";
import A1SharedAssignmentWorkbookLayout, { WorkbookSection } from "./A1SharedAssignmentWorkbookLayout";
import { getA1Assignment } from "../data/a1AssignmentRegistry";
import { styles } from "../styles";

/**
 * Compatibility shell for the nine React-owned workbook pages that historically
 * supplied one top-level element per Teil. Navigation and submission ownership
 * now live exclusively in A1SharedAssignmentWorkbookLayout.
 */
const A1TutorMarkedWorkbookShell = ({
  fallbackAssignmentKey,
  title,
  subtitle,
  assignmentIntro,
  submitTitle,
  submitDescription,
  children,
}) => {
  const assignment = getA1Assignment(fallbackAssignmentKey);
  if (!assignment) throw new Error(`Unknown canonical A1 assignment: ${fallbackAssignmentKey}`);
  const content = Children.toArray(children);
  const sections = useMemo(() => assignment.sections.map((declared, index) => (
    <WorkbookSection key={declared.key} sectionKey={declared.key}>{content[index]}</WorkbookSection>
  )), [assignment.sections, content]);

  if (process.env.NODE_ENV !== "production" && content.length !== assignment.sections.length) {
    throw new Error(`[A1 workbook ${assignment.assignmentKey}] declares ${assignment.sections.length} sections but rendered ${content.length} top-level section elements.`);
  }

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 12 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <h1 style={{ ...styles.title, marginBottom: 0 }}>{title}</h1>
        {subtitle ? <p style={{ ...styles.subtitle, margin: 0 }}>{subtitle}</p> : null}
      </header>
      <A1SharedAssignmentWorkbookLayout
        assignmentKey={assignment.assignmentKey}
        overview={<p style={{ ...styles.card, margin: 0 }}>{assignmentIntro || `Complete every section, then submit ${assignment.assignmentKey}.`}</p>}
        renderSubmission={(canonical) => (
          <section style={{ ...styles.card, display: "grid", gap: 12 }} aria-label={`Submit ${canonical.assignmentKey} answers`}>
            <h2>{submitTitle || `Submit ${canonical.assignmentKey}`}</h2>
            <p>{submitDescription || `This submission is locked to ${canonical.assignmentKey}.`}</p>
            <div data-a1-built-in-submission data-assignment-key={canonical.assignmentKey}>
              <VerifiedCloudDraftSubmissionPage submissionContext={{
                level: "A1", day: canonical.day, chapter: canonical.chapter,
                assignmentKey: canonical.assignmentKey,
                canonicalAssignmentKey: canonical.assignmentKey,
              }} />
            </div>
          </section>
        )}
      >
        {sections}
      </A1SharedAssignmentWorkbookLayout>
    </div>
  );
};

export { WorkbookSection };
export default A1TutorMarkedWorkbookShell;
