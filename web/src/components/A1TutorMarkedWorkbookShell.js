import React, { Children, isValidElement } from "react";
import AppBackButton from "./navigation/AppBackButton";
import A1CanonicalSubmissionPanel from "./A1CanonicalSubmissionPanel";
import A1SharedAssignmentWorkbookLayout, { WorkbookSection } from "./A1SharedAssignmentWorkbookLayout";
import { getA1Assignment } from "../data/a1AssignmentRegistry";
import { styles } from "../styles";

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
  children,
}) => {
  const assignment = getA1Assignment(fallbackAssignmentKey);
  if (!assignment) throw new Error(`Unknown canonical A1 assignment: ${fallbackAssignmentKey}`);

  const { sectionMap, overviewNodes } = splitA1WorkbookContent(children);
  const sections = assignment.sections
    .filter(({ key }) => sectionMap.has(key))
    .map(({ key }) => (
      <WorkbookSection key={key} sectionKey={key}>{sectionMap.get(key)}</WorkbookSection>
    ));

  if (process.env.NODE_ENV !== "production") {
    const missing = assignment.sections.filter(({ key }) => !sectionMap.has(key)).map(({ key }) => key);
    if (missing.length) {
      throw new Error(
        `[A1 workbook ${assignment.assignmentKey}] could not find rendered content for ${missing.join(", ")}.`,
      );
    }
  }

  const overview = (
    <div style={{ display: "grid", gap: 12 }}>
      <p style={{ ...styles.card, margin: 0 }}>
        {assignmentIntro || `Complete every section, then submit ${assignment.assignmentKey}.`}
      </p>
      {overviewNodes}
    </div>
  );

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 12 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <h1 style={{ ...styles.title, marginBottom: 0 }}>{title}</h1>
        {subtitle ? <p style={{ ...styles.subtitle, margin: 0 }}>{subtitle}</p> : null}
      </header>

      <A1SharedAssignmentWorkbookLayout
        assignmentKey={assignment.assignmentKey}
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
