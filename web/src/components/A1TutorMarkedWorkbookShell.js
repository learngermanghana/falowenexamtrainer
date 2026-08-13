import React, { Children, isValidElement } from "react";
import { useNavigate } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import A1CanonicalSubmissionPanel from "./A1CanonicalSubmissionPanel";
import A1Day21WeatherResources from "./A1Day21WeatherResources";
import A1SharedAssignmentWorkbookLayout, { WorkbookSection } from "./A1SharedAssignmentWorkbookLayout";
import A1TutorMarkedOverviewGuidance from "./A1TutorMarkedOverviewGuidance";
import A1WorkbookGrammarNotes from "./A1WorkbookGrammarNotes";
import { getA1Assignment } from "../data/a1AssignmentRegistry";
import { styles } from "../styles";

export { A1_TUTOR_MARKED_OVERVIEW_GUIDANCE } from "./A1TutorMarkedOverviewGuidance";

const headingTypes = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

const readText = (value) => Children.toArray(value)
  .map((child) => {
    if (typeof child === "string" || typeof child === "number") return String(child);
    if (isValidElement(child)) return readText(child.props.children);
    return "";
  })
  .join(" ")
  .replace(/\s+/g, " ")
  .trim();

const getDirectSectionKey = (element) => {
  if (!isValidElement(element)) return "";
  const heading = Children.toArray(element.props.children).find(
    (child) => isValidElement(child) && typeof child.type === "string" && headingTypes.has(child.type),
  );
  if (!heading) return "";
  const match = readText(heading.props.children).match(/^Teil\s*(\d+)\b/i);
  return match ? `teil-${Number(match[1])}` : "";
};

const containsSectionRoot = (element) => {
  if (!isValidElement(element)) return false;
  if (element.type === WorkbookSection || getDirectSectionKey(element)) return true;
  return Children.toArray(element.props.children).some((child) => containsSectionRoot(child));
};

export const splitA1WorkbookContent = (children) => {
  const sectionMap = new Map();
  const overviewNodes = [];

  const visit = (node) => {
    if (!isValidElement(node)) {
      if (node !== null && node !== undefined && node !== false) overviewNodes.push(node);
      return;
    }

    if (node.type === WorkbookSection) {
      sectionMap.set(node.props.sectionKey, node.props.children);
      return;
    }

    const sectionKey = getDirectSectionKey(node);
    if (sectionKey) {
      sectionMap.set(sectionKey, node);
      return;
    }

    const childNodes = Children.toArray(node.props.children);
    if (childNodes.some((child) => containsSectionRoot(child))) {
      childNodes.forEach(visit);
      return;
    }

    overviewNodes.push(node);
  };

  Children.toArray(children).forEach(visit);
  return { sectionMap, overviewNodes };
};

const A1TutorMarkedWorkbookShell = ({
  fallbackAssignmentKey,
  title,
  subtitle,
  assignmentIntro,
  submitTitle,
  submitDescription,
  backLabel = "Back to Course Book",
  backFallbackPath = "/campus/course",
  backTo = "",
  headerActions = null,
  children,
}) => {
  const navigate = useNavigate();
  const assignment = getA1Assignment(fallbackAssignmentKey);
  if (!assignment) throw new Error(`Unknown canonical A1 assignment: ${fallbackAssignmentKey}`);

  const isFirstA1Workbook = assignment.assignmentKey === "A1-0.1";
  const { sectionMap, overviewNodes } = splitA1WorkbookContent(children);
  const sections = assignment.sections
    .filter(({ key }) => sectionMap.has(key))
    .map(({ key, number }) => (
      <WorkbookSection key={key} sectionKey={key}>
        {isFirstA1Workbook && number === 1 ? (
          <div style={{ border: "1px solid #bfdbfe", borderRadius: 12, padding: 12, marginBottom: 12, background: "#eff6ff", lineHeight: 1.6 }}>
            <strong>Reading + Questions:</strong> Read the text first, then continue directly to the questions below on this same page. Do not submit here. When you finish the questions, open <strong>Submit</strong>.
          </div>
        ) : null}
        {sectionMap.get(key)}
      </WorkbookSection>
    ));

  if (process.env.NODE_ENV !== "production") {
    const missing = assignment.sections.filter(({ key }) => !sectionMap.has(key)).map(({ key }) => key);
    if (missing.length) {
      throw new Error(`[A1 workbook ${assignment.assignmentKey}] could not find rendered content for ${missing.join(", ")}.`);
    }
  }

  const firstWorkbookOverview = (
    <div
      data-a1-day1-combined-guidance="true"
      style={{
        ...styles.card,
        margin: 0,
        border: "1px solid #bfdbfe",
        background: "#eff6ff",
        display: "grid",
        gap: 6,
        lineHeight: 1.65,
      }}
    >
      <strong>How to complete this assignment</strong>
      <p style={{ margin: 0 }}>
        Start here in <strong>Overview</strong>. First open <strong>Grammar</strong> and read the lesson. Then open <strong>Reading + Questions</strong>: read the short text and answer the questions on the same page. You do not type or submit answers there. When you are finished, open <strong>Submit</strong> to send your final answers.
      </p>
    </div>
  );

  const overview = (
    <div style={{ display: "grid", gap: 12 }}>
      <p style={{ ...styles.card, margin: 0 }}>
        {assignmentIntro || `Complete every section, then submit ${assignment.assignmentKey}.`}
      </p>
      {assignment.assignmentKey === "A1-13" ? <A1Day21WeatherResources /> : null}
      {isFirstA1Workbook ? firstWorkbookOverview : <A1TutorMarkedOverviewGuidance />}
      {overviewNodes}
    </div>
  );

  const grammar = (
    <div style={{ display: "grid", gap: 12 }}>
      {isFirstA1Workbook ? (
        <div style={{ border: "1px solid #fecaca", borderRadius: 12, padding: 12, background: "#fff1f2", color: "#991b1b", lineHeight: 1.65 }}>
          <strong>Grammar only.</strong> Read and learn on this page. Your assignment is under <strong>Reading + Questions</strong>. Use <strong>Submit</strong> only after you finish the questions.
        </div>
      ) : null}
      <A1WorkbookGrammarNotes assignmentKey={assignment.assignmentKey} />
    </div>
  );

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 12 }}>
        <AppBackButton
          label={backLabel}
          fallbackPath={backFallbackPath}
          onBack={backTo ? () => navigate(backTo, { replace: true }) : undefined}
        />
        <h1 style={{ ...styles.title, marginBottom: 0 }}>{title}</h1>
        {subtitle ? <p style={{ ...styles.subtitle, margin: 0 }}>{subtitle}</p> : null}
        {headerActions ? (
          <div
            data-a1-workbook-header-actions="true"
            style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}
          >
            {headerActions}
          </div>
        ) : null}
      </header>

      <A1SharedAssignmentWorkbookLayout
        assignmentKey={assignment.assignmentKey}
        grammar={grammar}
        overview={overview}
        renderSubmission={(canonical) => (
          <A1CanonicalSubmissionPanel
            assignment={canonical}
            submitTitle={submitTitle}
            submitDescription={submitDescription}
          />
        )}
      >
        {sections}
      </A1SharedAssignmentWorkbookLayout>
    </div>
  );
};

export { WorkbookSection };
export default A1TutorMarkedWorkbookShell;
