import React, { useEffect, useId, useState } from "react";
import C1_APPROVED_OPINION_ESSAY_TEMPLATE from "../data/c1ApprovedOpinionEssayTemplate";
import { getWritingCheatSheet } from "../data/writingCheatSheets";
import {
  getWritingVideoResource,
  getYouTubeEmbedUrl,
} from "../data/writingVideoResources";
import { styles } from "../styles";
import {
  A2LetterTemplateCheatSheet,
  A2WritingPlanner,
} from "./A2WritingWorkspaceSupport";

const C1_TEMPLATE_LABELS = [
  "Einleitung",
  "Hauptargument / Kriterien",
  "Beispiel",
  "Einwand",
  "Alternative",
  "Schluss",
];

const syncC1OpinionTemplateSection = (sections = [], normalizedLevel = "") => {
  if (normalizedLevel !== "C1") return sections;
  const templateItems = C1_APPROVED_OPINION_ESSAY_TEMPLATE
    .split(/\n\n+/)
    .map((meaning, index) => ({
      phrase: C1_TEMPLATE_LABELS[index] || `Abschnitt ${index + 1}`,
      meaning,
    }));

  return sections.map((section) =>
    section.id === "c1-opinion-essay-template"
      ? {
          ...section,
          title: "C1 MEINUNGSBEITRAG / ERÖRTERUNG · Gleiche Vorlage wie im Schreibfeld",
          layout: "template",
          items: templateItems,
        }
      : section,
  );
};

export const WritingVideoSupportCard = ({ writingVideo, writingVideoEmbed }) => {
  if (!writingVideo?.url) return null;

  return (
    <section
      data-writing-video-support="true"
      aria-label="Writing video and essay ideas"
      style={{
        display: "grid",
        gap: 12,
        border: "1px solid #bfdbfe",
        borderRadius: 16,
        padding: 14,
        background: "linear-gradient(135deg,#eff6ff,#f8fafc)",
      }}
    >
      <span
        style={{
          width: "fit-content",
          borderRadius: 999,
          padding: "5px 10px",
          background: "#dbeafe",
          color: "#1e3a8a",
          fontSize: ".82rem",
          fontWeight: 800,
        }}
      >
        Watch before writing · Essay Ideas
      </span>

      <div style={{ display: "grid", gap: 6 }}>
        <h3 style={{ margin: 0, color: "#1e3a8a" }}>
          Get ideas for this exact essay
        </h3>
        <strong style={{ color: "#0f172a" }}>
          {writingVideo.title || "Writing explanation video"}
        </strong>
        {writingVideo.description ? (
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>
            {writingVideo.description}
          </p>
        ) : null}
      </div>

      {writingVideoEmbed ? (
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingTop: "56.25%",
            borderRadius: 16,
            overflow: "hidden",
            background: "#0f172a",
          }}
        >
          <iframe
            title={writingVideo.title || "Writing explanation video"}
            src={writingVideoEmbed}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: 0,
            }}
          />
        </div>
      ) : (
        <a
          href={writingVideo.url}
          target="_blank"
          rel="noreferrer"
          style={{ ...styles.linkButton, width: "fit-content" }}
        >
          Open writing video
        </a>
      )}
    </section>
  );
};

export default function WritingCheatSheetTabs({ level, day, children }) {
  const baseId = useId();
  const taskTabId = `${baseId}-writing-task-tab`;
  const cheatSheetTabId = `${baseId}-writing-cheat-sheet-tab`;
  const taskPanelId = `${baseId}-writing-task-panel`;
  const cheatSheetPanelId = `${baseId}-writing-cheat-sheet-panel`;
  const [writeView, setWriteView] = useState("task");
  const normalizedLevel = String(level || "").trim().toUpperCase();
  const isA2 = normalizedLevel === "A2";
  const writingCheatSheet = syncC1OpinionTemplateSection(
    getWritingCheatSheet(level, day),
    normalizedLevel,
  );
  const writingVideo = getWritingVideoResource(level, day);
  const writingVideoEmbed = getYouTubeEmbedUrl(writingVideo?.url);
  const hasWritingVideo = Boolean(writingVideo?.url);
  const hasCheatSheet = writingCheatSheet.length > 0 || isA2;
  const taskChildren = React.Children.toArray(children);
  const [questionContent, ...writingWorkspaceContent] = taskChildren;

  useEffect(() => setWriteView("task"), [level, day]);

  if (!hasWritingVideo && !hasCheatSheet) return children;

  const taskContent = (
    <>
      {isA2 ? <A2WritingPlanner /> : null}
      {questionContent || null}
      {hasWritingVideo ? (
        <WritingVideoSupportCard
          writingVideo={writingVideo}
          writingVideoEmbed={writingVideoEmbed}
        />
      ) : null}
      {writingWorkspaceContent}
    </>
  );

  if (!hasCheatSheet) {
    return <div style={{ display: "grid", gap: 14 }}>{taskContent}</div>;
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div
        role="tablist"
        aria-label="Writing support"
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          padding: 6,
          border: "1px solid #dbeafe",
          borderRadius: 14,
          background: "#eff6ff",
        }}
      >
        <button
          id={taskTabId}
          type="button"
          role="tab"
          aria-selected={writeView === "task"}
          aria-controls={taskPanelId}
          onClick={() => setWriteView("task")}
          style={{
            ...(writeView === "task" ? styles.primaryButton : styles.secondaryButton),
            borderRadius: 999,
          }}
        >
          {isA2 ? "Write + Mark My Letter" : "Schreiben Task"}
        </button>
        <button
          id={cheatSheetTabId}
          type="button"
          role="tab"
          aria-selected={writeView === "cheatSheet"}
          aria-controls={cheatSheetPanelId}
          onClick={() => setWriteView("cheatSheet")}
          style={{
            ...(writeView === "cheatSheet" ? styles.primaryButton : styles.secondaryButton),
            borderRadius: 999,
          }}
        >
          {isA2 ? "Formal + Informal Cheat Sheet" : "Cheat Sheet"}
        </button>
      </div>

      <div
        id={taskPanelId}
        role="tabpanel"
        hidden={writeView !== "task"}
        aria-labelledby={taskTabId}
        style={{ display: writeView === "task" ? "grid" : "none", gap: 14 }}
      >
        {taskContent}
      </div>

      {writeView === "cheatSheet" ? (
        <div
          id={cheatSheetPanelId}
          role="tabpanel"
          aria-labelledby={cheatSheetTabId}
          style={{ display: "grid", gap: 16 }}
        >
          {isA2 ? <A2LetterTemplateCheatSheet /> : null}

          {writingCheatSheet.map((section) => {
            const isTemplate = section.layout === "template";

            return (
              <section
                key={section.id}
                data-cheat-sheet-layout={section.layout || "cards"}
                style={{ display: "grid", gap: 10 }}
              >
                <h3 style={{ margin: 0, fontSize: "1rem", color: "#1e3a8a" }}>
                  {section.title}
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isTemplate
                      ? "1fr"
                      : "repeat(auto-fit,minmax(min(100%,280px),1fr))",
                    gap: 8,
                  }}
                >
                  {section.items.map((item) => (
                    <div
                      key={`${section.id}-${item.phrase}`}
                      style={{
                        display: "grid",
                        gridTemplateColumns: isTemplate
                          ? "minmax(110px,180px) minmax(0,1fr)"
                          : "repeat(auto-fit,minmax(min(100%,180px),1fr))",
                        gap: 12,
                        alignItems: isTemplate ? "start" : "center",
                        border: "1px solid #e2e8f0",
                        borderRadius: 12,
                        padding: 12,
                        background: isTemplate ? "#ffffff" : "#f8fafc",
                        overflowWrap: "anywhere",
                      }}
                    >
                      <strong style={{ color: "#0f172a" }}>{item.phrase}</strong>
                      <span style={{ color: "#475569", whiteSpace: "pre-line", lineHeight: 1.7 }}>
                        {item.meaning}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
