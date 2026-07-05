import React, { Fragment, useMemo, useState } from "react";
import { styles } from "../styles";
import { getA2SpeakingMindMap } from "../data/speakingMindMaps/a2";
import SpeakingMindMap from "./SpeakingMindMap";
import SpeakingPage from "./SpeakingPage";
import WritingPage from "./WritingPage";
import WritingCheatSheetTabs from "./WritingCheatSheetTabs";

const currentPath = () => {
  if (typeof window === "undefined") return "";
  return String(window.location?.pathname || "").toLowerCase();
};

const routeWritingContext = () => {
  const path = currentPath();
  const match =
    path.match(/\/campus\/course\/lesson\/(a1|a2|b1|b2|c1)\/(\d+)/) ||
    path.match(/(a1|a2|b1|b2|c1)-day-(\d+)/);
  if (!match) return {};

  const level = match[1].toUpperCase();
  const day = Number(match[2]);
  const lessonId = `${level}-day-${day}`;
  return {
    level,
    courseLevel: level,
    day,
    lessonId,
    workbookId: lessonId,
    writingTaskId: `${lessonId}-teil-2-writing`,
  };
};

const routeSpeakingMindMap = () => {
  const path = currentPath();
  if (path.includes("/campus/course/a2-day-2-small-talk-workbook")) return getA2SpeakingMindMap(1);
  return null;
};

const mobileTextStyle = {
  margin: 0,
  lineHeight: 1.75,
  fontSize: "clamp(.94rem, 3.7vw, 1rem)",
  overflowWrap: "anywhere",
  wordBreak: "break-word",
};

const b1WritingTabsWrapStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 8,
  padding: 6,
  border: "1px solid #dbeafe",
  borderRadius: 14,
  background: "#eff6ff",
};

const b1WritingSubTabButtonStyle = (active) => ({
  border: active ? "1px solid #1d4ed8" : "1px solid #cbd5e1",
  borderRadius: 12,
  padding: "12px 10px",
  minHeight: 44,
  background: active ? "#1d4ed8" : "#fff",
  color: active ? "#fff" : "#1e293b",
  fontWeight: 800,
  fontSize: "clamp(.92rem, 3.8vw, 1rem)",
  cursor: "pointer",
});

const b1WritingPanelStyle = {
  border: "1px solid #bfdbfe",
  borderRadius: 14,
  padding: 12,
  background: "#f8fbff",
  display: "grid",
  gap: 12,
  overflowWrap: "anywhere",
  wordBreak: "break-word",
};

const b1WritingTextareaStyle = {
  width: "100%",
  minHeight: 260,
  border: "1px solid #cbd5e1",
  borderRadius: 14,
  padding: 12,
  fontSize: "clamp(1rem, 4vw, 1.05rem)",
  lineHeight: 1.7,
  resize: "vertical",
  boxSizing: "border-box",
  overflowWrap: "anywhere",
};

const b1ListStyle = {
  margin: 0,
  paddingLeft: 22,
  lineHeight: 1.75,
  fontSize: "clamp(.94rem, 3.7vw, 1rem)",
};

const defaultB1WritingTemplate = `Liebe Forum-Mitglieder,

heutzutage ist das Thema [Thema] sehr wichtig. Ich bin der Meinung, dass [Ihre Meinung], weil [Begründung].

Einerseits gibt es Vorteile. Zum Beispiel [Beispiel].

Andererseits gibt es auch Nachteile. Ein Beispiel dafür ist [Beispiel].

Meiner Meinung nach [abschließende Meinung].

Zusammenfassend lässt sich sagen, dass [Thema] eine wichtige Rolle spielt.

Mit freundlichen Grüßen
[Ihr Name]`;

const b1FormalLetterTemplate = `Sehr geehrte Frau [Name] / Sehr geehrter Herr [Name],

ich schreibe Ihnen, weil [Grund].

Ich möchte gern wissen, ob [Frage]. Außerdem ist für mich wichtig, dass [Information].

Könnten Sie mir bitte antworten?

Vielen Dank im Voraus.

Mit freundlichen Grüßen
[Ihr Name]`;

const b1InformalLetterTemplate = `Liebe/r [Name],

wie geht es dir? Ich hoffe, es geht dir gut.

Ich schreibe dir, weil [Grund].

Ich möchte dir erzählen, dass [Information]. Außerdem [weitere Information].

Was meinst du dazu? Schreib mir bald.

Liebe Grüße
[Ihr Name]`;

const B1WritingDraftPanel = ({ writingContext = {} }) => {
  const [activeView, setActiveView] = useState("schreiben");
  const [draft, setDraft] = useState("");
  const supportItems = writingContext.supportStructure?.length
    ? writingContext.supportStructure
    : writingContext.taskPoints || [];
  const vocabulary = writingContext.vocabulary || [];
  const template = writingContext.template || defaultB1WritingTemplate;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={b1WritingTabsWrapStyle}>
        <button type="button" style={b1WritingSubTabButtonStyle(activeView === "schreiben")} onClick={() => setActiveView("schreiben")}>Schreiben</button>
        <button type="button" style={b1WritingSubTabButtonStyle(activeView === "cheatSheet")} onClick={() => setActiveView("cheatSheet")}>Cheat sheet</button>
      </div>

      {activeView === "schreiben" ? (
        <div style={b1WritingPanelStyle}>
          <strong>Schreiben</strong>
          <p style={mobileTextStyle}>Type your draft here first. When it is finished, copy it to the Submit tab.</p>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Liebe Forum-Mitglieder,\n\nich bin der Meinung, dass ..."
            style={b1WritingTextareaStyle}
          />
        </div>
      ) : null}

      {activeView === "cheatSheet" ? (
        <div style={b1WritingPanelStyle}>
          <strong>Cheat sheet · Writing support</strong>
          {writingContext.taskTitle ? <p style={mobileTextStyle}><strong>Question:</strong> {writingContext.taskTitle}</p> : null}
          {supportItems.length ? (
            <>
              <strong>What to include</strong>
              <ul style={b1ListStyle}>{supportItems.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul>
            </>
          ) : null}
          <strong>Task template</strong>
          <p style={{ ...mobileTextStyle, whiteSpace: "pre-line" }}>{template}</p>
          <strong>Formal letter template</strong>
          <p style={{ ...mobileTextStyle, whiteSpace: "pre-line" }}>{b1FormalLetterTemplate}</p>
          <strong>Informal letter template</strong>
          <p style={{ ...mobileTextStyle, whiteSpace: "pre-line" }}>{b1InformalLetterTemplate}</p>
          {vocabulary.length ? (
            <>
              <strong>Useful vocabulary</strong>
              <ul style={b1ListStyle}>{vocabulary.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

const practiceConfig = {
  speaking: {
    defaultTitle: "Practice Teil 1 speaking here",
    defaultDescription:
      "Teil 1 is for practice and class discussion only. You do not submit it as an assignment. Use this AI speaking coach to prepare your answer before class.",
    label: "Custom speaking chat",
    closedButtonLabel: "Open custom speaking chat",
    render: () => <SpeakingPage mode="course" />,
  },
  writing: {
    defaultTitle: "Mark My Letter",
    defaultDescription:
      "Paste your completed text here. Falowen AI will mark it, show your score, explain the corrections and help you improve the final version. Submit the finished work through your normal assignment area when required.",
    label: "Mark My Letter",
    closedButtonLabel: "Open Mark My Letter",
    render: (writingContext) => (
      <WritingPage
        mode="course"
        initialTab="mark"
        enabledTabs={["mark"]}
        hideTabList
        markLabel="Mark My Letter"
        submitLabel="Mark My Letter"
        writingContext={writingContext}
      />
    ),
  },
};

const CourseInlinePracticePanel = ({
  type,
  title,
  description,
  defaultOpen = true,
  writingContext = {},
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const config = practiceConfig[type] || practiceConfig.speaking;
  const panelId = `course-inline-practice-${type || "speaking"}`;
  const speakingMindMap = useMemo(() => (type === "speaking" ? routeSpeakingMindMap() : null), [type]);
  const resolvedWritingContext = useMemo(() => {
    if (type !== "writing") return {};
    const routeContext = routeWritingContext();
    const merged = { ...routeContext, ...writingContext };
    const fallbackId = [merged.level, merged.day]
      .filter((value) => value !== undefined && value !== null && value !== "")
      .join("-day-");
    return {
      ...merged,
      lessonId: merged.lessonId || fallbackId || "course-writing",
      workbookId: merged.workbookId || fallbackId || "course-writing",
      writingTaskId:
        merged.writingTaskId ||
        `${merged.workbookId || fallbackId || "course-writing"}-teil-2-writing`,
      taskTitle: merged.taskTitle || title || "Teil 2 writing task",
    };
  }, [title, type, writingContext]);

  const level = String(resolvedWritingContext.level || resolvedWritingContext.courseLevel || "").toUpperCase();
  const isB1Writing = type === "writing" && level === "B1";
  const renderedPractice = config.render(resolvedWritingContext);
  const practiceContent = isB1Writing ? (
    <B1WritingDraftPanel writingContext={resolvedWritingContext} />
  ) : type === "writing" ? (
    <WritingCheatSheetTabs
      level={resolvedWritingContext.level || resolvedWritingContext.courseLevel}
      day={resolvedWritingContext.day}
    >
      {renderedPractice}
    </WritingCheatSheetTabs>
  ) : (
    renderedPractice
  );
  const panelTitle = isB1Writing ? "Teil 2 writing workspace" : title || config.defaultTitle;
  const panelDescription = isB1Writing
    ? "Use Schreiben to draft your answer, or open the Cheat sheet for the hidden support template. Copy your final text to the Submit tab when you are done."
    : description || config.defaultDescription;
  const closedButtonLabel = isB1Writing ? "Open writing workspace" : config.closedButtonLabel;

  return (
    <Fragment>
      {speakingMindMap ? <SpeakingMindMap config={speakingMindMap} /> : null}
      <div
        data-course-inline-practice={type || "speaking"}
        style={{
          ...styles.card,
          margin: 0,
          display: "grid",
          gap: 12,
          background: "#f8fafc",
          border: "1px solid #dbeafe",
        }}
      >
        <div style={{ display: "grid", gap: 6 }}>
          <strong>{panelTitle}</strong>
          <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.6 }}>{panelDescription}</p>
        </div>
        <button
          type="button"
          style={{ ...styles.primaryButton, width: "fit-content" }}
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-controls={panelId}
        >
          {isOpen ? "Hide practice" : closedButtonLabel}
        </button>
        {isOpen ? (
          <div
            id={panelId}
            style={{
              display: "grid",
              gap: 12,
              borderTop: "1px solid #dbeafe",
              paddingTop: 12,
            }}
          >
            {practiceContent}
          </div>
        ) : null}
      </div>
    </Fragment>
  );
};

export default CourseInlinePracticePanel;
