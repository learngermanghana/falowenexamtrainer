import React, { Fragment, useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { getA2SpeakingMindMap } from "../data/speakingMindMaps/a2";
import SpeakingMindMap from "./SpeakingMindMap";
import SpeakingPage from "./SpeakingPage";
import WritingPage from "./WritingPage";
import WritingCheatSheetTabs from "./WritingCheatSheetTabs";
import B1WritingWorkspace from "./B1WritingWorkspace";

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
  const isB1Writing =
    type === "writing" &&
    String(resolvedWritingContext.level || resolvedWritingContext.courseLevel || "").toUpperCase() === "B1";

  useEffect(() => {
    if (type !== "speaking" || typeof window === "undefined") return undefined;
    window.__FALOWEN_COURSE_SPEAKING_CONTEXT__ = resolvedSpeakingContext;
    return () => {
      if (window.__FALOWEN_COURSE_SPEAKING_CONTEXT__ === resolvedSpeakingContext) {
        delete window.__FALOWEN_COURSE_SPEAKING_CONTEXT__;
      }
    };
  }, [resolvedSpeakingContext, type]);

  const renderedPractice = config.render(resolvedWritingContext);
  const practiceContent = isB1Writing ? (
    <B1WritingWorkspace writingContext={resolvedWritingContext} />
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
    ? "Plan your Stichpunkte, write the complete Schreiben, use the formal, informal or opinion template when helpful, then open Mark My Letter to check and improve your final text."
    : type === "speaking"
      ? `Topic locked: ${resolvedSpeakingContext.topic}. The chat can ask follow-up questions, but it should stay on this lesson topic.`
      : description || config.defaultDescription;

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
          {isOpen ? "Hide practice" : isB1Writing ? "Open Teil 2 writing workspace" : config.closedButtonLabel}
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
