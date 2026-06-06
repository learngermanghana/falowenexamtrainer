import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { styles } from "../styles";
import { courseSchedules } from "../data/courseSchedule";
import LessonClassNotesPanel from "./LessonClassNotesPanel";
import WorkbookReadAloudInjector from "./WorkbookReadAloudInjector";

const resolveWorkbookLevel = (level) => {
  const explicit = String(level || "").trim().toUpperCase();
  if (["A2", "B1"].includes(explicit)) return explicit;

  if (typeof window === "undefined") return "";
  const path = `${window.location.pathname || ""} ${window.location.href || ""}`.toUpperCase();
  if (/\bB1\b|B1DAY|\/B1\//.test(path)) return "B1";
  if (/\bA2\b|A2DAY|\/A2\//.test(path)) return "A2";
  return "";
};

const isInternalLink = (url = "") => String(url || "").startsWith("/");

const normalizePath = (value = "") => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    const parsed = raw.startsWith("http") ? new URL(raw) : new URL(raw, "https://www.falowen.app");
    return parsed.pathname.replace(/\/+$/, "");
  } catch {
    return raw.split("?")[0].replace(/\/+$/, "");
  }
};

const toRows = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const getLessonResources = (lesson = {}) => [
  ...toRows(lesson.lesen_hören),
  ...toRows(lesson.schreiben_sprechen),
  lesson,
].filter(Boolean);

const findLessonMetaForWorkbook = ({ level, pathname, stateLesson }) => {
  if (stateLesson?.topic || stateLesson?.workbookLink) return stateLesson;

  const targetPath = normalizePath(pathname);
  const levels = level ? [level] : ["A2", "B1"];

  for (const currentLevel of levels) {
    for (const lesson of courseSchedules[currentLevel] || []) {
      const resource = getLessonResources(lesson).find((row) => normalizePath(row.workbook_link) === targetPath);
      if (resource) {
        return {
          level: currentLevel,
          day: lesson.day,
          chapter: resource.chapter || lesson.chapter,
          topic: lesson.topic || resource.title,
          goal: lesson.goal,
          instruction: lesson.instruction,
          grammarTopic: lesson.grammar_topic,
          video: resource.video || resource.youtube_link || lesson.video || lesson.youtube_link,
          grammarLink: resource.grammarbook_link || lesson.grammarbook_link,
          workbookLink: resource.workbook_link,
        };
      }
    }
  }

  return null;
};

const renderExternalLinkProps = (url = "") => (isInternalLink(url) ? {} : { target: "_blank", rel: "noreferrer" });

const actionLinkStyle = {
  ...styles.secondaryButton,
  textDecoration: "none",
  width: "fit-content",
};

const PrepLink = ({ href, children }) => {
  if (!href) return null;
  return (
    <a href={href} {...renderExternalLinkProps(href)} style={actionLinkStyle}>
      {children}
    </a>
  );
};

const StartPanel = ({ workbookLabel, lessonMeta }) => (
  <div style={{ display: "grid", gap: 8, lineHeight: 1.6 }}>
    <p style={{ margin: 0 }}>
      This {workbookLabel} is your lesson workspace. Use the workbook tabs above for <strong>Teil 1 · Sprechen</strong>, <strong>Teil 2 · Schreiben</strong>, <strong>Teil 3 · Lesen</strong> and <strong>Teil 4 · Hören</strong>.
    </p>
    {lessonMeta?.topic ? (
      <div style={{ border: "1px solid #bfdbfe", borderRadius: 12, padding: 12, background: "#ffffff" }}>
        <strong>{lessonMeta.level} Day {lessonMeta.day}{lessonMeta.chapter ? ` · Kapitel ${lessonMeta.chapter}` : ""}</strong>
        <p style={{ margin: "6px 0 0", lineHeight: 1.6 }}>{lessonMeta.topic}</p>
        {lessonMeta.goal ? <p style={{ margin: "6px 0 0", color: "#475569" }}>{lessonMeta.goal}</p> : null}
      </div>
    ) : null}
    <p style={{ margin: 0 }}>
      First, watch the video and review the grammar. Then continue with the workbook parts.
    </p>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <PrepLink href={lessonMeta?.video}>Video lecture</PrepLink>
      <PrepLink href={lessonMeta?.grammarLink}>Grammar notes</PrepLink>
    </div>
    <p style={{ margin: 0 }}>
      Submit only your final answers for <strong>Teil 2, Teil 3 and Teil 4</strong> in the Submission tab. Teil 1 is class preparation.
    </p>
  </div>
);

export const A2B1WorkbookGuidance = ({ level = "", showClassNotes = true, compactNotes = true }) => {
  const location = useLocation();
  const workbookLevel = useMemo(() => resolveWorkbookLevel(level), [level]);
  const lessonMeta = useMemo(
    () => findLessonMetaForWorkbook({ level: workbookLevel, pathname: location.pathname, stateLesson: location.state?.sourceLesson }),
    [location.pathname, location.state?.sourceLesson, workbookLevel]
  );
  const workbookLabel = workbookLevel ? `${workbookLevel} workbook` : "workbook";

  return (
    <>
      <WorkbookReadAloudInjector />
      <section
        aria-label="Lesson workspace guide"
        style={{
          ...styles.card,
          margin: 0,
          display: "grid",
          gap: 12,
          border: "1px solid #bfdbfe",
          background: "#eff6ff",
          color: "#1e3a8a",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: "1.05rem" }}>Before you start</h2>
          {showClassNotes ? <span style={{ ...styles.badge, background: "#dbeafe", color: "#1d4ed8" }}>Class notes available</span> : null}
        </div>

        <StartPanel workbookLabel={workbookLabel} lessonMeta={lessonMeta} />

        {showClassNotes ? (
          <details style={{ borderTop: "1px solid #bfdbfe", paddingTop: 10 }}>
            <summary style={{ cursor: "pointer", fontWeight: 800 }}>Open Class Notes</summary>
            <div style={{ marginTop: 10 }}>
              <LessonClassNotesPanel compact={compactNotes} />
            </div>
          </details>
        ) : null}
      </section>
    </>
  );
};

export const WorkbookSubmissionReminder = () => (
  <div
    role="note"
    style={{
      border: "1px solid #bfdbfe",
      borderRadius: 10,
      padding: "10px 12px",
      background: "#eff6ff",
      color: "#1e40af",
      fontWeight: 600,
      lineHeight: 1.5,
    }}
  >
    Reminder: This page is for learning and practice. Submit only your final assignment work in the Submission tab.
  </div>
);
