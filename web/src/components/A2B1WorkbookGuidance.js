import React, { useEffect, useMemo, useRef, useState } from "react";
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

const youtubeEmbedUrl = (url = "") => {
  const raw = String(url || "").trim();
  if (!raw) return "";
  try {
    const parsed = new URL(raw);
    let videoId = "";
    if (parsed.hostname.includes("youtu.be")) videoId = parsed.pathname.replace("/", "");
    if (parsed.hostname.includes("youtube.com")) videoId = parsed.searchParams.get("v") || parsed.pathname.split("/").pop();
    if (!videoId) return "";
    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return "";
  }
};

const tabButtonStyle = (active) => ({
  ...styles.secondaryButton,
  borderColor: active ? "#2563eb" : "#d1d5db",
  background: active ? "#eff6ff" : "#ffffff",
  color: active ? "#1d4ed8" : "#111827",
  fontWeight: 800,
});

const WorkspaceTabButton = ({ active, onClick, children }) => (
  <button type="button" style={tabButtonStyle(active)} onClick={onClick}>
    {children}
  </button>
);

const renderExternalLinkProps = (url = "") => (isInternalLink(url) ? {} : { target: "_blank", rel: "noreferrer" });

const LessonVideoPanel = ({ lessonMeta }) => {
  const embedUrl = youtubeEmbedUrl(lessonMeta?.video);
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h3 style={{ margin: 0 }}>Video</h3>
      <p style={{ margin: 0, lineHeight: 1.6 }}>
        Watch the lesson video first, then continue to Grammar and the workbook parts.
      </p>
      {embedUrl ? (
        <iframe
          title={`${lessonMeta?.topic || "Lesson"} video`}
          src={embedUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ width: "100%", minHeight: 315, border: 0, borderRadius: 12, background: "#000" }}
        />
      ) : lessonMeta?.video ? (
        <a href={lessonMeta.video} {...renderExternalLinkProps(lessonMeta.video)} style={styles.linkButton}>
          Open lesson video
        </a>
      ) : (
        <p style={{ margin: 0, color: "#64748b" }}>No video has been added for this workbook yet.</p>
      )}
    </div>
  );
};

const LessonGrammarPanel = ({ lessonMeta }) => (
  <div style={{ display: "grid", gap: 12 }}>
    <h3 style={{ margin: 0 }}>Grammar</h3>
    {lessonMeta?.grammarTopic ? (
      <div style={{ border: "1px solid #c7d2fe", borderRadius: 12, padding: 12, background: "#ffffff" }}>
        <strong>Grammar focus</strong>
        <p style={{ margin: "6px 0 0", lineHeight: 1.6 }}>{lessonMeta.grammarTopic}</p>
      </div>
    ) : null}
    <p style={{ margin: 0, lineHeight: 1.6 }}>
      Review the grammar before you answer the workbook parts. Grammar is part of the same lesson workspace, not a separate assignment.
    </p>
    {lessonMeta?.grammarLink ? (
      <a href={lessonMeta.grammarLink} {...renderExternalLinkProps(lessonMeta.grammarLink)} style={styles.linkButton}>
        Open grammar notes
      </a>
    ) : (
      <p style={{ margin: 0, color: "#64748b" }}>No separate grammar notes have been added for this workbook yet.</p>
    )}
  </div>
);

const StartPanel = ({ workbookLabel, lessonMeta, showClassNotes }) => (
  <div style={{ display: "grid", gap: 8, lineHeight: 1.6 }}>
    <p style={{ margin: 0 }}>
      This {workbookLabel} is your full lesson workspace. Use the tabs in this order: <strong>Start → Video → Grammar → Sprechen → Schreiben → Lesen → Hören</strong>{showClassNotes ? <strong> → Class Notes</strong> : null}.
    </p>
    {lessonMeta?.topic ? (
      <div style={{ border: "1px solid #bfdbfe", borderRadius: 12, padding: 12, background: "#ffffff" }}>
        <strong>{lessonMeta.level} Day {lessonMeta.day}{lessonMeta.chapter ? ` · Kapitel ${lessonMeta.chapter}` : ""}</strong>
        <p style={{ margin: "6px 0 0", lineHeight: 1.6 }}>{lessonMeta.topic}</p>
        {lessonMeta.goal ? <p style={{ margin: "6px 0 0", color: "#475569" }}>{lessonMeta.goal}</p> : null}
      </div>
    ) : null}
    <p style={{ margin: 0 }}>
      <strong>Teil 1 · Sprechen</strong> is practical class preparation. You do not submit Teil 1 as an assignment. Prepare it before class and use the AI speaking coach on this page to practise.
    </p>
    <p style={{ margin: 0 }}>
      <strong>Teil 2 · Schreiben, Teil 3 · Lesen and Teil 4 · Hören</strong> are the assignment parts. You can practise with the AI tools on this page, but your final answers must be submitted in the <strong>Submission</strong> tab.
    </p>
    {showClassNotes ? (
      <p style={{ margin: 0 }}>
        <strong>Class Notes</strong> is not an assignment. It is where your tutor saves vocabulary from Zoom, short suggestions, corrections, reminders and answers to class questions for this lesson.
      </p>
    ) : null}
    <p style={{ margin: 0 }}>
      <strong>Read aloud:</strong> In Teil 3 · Lesen, use the free German voice controls to listen to the text, pause, continue, stop and change speed.
    </p>
  </div>
);

export const A2B1WorkbookGuidance = ({ level = "", showClassNotes = true, compactNotes = true }) => {
  const location = useLocation();
  const [activePart, setActivePart] = useState("start");
  const [hasOpenedNotes, setHasOpenedNotes] = useState(false);
  const sectionRef = useRef(null);
  const workbookLevel = useMemo(() => resolveWorkbookLevel(level), [level]);
  const lessonMeta = useMemo(
    () => findLessonMetaForWorkbook({ level: workbookLevel, pathname: location.pathname, stateLesson: location.state?.sourceLesson }),
    [location.pathname, location.state?.sourceLesson, workbookLevel]
  );
  const workbookLabel = workbookLevel ? `${workbookLevel} workbook` : "workbook";

  useEffect(() => {
    if (activePart === "notes") setHasOpenedNotes(true);
  }, [activePart]);

  useEffect(() => {
    if (!sectionRef.current || typeof document === "undefined") return undefined;

    const section = sectionRef.current;
    const headerCard = section.previousElementSibling;
    if (!headerCard || headerCard.querySelector('[data-workspace-tab="start"]')) return undefined;

    const tabRows = Array.from(headerCard.querySelectorAll("div"));
    const tabRow = tabRows.find((row) => {
      const buttons = Array.from(row.querySelectorAll("button"));
      const buttonText = buttons.map((button) => button.textContent || "").join(" ");
      return buttons.length >= 4 && buttonText.includes("Teil 1") && buttonText.includes("Teil 4");
    });

    if (!tabRow) return undefined;

    const makeButton = ({ key, label, before = false }) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.workspaceTab = key;
      button.textContent = label;
      Object.assign(button.style, {
        border: "1px solid #d1d5db",
        background: "#ffffff",
        color: "#111827",
        borderRadius: "999px",
        padding: "9px 16px",
        fontWeight: "700",
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: "inherit",
      });
      const activate = () => {
        setActivePart(key);
        if (key === "notes") setHasOpenedNotes(true);
        window.setTimeout(() => section.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
      };
      button.addEventListener("click", activate);
      if (before) tabRow.insertBefore(button, tabRow.firstChild);
      else tabRow.appendChild(button);
      return { button, activate };
    };

    const inserted = [
      makeButton({ key: "start", label: "Start", before: true }),
      makeButton({ key: "video", label: "Video", before: false }),
      makeButton({ key: "grammar", label: "Grammar", before: false }),
    ];

    if (showClassNotes && !headerCard.querySelector('[data-workspace-tab="notes"]')) {
      inserted.push(makeButton({ key: "notes", label: "Class Notes", before: false }));
    }

    return () => {
      inserted.forEach(({ button, activate }) => {
        button.removeEventListener("click", activate);
        button.remove();
      });
    };
  }, [showClassNotes]);

  return (
    <>
      <WorkbookReadAloudInjector />
      <section
        ref={sectionRef}
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
          <h2 style={{ margin: 0, fontSize: "1.05rem" }}>Lesson workspace</h2>
          {showClassNotes && !hasOpenedNotes ? (
            <span style={{ ...styles.badge, background: "#dbeafe", color: "#1d4ed8" }}>Class notes available</span>
          ) : null}
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <WorkspaceTabButton active={activePart === "start"} onClick={() => setActivePart("start")}>Start</WorkspaceTabButton>
          <WorkspaceTabButton active={activePart === "video"} onClick={() => setActivePart("video")}>Video</WorkspaceTabButton>
          <WorkspaceTabButton active={activePart === "grammar"} onClick={() => setActivePart("grammar")}>Grammar</WorkspaceTabButton>
          {showClassNotes ? <WorkspaceTabButton active={activePart === "notes"} onClick={() => setActivePart("notes")}>Class Notes</WorkspaceTabButton> : null}
        </div>

        {activePart === "start" ? <StartPanel workbookLabel={workbookLabel} lessonMeta={lessonMeta} showClassNotes={showClassNotes} /> : null}
        {activePart === "video" ? <LessonVideoPanel lessonMeta={lessonMeta} /> : null}
        {activePart === "grammar" ? <LessonGrammarPanel lessonMeta={lessonMeta} /> : null}
        {showClassNotes && activePart === "notes" ? <LessonClassNotesPanel compact={compactNotes} /> : null}
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
