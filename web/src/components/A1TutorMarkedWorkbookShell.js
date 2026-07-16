import React, { Children, isValidElement } from "react";
import AppBackButton from "./navigation/AppBackButton";
import A1CanonicalSubmissionPanel from "./A1CanonicalSubmissionPanel";
import A1SharedAssignmentWorkbookLayout, { WorkbookSection } from "./A1SharedAssignmentWorkbookLayout";
import { getA1Assignment } from "../data/a1AssignmentRegistry";
import { styles } from "../styles";

const headingTypes = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);
const LEGACY_NAV_COMPONENT_NAMES = new Set(["Day21SectionNavigation"]);

const readText = (value) => Children.toArray(value)
  .map((child) => {
    if (typeof child === "string" || typeof child === "number") return String(child);
    if (isValidElement(child)) return readText(child.props.children);
    return "";
  })
  .join(" ")
  .replace(/\s+/g, " ")
  .trim();

const getComponentName = (element) => {
  if (!isValidElement(element) || typeof element.type === "string") return "";
  return element.type?.displayName || element.type?.name || "";
};

const getComponentSectionKey = (element) => {
  const name = getComponentName(element);
  const match = name.match(/^Teil(\d+)Content$/i);
  return match ? `teil-${Number(match[1])}` : "";
};

const getDirectSectionKey = (element) => {
  if (!isValidElement(element)) return "";
  if (element.type === WorkbookSection) return element.props.sectionKey || "";

  const componentSectionKey = getComponentSectionKey(element);
  if (componentSectionKey) return componentSectionKey;

  const heading = Children.toArray(element.props.children).find(
    (child) => isValidElement(child) && typeof child.type === "string" && headingTypes.has(child.type),
  );
  if (!heading) return "";
  const match = readText(heading.props.children).match(/^Teil\s*(\d+)\b/i);
  return match ? `teil-${Number(match[1])}` : "";
};

const isLegacyNavigationNode = (element) => {
  if (!isValidElement(element)) return false;
  if (LEGACY_NAV_COMPONENT_NAMES.has(getComponentName(element))) return true;
  return element.props?.["data-a1-teil-navigation"] === "true";
};

const containsSectionRoot = (element) => {
  if (!isValidElement(element)) return false;
  if (getDirectSectionKey(element)) return true;
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

    if (isLegacyNavigationNode(node)) return;

    const sectionKey = getDirectSectionKey(node);
    if (sectionKey) {
      sectionMap.set(sectionKey, node.type === WorkbookSection ? node.props.children : node);
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
  const allowPartialSections = assignment.assignmentKey === "A1-13";
  const sections = assignment.sections
    .filter(({ key }) => sectionMap.has(key))
    .map(({ key }) => (
      <WorkbookSection key={key} sectionKey={key}>{sectionMap.get(key)}</WorkbookSection>
    ));

  if (process.env.NODE_ENV !== "production" && !allowPartialSections) {
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
        allowPartialSections={allowPartialSections}
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
