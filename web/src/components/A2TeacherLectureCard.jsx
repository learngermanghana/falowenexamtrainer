import React from "react";
import { getTeacherLectureVideoResources } from "../data/teacherLectureVideoResources";

const extractYouTubeId = (url = "") => {
  const value = String(url || "").trim();
  const shortMatch = value.match(/youtu\.be\/([^?&#/]+)/i);
  if (shortMatch?.[1]) return shortMatch[1];
  const watchMatch = value.match(/[?&]v=([^?&#/]+)/i);
  if (watchMatch?.[1]) return watchMatch[1];
  const embedMatch = value.match(/\/embed\/([^?&#/]+)/i);
  return embedMatch?.[1] || "";
};

export default function A2TeacherLectureCard({ day }) {
  const resource = getTeacherLectureVideoResources("A2", day)[0];
  if (!resource) return null;

  const videoId = extractYouTubeId(resource.url);
  return (
    <section
      data-a2-teacher-lecture="true"
      style={{
        border: "1px solid #bfdbfe",
        borderRadius: 16,
        padding: 14,
        background: "#eff6ff",
        display: "grid",
        gap: 10,
      }}
    >
      <div>
        <div style={{ color: "#1d4ed8", fontSize: 12, fontWeight: 900, textTransform: "uppercase" }}>Teacher lecture</div>
        <h3 style={{ margin: "4px 0" }}>Watch your teacher before you build your answer</h3>
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          Listen for useful vocabulary, sentence patterns and ideas. Then use the brain map below to prepare your own answer.
        </p>
      </div>
      {videoId ? (
        <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 12, overflow: "hidden", background: "#000" }}>
          <iframe
            title={`A2 Day ${day} teacher lecture`}
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          />
        </div>
      ) : null}
    </section>
  );
}
