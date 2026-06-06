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

const renderExternalLinkProps = (url = "") => (isInternalLink(url) ? {} : { target: "_blank", rel: "noreferrer" });

const panelTitle = {
  start: "Start",
  lecture: "Recorded Lecture",
  grammar: "Grammar",
  notes: "Class Notes",
};

const injectedTabStyle = (active = false) => ({
  border: `1px solid ${active ? "#2563eb" : "#d1d5db"}`,
  background: active ? "#eff6ff" : "#ffffff",
  color: active ? "#1d4ed8" : "#111827",
  borderRadius: "999px",
  padding: "9px 16px",
  fontWeight: "700",
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: "inherit",
});

const applyButtonStyle = (button, active = false) => {
  Object.assign(button.style, injectedTabStyle(active));
};

const youtubeEmbedUrl = (url = "") => {
  const raw = String(url || "").trim();
  if (!raw) return "";
  try {
    const parsed = new URL(raw);
    let videoId = "";
    if (parsed.hostname.includes("youtu.be")) videoId = parsed.pathname.replace("/", "");
    if (parsed.hostname.includes("youtube.com")) videoId = parsed.searchParams.get("v") || parsed.pathname.split("/").pop();
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  } catch {
    return "";
  }
};

const StartPanel = ({ workbookLabel, lessonMeta }) => (
  <div style={{ display: "grid", gap: 8, lineHeight: 1.6 }}>
    <p style={{ margin: 0 }}>
      This {workbookLabel} is your lesson workspace. Follow the tabs above from left to right.
    </p>
    {lessonMeta?.topic ? (
      <div style={{ border: "1px solid #bfdbfe", borderRadius: 12, padding: 12, background: "#ffffff" }}>
        <strong>{lessonMeta.level} Day {lessonMeta.day}{lessonMeta.chapter ? ` · Kapitel ${lessonMeta.chapter}` : ""}</strong>
        <p style={{ margin: "6px 0 0", lineHeight: 1.6 }}>{lessonMeta.topic}</p>
        {lessonMeta.goal ? <p style={{ margin: "6px 0 0", color: "#475569" }}>{lessonMeta.goal}</p> : null}
      </div>
    ) : null}
    <p style={{ margin: 0 }}>
      Start with <strong>Recorded Lecture</strong> and <strong>Grammar</strong>. Then practise <strong>Teil 1 · Sprechen</strong> and submit only final answers for <strong>Teil 2, Teil 3 and Teil 4</strong> in the Submission tab.
    </p>
  </div>
);

const RecordedLecturePanel = ({ lessonMeta }) => {
  const embedUrl = youtubeEmbedUrl(lessonMeta?.video);
  return (
    <div style={{ display: "grid", gap: 10 }}>
      <p style={{ margin: 0, lineHeight: 1.6 }}>
        Watch the recorded lecture first. Then open the Grammar tab before continuing to the workbook parts.
      </p>
      {embedUrl ? (
        <iframe
          title={`${lessonMeta?.topic || "Lesson"} recorded lecture`}
          src={embedUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ width: "100%", minHeight: 315, border: 0, borderRadius: 12, background: "#000" }}
        />
      ) : lessonMeta?.video ? (
        <a href={lessonMeta.video} {...renderExternalLinkProps(lessonMeta.video)} style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content" }}>
          Open recorded lecture
        </a>
      ) : (
        <p style={{ margin: 0, color: "#64748b" }}>No recorded lecture has been added for this workbook yet.</p>
      )}
    </div>
  );
};

const GrammarPanel = ({ lessonMeta }) => (
  <div style={{ display: "grid", gap: 10 }}>
    {lessonMeta?.grammarTopic ? (
      <div style={{ border: "1px solid #bfdbfe", borderRadius: 12, padding: 12, background: "#ffffff" }}>
        <strong>Grammar focus</strong>
        <p style={{ margin: "6px 0 0", lineHeight: 1.6 }}>{lessonMeta.grammarTopic}</p>
      </div>
    ) : null}
    <p style={{ margin: 0, lineHeight: 1.6 }}>
      Review the grammar before you answer the workbook parts. Grammar is part of the same lesson workspace, not a separate assignment.
    </p>
    {lessonMeta?.grammarLink ? (
      <a href={lessonMeta.grammarLink} {...renderExternalLinkProps(lessonMeta.grammarLink)} style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content" }}>
        Open grammar notes
      </a>
    ) : (
      <p style={{ margin: 0, color: "#64748b" }}>No grammar notes have been added for this workbook yet.</p>
    )}
  </div>
);

export const A2B1WorkbookGuidance = ({ level = "", showClassNotes = true, compactNotes = true }) => {
  const location = useLocation();
  const sectionRef = useRef(null);
  const injectedButtonsRef = useRef([]);
  const [activePanel, setActivePanel] = useState("start");
  const workbookLevel = useMemo(() => resolveWorkbookLevel(level), [level]);
  const lessonMeta = useMemo(
    () => findLessonMetaForWorkbook({ level: workbookLevel, pathname: location.pathname, stateLesson: location.state?.sourceLesson }),
    [location.pathname, location.state?.sourceLesson, workbookLevel]
  );
  const workbookLabel = workbookLevel ? `${workbookLevel} workbook` : "workbook";

  useEffect(() => {
    injectedButtonsRef.current.forEach(({ button }) => button.remove());
    injectedButtonsRef.current = [];

    if (!sectionRef.current || typeof document === "undefined") return undefined;
    const section = sectionRef.current;
    const headerCard = section.previousElementSibling;
    if (!headerCard) return undefined;

    const tabRows = Array.from(headerCard.querySelectorAll("div"));
    const tabRow = tabRows.find((row) => {
      const buttons = Array.from(row.querySelectorAll("button"));
      const buttonText = buttons.map((button) => button.textContent || "").join(" ");
      return buttons.length >= 4 && buttonText.includes("Teil 1") && buttonText.includes("Teil 4");
    });

    if (!tabRow) return undefined;

    Array.from(tabRow.querySelectorAll("button")).forEach((button) => {
      const text = (button.textContent || "").trim().toLowerCase();
      if (text === "video") button.textContent = "Recorded Lecture";
      if (text === "class notes") button.textContent = "Class Notes";
    });

    const existingText = Array.from(tabRow.querySelectorAll("button")).map((button) => (button.textContent || "").trim().toLowerCase());
    const firstTeilButton = Array.from(tabRow.querySelectorAll("button")).find((button) => (button.textContent || "").includes("Teil 1"));

    const makeButton = ({ key, label, beforeTeil = false }) => {
      if (existingText.includes(label.toLowerCase())) return null;
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.extraWorkbookTab = key;
      button.textContent = label;
      applyButtonStyle(button, activePanel === key);
      const activate = () => {
        setActivePanel(key);
        window.setTimeout(() => section.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
      };
      button.addEventListener("click", activate);
      if (beforeTeil && firstTeilButton) tabRow.insertBefore(button, firstTeilButton);
      else tabRow.appendChild(button);
      const entry = { button, activate, key };
      injectedButtonsRef.current.push(entry);
      return entry;
    };

    makeButton({ key: "lecture", label: "Recorded Lecture", beforeTeil: true });
    makeButton({ key: "grammar", label: "Grammar", beforeTeil: true });
    if (showClassNotes) makeButton({ key: "notes", label: "Class Notes" });

    return () => {
      injectedButtonsRef.current.forEach(({ button, activate }) => {
        button.removeEventListener("click", activate);
        button.remove();
      });
      injectedButtonsRef.current = [];
    };
  }, [activePanel, showClassNotes]);

  useEffect(() => {
    injectedButtonsRef.current.forEach(({ button, key }) => applyButtonStyle(button, activePanel === key));
  }, [activePanel]);

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
        <h2 style={{ margin: 0, fontSize: "1.05rem" }}>{panelTitle[activePanel] || "Start"}</h2>

        {activePanel === "lecture" ? <RecordedLecturePanel lessonMeta={lessonMeta} /> : null}
        {activePanel === "grammar" ? <GrammarPanel lessonMeta={lessonMeta} /> : null}
        {showClassNotes && activePanel === "notes" ? <LessonClassNotesPanel compact={compactNotes} /> : null}
        {activePanel === "start" || (!showClassNotes && activePanel === "notes") ? (
          <StartPanel workbookLabel={workbookLabel} lessonMeta={lessonMeta} />
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
