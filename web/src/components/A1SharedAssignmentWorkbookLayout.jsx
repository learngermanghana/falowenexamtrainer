import React, { Children, isValidElement, useCallback, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getA1Assignment, getA1AssignmentNeighbors } from "../data/a1AssignmentRegistry";
import { styles } from "../styles";

export const WorkbookSection = ({ sectionKey, children }) => (
  <section data-workbook-section={sectionKey}>{children}</section>
);

const contentError = (assignmentKey, message) =>
  new Error(`[A1 workbook ${assignmentKey}] ${message}`);

export const validateWorkbookSections = (assignment, sectionElements, { allowPartialSections = false } = {}) => {
  const declared = assignment.sections.map(({ key }) => key);
  if (new Set(declared).size !== declared.length) {
    throw contentError(assignment.assignmentKey, "declares duplicate section keys.");
  }

  const rendered = sectionElements.map((element) => element.props.sectionKey);
  if (!allowPartialSections) {
    declared.forEach((key) => {
      const matches = rendered.filter((renderedKey) => renderedKey === key).length;
      if (!matches) {
        throw contentError(
          assignment.assignmentKey,
          `declares ${key}, but no WorkbookSection with sectionKey="${key}" was rendered.`,
        );
      }
      if (matches > 1) {
        throw contentError(assignment.assignmentKey, `renders WorkbookSection sectionKey="${key}" more than once.`);
      }
    });
  }

  rendered.forEach((key, index) => {
    if (!declared.includes(key)) {
      throw contentError(assignment.assignmentKey, `renders undeclared WorkbookSection sectionKey="${key}".`);
    }
    if (rendered.indexOf(key) !== index) {
      throw contentError(assignment.assignmentKey, `renders WorkbookSection sectionKey="${key}" more than once.`);
    }
  });

  sectionElements.forEach((element) => {
    if (!Children.count(element.props.children)) {
      throw contentError(assignment.assignmentKey, `${element.props.sectionKey} contains no content.`);
    }
  });
};

export const getAllowedWorkbookTabs = (sections) => [
  sections.length ? "overview" : "assignment",
  ...sections.map(({ key }) => key),
  "submit",
];

export const useA1WorkbookTabState = ({ assignment, sections = assignment.sections }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const allowedTabs = useMemo(() => getAllowedWorkbookTabs(sections), [sections]);
  const fallbackTab = sections.length ? "overview" : "assignment";
  const requestedTab = new URLSearchParams(location.search).get("workbookTab");
  const activeTab = allowedTabs.includes(requestedTab) ? requestedTab : fallbackTab;

  useEffect(() => {
    if (!requestedTab || allowedTabs.includes(requestedTab)) return;
    const search = new URLSearchParams(location.search);
    search.set("workbookTab", fallbackTab);
    navigate(
      { pathname: location.pathname, search: `?${search.toString()}`, hash: location.hash },
      { replace: true, state: location.state },
    );
  }, [allowedTabs, fallbackTab, location.hash, location.pathname, location.search, location.state, navigate, requestedTab]);

  const openTab = useCallback((key) => {
    if (!allowedTabs.includes(key)) return;
    const search = new URLSearchParams(location.search);
    search.set("workbookTab", key);
    search.set("assignmentKey", assignment.assignmentKey);
    search.set("assignmentId", assignment.assignmentKey);
    search.set("level", "A1");
    navigate(
      { pathname: location.pathname, search: `?${search.toString()}`, hash: location.hash },
      {
        replace: true,
        state: {
          ...(location.state || {}),
          level: "A1",
          day: assignment.day,
          chapter: assignment.chapter,
          assignmentKey: assignment.assignmentKey,
          assignmentId: assignment.assignmentKey,
          canonicalAssignmentKey: assignment.assignmentKey,
          inlineCourseSubmission: true,
        },
      },
    );
  }, [allowedTabs, assignment, location.hash, location.pathname, location.search, location.state, navigate]);

  return { activeTab, allowedTabs, fallbackTab, openTab };
};

const tabButtonStyle = (selected, submit = false) => ({
  ...styles.secondaryButton,
  background: selected ? (submit ? "#166534" : "#2563eb") : submit ? "#ecfdf5" : "#ffffff",
  borderColor: submit ? "#86efac" : selected ? "#2563eb" : "#93c5fd",
  color: selected ? "#ffffff" : submit ? "#166534" : "#1d4ed8",
  flex: "1 1 120px",
  fontWeight: 900,
  minHeight: 46,
  padding: "10px 14px",
});

export const A1SharedWorkbookTabBar = ({ assignment, sections, activeTab, onSelect }) => {
  const tabs = sections.length
    ? [{ key: "overview", label: "Overview" }, ...sections, { key: "submit", label: "Submit", submit: true }]
    : [{ key: "assignment", label: "Assignment" }, { key: "submit", label: "Submit", submit: true }];

  return (
    <nav
      data-workbook-navigation="shared"
      role="tablist"
      aria-label={`${assignment.assignmentKey} workbook sections`}
      style={{
        ...styles.card,
        border: "2px solid #2563eb",
        background: "linear-gradient(135deg, #dbeafe 0%, #ffffff 74%)",
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        position: "sticky",
        top: 8,
        zIndex: 35,
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.key}
          onClick={() => onSelect(tab.key)}
          style={tabButtonStyle(activeTab === tab.key, tab.submit)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export const A1AssignmentNeighborLinks = ({ assignmentKey }) => {
  const neighbors = getA1AssignmentNeighbors(assignmentKey);
  return (
    <nav
      aria-label="Previous and next A1 assignments"
      style={{ ...styles.card, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}
    >
      {neighbors.previous ? (
        <Link to={neighbors.previous.workbookRoute}>← {neighbors.previous.assignmentKey}</Link>
      ) : <span />}
      {neighbors.next ? (
        <Link to={neighbors.next.workbookRoute}>{neighbors.next.assignmentKey} →</Link>
      ) : <span />}
    </nav>
  );
};

export default function A1SharedAssignmentWorkbookLayout({
  assignmentKey,
  children,
  overview,
  renderSubmission,
  allowPartialSections = false,
}) {
  const assignment = getA1Assignment(assignmentKey);
  if (!assignment) throw contentError(assignmentKey, "has no canonical registry record.");

  const sectionElements = Children.toArray(children).filter(isValidElement);
  if (process.env.NODE_ENV !== "production") {
    validateWorkbookSections(assignment, sectionElements, { allowPartialSections });
  }

  const renderedKeys = new Set(sectionElements.map((element) => element.props.sectionKey));
  const availableSections = assignment.sections.filter(({ key }) => renderedKeys.has(key));
  const navigationSections = allowPartialSections ? assignment.sections : availableSections;
  const { activeTab, fallbackTab, openTab } = useA1WorkbookTabState({ assignment, sections: navigationSections });

  return (
    <div data-a1-shared-workbook={assignmentKey} style={{ display: "grid", gap: 16 }}>
      <A1SharedWorkbookTabBar
        assignment={assignment}
        sections={navigationSections}
        activeTab={activeTab}
        onSelect={openTab}
      />

      <div data-workbook-content>
        <div hidden={activeTab !== fallbackTab}>{overview}</div>
        {sectionElements.map((element) => (
          <div key={element.props.sectionKey} hidden={activeTab !== element.props.sectionKey}>
            {element}
          </div>
        ))}
        <div hidden={activeTab !== "submit"} data-workbook-submission={assignment.assignmentKey}>
          {renderSubmission?.(assignment)}
        </div>
      </div>

      <A1AssignmentNeighborLinks assignmentKey={assignmentKey} />
    </div>
  );
}
