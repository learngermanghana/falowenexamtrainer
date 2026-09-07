import React from "react";
import { styles } from "../styles";

const clampPercent = (value) => Math.max(0, Math.min(Number(value) || 0, 100));

const CourseCompletionProgressCard = ({ progress, onContinue, loading = false, error = "" }) => {
  if (!progress?.level || progress.mode === "unsupported") return null;

  const percent = clampPercent(progress.completionPercent);
  const unit = progress.mode === "self-learning" ? "required lessons" : "required assignments";
  const nextLabel = progress.next?.label || "";

  return (
    <section
      data-course-completion-progress
      data-level={progress.level}
      style={{
        ...styles.card,
        marginBottom: 0,
        display: "grid",
        gap: 12,
        border: "1px solid #bfdbfe",
        background: "linear-gradient(135deg,#eff6ff 0%,#ffffff 70%)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ display: "grid", gap: 4 }}>
          <span style={{ color: "#1d4ed8", fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".05em" }}>
            {progress.level} Course
          </span>
          <h2 style={{ margin: 0, color: "#0f172a", fontSize: "1.25rem" }}>
            {progress.courseWorkCompleted ? "Course work completed" : `Course progress: ${percent}%`}
          </h2>
        </div>
        <strong style={{ color: progress.courseWorkCompleted ? "#166534" : "#1d4ed8", fontSize: "1.65rem", lineHeight: 1 }}>
          {percent}%
        </strong>
      </div>

      <div
        role="progressbar"
        aria-label={`${progress.level} course completion`}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={percent}
        style={{ height: 12, borderRadius: 999, background: "#dbeafe", overflow: "hidden" }}
      >
        <div
          style={{
            height: "100%",
            width: `${percent}%`,
            borderRadius: 999,
            background: "linear-gradient(90deg,#2563eb,#16a34a)",
            transition: "width 180ms ease",
          }}
        />
      </div>

      <strong data-course-completion-count style={{ color: "#0f172a" }}>
        {progress.completed} / {progress.total} {unit} completed
      </strong>

      {progress.masteryAvailable ? (
        <div style={{ display: "grid", gap: 5 }}>
          <span data-course-mastery style={{ color: "#334155", fontWeight: 800 }}>
            Passed: {progress.passed} of {progress.completed} completed · {progress.masteryPercent ?? 0}%
          </span>
          <span style={{ color: "#64748b", fontSize: 13 }}>
            {progress.passed} passed · {progress.needsImprovement} need improvement
            {progress.awaitingReview ? ` · ${progress.awaitingReview} awaiting review` : ""}
          </span>
        </div>
      ) : (
        <p style={{ margin: 0, color: "#475569", fontSize: 13, lineHeight: 1.55 }}>
          Completion requires Learn + Speak + Write + Finish. Videos and Ref support learning but do not increase this percentage.
        </p>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "grid", gap: 3 }}>
          {progress.milestone ? (
            <span style={{ color: "#166534", fontSize: 12, fontWeight: 900 }}>
              {progress.milestone}% milestone reached
            </span>
          ) : null}
          {!progress.courseWorkCompleted && progress.nextMilestone ? (
            <span style={{ color: "#64748b", fontSize: 12 }}>Next milestone: {progress.nextMilestone}%</span>
          ) : null}
        </div>

        {progress.courseWorkCompleted ? (
          <span style={{ color: "#166534", fontWeight: 900 }}>All required course work is complete.</span>
        ) : nextLabel ? (
          <button type="button" style={styles.primaryButton} onClick={onContinue} disabled={!onContinue}>
            Continue learning → {nextLabel}
          </button>
        ) : null}
      </div>

      {loading ? <span style={{ color: "#64748b", fontSize: 12 }}>Syncing latest progress...</span> : null}
      {error ? <span style={{ color: "#b45309", fontSize: 12 }}>{error}</span> : null}
    </section>
  );
};

export default CourseCompletionProgressCard;