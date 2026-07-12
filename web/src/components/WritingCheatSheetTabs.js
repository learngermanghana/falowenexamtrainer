import React, { useEffect, useId, useState } from "react";
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

export default function WritingCheatSheetTabs({ level, day, children }) {
  const baseId = useId();
  const taskTabId = `${baseId}-writing-task-tab`;
  const videoTabId = `${baseId}-writing-video-tab`;
  const cheatSheetTabId = `${baseId}-writing-cheat-sheet-tab`;
  const taskPanelId = `${baseId}-writing-task-panel`;
  const videoPanelId = `${baseId}-writing-video-panel`;
  const cheatSheetPanelId = `${baseId}-writing-cheat-sheet-panel`;
  const [writeView, setWriteView] = useState("task");
  const normalizedLevel = String(level || "").trim().toUpperCase();
  const isA2 = normalizedLevel === "A2";
  const writingCheatSheet = getWritingCheatSheet(level, day);
  const writingVideo = getWritingVideoResource(level, day);
  const writingVideoEmbed = getYouTubeEmbedUrl(writingVideo?.url);
  const hasWritingVideo = Boolean(writingVideo?.url);
  const hasCheatSheet = writingCheatSheet.length > 0 || isA2;

  useEffect(() => setWriteView("task"), [level, day]);

  if (!hasWritingVideo && !hasCheatSheet) return children;

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
        {hasWritingVideo ? (
          <button
            id={videoTabId}
            type="button"
            role="tab"
            aria-selected={writeView === "video"}
            aria-controls={videoPanelId}
            onClick={() => setWriteView("video")}
            style={{
              ...(writeView === "video" ? styles.primaryButton : styles.secondaryButton),
              borderRadius: 999,
            }}
          >
            Writing Video
          </button>
        ) : null}
        {hasCheatSheet ? (
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
        ) : null}
      </div>

      <div
        id={taskPanelId}
        role="tabpanel"
        hidden={writeView !== "task"}
        aria-labelledby={taskTabId}
        style={{ display: writeView === "task" ? "grid" : "none", gap: 14 }}
      >
        {isA2 ? <A2WritingPlanner /> : null}
        {children}
      </div>

      {writeView === "video" && hasWritingVideo ? (
        <div
          id={videoPanelId}
          role="tabpanel"
          aria-labelledby={videoTabId}
          style={{ display: "grid", gap: 12 }}
        >
          <div
            style={{
              display: "grid",
              gap: 8,
              border: "1px solid #bfdbfe",
              borderRadius: 14,
              padding: 14,
              background: "#eff6ff",
            }}
          >
            <h3 style={{ margin: 0, color: "#1e3a8a" }}>
              {writingVideo.title || "Writing explanation video"}
            </h3>
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
        </div>
      ) : null}

      {writeView === "cheatSheet" && hasCheatSheet ? (
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
