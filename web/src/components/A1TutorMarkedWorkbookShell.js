import React, { Children, isValidElement } from "react";
import { useNavigate } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import A1CanonicalSubmissionPanel from "./A1CanonicalSubmissionPanel";
import A1Day21WeatherResources from "./A1Day21WeatherResources";
import A1SharedAssignmentWorkbookLayout, { WorkbookSection } from "./A1SharedAssignmentWorkbookLayout";
import A1TutorMarkedOverviewGuidance from "./A1TutorMarkedOverviewGuidance";
import A1WorkbookGrammarNotes from "./A1WorkbookGrammarNotes";
import A1WorkbookMediaPanel from "./A1WorkbookMediaPanel";
import { A1_ASSIGNMENT_ORDER, getA1Assignment } from "../data/a1AssignmentRegistry";
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

const metaBadgeStyle = (emphasis = false) => ({
  alignItems: "center",
  background: emphasis ? "#1d4ed8" : "#eff6ff",
  border: `1px solid ${emphasis ? "#1d4ed8" : "#bfdbfe"}`,
  borderRadius: 999,
  color: emphasis ? "#ffffff" : "#1e3a8a",
  display: "inline-flex",
  fontSize: 12,
  fontWeight: 900,
  gap: 4,
  lineHeight: 1,
  minHeight: 28,
  padding: "7px 10px",
});

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

  const assignmentIndex = A1_ASSIGNMENT_ORDER.indexOf(assignment.assignmentKey);
  const assignmentNumber = assignmentIndex >= 0 ? assignmentIndex + 1 : 1;
  const assignmentTotal = A1_ASSIGNMENT_ORDER.length;
  const assignmentProgress = Math.round((assignmentNumber / assignmentTotal) * 100);
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

  const handlePrint = () => {
    if (typeof window !== "undefined" && typeof window.print === "function") window.print();
  };

  return (
    <div
      data-a1-tutor-marked-workbook={assignment.assignmentKey}
      style={{ ...styles.container, display: "grid", gap: 16 }}
    >
      <style>{`@media print { [data-a1-workbook-screen-controls="true"] { display: none !important; } [data-a1-workbook-media="true"] { break-inside: avoid; } }`}</style>

      <header
        data-a1-modern-workbook-header="true"
        style={{
          ...styles.card,
          display: "grid",
          gap: 14,
          border: "1px solid #bfdbfe",
          background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 70%)",
          boxShadow: "0 14px 30px rgba(15, 23, 42, 0.08)",
        }}
      >
        <div
          data-a1-workbook-screen-controls="true"
          style={{ display: "flex", gap: 8, justifyContent: "space-between", flexWrap: "wrap", alignItems: "center" }}
        >
          <AppBackButton
            label={backLabel}
            fallbackPath={backFallbackPath}
            onBack={backTo ? () => navigate(backTo, { replace: true }) : undefined}
          />
          <button
            type="button"
            onClick={handlePrint}
            style={{
              ...styles.secondaryButton,
              borderColor: "#93c5fd",
              color: "#1d4ed8",
              fontWeight: 900,
              minHeight: 42,
              padding: "9px 13px",
            }}
          >
            Download / Print PDF
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={metaBadgeStyle(true)}>A1</span>
          <span style={metaBadgeStyle()}>Day {assignment.day}</span>
          <span style={metaBadgeStyle()}>Kapitel {assignment.chapter}</span>
          <span style={metaBadgeStyle()}>Assignment {assignment.assignmentKey}</span>
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <h1 style={{ ...styles.title, margin: 0 }}>{title || assignment.title}</h1>
          {title && title !== assignment.title ? (
            <p style={{ margin: 0, color: "#334155", fontWeight: 800 }}>{assignment.title}</p>
          ) : null}
          {subtitle ? <p style={{ ...styles.subtitle, margin: 0 }}>{subtitle}</p> : null}
        </div>

        <div data-a1-assignment-progress="true" style={{ display: "grid", gap: 7 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", color: "#475569", fontSize: 13, fontWeight: 800 }}>
            <span>Assignment {assignmentNumber} of {assignmentTotal}</span>
            <span>{assignmentProgress}% of tutor-marked A1 workbooks</span>
          </div>
          <div
            role="progressbar"
            aria-label="A1 assignment progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={assignmentProgress}
            style={{ height: 8, width: "100%", background: "#dbeafe", borderRadius: 999, overflow: "hidden" }}
          >
            <div style={{ width: `${assignmentProgress}%`, height: "100%", background: "#2563eb", borderRadius: 999 }} />
          </div>
        </div>

        {headerActions ? (
          <div
            data-a1-workbook-header-actions="true"
            data-a1-workbook-screen-controls="true"
            style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}
          >
            {headerActions}
          </div>
        ) : null}
      </header>

      <A1WorkbookMediaPanel day={assignment.day} chapter={assignment.chapter} />

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
