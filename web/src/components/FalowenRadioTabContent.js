import React, { useState } from "react";
import { getLessonRadioResource } from "../data/lessonRadioDictionary";
import { styles } from "../styles";

const questionCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 6,
};

const FalowenRadioTabContent = ({ level = "A2", day = 9, onContinue }) => {
  const [completed, setCompleted] = useState(false);
  const radio = getLessonRadioResource(level, day) || {};
  const hasVideo = Boolean(String(radio.youtubeId || "").trim());

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
          Audio warm-up · No assignment
        </span>
        <h2 style={{ margin: 0, fontSize: "clamp(1.4rem, 4vw, 2rem)" }}>🎙️ Falowen Radio</h2>
        <p style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>{radio.title || "Urlaub planen"}</p>
        <p style={{ margin: 0, lineHeight: 1.7, color: "#e0e7ff" }}>
          Listen before Teil 1. This is natural topic-based German. Teil 4 remains your formal exam-listening exercise.
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
            title={`Falowen Radio: ${radio.title || "Urlaub planen"}`}
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
            <strong style={{ fontSize: "1.15rem" }}>Die erste Falowen-Radio-Folge wird vorbereitet.</strong>
            <span style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
              The pilot player is ready. Add the YouTube video ID to the Day 9 radio lesson data to activate it.
            </span>
          </div>
        </div>
      )}

      <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
        <strong>So arbeitest du mit der Folge</strong>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          {radio.instruction ||
            "Höre zweimal zu. Notiere fünf nützliche Ausdrücke und beantworte danach die Fragen."}
        </p>
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
          <li>Höre zuerst ohne Untertitel oder Transkript.</li>
          <li>Höre ein zweites Mal und notiere wichtige Wörter.</li>
          <li>Beantworte die Fragen und gehe danach zu Teil 1.</li>
        </ol>
      </div>

      <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Fragen zum Zuhören</h3>
      {(radio.questions || []).map((question, index) => (
        <div key={question} style={questionCardStyle}>
          <strong>
            {index + 1}. {question}
          </strong>
        </div>
      ))}

      <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Nützliche Ausdrücke für Teil 1</h3>
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
        {(radio.usefulExpressions || []).map((expression) => (
          <div key={expression} style={questionCardStyle}>
            <span>{expression}</span>
          </div>
        ))}
      </div>

      <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
        <input type="checkbox" checked={completed} onChange={(event) => setCompleted(event.target.checked)} />
        I listened twice and completed the warm-up.
      </label>

      <button
        type="button"
        onClick={onContinue}
        style={{ ...styles.primaryButton, width: "fit-content" }}
      >
        Continue to Teil 1 · Sprechen →
      </button>
    </div>
  );
};

export default FalowenRadioTabContent;
