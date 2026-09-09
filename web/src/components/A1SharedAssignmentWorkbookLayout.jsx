import React, { Children, isValidElement, useCallback, useEffect, useMemo, useRef } from "react";
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

  rendered.forEach((key) => {
    if (!declared.includes(key)) {
      throw contentError(assignment.assignmentKey, `renders undeclared WorkbookSection sectionKey="${key}".`);
    }
  });

  sectionElements.forEach((element) => {
    if (!Children.count(element.props.children)) {
      throw contentError(assignment.assignmentKey, `${element.props.sectionKey} contains no content.`);
    }
  });
};

export const getAllowedWorkbookTabs = (sections, hasGrammar = false) => [
  sections.length ? "overview" : "assignment",
  ...(hasGrammar ? ["grammar"] : []),
  ...sections.map(({ key }) => key),
  "submit",
];

export const useA1WorkbookTabState = ({ assignment, sections = assignment.sections, hasGrammar = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const allowedTabs = useMemo(() => getAllowedWorkbookTabs(sections, hasGrammar), [hasGrammar, sections]);
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

export const moveA1WorkbookViewportTo = (element) => {
  if (!element) return;
  const focusTarget = element.querySelector?.("h1, h2, h3, h4, h5, h6") || element;
  if (!focusTarget.hasAttribute?.("tabindex")) focusTarget.setAttribute?.("tabindex", "-1");
  focusTarget.focus?.({ preventScroll: true });
  element.scrollIntoView?.({ behavior: "smooth", block: "start" });
};

const tabButtonStyle = (selected, submit = false) => ({
  ...styles.secondaryButton,
  background: selected ? (submit ? "#166534" : "#2563eb") : submit ? "#ecfdf5" : "#ffffff",
  borderColor: submit ? "#86efac" : selected ? "#2563eb" : "#93c5fd",
  color: selected ? "#ffffff" : submit ? "#166534" : "#1d4ed8",
  flex: "1 1 112px",
  fontWeight: 900,
  lineHeight: 1.2,
  minHeight: 50,
  minWidth: 0,
  padding: "10px 12px",
  whiteSpace: "normal",
});

export const getA1WorkbookTabDefinitions = ({ sections = [], hasGrammar = false } = {}) =>
  sections.length
    ? [
      { key: "overview", label: "Overview" },
      ...(hasGrammar ? [{ key: "grammar", label: "Grammar" }] : []),
      ...sections,
      { key: "submit", label: "Submit Assignment", submit: true },
    ]
    : [
      { key: "assignment", label: "Assignment" },
      ...(hasGrammar ? [{ key: "grammar", label: "Grammar" }] : []),
      { key: "submit", label: "Submit Assignment", submit: true },
    ];

export const A1WorkbookSectionAction = ({ sections = [], sectionKey, onSelect }) => {
  const sectionIndex = sections.findIndex((section) => section.key === sectionKey);
  if (sectionIndex < 0) return null;

  const isFinalSection = sectionIndex === sections.length - 1;
  const nextSection = !isFinalSection ? sections[sectionIndex + 1] : null;
  const targetKey = isFinalSection ? "submit" : nextSection?.key;
  if (!targetKey) return null;

  const nextLabel = nextSection?.label || (nextSection?.number ? `Teil ${nextSection.number}` : "the next Teil");
  const buttonLabel = isFinalSection ? "Submit Complete Assignment" : `Continue to ${nextLabel}`;

  return (
    <div
      data-a1-section-action={sectionKey}
      data-a1-final-section={isFinalSection ? "true" : "false"}
      style={{
        ...styles.card,
        border: `1px solid ${isFinalSection ? "#86efac" : "#bfdbfe"}`,
        background: isFinalSection ? "#f0fdf4" : "#eff6ff",
        display: "grid",
        gap: 10,
        marginTop: 16,
      }}
    >
      <p style={{ margin: 0, color: isFinalSection ? "#166534" : "#1e3a8a", lineHeight: 1.65, fontWeight: 700 }}>
        {isFinalSection
          ? "This is the final required Teil. Make sure all of your answers are ready, then open the submission form for the complete assignment."
          : "Finished this Teil? Continue to the next required Teil before submitting the assignment."}
      </p>
      <button
        type="button"
        onClick={() => onSelect?.(targetKey)}
        style={{
          ...(isFinalSection ? styles.primaryButton : styles.secondaryButton),
          justifySelf: "start",
          minHeight: 46,
          whiteSpace: "normal",
        }}
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export const A1SharedWorkbookTabBar = ({ assignment, sections, activeTab, onSelect, hasGrammar = false }) => {
  const tabs = getA1WorkbookTabDefinitions({ sections, hasGrammar });
  const activeIndex = Math.max(0, tabs.findIndex((tab) => tab.key === activeTab));
  const progressPercent = tabs.length ? Math.round(((activeIndex + 1) / tabs.length) * 100) : 0;

  return (
    <div data-a1-workbook-navigation-shell="true" style={{ display: "grid", gap: 8 }}>
      <nav
        data-workbook-navigation="shared"
        data-workbook-navigation-behavior="static"
        role="tablist"
        aria-label={`${assignment.assignmentKey} workbook sections`}
        style={{
          ...styles.card,
          border: "2px solid #2563eb",
          background: "linear-gradient(135deg, #dbeafe 0%, #ffffff 74%)",
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          padding: 12,
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
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

      <div
        data-a1-workbook-section-progress="true"
        style={{ ...styles.card, padding: "10px 12px", display: "grid", gap: 7 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", color: "#475569", fontSize: 13, fontWeight: 800 }}>
          <span>Section {activeIndex + 1} of {tabs.length}</span>
          <span>{progressPercent}%</span>
        </div>
        <div
          role="progressbar"
          aria-label="A1 workbook section progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercent}
          style={{ height: 7, width: "100%", background: "#dbeafe", borderRadius: 999, overflow: "hidden" }}
        >
          <div style={{ width: `${progressPercent}%`, height: "100%", background: "#2563eb", borderRadius: 999, transition: "width 180ms ease" }} />
        </div>
      </div>
    </div>
  );
};

export const A1AssignmentNeighborLinks = ({ assignmentKey }) => {
  const neighbors = getA1AssignmentNeighbors(assignmentKey);
  return (
    <nav
      aria-label="Previous and next A1 assignments"
      data-a1-assignment-neighbors="true"
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
  grammar,
  overview,
  renderSubmission,
}) {
  const assignment = getA1Assignment(assignmentKey);
  if (!assignment) throw contentError(assignmentKey, "has no canonical registry record.");

  const sectionElements = Children.toArray(children).filter(isValidElement);
  if (process.env.NODE_ENV !== "production") validateWorkbookSections(assignment, sectionElements);

  const renderedKeys = new Set(sectionElements.map((element) => element.props.sectionKey));
  const isCombinedDay1 =
    assignment.assignmentKey === "A1-0.1" &&
    renderedKeys.has("teil-1") &&
    renderedKeys.has("teil-2");
  const availableSections = isCombinedDay1
    ? [{ key: "teil-2", number: 2, label: "Reading + Questions" }]
    : assignment.sections.filter(({ key }) => renderedKeys.has(key));
  const hasGrammar = Boolean(grammar);
  const { activeTab, openTab } = useA1WorkbookTabState({ assignment, sections: availableSections, hasGrammar });
  const overviewTab = availableSections.length ? "overview" : "assignment";
  const layoutRef = useRef(null);
  const pendingViewportTabRef = useRef("");

  const openTabFromSectionAction = useCallback((key) => {
    pendingViewportTabRef.current = key;
    openTab(key);
  }, [openTab]);

  useEffect(() => {
    if (!pendingViewportTabRef.current || pendingViewportTabRef.current !== activeTab) return;
    pendingViewportTabRef.current = "";
    const target = layoutRef.current?.querySelector?.(`[data-workbook-panel="${activeTab}"]`);
    moveA1WorkbookViewportTo(target);
  }, [activeTab]);

  return (
    <div ref={layoutRef} data-a1-shared-workbook={assignmentKey} style={{ display: "grid", gap: 16 }}>
      <A1SharedWorkbookTabBar
        assignment={assignment}
        sections={availableSections}
        activeTab={activeTab}
        onSelect={openTab}
        hasGrammar={hasGrammar}
      />

      <div data-workbook-content>
        <div data-workbook-panel={overviewTab} hidden={activeTab !== overviewTab}>{overview}</div>
        {hasGrammar ? (
          <div data-workbook-panel="grammar" hidden={activeTab !== "grammar"} data-workbook-grammar={assignment.assignmentKey}>
            {grammar}
          </div>
        ) : null}
        {isCombinedDay1 ? (
          <div data-workbook-panel="teil-2" hidden={activeTab !== "teil-2"} data-workbook-combined-section="reading-questions">
            {sectionElements}
            <A1WorkbookSectionAction
              sections={availableSections}
              sectionKey="teil-2"
              onSelect={openTabFromSectionAction}
            />
          </div>
        ) : (
          sectionElements.map((element) => (
            <div
              key={element.props.sectionKey}
              data-workbook-panel={element.props.sectionKey}
              hidden={activeTab !== element.props.sectionKey}
            >
              {element}
              <A1WorkbookSectionAction
                sections={availableSections}
                sectionKey={element.props.sectionKey}
                onSelect={openTabFromSectionAction}
              />
            </div>
          ))
        )}
        <div
          data-workbook-panel="submit"
          hidden={activeTab !== "submit"}
          data-workbook-submission={assignment.assignmentKey}
        >
          {renderSubmission?.(assignment)}
        </div>
      </div>

      <A1AssignmentNeighborLinks assignmentKey={assignmentKey} />
    </div>
  );
}
