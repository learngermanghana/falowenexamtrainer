import React, { useEffect, useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { updatePageMeta } from "../lib/pageMeta";
import { styles } from "../styles";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import A1AlphabetAssignmentContent from "./A1AlphabetAssignmentContent";
import { getInlineCourseAssignments } from "../utils/courseLessonAssignments";

const panel = { ...styles.card, display: "grid", gap: 12 };

const A1Day3GermanAlphabetReviewingWorkbookPage = () => {
  const level = "A1";
  const day = 2;
  const [activeTab, setActiveTab] = useState("assignment");
  const assignmentKey = useMemo(() => {
    const assignment = getInlineCourseAssignments(level, day).find(
      (item) => item.chapter === "0.2"
    );
    return assignment?.assignmentKey || "A1-0.2";
  }, []);

  useEffect(() => {
    updatePageMeta({
      title: "A1 · Day 2 Workbook · German Alphabet + Reviewing",
      canonicalPath: "/campus/course/a1-day-2-german-alphabet-reviewing-workbook",
    });
  }, []);

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={panel}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          A1 · Day 2 Workbook · German Alphabet + Reviewing
        </h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Chapter 0.2 · Assignment for tutor marking
        </p>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Complete the workbook in the Assignment tab, then use the Submit tab to send your final
          answers for this exact assignment.
        </p>
        <div
          role="tablist"
          aria-label="A1 Day 2 workbook tabs"
          style={{ display: "flex", gap: 8, flexWrap: "wrap", borderTop: "1px solid #dbeafe", paddingTop: 12 }}
        >
          {[
            { key: "assignment", label: "Assignment" },
            { key: "submit", label: "Submit" },
          ].map((tab) => {
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
                  background: selected ? "#2563eb" : "#fff",
                  borderColor: selected ? "#2563eb" : "#93c5fd",
                  color: selected ? "#fff" : "#1d4ed8",
                  fontWeight: 800,
                  minWidth: 120,
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "assignment" ? (
        <A1AlphabetAssignmentContent />
      ) : (
        <section style={{ ...panel, border: "1px solid #bfdbfe" }} aria-label="Submit A1 Day 2 workbook answers">
          <div>
            <p style={{ color: "#1d4ed8", fontSize: 13, fontWeight: 900, letterSpacing: ".04em", margin: 0, textTransform: "uppercase" }}>
              Tutor-marked assignment
            </p>
            <h2 style={{ margin: "4px 0" }}>Submit A1 · Day 2 · German Alphabet</h2>
            <p style={{ color: "#475569", margin: 0 }}>
              This submission box is locked to {assignmentKey}, so your work is saved under the
              correct assignment.
            </p>
          </div>
          <div className="a1-day2-workbook-submit-tab">
            <style>{`.a1-day2-workbook-submit-tab > div > section:first-child { display: none !important; }
              .a1-day2-workbook-submit-tab select { display: none !important; }`}</style>
            <AssignmentSubmissionPage
              submissionContext={{
                level,
                day,
                assignmentKey,
                canonicalAssignmentKey: assignmentKey,
              }}
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default A1Day3GermanAlphabetReviewingWorkbookPage;
