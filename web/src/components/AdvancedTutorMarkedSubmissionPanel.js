import React, { useMemo } from "react";
import { getCurriculumEntriesForLevel } from "../data/germanAssignmentCatalog";
import { styles } from "../styles";
import ContextualAssignmentSubmissionPage from "./ContextualAssignmentSubmissionPage";

const ADVANCED_TUTOR_LEVELS = new Set(["B2", "C1"]);

export const resolvePublishedAdvancedTutorAssignment = ({
  level = "",
  day = null,
  canonicalLesson = null,
} = {}) => {
  const normalizedLevel = String(level || "").trim().toUpperCase();
  const numericDay = Number(day);
  if (!ADVANCED_TUTOR_LEVELS.has(normalizedLevel) || !Number.isFinite(numericDay) || numericDay <= 0) {
    return null;
  }

  const canonicalAssignmentId = String(
    canonicalLesson?.assignmentId ||
      canonicalLesson?.assignment_id ||
      canonicalLesson?.canonicalAssignmentId ||
      "",
  ).trim();

  const entries = getCurriculumEntriesForLevel(normalizedLevel) || [];
  const assignment = entries.find((entry) => {
    if (Number(entry?.day ?? entry?.assignmentDay ?? entry?.displayDay) !== numericDay) return false;
    if (entry?.assignment !== true || entry?.progressionEligible === false) return false;
    if (String(entry?.contentStatus || "published").toLowerCase() === "planned") return false;
    if (!canonicalAssignmentId) return true;
    return String(entry?.assignment_id || entry?.assignmentId || "").trim() === canonicalAssignmentId;
  });

  if (!assignment) return null;

  const assignmentKey = String(
    assignment.assignment_id || assignment.assignmentId || assignment.canonicalAssignmentId || "",
  ).trim();
  if (!assignmentKey) return null;

  return {
    level: normalizedLevel,
    day: numericDay,
    chapter: String(assignment.chapter || "").trim(),
    assignmentKey,
    canonicalAssignmentKey: assignmentKey,
    title: String(assignment.topic || assignment.title || "").trim(),
  };
};

const AdvancedTutorMarkedSubmissionPanel = ({ level, day, canonicalLesson = null }) => {
  const assignment = useMemo(
    () => resolvePublishedAdvancedTutorAssignment({ level, day, canonicalLesson }),
    [canonicalLesson, day, level],
  );

  if (!assignment) return null;

  return (
    <section
      data-advanced-tutor-marked-submission="true"
      data-assignment-key={assignment.assignmentKey}
      style={{
        ...styles.container,
        display: "grid",
        gap: 14,
        marginTop: 18,
        marginBottom: 24,
      }}
    >
      <div
        style={{
          ...styles.card,
          display: "grid",
          gap: 10,
          border: "2px solid #2563eb",
          borderRadius: 18,
          background: "linear-gradient(135deg,#eff6ff,#ffffff)",
        }}
      >
        <span style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e3a8a" }}>
          Teacher-marked assignment
        </span>
        <h2 style={{ margin: 0 }}>Submit Day {assignment.day} to your tutor</h2>
        <p style={{ margin: 0, lineHeight: 1.7, color: "#475569" }}>
          Submit your final work for <strong>{assignment.assignmentKey}</strong>
          {assignment.title ? <> · {assignment.title}</> : null}. This submission is locked to this lesson.
        </p>
        <ContextualAssignmentSubmissionPage submissionContext={assignment} />
      </div>
    </section>
  );
};

export default AdvancedTutorMarkedSubmissionPanel;
