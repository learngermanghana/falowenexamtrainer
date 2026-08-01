import React from "react";
import { getA1TeacherVideoResources } from "../data/a1TeacherVideoResources";
import {
  buildA1AssignmentVideoModel,
  extractYouTubeVideoId,
} from "./A1WorkbookVideoHeader";

export const A1_DAY21_ASSIGNMENT_KEY = "A1-13";
export const A1_DAY21_CHAPTER = "13";

const toVideoModel = (resource, kind, fallbackTitle) => {
  const sourceUrl = String(resource?.url || resource?.sourceUrl || "").trim();
  const youtubeId = extractYouTubeVideoId(sourceUrl);
  if (!sourceUrl || !youtubeId) return null;

  return {
    kind,
    title: String(resource?.title || fallbackTitle).trim() || fallbackTitle,
    description: String(resource?.description || "").trim(),
    sourceUrl,
    youtubeId,
    embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}`,
  };
};

export const buildA1Day21WeatherResourceModels = () => {
  const teacherResource = getA1TeacherVideoResources(21).find(
    (resource) => String(resource.chapter || "").trim() === A1_DAY21_CHAPTER,
  );
  const aiVideo = buildA1AssignmentVideoModel(A1_DAY21_ASSIGNMENT_KEY);

  return {
    teacher: toVideoModel(
      teacherResource,
      "teacher",
      "Weather · Teacher lecture",
    ),
    ai: toVideoModel(
      aiVideo?.videoResource || aiVideo,
      "ai",
      "Weather · AI grammar video",
    ),
  };
};

const videoShellStyle = {
  aspectRatio: "16 / 9",
  background: "#000000",
  border: "1px solid #cbd5e1",
  borderRadius: 14,
  overflow: "hidden",
  position: "relative",
  width: "100%",
};

const VideoResourceCard = ({ model, eyebrow, heading, actionLabel }) => {
  if (!model) return null;

  return (
    <article
      aria-label={`${model.kind} weather video`}
      data-a1-day21-weather-video={model.kind}
      style={{
        background: "#ffffff",
        border: "1px solid #bfdbfe",
        borderRadius: 16,
        display: "grid",
        gap: 10,
        padding: 14,
      }}
    >
      <div style={{ display: "grid", gap: 4 }}>
        <span
          style={{
            color: model.kind === "ai" ? "#6d28d9" : "#1d4ed8",
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: ".04em",
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </span>
        <h3 style={{ color: "#0f172a", fontSize: 18, lineHeight: 1.35, margin: 0 }}>
          {heading}
        </h3>
        <p style={{ color: "#475569", lineHeight: 1.55, margin: 0 }}>
          {model.description ||
            (model.kind === "ai"
              ? "Use the AI explanation to revise the weather lesson and grammar."
              : "Watch the recorded teacher explanation for this weather lesson.")}
        </p>
      </div>

      <div style={videoShellStyle}>
        <iframe
          src={model.embedUrl}
          title={model.title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ border: 0, height: "100%", inset: 0, position: "absolute", width: "100%" }}
        />
      </div>

      <a
        href={model.sourceUrl}
        target="_blank"
        rel="noreferrer"
        style={{ color: "#1d4ed8", fontWeight: 800, width: "fit-content" }}
      >
        {actionLabel}
      </a>
    </article>
  );
};

export default function A1Day21WeatherResources() {
  const { teacher, ai } = buildA1Day21WeatherResourceModels();

  if (!teacher && !ai) return null;

  return (
    <section
      aria-label="A1 Day 21 lesson resources"
      data-a1-day21-weather-resources="true"
      style={{
        background: "linear-gradient(135deg, #eff6ff, #ffffff)",
        border: "1px solid #93c5fd",
        borderRadius: 18,
        display: "grid",
        gap: 14,
        padding: 16,
      }}
    >
      <div style={{ display: "grid", gap: 6 }}>
        <span
          style={{
            color: "#1d4ed8",
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: ".04em",
            textTransform: "uppercase",
          }}
        >
          Continue after Falowen Radio
        </span>
        <h2 style={{ margin: 0 }}>Weather lesson resources</h2>
        <p style={{ color: "#475569", lineHeight: 1.65, margin: 0 }}>
          Watch the teacher lecture and the AI grammar explanation before completing the workbook.
          The AI video is also embedded in the Grammar tab.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        <VideoResourceCard
          model={teacher}
          eyebrow="Teacher lecture"
          heading="Weather · Teacher explanation"
          actionLabel="Open teacher lecture on YouTube"
        />
        <VideoResourceCard
          model={ai}
          eyebrow="AI grammar video"
          heading="Weather · AI explanation"
          actionLabel="Open AI grammar video on YouTube"
        />
      </div>
    </section>
  );
}
