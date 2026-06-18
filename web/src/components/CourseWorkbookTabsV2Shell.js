import React from "react";
import { styles } from "../styles";
import useCourseWorkbookTabsV2 from "../hooks/useCourseWorkbookTabsV2";
import CourseWorkbookAssignmentSubmission from "./CourseWorkbookAssignmentSubmission";

const CourseWorkbookTabsV2Shell = ({ hostRef, match }) => {
  const {
    activeTab,
    assignment,
    assignmentKey,
    canonicalLockId,
    day,
    enabled,
    legacyChapterKey,
    legacyLockId,
    level,
    setActiveTab,
    studentScopeKey,
    tabs,
  } = useCourseWorkbookTabsV2({ hostRef, match });

  if (!enabled) return null;

  return (
    <section
      aria-label="Workbook assignment navigation"
      style={{
        ...styles.card,
        background: "#eff6ff",
        border: "1px solid #bfdbfe",
        display: "grid",
        gap: 10,
        marginTop: 12,
        padding: 12,
      }}
    >
      <div>
        <strong style={{ color: "#0f172a" }}>{level} · Day {day} workbook</strong>
        <p style={{ color: "#475569", fontSize: 12, margin: "3px 0 0" }}>
          {assignment?.chapter ? `Chapter ${assignment.chapter} · ` : ""}
          {assignmentKey}
        </p>
      </div>

      <div
        role="tablist"
        aria-label={`${level} workbook sections`}
        style={{ display: "flex", gap: 8, overflowX: "auto" }}
      >
        {tabs.map((tab) => {
          const selected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveTab(tab.key)}
              style={{
                ...styles.secondaryButton,
                background: selected ? "#2563eb" : "#ffffff",
                borderColor: selected ? "#2563eb" : "#93c5fd",
                color: selected ? "#ffffff" : "#1d4ed8",
                flex: "0 0 auto",
                fontWeight: 800,
                minWidth: level === "A1" ? 120 : 74,
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "submit" ? (
        <div style={{ background: "#ffffff", border: "1px solid #bfdbfe", borderRadius: 14, padding: 8 }}>
          <CourseWorkbookAssignmentSubmission
            assignment={assignment}
            assignmentKey={assignmentKey}
            canonicalLockId={canonicalLockId}
            legacyLockId={legacyLockId}
            legacyChapterKey={legacyChapterKey}
            level={level}
            day={day}
            studentScopeKey={studentScopeKey}
          />
        </div>
      ) : null}
    </section>
  );
};

export default CourseWorkbookTabsV2Shell;
