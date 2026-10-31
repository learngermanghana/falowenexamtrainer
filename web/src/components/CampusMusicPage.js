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
        borderRadius: 20, padding: "22px 22px", border: "1px solid #3d7564",
        background: "radial-gradient(circle at 94% 10%, rgba(181,241,140,.20), transparent 46%), linear-gradient(115deg, #123e38 0%, #14273b 100%)", display: "flex",
        justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <p style={{ color: "#a4efbb", textTransform: "uppercase", fontSize: 11, letterSpacing: ".09em", fontWeight: 800, margin: "0 0 6px" }}>Listen · Learn · Practise</p>
          <h2 style={{ color: "#f1fff0", fontSize: 24, margin: 0 }}>Music</h2>
          <p style={{ color: "#c8dfd7", margin: "7px 0 0", fontSize: 14, lineHeight: 1.5 }}>Learn German with songs, lyrics, vocabulary and listening practice — without leaving Falowen.</p>
        </div>
        <a href="https://music.falowen.app/" target="_blank" rel="noopener noreferrer"
          style={{ color: "#cbf6ab", fontWeight: 700, fontSize: 13, textUnderlineOffset: 3 }}>
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
          border: "1px solid #527d72", borderRadius: 18, background: "#0e1921",
        }}
      />
    </section>
  );
}
