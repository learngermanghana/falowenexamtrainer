import React, { useEffect, useRef } from "react";
import { auth } from "../firebase";
import { normalizeCampusMusicPractice, saveCampusMusicPractice } from "./musicPracticeTracking";

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
  const iframeRef = useRef(null);

  useEffect(() => {
    const onMusicEvent = event => {
      // Reject cross-origin messages and frames not owned by this Campus page.
      if (event.origin !== window.location.origin || event.source !== iframeRef.current?.contentWindow) return;
      const data = normalizeCampusMusicPractice(event.data);
      const student = auth?.currentUser;
      if (!data || !student || student.isAnonymous) return;
      // Deliberately best effort: a reporting outage must not interrupt lessons.
      saveCampusMusicPractice(student, data).catch(() => {});
    };
    window.addEventListener('message', onMusicEvent);
    return () => window.removeEventListener('message', onMusicEvent);
  }, []);

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
      <p style={{ margin: 0, fontSize: 12, color: '#475569' }}>
        Your song starts, listening time and completed listens in Campus Music are saved to your Falowen learning account so authorised staff can follow your practice. Public Music listening stays anonymous.
      </p>
      <iframe
        ref={iframeRef}
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
