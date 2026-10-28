import React from "react";

/**
 * Reuses the existing Falowen Music app through the SAME ORIGIN.
 *
 * The student remains under /campus/music in the Falowen app shell while
 * the embedded music page uses its already shipped catalogue, R2 playback,
 * lyrics and quizzes. The public music.falowen.app site remains shareable.
 *
 * Do not duplicate music catalogues, R2 credentials or music API requests.
 */
export default function CampusMusicPage() {
  return (
    <section aria-label="Falowen Music" data-campus-music="true" style={{ display: "grid", gap: 12 }}>
      <header style={{
        borderRadius: 16, padding: "16px 18px", border: "1px solid #bfe0cd",
        background: "linear-gradient(110deg, #ebf7ee, #f7fbf5)", display: "flex",
        justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <p style={{ color: "#37614b", textTransform: "uppercase", fontSize: 11, letterSpacing: ".09em", fontWeight: 800, margin: "0 0 6px" }}>Listen · Learn · Practise</p>
          <h2 style={{ color: "#153b2d", fontSize: 24, margin: 0 }}>Music</h2>
          <p style={{ color: "#476759", margin: "7px 0 0", fontSize: 14, lineHeight: 1.5 }}>Learn German with songs, lyrics, vocabulary and listening practice — without leaving Falowen.</p>
        </div>
        <a href="https://music.falowen.app/" target="_blank" rel="noopener noreferrer"
          style={{ color: "#12563c", fontWeight: 700, fontSize: 13, textUnderlineOffset: 3 }}>
          Open public Music site ↗
        </a>
      </header>
      <iframe
        title="Falowen Music — German listening room"
        src="/music/index.html?embedded=1"
        loading="eager"
        allow="autoplay; clipboard-write"
        referrerPolicy="strict-origin-when-cross-origin"
        style={{
          display: "block", width: "100%", height: "min(82vh, 960px)", minHeight: 560,
          border: "1px solid #d4e1d5", borderRadius: 16, background: "#f7faf5",
        }}
      />
    </section>
  );
}
