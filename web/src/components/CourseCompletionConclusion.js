import React from "react";
import { styles } from "../styles";

const nextLevelByLevel = {
  A1: "A2",
  A2: "B1",
  B1: "B2",
};

const summaryCard = {
  border: "1px solid #dbeafe",
  borderRadius: 14,
  padding: 12,
  background: "#ffffff",
  display: "grid",
  gap: 3,
};

const actionLink = {
  ...styles.secondaryButton,
  textDecoration: "none",
  justifyContent: "center",
};

const CourseCompletionConclusion = ({
  level,
  completedLessons = 0,
  totalLessons = 0,
  passedAssignments = 0,
  totalAssignments = 0,
  onExploreNextLevel,
}) => {
  const normalizedLevel = String(level || "").toUpperCase();
  const nextLevel = nextLevelByLevel[normalizedLevel];

  if (!nextLevel) return null;

  return (
    <section
      data-course-completion-conclusion={normalizedLevel}
      style={{
        ...styles.card,
        border: "1px solid #86efac",
        background: "linear-gradient(145deg, #f0fdf4 0%, #ffffff 58%, #eff6ff 100%)",
        borderRadius: 22,
        padding: "clamp(16px, 3vw, 24px)",
        display: "grid",
        gap: 18,
        boxShadow: "0 18px 42px rgba(15, 118, 110, 0.10)",
      }}
    >
      <div style={{ display: "grid", gap: 7 }}>
        <p style={{ margin: 0, color: "#047857", fontSize: 12, fontWeight: 900, letterSpacing: ".05em", textTransform: "uppercase" }}>
          Course completed
        </p>
        <h2 style={{ margin: 0, color: "#0f172a", fontSize: "clamp(23px, 4vw, 32px)" }}>
          {normalizedLevel} Course Completed
        </h2>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.65, maxWidth: 760 }}>
          You have reached the end of your {normalizedLevel} Course Book. Review your Results and any areas that still need improvement before moving fully into exam preparation or your next level.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10 }}>
        <div style={summaryCard}>
          <span style={{ color: "#64748b", fontSize: 12, fontWeight: 800 }}>Course work</span>
          <strong style={{ color: "#0f172a", fontSize: 18 }}>{completedLessons}/{totalLessons} lessons</strong>
          <span style={{ color: "#64748b", fontSize: 12 }}>Course Book requirements completed</span>
        </div>
        <div style={summaryCard}>
          <span style={{ color: "#64748b", fontSize: 12, fontWeight: 800 }}>Assignments</span>
          <strong style={{ color: "#0f172a", fontSize: 18 }}>{passedAssignments}/{totalAssignments} passed</strong>
          <a href="/campus/results" style={{ color: "#1d4ed8", fontSize: 12, fontWeight: 800, textDecoration: "none" }}>Review Results →</a>
        </div>
        <div style={summaryCard}>
          <span style={{ color: "#64748b", fontSize: 12, fontWeight: 800 }}>Attendance</span>
          <strong style={{ color: "#0f172a", fontSize: 18 }}>Review record</strong>
          <a href="/campus/attendance" style={{ color: "#1d4ed8", fontSize: 12, fontWeight: 800, textDecoration: "none" }}>Open Attendance →</a>
        </div>
        <div style={summaryCard}>
          <span style={{ color: "#64748b", fontSize: 12, fontWeight: 800 }}>Class Participation</span>
          <strong style={{ color: "#0f172a", fontSize: 18 }}>Review participation</strong>
          <a href="/campus/account?tab=participation" style={{ color: "#1d4ed8", fontSize: 12, fontWeight: 800, textDecoration: "none" }}>Open Participation →</a>
        </div>
      </div>

      <div style={{ borderTop: "1px solid #d1fae5", paddingTop: 16, display: "grid", gap: 10 }}>
        <h3 style={{ margin: 0, color: "#0f172a" }}>What’s next?</h3>
        <ol style={{ margin: 0, paddingLeft: 21, color: "#334155", lineHeight: 1.75 }}>
          <li>Review your Results, corrections and weak areas.</li>
          <li>Check your Attendance and Class Participation records.</li>
          <li>Continue with focused {normalizedLevel} exam preparation and your study calendar.</li>
          <li>Move to {nextLevel} when you are ready and your course progression has been confirmed.</li>
        </ol>
      </div>

      <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
        <a href="/exams/question" style={{ ...styles.primaryButton, textDecoration: "none" }}>
          Prepare for {normalizedLevel} Exam
        </a>
        <a href="/exams/study?force=1" style={actionLink}>
          Study Calendar
        </a>
        <button type="button" style={styles.secondaryButton} onClick={onExploreNextLevel}>
          Explore {nextLevel}
        </button>
      </div>

      <div style={{ borderRadius: 14, padding: 13, background: "#fffbeb", border: "1px solid #fde68a", color: "#78350f", lineHeight: 1.6 }}>
        <strong>Certificate confirmation:</strong> The school will confirm your course completion and certificate after the required work and course records have been reviewed. You do not need to email simply to choose your next step.
      </div>
    </section>
  );
};

export default CourseCompletionConclusion;
