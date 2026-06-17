import React, { useMemo, useState } from "react";
import { styles } from "../styles";
import SpeakingPage from "./SpeakingPage";
import WritingPage from "./WritingPage";
import SpeakingPreparationFlow from "./speaking/SpeakingPreparationFlow";
import { resolvePilotSpeakingMindMapFromPath } from "../data/speakingMindMaps/pilotSpeakingMindMaps";

const routeWritingContext = () => {
  if (typeof window === "undefined") return {};
  const path = String(window.location?.pathname || "").toLowerCase();
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

const resolveSpeakingMindMap = (explicitConfig) => {
  if (explicitConfig) return explicitConfig;
  if (typeof window === "undefined") return null;
  return resolvePilotSpeakingMindMapFromPath(window.location?.pathname || "");
};

const practiceConfig = {
  speaking: {
    defaultTitle: "Practice Teil 1 speaking here",
    defaultDescription:
      "Teil 1 is for practice and class discussion only. You do not submit it as an assignment. Use the mind map first, then open the AI speaking coach and practise your complete answer.",
    label: "Mind map and custom speaking chat",
    closedButtonLabel: "Open speaking preparation",
    render: (context) => {
      const coach = <SpeakingPage mode="course" />;
      return context.speakingMindMap ? (
        <SpeakingPreparationFlow config={context.speakingMindMap}>
          {coach}
        </SpeakingPreparationFlow>
      ) : (
        coach
      );
    },
  },
  writing: {
    defaultTitle: "Mark My Letter",
    defaultDescription:
      "Paste your completed text here. Falowen AI will mark it, show your score, explain the corrections and help you improve the final version. Submit the finished work through your normal assignment area when required.",
    label: "Mark My Letter",
    closedButtonLabel: "Open Mark My Letter",
    render: (context) => (
      <WritingPage
        mode="course"
        initialTab="mark"
        enabledTabs={["mark"]}
        hideTabList
        markLabel="Mark My Letter"
        submitLabel="Mark My Letter"
        writingContext={context.writingContext}
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
  speakingMindMap = null,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const config = practiceConfig[type] || practiceConfig.speaking;
  const panelId = `course-inline-practice-${type || "speaking"}`;

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

  const resolvedSpeakingMindMap = useMemo(
    () => (type === "speaking" ? resolveSpeakingMindMap(speakingMindMap) : null),
    [speakingMindMap, type],
  );

  const renderContext = {
    writingContext: resolvedWritingContext,
    speakingMindMap: resolvedSpeakingMindMap,
  };

  return (
    <div
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
        <strong>{title || config.defaultTitle}</strong>
        <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.6 }}>
          {description || config.defaultDescription}
        </p>
      </div>
      <button
        type="button"
        style={{ ...styles.primaryButton, width: "fit-content" }}
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        {isOpen ? "Hide practice" : config.closedButtonLabel}
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
          <span style={styles.helperText}>
            {config.label} loaded inside this workbook page.
          </span>
          {config.render(renderContext)}
        </div>
      ) : null}
    </div>
  );
};

export default CourseInlinePracticePanel;
