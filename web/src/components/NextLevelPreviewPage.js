import React, { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { courseSchedules } from "../data/courseSchedule";
import { normalizeCourseLevel } from "../utils/levelAccess";
import { styles } from "../styles";

const LEVELS = new Set(["A2", "B1", "B2", "C1", "C2"]);
const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const isCompletionEntry = (entry = {}) =>
  Boolean(entry.completion) || /course completed/i.test(String(entry.topic || entry.title || ""));

const getDay = (entry = {}) => Number(entry.displayDay ?? entry.day ?? 0);
const getTitle = (entry = {}) =>
  String(entry.lessonTitle || entry.topic || entry.title || entry.chapter || `Day ${getDay(entry)}`).trim();

const getChapter = (entry = {}) =>
  String(entry.displayChapter || entry.chapter || "").trim();

const getResourceHighlights = (entry = {}) => {
  const resources = [
    ...toArray(entry.lesen_hören),
    ...toArray(entry.schreiben_sprechen),
  ];

  const labels = resources
    .map((resource) => String(resource?.title || resource?.topic || resource?.chapter || "").trim())
    .filter(Boolean);

  return [...new Set(labels)].slice(0, 4);
};

const card = {
  ...styles.card,
  borderRadius: 18,
  padding: "clamp(15px, 3vw, 22px)",
};

const lockBadge = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  borderRadius: 999,
  padding: "5px 9px",
  fontSize: 12,
  fontWeight: 900,
  background: "#f1f5f9",
  color: "#475569",
  border: "1px solid #cbd5e1",
};

export default function NextLevelPreviewPage() {
  const { level: levelParam } = useParams();
  const previewLevel = normalizeCourseLevel(levelParam);

  const lessons = useMemo(() => {
    if (!previewLevel) return [];
    return (courseSchedules?.[previewLevel] || [])
      .filter((entry) => getDay(entry) > 0 && !isCompletionEntry(entry))
      .sort((a, b) => getDay(a) - getDay(b));
  }, [previewLevel]);

  if (!LEVELS.has(previewLevel)) {
    return <Navigate to="/campus/course" replace />;
  }

  const previewLesson = lessons[0] || null;
  const lockedLessons = lessons.slice(1);
  const chapter = previewLesson ? getChapter(previewLesson) : "";
  const resourceHighlights = previewLesson ? getResourceHighlights(previewLesson) : [];
  const upgradeHref = "/campus/account?tab=upgrade";

  return (
    <main style={{ ...styles.container, display: "grid", gap: 18, paddingBottom: 70 }}>
      <section
        style={{
          ...card,
          background: "linear-gradient(145deg, #eff6ff 0%, #ffffff 62%, #f0fdf4 100%)",
          border: "1px solid #bfdbfe",
          display: "grid",
          gap: 12,
        }}
      >
        <p style={{ margin: 0, color: "#1d4ed8", fontSize: 12, fontWeight: 900, letterSpacing: ".05em", textTransform: "uppercase" }}>
          Next-level preview
        </p>
        <h1 style={{ ...styles.title, margin: 0 }}>Explore {previewLevel}</h1>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.7, maxWidth: 780 }}>
          See what comes next before you upgrade. The first {previewLevel} chapter is open as a preview. The remaining course stays locked until your {previewLevel} enrollment is activated.
        </p>
        <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
          <a href={upgradeHref} style={{ ...styles.primaryButton, textDecoration: "none" }}>
            Upgrade to {previewLevel}
          </a>
          <a href="/campus/course" style={{ ...styles.secondaryButton, textDecoration: "none" }}>
            Back to Course Book
          </a>
        </div>
      </section>

      {previewLesson ? (
        <section style={{ ...card, border: "1px solid #86efac", background: "#f0fdf4", display: "grid", gap: 13 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ display: "grid", gap: 5 }}>
              <span style={{ color: "#047857", fontSize: 12, fontWeight: 900 }}>FREE PREVIEW · DAY {getDay(previewLesson)}</span>
              <h2 style={{ margin: 0, color: "#0f172a" }}>{getTitle(previewLesson)}</h2>
            </div>
            <span style={{ ...lockBadge, background: "#dcfce7", borderColor: "#86efac", color: "#166534" }}>Unlocked preview</span>
          </div>

          {chapter ? <p style={{ margin: 0, color: "#334155" }}><strong>Chapter:</strong> {chapter}</p> : null}
          {previewLesson.grammar_topic ? (
            <p style={{ margin: 0, color: "#334155", lineHeight: 1.65 }}><strong>Grammar focus:</strong> {previewLesson.grammar_topic}</p>
          ) : null}
          {previewLesson.goal ? (
            <p style={{ margin: 0, color: "#334155", lineHeight: 1.65 }}><strong>Learning goal:</strong> {previewLesson.goal}</p>
          ) : null}
          {previewLesson.instruction ? (
            <p style={{ margin: 0, color: "#334155", lineHeight: 1.65 }}><strong>Lesson guidance:</strong> {previewLesson.instruction}</p>
          ) : null}

          {resourceHighlights.length ? (
            <div style={{ display: "grid", gap: 7 }}>
              <strong style={{ color: "#0f172a" }}>Inside this chapter</strong>
              <ul style={{ margin: 0, paddingLeft: 22, color: "#334155", lineHeight: 1.7 }}>
                {resourceHighlights.map((label) => <li key={label}>{label}</li>)}
              </ul>
            </div>
          ) : null}

          <div style={{ borderRadius: 13, padding: 12, background: "#ffffff", border: "1px solid #bbf7d0", color: "#166534", lineHeight: 1.6 }}>
            This is preview mode. Workbook submission, progress tracking and the rest of the {previewLevel} Course Book stay locked until you upgrade.
          </div>
        </section>
      ) : (
        <section style={{ ...card, border: "1px solid #fde68a", background: "#fffbeb" }}>
          <h2 style={{ marginTop: 0 }}>Preview being prepared</h2>
          <p style={{ marginBottom: 0, color: "#78350f", lineHeight: 1.6 }}>
            The {previewLevel} course is available for enrollment, but a preview chapter has not been published here yet.
          </p>
        </section>
      )}

      {lockedLessons.length ? (
        <section style={{ display: "grid", gap: 12 }}>
          <div>
            <h2 style={{ margin: 0, color: "#0f172a" }}>Rest of the {previewLevel} Course Book</h2>
            <p style={{ margin: "5px 0 0", color: "#64748b", lineHeight: 1.6 }}>
              These lessons become available when your {previewLevel} enrollment is activated.
            </p>
          </div>
          <div style={{ display: "grid", gap: 9 }}>
            {lockedLessons.map((entry, index) => (
              <article
                key={`${previewLevel}-${getDay(entry)}-${getChapter(entry)}-${index}`}
                style={{
                  ...card,
                  padding: 14,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  alignItems: "center",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, color: "#64748b", fontSize: 12, fontWeight: 800 }}>Day {getDay(entry)}{getChapter(entry) ? ` · Chapter ${getChapter(entry)}` : ""}</p>
                  <h3 style={{ margin: "3px 0 0", color: "#334155", fontSize: 16 }}>{getTitle(entry)}</h3>
                </div>
                <span style={lockBadge}>Locked</span>
              </article>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 4 }}>
            <a href={upgradeHref} style={{ ...styles.primaryButton, textDecoration: "none" }}>
              Upgrade to {previewLevel} to unlock all lessons
            </a>
          </div>
        </section>
      ) : null}
    </main>
  );
}
