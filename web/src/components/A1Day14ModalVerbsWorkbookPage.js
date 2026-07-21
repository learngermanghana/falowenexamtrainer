import React from "react";
import { useLocation } from "react-router-dom";
import { styles } from "../styles";
import A1Day14ModalVerbsWorkbookCorePage from "./A1Day14ModalVerbsWorkbookCorePage";

const SELF_LEARNING_MEDIA = Object.freeze([
  Object.freeze({
    key: "a1-day14-falowen-radio",
    step: 1,
    eyebrow: "Falowen Radio",
    title: "Modal verbs with separable verbs",
    description:
      "Start with the Falowen Radio explanation. Listen for the sentence pattern and repeat the examples before continuing.",
    videoId: "GeHygJE7Hww",
    url: "https://youtu.be/GeHygJE7Hww",
    linkLabel: "Open Falowen Radio on YouTube",
  }),
  Object.freeze({
    key: "a1-day14-tutor-lecture",
    step: 2,
    eyebrow: "Tutor lecture",
    title: "Teacher explanation · Modal verbs and separable verbs",
    description:
      "Watch the recorded tutor lecture for a guided explanation of modal verbs, normal main verbs and separable main verbs.",
    videoId: "GJw1aJehYHU",
    url: "https://youtu.be/GJw1aJehYHU",
    linkLabel: "Open tutor lecture on YouTube",
  }),
]);

const videoShellStyle = {
  aspectRatio: "16 / 9",
  background: "#020617",
  borderRadius: 14,
  overflow: "hidden",
  position: "relative",
  width: "100%",
};

const SelfLearningVideoCard = ({ resource }) => (
  <article
    data-self-learning-video={resource.key}
    style={{
      background: "#ffffff",
      border: "1px solid #dbeafe",
      borderRadius: 16,
      display: "grid",
      gap: 11,
      minWidth: 0,
      padding: 14,
    }}
  >
    <div style={{ alignItems: "flex-start", display: "flex", gap: 10 }}>
      <span
        aria-hidden="true"
        style={{
          alignItems: "center",
          background: "#1e3a8a",
          borderRadius: "999px",
          color: "#ffffff",
          display: "inline-flex",
          flex: "0 0 32px",
          fontWeight: 900,
          height: 32,
          justifyContent: "center",
        }}
      >
        {resource.step}
      </span>
      <div style={{ display: "grid", gap: 4, minWidth: 0 }}>
        <span
          style={{
            color: "#1d4ed8",
            fontSize: ".75rem",
            fontWeight: 900,
            letterSpacing: ".05em",
            textTransform: "uppercase",
          }}
        >
          {resource.eyebrow}
        </span>
        <strong style={{ color: "#0f172a", fontSize: "1.02rem", lineHeight: 1.4 }}>
          {resource.title}
        </strong>
      </div>
    </div>

    <p style={{ color: "#475569", lineHeight: 1.6, margin: 0 }}>{resource.description}</p>

    <div style={videoShellStyle}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${resource.videoId}`}
        title={`${resource.eyebrow} · ${resource.title}`}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{ border: 0, height: "100%", inset: 0, position: "absolute", width: "100%" }}
      />
    </div>

    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      style={{ ...styles.linkButton, justifySelf: "start", width: "fit-content" }}
    >
      {resource.linkLabel}
    </a>
  </article>
);

export const A1Day14SelfLearningMaterials = () => (
  <div
    data-a1-day14-self-learning-materials="true"
    style={{ ...styles.container, display: "grid", gap: 12, paddingBottom: 0, paddingTop: 0 }}
  >
    <section
      style={{
        ...styles.card,
        background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 55%, #f0fdf4 100%)",
        border: "1px solid #93c5fd",
        display: "grid",
        gap: 14,
      }}
    >
      <div style={{ display: "grid", gap: 6 }}>
        <span
          style={{
            ...styles.badge,
            background: "#dbeafe",
            color: "#1e3a8a",
            width: "fit-content",
          }}
        >
          Self-learning materials
        </span>
        <h2 style={{ color: "#0f172a", fontSize: "1.35rem", margin: 0 }}>
          Watch and listen before starting the lesson
        </h2>
        <p style={{ color: "#475569", lineHeight: 1.65, margin: 0 }}>
          Recommended order: Falowen Radio, tutor lecture, AI lesson video, then the workbook activities below.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 290px), 1fr))",
        }}
      >
        {SELF_LEARNING_MEDIA.map((resource) => (
          <SelfLearningVideoCard key={resource.key} resource={resource} />
        ))}
      </div>
    </section>
  </div>
);

export default function A1Day14ModalVerbsWorkbookPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search || "");
  const isA2Day17Context =
    String(query.get("level") || "").toUpperCase() === "A2"
    && Number(query.get("day") || 0) === 17;

  return (
    <>
      {!isA2Day17Context ? <A1Day14SelfLearningMaterials /> : null}
      <A1Day14ModalVerbsWorkbookCorePage />
    </>
  );
}
