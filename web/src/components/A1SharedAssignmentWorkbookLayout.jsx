import React, { Children, isValidElement, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getA1Assignment, getA1AssignmentNeighbors } from "../data/a1AssignmentRegistry";
import { styles } from "../styles";

export const WorkbookSection = ({ sectionKey, children }) => (
  <section data-workbook-section={sectionKey}>{children}</section>
);

const contentError = (assignmentKey, message) =>
  new Error(`[A1 workbook ${assignmentKey}] ${message}`);

export const validateWorkbookSections = (assignment, sectionElements) => {
  const declared = assignment.sections.map(({ key }) => key);
  if (new Set(declared).size !== declared.length) {
    throw contentError(assignment.assignmentKey, "declares duplicate section keys.");
  }
  const rendered = sectionElements.map((element) => element.props.sectionKey);
  declared.forEach((key) => {
    const matches = rendered.filter((renderedKey) => renderedKey === key).length;
    if (!matches) throw contentError(assignment.assignmentKey, `declares ${key}, but no WorkbookSection with sectionKey="${key}" was rendered.`);
    if (matches > 1) throw contentError(assignment.assignmentKey, `renders WorkbookSection sectionKey="${key}" more than once.`);
  });
  rendered.forEach((key) => {
    if (!declared.includes(key)) throw contentError(assignment.assignmentKey, `renders undeclared WorkbookSection sectionKey="${key}".`);
  });
  sectionElements.forEach((element) => {
    if (!Children.count(element.props.children)) throw contentError(assignment.assignmentKey, `${element.props.sectionKey} contains no content.`);
  });
};

export const getAllowedWorkbookTabs = (sections) => [
  sections.length ? "overview" : "assignment",
  ...sections.map(({ key }) => key),
  "submit",
];

export default function A1SharedAssignmentWorkbookLayout({
  assignmentKey,
  children,
  overview,
  renderSubmission,
}) {
  const assignment = getA1Assignment(assignmentKey);
  if (!assignment) throw contentError(assignmentKey, "has no canonical registry record.");
  const location = useLocation();
  const navigate = useNavigate();
  const sectionElements = Children.toArray(children).filter(isValidElement);
  if (process.env.NODE_ENV !== "production") validateWorkbookSections(assignment, sectionElements);

  const allowedTabs = useMemo(() => getAllowedWorkbookTabs(assignment.sections), [assignment.sections]);
  const fallbackTab = assignment.sections.length ? "overview" : "assignment";
  const requestedTab = new URLSearchParams(location.search).get("workbookTab");
  const activeTab = allowedTabs.includes(requestedTab) ? requestedTab : fallbackTab;

  useEffect(() => {
    if (!requestedTab || allowedTabs.includes(requestedTab)) return;
    const search = new URLSearchParams(location.search);
    search.set("workbookTab", fallbackTab);
    navigate({ pathname: location.pathname, search: `?${search}` }, { replace: true });
  }, [allowedTabs, fallbackTab, location.pathname, location.search, navigate, requestedTab]);

  const openTab = (key) => {
    const search = new URLSearchParams(location.search);
    search.set("workbookTab", key);
    search.set("assignmentKey", assignment.assignmentKey);
    search.set("assignmentId", assignment.assignmentKey);
    search.set("level", "A1");
    navigate({ pathname: location.pathname, search: `?${search}` }, { replace: true });
  };
  const tabs = assignment.sections.length
    ? [{ key: "overview", label: "Overview" }, ...assignment.sections, { key: "submit", label: "Submit" }]
    : [{ key: "assignment", label: "Assignment" }, { key: "submit", label: "Submit" }];
  const neighbors = getA1AssignmentNeighbors(assignmentKey);

  return (
    <div data-a1-shared-workbook={assignmentKey} style={{ display: "grid", gap: 16 }}>
      <nav data-workbook-navigation="shared" role="tablist" aria-label={`${assignmentKey} workbook sections`} style={{ ...styles.card, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {tabs.map((tab) => <button key={tab.key} type="button" role="tab" aria-selected={activeTab === tab.key} onClick={() => openTab(tab.key)} style={{ ...styles.secondaryButton, fontWeight: 800 }}>{tab.label}</button>)}
      </nav>

      <div data-workbook-content>
        <div hidden={activeTab !== fallbackTab}>{overview}</div>
        {sectionElements.map((element) => (
          <div key={element.props.sectionKey} hidden={activeTab !== element.props.sectionKey}>{element}</div>
        ))}
        <div hidden={activeTab !== "submit"} data-workbook-submission={assignment.assignmentKey}>
          {renderSubmission?.(assignment)}
        </div>
      </div>

      <nav aria-label="Previous and next A1 assignments" style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        {neighbors.previous ? <Link to={neighbors.previous.workbookRoute}>← {neighbors.previous.assignmentKey}</Link> : <span />}
        {neighbors.next ? <Link to={neighbors.next.workbookRoute}>{neighbors.next.assignmentKey} →</Link> : <span />}
      </nav>
    </div>
  );
}
