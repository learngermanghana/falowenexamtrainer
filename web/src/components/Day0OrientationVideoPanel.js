import React from "react";
import { styles } from "../styles";

const B1_DAY0_VIDEO_ID = ["QMWj", "_N6ncwI"].join("");

export const DAY0_ORIENTATION_VIDEOS = Object.freeze({
  A1: Object.freeze({
    id: "qPwxBYlu3CE",
    url: "https://youtu.be/qPwxBYlu3CE",
    title: "A1 orientation video",
    description:
      "Watch this video inside the orientation guide before you continue with the Day 0 instructions and readiness check.",
  }),
  A2: Object.freeze({
    id: "ORX4KELTPEQ",
    url: "https://youtu.be/ORX4KELTPEQ",
    title: "A2 Day 0 orientation video",
    description:
      "Watch this video inside the orientation guide so you understand the A2 Course Book, workbook tabs, Falowen Radio and submission flow before Day 1.",
  }),
  B1: Object.freeze({
    id: B1_DAY0_VIDEO_ID,
    url: `https://youtu.be/${B1_DAY0_VIDEO_ID}`,
    title: "B1 Day 0 orientation video",
    description:
      "Watch this video inside the orientation guide so you understand the B1 Course Book, fuller B1 answers, speaking preparation and submission routine before Day 1.",
  }),
  B2: Object.freeze({
    id: "AH2dPdqjfTo",
    url: "https://youtu.be/AH2dPdqjfTo",
    title: "B2 Day 0 self-learning orientation video",
    description:
      "Watch this video inside the orientation guide so you understand the B2 self-learning workflow, Falowen AI practice and independent lesson routine.",
  }),
});

export const getDay0OrientationVideo = (level = "") =>
  DAY0_ORIENTATION_VIDEOS[String(level || "").trim().toUpperCase()] || null;

const getEmbedUrl = (videoId = "") =>
  videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&playsinline=1` : "";

export default function Day0OrientationVideoPanel({ level, video: videoOverride = null }) {
  const video = videoOverride || getDay0OrientationVideo(level);
  if (!video?.id) return null;

  return (
    <section
      data-day0-orientation-video={String(level || "").toUpperCase()}
      style={{
        ...styles.card,
        display: "grid",
        gap: 12,
        border: "1px solid #bbf7d0",
        background: "linear-gradient(135deg, #f0fdf4, #ffffff)",
      }}
    >
      <div style={{ display: "grid", gap: 5 }}>
        <span
          style={{
            ...styles.badge,
            width: "fit-content",
            background: "#dcfce7",
            color: "#166534",
          }}
        >
          Start here · Orientation video
        </span>
        <h2 style={{ margin: 0 }}>{video.title}</h2>
        <p style={{ margin: 0, lineHeight: 1.65, color: "#475569" }}>
          {video.description}
        </p>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%",
          borderRadius: 14,
          overflow: "hidden",
          background: "#000",
          boxShadow: "0 14px 30px rgba(15, 23, 42, 0.16)",
        }}
      >
        <iframe
          title={video.title}
          src={getEmbedUrl(video.id)}
          loading="eager"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <p style={{ margin: 0, lineHeight: 1.6, color: "#475569", fontSize: 14 }}>
        The video and orientation text are now on the same page. If the embedded player does not load,{" "}
        <a href={video.url} target="_blank" rel="noreferrer">
          open the video on YouTube
        </a>
        .
      </p>
    </section>
  );
}
