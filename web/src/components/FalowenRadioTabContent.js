import React from "react";
import { getLessonRadioResource } from "../data/lessonRadioDictionary";
import { styles } from "../styles";

const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@LLEAGhana";

const FalowenRadioTabContent = ({
  level = "A2",
  day = 9,
  resource,
  onContinue,
  actionLabel = "Continue to Teil 1 · Sprechen →",
  actionDisabled = false,
}) => {
  const radio = resource || getLessonRadioResource(level, day) || {};
  const hasVideo = Boolean(String(radio.youtubeId || "").trim());
  const showAction = typeof onContinue === "function";

  return (
    <div style={{ ...styles.card, display: "grid", gap: 12 }}>
      <div
        style={{
          borderRadius: 14,
          padding: 18,
          color: "#fff",
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 55%, #7c3aed 100%)",
          display: "grid",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase" }}>
          Listening warm-up · No assignment
        </span>
        <h2 style={{ margin: 0, fontSize: "clamp(1.4rem, 4vw, 2rem)" }}>🎙️ Falowen Radio</h2>
        <p style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>
          {radio.title || "Listening warm-up"}
        </p>
        <p style={{ margin: 0, lineHeight: 1.7, color: "#e0e7ff" }}>
          {radio.instruction || "Höre einfach zu und stimme dich auf das Thema ein."}
        </p>
        <p style={{ margin: 0, lineHeight: 1.7, color: "#ddd6fe", fontSize: 14 }}>
          Falowen Radio is the listening stage inside your course book. This episode matches today&apos;s topic and prepares you for the speaking, grammar and workbook activities that follow.
        </p>
      </div>

      {hasVideo ? (
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingTop: "56.25%",
            borderRadius: 12,
            overflow: "hidden",
            background: "#111827",
          }}
        >
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${radio.youtubeId}?rel=0&playsinline=1`}
            title={`Falowen Radio: ${radio.title || "Listening warm-up"}`}
            loading="lazy"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          />
        </div>
      ) : (
        <div
          style={{
            minHeight: 240,
            borderRadius: 12,
            background: "#111827",
            display: "grid",
            placeItems: "center",
            textAlign: "center",
            color: "#f9fafb",
          }}
        >
          <div style={{ padding: 24, display: "grid", gap: 8, maxWidth: 520 }}>
            <span style={{ fontSize: 42 }}>🎧</span>
            <strong style={{ fontSize: "1.15rem" }}>Die Falowen-Radio-Folge wird vorbereitet.</strong>
          </div>
        </div>
      )}

      <div
        style={{
          border: "1px solid #c7d2fe",
          borderRadius: 12,
          padding: 14,
          background: "#eef2ff",
          display: "grid",
          gap: 10,
        }}
      >
        <strong>Train your ear before you answer</strong>
        <p style={{ margin: 0, lineHeight: 1.65, color: "#475569" }}>
          Listen once for the general meaning. Listen again for pronunciation, rhythm and useful words. You do not need to understand every word before continuing.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <a
            href="/falowen-radio"
            style={{ ...styles.secondaryButton, textDecoration: "none", display: "inline-flex", alignItems: "center" }}
          >
            How Falowen Radio works
          </a>
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noreferrer"
            style={{ ...styles.secondaryButton, textDecoration: "none", display: "inline-flex", alignItems: "center" }}
          >
            ▶ Subscribe on YouTube
          </a>
        </div>
      </div>

      {showAction ? (
        <button
          type="button"
          onClick={onContinue}
          disabled={actionDisabled}
          aria-busy={actionDisabled ? "true" : undefined}
          style={{
            ...styles.primaryButton,
            width: "fit-content",
            opacity: actionDisabled ? 0.72 : 1,
            cursor: actionDisabled ? "progress" : "pointer",
          }}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
};

export default FalowenRadioTabContent;
