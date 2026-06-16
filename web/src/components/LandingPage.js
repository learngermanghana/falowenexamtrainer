import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import LandingPageLegacy from "./LandingPageLegacy";

const FREE_LESSONS_MOUNT_ID = "falowen-free-lessons-mount";
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@LLEAGhana";
const YOUTUBE_UPLOADS_EMBED_URL =
  "https://www.youtube.com/embed?listType=user_uploads&list=LLEAGhana&playsinline=1&controls=1&rel=0";

const FreeLessonsSection = () => (
  <section
    id="free-lessons"
    aria-labelledby="free-lessons-title"
    style={{
      border: "1px solid #bfdbfe",
      borderRadius: 18,
      padding: 18,
      background: "linear-gradient(135deg, #eff6ff, #ffffff 58%, #fef3c7)",
      display: "grid",
      gap: 16,
      boxShadow: "0 8px 22px rgba(37, 99, 235, 0.08)",
    }}
  >
    <div style={{ display: "grid", gap: 7 }}>
      <span
        style={{
          width: "fit-content",
          display: "inline-flex",
          alignItems: "center",
          borderRadius: 999,
          padding: "6px 10px",
          background: "#dbeafe",
          color: "#1e40af",
          fontSize: 12,
          fontWeight: 900,
        }}
      >
        Latest from YouTube
      </span>
      <h2 id="free-lessons-title" style={{ margin: 0, color: "#111827", fontSize: 24 }}>
        Free Lessons
      </h2>
      <p style={{ margin: 0, color: "#475569", lineHeight: 1.65, maxWidth: 760 }}>
        Watch the newest free German lesson from Learn Language Education Academy. New uploads from our YouTube channel appear here automatically.
      </p>
    </div>

    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        overflow: "hidden",
        borderRadius: 16,
        background: "#0f172a",
        boxShadow: "0 14px 32px rgba(15, 23, 42, 0.2)",
      }}
    >
      <iframe
        src={YOUTUBE_UPLOADS_EMBED_URL}
        title="Latest free lesson from LLEA Ghana"
        loading="lazy"
        allow="encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
      />
    </div>

    <a
      href={YOUTUBE_CHANNEL_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        width: "fit-content",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 44,
        padding: "10px 14px",
        borderRadius: 12,
        background: "#dc2626",
        color: "#ffffff",
        fontWeight: 900,
        textDecoration: "none",
      }}
    >
      See all free lessons on YouTube
    </a>
  </section>
);

export default function LandingPage(props) {
  const [portalTarget, setPortalTarget] = useState(null);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    let active = true;

    const ensureFreeLessonsMount = () => {
      const oldSection = document.getElementById("how-it-works");
      if (!oldSection) return;

      oldSection.style.display = "none";
      oldSection.setAttribute("aria-hidden", "true");

      let mount = document.getElementById(FREE_LESSONS_MOUNT_ID);
      if (!mount) {
        mount = document.createElement("div");
        mount.id = FREE_LESSONS_MOUNT_ID;
        mount.style.display = "contents";
        oldSection.insertAdjacentElement("afterend", mount);
      }

      if (active) {
        setPortalTarget((current) => (current === mount ? current : mount));
      }
    };

    ensureFreeLessonsMount();
    const observer = new MutationObserver(ensureFreeLessonsMount);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      active = false;
      observer.disconnect();
      document.getElementById(FREE_LESSONS_MOUNT_ID)?.remove();
      const oldSection = document.getElementById("how-it-works");
      if (oldSection) {
        oldSection.style.removeProperty("display");
        oldSection.removeAttribute("aria-hidden");
      }
    };
  }, []);

  return (
    <>
      <LandingPageLegacy {...props} />
      {portalTarget ? createPortal(<FreeLessonsSection />, portalTarget) : null}
    </>
  );
}
