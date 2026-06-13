import React from "react";
import { getLessonRadioResource } from "../data/lessonRadioDictionary";
import { styles } from "../styles";

const FalowenRadioTabContent = ({
  level = "A2",
  day = 9,
  onContinue,
  actionLabel = "Continue to Teil 1 · Sprechen →",
}) => {
  const radio = getLessonRadioResource(level, day) || {};
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

      {showAction ? (
        <button
          type="button"
          onClick={onContinue}
          style={{ ...styles.primaryButton, width: "fit-content" }}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
};

export default FalowenRadioTabContent;
