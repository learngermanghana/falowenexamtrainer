import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import LandingPageLegacy from "./LandingPageLegacy";
import {
  buildPublicFunnelUrl,
  rememberPublicFunnelContext,
  trackPublicFunnelEvent,
} from "../lib/publicFunnelTracking";

const FREE_LESSONS_MOUNT_ID = "falowen-free-lessons-mount";
const PLAYER_ID = "falowen-free-lessons-player";
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@LLEAGhana";
const YOUTUBE_UPLOADS_EMBED_URL =
  "https://www.youtube.com/embed?listType=user_uploads&list=LLEAGhana&playsinline=1&controls=1&rel=0&enablejsapi=1";

const actionStyle = (background, color = "#fff") => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 44,
  padding: "10px 14px",
  borderRadius: 12,
  background,
  color,
  border: "1px solid transparent",
  textDecoration: "none",
  fontWeight: 900,
});

const FreeLessonsSection = ({ videoId }) => {
  const attribution = useMemo(
    () => ({
      source: "youtube_free_lessons",
      video: videoId || "channel-latest",
      utm_source: "youtube",
      utm_medium: "free_lesson",
      utm_campaign: "public_funnel",
    }),
    [videoId]
  );

  const placementUrl = buildPublicFunnelUrl("/placement-test", {
    ...attribution,
    utm_content: "placement_test",
  });
  const classesUrl = buildPublicFunnelUrl("/classes/", {
    ...attribution,
    utm_content: "choose_class",
  });
  const signupUrl = buildPublicFunnelUrl("/signup/", {
    ...attribution,
    utm_content: "continue_application",
  });

  const trackClick = (stage) => {
    rememberPublicFunnelContext(attribution);
    trackPublicFunnelEvent(stage, { video: attribution.video });
  };

  return (
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
        <span style={{ width: "fit-content", borderRadius: 999, padding: "6px 10px", background: "#dbeafe", color: "#1e40af", fontSize: 12, fontWeight: 900 }}>
          Latest from YouTube
        </span>
        <h2 id="free-lessons-title" style={{ margin: 0, color: "#111827", fontSize: 24 }}>
          Free Lessons
        </h2>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.65, maxWidth: 760 }}>
          Watch the newest free German lesson, check your level, choose the right class and continue directly to your Falowen application.
        </p>
      </div>

      <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", overflow: "hidden", borderRadius: 16, background: "#0f172a", boxShadow: "0 14px 32px rgba(15, 23, 42, 0.2)" }}>
        <iframe
          id={PLAYER_ID}
          src={YOUTUBE_UPLOADS_EMBED_URL}
          title="Latest free lesson from LLEA Ghana"
          loading="lazy"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
        />
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <a href={placementUrl} onClick={() => trackClick("free_lesson_placement_click")} style={actionStyle("#2563eb")}>Take the free placement test</a>
        <a href={classesUrl} onClick={() => trackClick("free_lesson_classes_click")} style={{ ...actionStyle("#fff", "#1d4ed8"), borderColor: "#2563eb" }}>Choose an A1/A2/B1 class</a>
        <a href={signupUrl} onClick={() => trackClick("free_lesson_application_click")} style={actionStyle("#0f172a")}>Continue application</a>
        <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackClick("free_lesson_channel_click")} style={actionStyle("#dc2626")}>See all free lessons</a>
      </div>
    </section>
  );
};

export default function LandingPage(props) {
  const [portalTarget, setPortalTarget] = useState(null);
  const [videoId, setVideoId] = useState("");

  useEffect(() => {
    rememberPublicFunnelContext({ lastStage: "landing" });
    trackPublicFunnelEvent("landing_view");
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    let active = true;

    const ensureMount = () => {
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
      if (active) setPortalTarget((current) => (current === mount ? current : mount));
    };

    ensureMount();
    const observer = new MutationObserver(ensureMount);
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

  useEffect(() => {
    if (!portalTarget || typeof window === "undefined") return undefined;
    let player;
    let cancelled = false;

    const connectPlayer = () => {
      if (cancelled || !window.YT?.Player || !document.getElementById(PLAYER_ID)) return;
      player = new window.YT.Player(PLAYER_ID, {
        events: {
          onStateChange: (event) => {
            if (event.data !== window.YT.PlayerState.PLAYING) return;
            const current = event.target.getVideoData?.().video_id || "";
            if (current) {
              setVideoId(current);
              rememberPublicFunnelContext({ source: "youtube_free_lessons", video: current });
              trackPublicFunnelEvent("free_lesson_play", { video: current });
            }
          },
        },
      });
    };

    if (window.YT?.Player) connectPlayer();
    else {
      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        connectPlayer();
      };
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      try {
        player?.destroy?.();
      } catch (_error) {}
    };
  }, [portalTarget]);

  return (
    <>
      <LandingPageLegacy {...props} />
      {portalTarget ? createPortal(<FreeLessonsSection videoId={videoId} />, portalTarget) : null}
    </>
  );
}
