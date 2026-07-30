import React from "react";
import {
  A1_GRAMMAR_VIDEO_ATTRIBUTE,
  buildA1AssignmentVideoModel,
} from "./A1WorkbookVideoHeader";

export default function A1GrammarVideoCard({ assignmentKey }) {
  const video = buildA1AssignmentVideoModel(assignmentKey);
  if (!video) return null;

  return (
    <section
      {...{ [A1_GRAMMAR_VIDEO_ATTRIBUTE]: "true" }}
      aria-label="AI grammar video"
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
              title={`${video.title} · AI grammar video`}
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
        <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, color: "#92400e", fontWeight: 800, lineHeight: 1.55, padding: 12 }}>
          AI grammar video coming soon. Continue with the grammar notes below.
        </div>
      )}
    </section>
  );
}
