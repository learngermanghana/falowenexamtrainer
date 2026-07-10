import React, { Fragment, useEffect, useMemo, useState } from "react";
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

const routeSpeakingContext = () => {
  const path = currentPath();
  const match =
    path.match(/\/campus\/course\/lesson\/(a1|a2|b1|b2|c1)\/(\d+)/) ||
    path.match(/(a1|a2|b1|b2|c1)-day-(\d+)/);
  if (!match) return {};
  const level = match[1].toUpperCase();
  const day = Number(match[2]);
  return { level, day };
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

const b1TemplateTabsWrapStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: 8,
  padding: 6,
  border: "1px solid #bfdbfe",
  borderRadius: 14,
  background: "#eff6ff",
};

const b1TemplateButtonStyle = (active) => ({
  border: active ? "1px solid #1d4ed8" : "1px solid #cbd5e1",
  borderRadius: 12,
  padding: "10px 8px",
  minHeight: 48,
  background: active ? "#1d4ed8" : "#fff",
  color: active ? "#fff" : "#1e293b",
  fontWeight: 850,
  fontSize: "clamp(.86rem, 3.5vw, .96rem)",
  cursor: "pointer",
  lineHeight: 1.25,
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

const b1TemplateCardStyle = {
  border: "1px solid #dbeafe",
  borderRadius: 14,
  padding: 12,
  background: "#ffffff",
  display: "grid",
  gap: 8,
};

const b1PlanningBoxStyle = {
  border: "1px solid #c4b5fd",
  borderRadius: 14,
  padding: 12,
  background: "#faf5ff",
  display: "grid",
  gap: 8,
};

const b1WritingTextareaStyle = {
  width: "100%",
  minHeight: 260,
  border: "1px solid #cbd5e1",
  borderRadius: 14,
  padding: 12,
  fontSize: "16px",
  lineHeight: 1.7,
  resize: "vertical",
  boxSizing: "border-box",
  overflowWrap: "anywhere",
  userSelect: "text",
  WebkitUserSelect: "text",
  touchAction: "manipulation",
  pointerEvents: "auto",
  background: "#fff",
};

const b1PlanningTextareaStyle = {
  ...b1WritingTextareaStyle,
  minHeight: 130,
  border: "1px solid #a78bfa",
};

const b1ListStyle = {
  margin: 0,
  paddingLeft: 22,
  lineHeight: 1.75,
  fontSize: "clamp(.94rem, 3.7vw, 1rem)",
};

const defaultB1WritingTemplate = `Liebe Forenmitglieder,

heutzutage ist das Thema [Thema] sehr wichtig. Ich bin der Meinung, dass [Ihre Meinung], weil [Begründung].

Einerseits gibt es viele Vorteile. Zum Beispiel kann/können [Verb/Modalverb] [weitere Information].

Andererseits gibt es auch Nachteile. Ein Beispiel dafür ist/sind [Nomen], wie [weitere Information].

Ich glaube, dass [Ihre abschließende Meinung].

Zusammenfassend lässt sich sagen, dass [Thema] unser Leben positiv/negativ beeinflussen kann.`;

const b1FormalLetterTemplate = `Sehr geehrte Damen und Herren,
Sehr geehrte Frau [Name] / Sehr geehrter Herr [Name],

ich schreibe Ihnen, weil [Grund].

Ich möchte gern wissen, ob [Frage]. Außerdem ist für mich wichtig, dass [Information].

Könnten Sie mir bitte antworten?

Vielen Dank im Voraus.

Mit freundlichen Grüßen
[Ihr Name]`;

const b1InformalLetterTemplate = `Liebe/r [Name],
Hallo [Name],

wie geht es dir? Ich hoffe, es geht dir gut.

Ich schreibe dir, weil [Grund].

Ich möchte dir erzählen, dass [Information]. Außerdem [weitere Information].

Hast du Zeit? / Was meinst du dazu? / Kannst du mir helfen?

Schreib mir bald.

Liebe Grüße
[Ihr Name]`;

const b1PlanningNotesPlaceholder = `Write short points first. English is okay.

1. What is the topic/problem?
2. What is my opinion or reason?
3. What example can I use?
4. What do I want to ask/suggest?
5. What is my final sentence?

Example:
1. need to rent again
2. rent increased after Corona
3. company should help me search for an apartment
4. I need my own office
5. next time they should inform me early`;

const b1WritingTemplateOptions = [
  {
    key: "opinion",
    label: "Opinion essay / forum post",
    title: "OPINION ESSAY / FORUM POST",
    helper: "Use this for Meinung, Forum, Diskussion, Vorteile und Nachteile.",
    template: defaultB1WritingTemplate,
  },
  {
    key: "formal",
    label: "Formal letter",
    title: "FORMAL LETTER",
    helper: "Use this for Schule, Firma, Vermieter, Amt, course provider or official emails.",
    template: b1FormalLetterTemplate,
  },
  {
    key: "informal",
    label: "Informal letter",
    title: "INFORMAL LETTER",
    helper: "Use this for friends, family or personal messages.",
    template: b1InformalLetterTemplate,
  },
];

const B1WritingDraftPanel = ({ writingContext = {} }) => {
  const [activeView, setActiveView] = useState("schreiben");
  const [activeTemplate, setActiveTemplate] = useState("opinion");
  const [planningNotes, setPlanningNotes] = useState("");
  const [draft, setDraft] = useState(() => defaultB1WritingTemplate);
  const supportItems = writingContext.supportStructure?.length
    ? writingContext.supportStructure
    : writingContext.taskPoints || [];
  const vocabulary = writingContext.vocabulary || [];
  const selectedTemplate =
    b1WritingTemplateOptions.find((item) => item.key === activeTemplate) ||
    b1WritingTemplateOptions[0];

  const insertTemplate = (template = selectedTemplate.template) => {
    const current = String(draft || "").trim();
    const templateTrimmed = String(template || "").trim();
    const knownTemplate = b1WritingTemplateOptions.some((option) => current === String(option.template || "").trim());
    if (current && current !== templateTrimmed && !knownTemplate) {
      const shouldReplace = window.confirm("This will replace your current B1 draft with the selected template. Continue?");
      if (!shouldReplace) return;
    }
    setDraft(template);
    setActiveView("schreiben");
  };

  const chooseTemplate = (option) => {
    setActiveTemplate(option.key);
    insertTemplate(option.template);
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={b1WritingTabsWrapStyle}>
        <button type="button" style={b1WritingSubTabButtonStyle(activeView === "schreiben")} onClick={() => setActiveView("schreiben")}>Schreiben</button>
        <button type="button" style={b1WritingSubTabButtonStyle(activeView === "cheatSheet")} onClick={() => setActiveView("cheatSheet")}>Cheat sheet</button>
      </div>

      {activeView === "schreiben" ? (
        <div style={b1WritingPanelStyle}>
          <strong>Schreiben</strong>
          <p style={mobileTextStyle}>Step 1: write simple points first. Step 2: edit the B1 template into your final German answer. When it is finished, copy it to the Submit tab.</p>

          <div style={b1PlanningBoxStyle}>
            <strong>Step 1 · My points first</strong>
            <p style={{ ...mobileTextStyle, color: "#5b21b6" }}>English is okay here. Use these points as your guide while you improve the German template below.</p>
            <textarea
              value={planningNotes}
              onChange={(event) => setPlanningNotes(event.target.value)}
              placeholder={b1PlanningNotesPlaceholder}
              style={b1PlanningTextareaStyle}
              aria-label="B1 writing points"
              inputMode="text"
              autoCapitalize="sentences"
              autoCorrect="on"
            />
          </div>

          <div style={b1TemplateTabsWrapStyle} aria-label="Choose B1 writing template">
            {b1WritingTemplateOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                style={b1TemplateButtonStyle(activeTemplate === option.key)}
                onClick={() => chooseTemplate(option)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <section style={{ ...b1TemplateCardStyle, background: "#fffbeb", borderColor: "#fed7aa" }}>
            <strong>Step 2 · Edit this template</strong>
            <p style={{ ...mobileTextStyle, color: "#92400e" }}>{selectedTemplate.helper} Replace every bracket like [Thema], [Grund] or [Ihr Name].</p>
          </section>

          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={selectedTemplate.template}
            style={b1WritingTextareaStyle}
            aria-label="B1 writing draft"
            inputMode="text"
            autoCapitalize="sentences"
            autoCorrect="on"
          />
        </div>
      ) : null}

      {activeView === "cheatSheet" ? (
        <div style={b1WritingPanelStyle}>
          <strong>Cheat sheet · Choose the correct writing type</strong>
          {writingContext.taskTitle ? <p style={mobileTextStyle}><strong>Question:</strong> {writingContext.taskTitle}</p> : null}
          {supportItems.length ? (
            <>
              <strong>What to include</strong>
              <ul style={b1ListStyle}>{supportItems.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul>
            </>
          ) : null}

          <div style={b1TemplateTabsWrapStyle} aria-label="Choose B1 writing template">
            {b1WritingTemplateOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                style={b1TemplateButtonStyle(activeTemplate === option.key)}
                onClick={() => chooseTemplate(option)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <section style={b1TemplateCardStyle}>
            <span style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e40af" }}>
              {selectedTemplate.title}
            </span>
            <p style={{ ...mobileTextStyle, color: "#475569" }}>{selectedTemplate.helper}</p>
            <p style={{ ...mobileTextStyle, whiteSpace: "pre-line" }}>{selectedTemplate.template}</p>
            <button type="button" style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => insertTemplate(selectedTemplate.template)}>
              Use this template in Schreiben
            </button>
          </section>

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
  speakingContext = {},
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const config = practiceConfig[type] || practiceConfig.speaking;
  const panelId = `course-inline-practice-${type || "speaking"}`;
  const speakingMindMap = useMemo(() => (type === "speaking" ? routeSpeakingMindMap() : null), [type]);
  const resolvedSpeakingContext = useMemo(() => {
    if (type !== "speaking") return {};
    const routeContext = routeSpeakingContext();
    const topic = speakingContext.topic || speakingContext.question || title || "current workbook speaking topic";
    const allowedScope = speakingContext.allowedScope || speakingContext.instructions || description || "Ask follow-up questions only inside this workbook topic.";
    return {
      ...routeContext,
      ...speakingContext,
      topic,
      question: speakingContext.question || title || topic,
      allowedScope,
      topicLock: true,
    };
  }, [description, speakingContext, title, type]);
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

  useEffect(() => {
    if (type !== "speaking" || typeof window === "undefined") return undefined;
    window.__FALOWEN_COURSE_SPEAKING_CONTEXT__ = resolvedSpeakingContext;
    return () => {
      if (window.__FALOWEN_COURSE_SPEAKING_CONTEXT__ === resolvedSpeakingContext) {
        delete window.__FALOWEN_COURSE_SPEAKING_CONTEXT__;
      }
    };
  }, [resolvedSpeakingContext, type]);

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
    ? "Use Schreiben to write simple points first, then edit the correct B1 template: opinion essay, formal letter or informal letter. Copy your final text to the Submit tab when you are done."
    : type === "speaking"
      ? `Topic locked: ${resolvedSpeakingContext.topic}. The chat can ask follow-up questions, but it should stay on this lesson topic.`
      : description || config.defaultDescription;
  const closedButtonLabel = isB1Writing ? "Open writing workspace" : config.closedButtonLabel;

  return (
    <Fragment>
      {speakingMindMap ? <SpeakingMindMap config={speakingMindMap} /> : null}
      <div
        data-course-inline-practice={type || "speaking"}
        data-topic-lock={type === "speaking" ? resolvedSpeakingContext.topic : undefined}
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
