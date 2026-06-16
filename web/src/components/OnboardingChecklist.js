import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { LESSON_VIDEO_DICTIONARY } from "../data/lessonVideoDictionary";
import { detectLevelKey } from "../lib/day0Workbook";
import { useToast } from "../context/ToastContext";
import {
  getPublicFunnelContext,
  trackPublicFunnelEvent,
} from "../lib/publicFunnelTracking";

const getYouTubeId = (url = "") => {
  const match = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^?&/]+)/i);
  return match?.[1] || "";
};

const Step = ({ number, title, description }) => (
  <li style={{ display: "grid", gridTemplateColumns: "42px minmax(0, 1fr)", gap: 12, alignItems: "start" }}>
    <span
      style={{
        width: 38,
        height: 38,
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#dbeafe",
        color: "#1e40af",
        fontWeight: 900,
      }}
    >
      {number}
    </span>
    <div style={{ display: "grid", gap: 3 }}>
      <strong>{title}</strong>
      <span style={{ ...styles.helperText, lineHeight: 1.55 }}>{description}</span>
    </div>
  </li>
);

const OnboardingChecklist = ({ studentProfile, onSaveOnboarding }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [watchedVideo, setWatchedVideo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const level = detectLevelKey(studentProfile);
  const video = useMemo(() => LESSON_VIDEO_DICTIONARY?.[level]?.[0]?.videoResources?.[0] || null, [level]);
  const videoId = getYouTubeId(video?.url);

  useEffect(() => {
    const context = getPublicFunnelContext();
    if (!context.sessionId && !context.source && !context.video) return;
    trackPublicFunnelEvent("onboarding_view", { level, onboardingVideo: videoId });
  }, [level, videoId]);

  const openDashboard = async () => {
    if (!watchedVideo) {
      showToast("Please watch the short welcome video first.", "info");
      return;
    }

    setSaving(true);
    setSaveError("");
    try {
      await onSaveOnboarding?.();
      trackPublicFunnelEvent("onboarding_completed", { level, onboardingVideo: videoId });
      showToast("Welcome to Falowen. Your dashboard is ready.", "success");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Failed to save onboarding", error);
      setSaveError("We could not open your dashboard yet. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="onboarding-page">
      <section className="onboarding-focus-card">
        <div className="onboarding-intro">
          <span style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e40af" }}>
            Welcome to Falowen{level ? ` · ${level}` : ""}
          </span>
          <h1 style={{ margin: 0, fontSize: "clamp(28px, 5vw, 42px)", lineHeight: 1.12 }}>Watch this before your dashboard opens</h1>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.7, fontSize: 17 }}>
            This short introduction shows you where to learn, how to complete your work, and where to get help. There are no other buttons here, so you can focus on these easy steps first.
          </p>
        </div>

        {videoId ? (
          <div className="onboarding-video">
            <iframe
              title={video?.title || "Falowen welcome video"}
              src={`https://www.youtube-nocookie.com/embed/${videoId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="onboarding-video-placeholder">
            <span aria-hidden style={{ fontSize: 38 }}>▶️</span>
            <strong>Your welcome video is being prepared.</strong>
            <span style={styles.helperText}>Read the easy steps below, then confirm that you are ready.</span>
          </div>
        )}

        <section className="onboarding-steps" aria-labelledby="easy-steps-title">
          <h2 id="easy-steps-title" style={{ margin: 0 }}>Your 3 easy steps</h2>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 16 }}>
            <Step number="1" title="Open Campus" description="Follow your course in order and start with the next lesson shown to you." />
            <Step number="2" title="Complete and submit your work" description="Use the lesson instructions, finish the workbook, and submit assignments when requested." />
            <Step number="3" title="Check feedback and ask for help" description="Return to your dashboard to see results, class access, and support whenever you need it." />
          </ol>
        </section>

        <label className="onboarding-confirmation">
          <input type="checkbox" checked={watchedVideo} onChange={(event) => setWatchedVideo(event.target.checked)} />
          <span>
            <strong>{videoId ? "I watched the video and understand the easy steps." : "I read and understand the easy steps."}</strong>
            <small>Your dashboard will open after you confirm.</small>
          </span>
        </label>

        <button type="button" className="onboarding-open-dashboard" onClick={openDashboard} disabled={!watchedVideo || saving}>
          {saving ? "Opening dashboard..." : "Open my dashboard"}
        </button>
        {saveError ? <p style={{ margin: 0, color: "#b91c1c", textAlign: "center" }}>{saveError}</p> : null}
      </section>
    </div>
  );
};

export default OnboardingChecklist;
