import React from "react";
import { getAdditionalLessonVideoResources } from "../data/additionalLessonVideoResources";
import { getB1LessonResourceOverride } from "../data/b1LessonResourceOverrides";
import { getLessonVideoResources } from "../data/lessonVideoDictionary";

export const A2_B1_GRAMMAR_VIDEO_ATTRIBUTE = "data-a2-b1-grammar-video";

const normalizeLevel = (value = "") => String(value || "").trim().toUpperCase();

const resourceLabel = (resource = {}) =>
  `${resource.key || ""} ${resource.title || ""} ${resource.description || ""}`.toLowerCase();

const isAiGrammarVideo = (resource = {}) => {
  const label = resourceLabel(resource);
  if (/teacher|tutor lecture|falowen radio/.test(label)) return false;
  return /\bai\b|ai-|grammar video|grammar explainer/.test(label);
};

const uniqueByUrl = (resources = []) => {
  const seen = new Set();
  return resources.filter((resource) => {
    const url = String(resource?.url || "").trim();
    if (!url || seen.has(url)) return false;
    seen.add(url);
    return true;
  });
};

export const extractYouTubeVideoId = (url = "") => {
  const value = String(url || "").trim();
  if (!value) return "";

  const shortMatch = value.match(/youtu\.be\/([^?&#/]+)/i);
  if (shortMatch?.[1]) return shortMatch[1];

  const watchMatch = value.match(/[?&]v=([^?&#/]+)/i);
  if (watchMatch?.[1]) return watchMatch[1];

  const embedMatch = value.match(/\/embed\/([^?&#/]+)/i);
  if (embedMatch?.[1]) return embedMatch[1];

  const shortsMatch = value.match(/\/shorts\/([^?&#/]+)/i);
  return shortsMatch?.[1] || "";
};

export const getA2B1GrammarVideoModel = (level, day) => {
  const normalizedLevel = normalizeLevel(level);
  const normalizedDay = Number(day);
  if (!["A2", "B1"].includes(normalizedLevel) || !Number.isInteger(normalizedDay) || normalizedDay < 1) {
    return null;
  }

  const resourceOverride = normalizedLevel === "B1"
    ? getB1LessonResourceOverride(normalizedDay) || {}
    : {};
  const rawLesson = { day: normalizedDay, ...resourceOverride };
  const resources = uniqueByUrl([
    ...getLessonVideoResources(normalizedLevel, normalizedDay, rawLesson),
    ...getAdditionalLessonVideoResources(normalizedLevel, normalizedDay),
  ]);
  const videoResource = resources.find(isAiGrammarVideo) || null;
  if (!videoResource) return null;

  const sourceUrl = String(videoResource.url || "").trim();
  const youtubeId = extractYouTubeVideoId(sourceUrl);
  const configuredTitle = String(videoResource.title || "").trim();
  const title = !configuredTitle || /^ai grammar video$/i.test(configuredTitle)
    ? `${normalizedLevel} Day ${normalizedDay} AI grammar video`
    : configuredTitle;

  return {
    level: normalizedLevel,
    day: normalizedDay,
    videoResource,
    title,
    sourceUrl,
    youtubeId,
    embedUrl: youtubeId ? `https://www.youtube-nocookie.com/embed/${youtubeId}` : "",
  };
};

export default function A2B1GrammarVideoCard({ level, day }) {
  const video = getA2B1GrammarVideoModel(level, day);
  if (!video) return null;

  return (
    <section
      {...{ [A2_B1_GRAMMAR_VIDEO_ATTRIBUTE]: "true" }}
      aria-label={`${video.level} AI grammar video`}
      style={{
        background: "linear-gradient(135deg, #eff6ff, #ffffff)",
        border: "1px solid #93c5fd",
        borderRadius: 18,
        boxShadow: "0 14px 30px rgba(37, 99, 235, 0.12)",
        display: "grid",
        gap: 12,
        padding: 14,
      }}
    >
      <div style={{ display: "grid", gap: 4 }}>
        <span style={{ color: "#1d4ed8", fontSize: 12, fontWeight: 900, letterSpacing: ".04em", textTransform: "uppercase" }}>
          AI grammar video
        </span>
        <h2 style={{ color: "#0f172a", fontSize: 18, lineHeight: 1.35, margin: 0 }}>
          Watch before reading the grammar notes
        </h2>
        <p style={{ color: "#475569", lineHeight: 1.55, margin: 0 }}>
          Start with this explanation, then continue directly with the grammar notes below.
        </p>
      </div>

      {video.embedUrl ? (
        <>
          <div style={{ aspectRatio: "16 / 9", background: "#000", border: "1px solid #bfdbfe", borderRadius: 14, overflow: "hidden", position: "relative", width: "100%" }}>
            <iframe
              src={video.embedUrl}
              title={video.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ border: 0, height: "100%", inset: 0, position: "absolute", width: "100%" }}
            />
          </div>
          <a href={video.sourceUrl} target="_blank" rel="noreferrer" style={{ color: "#1d4ed8", fontWeight: 800, width: "fit-content" }}>
            Open AI grammar video on YouTube
          </a>
        </>
      ) : (
        <a href={video.sourceUrl} target="_blank" rel="noreferrer" style={{ color: "#1d4ed8", fontWeight: 800, width: "fit-content" }}>
          Open AI grammar video
        </a>
      )}
    </section>
  );
}
