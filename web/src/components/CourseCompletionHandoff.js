import React from "react";
import { styles } from "../styles";

const extractYouTubeId = (url = "") => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return parsed.pathname.replace(/^\//, "").split("/")[0];
    if (host.endsWith("youtube.com")) {
      return parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop() || "";
    }
  } catch {
    return "";
  }
  return "";
};

const CourseCompletionHandoff = ({
  level,
  isComplete,
  progressPercent,
  finalLessonTitle,
  journey,
  onOpenExamsRoom,
  onReviewFinalLesson,
}) => {
  const youtubeId = extractYouTubeId(journey?.videoUrl || "");
  const title = isComplete ? journey?.completedTitle : journey?.title;
  const description = isComplete ? journey?.completedDescription : journey?.description;

  return (
    <section
      aria-label={`${level} course completion and exam preparation`}
      style={{
        borderRadius: 24,
        overflow: "hidden",
        border: `1px solid ${isComplete ? "#86efac" : "#bfdbfe"}`,
        background: isComplete
          ? "linear-gradient(135deg,#ecfdf5 0%,#f0fdf4 45%,#eff6ff 100%)"
          : "linear-gradient(135deg,#eff6ff 0%,#ffffff 55%,#eef2ff 100%)",
        boxShadow: isComplete
          ? "0 22px 44px rgba(16,185,129,.14)"
          : "0 18px 38px rgba(37,99,235,.12)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: youtubeId ? "repeat(auto-fit,minmax(280px,1fr))" : "1fr",
          gap: 20,
          padding: "clamp(18px,4vw,30px)",
          alignItems: "center",
        }}
      >
        {youtubeId ? (
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingTop: "56.25%",
              borderRadius: 18,
              overflow: "hidden",
              background: "#0f172a",
              boxShadow: "0 16px 30px rgba(15,23,42,.2)",
            }}
          >
            <iframe
              title={`${level} course completion message`}
              src={`https://www.youtube.com/embed/${youtubeId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
            />
          </div>
        ) : null}

        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span
              style={{
                ...styles.badge,
                background: isComplete ? "#dcfce7" : "#dbeafe",
                color: isComplete ? "#166534" : "#1d4ed8",
              }}
            >
              {isComplete ? "Course completed" : journey?.eyebrow || "Your next step"}
            </span>
            <span style={{ ...styles.badge, background: "#ffffff", color: "#475569" }}>
              {Math.max(0, Math.min(Number(progressPercent) || 0, 100))}% complete
            </span>
          </div>

          <div>
            <h2 style={{ margin: 0, color: "#0f172a", fontSize: "clamp(1.55rem,4vw,2.35rem)", lineHeight: 1.12 }}>
              {title}
            </h2>
            <p style={{ margin: "10px 0 0", color: "#475569", lineHeight: 1.7, maxWidth: 760 }}>
              {description}
            </p>
          </div>

          <ol style={{ margin: 0, paddingLeft: 22, color: "#334155", lineHeight: 1.75 }}>
            {(journey?.steps || []).map((step) => <li key={step}>{step}</li>)}
          </ol>

          {isComplete ? (
            <div style={{ border: "1px solid #bbf7d0", background: "#f0fdf4", color: "#166534", borderRadius: 14, padding: 12, lineHeight: 1.6 }}>
              <strong>Do not stop here.</strong> Your language course is complete, but exam preparation is the next stage of your journey.
            </div>
          ) : (
            <div style={{ border: "1px solid #fde68a", background: "#fffbeb", color: "#92400e", borderRadius: 14, padding: 12, lineHeight: 1.6 }}>
              Finish the remaining Course Book lessons, then use the Exams Room for focused exam preparation.
            </div>
          )}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="button" style={{ ...styles.primaryButton, minHeight: 46, fontWeight: 900 }} onClick={onOpenExamsRoom}>
              Go to Exams Room
            </button>
            {onReviewFinalLesson ? (
              <button type="button" style={{ ...styles.secondaryButton, minHeight: 46 }} onClick={onReviewFinalLesson}>
                Review final lesson{finalLessonTitle ? `: ${finalLessonTitle}` : ""}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseCompletionHandoff;
