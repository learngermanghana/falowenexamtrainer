import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { styles } from "../styles";
import YouTubeSubscribeButton from "./YouTubeSubscribeButton";

const MIN_ZOOM = 0.8;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.2;
const ZOOM_STORAGE_PREFIX = "course-resource-viewer-zoom";

const LEGACY_SELF_LEARNING_RESOURCE_ROUTES = [
  {
    match: "1D1eb-iwfl_WA2sXPOSPD_66NCiTB4o2w",
    route: "/campus/course/lesson/B2/1",
  },
  {
    match: "17pVc0VfLm32z4zmkaaa_cdshKJEQQxYa",
    route: "/campus/course/lesson/B2/1",
  },
];

const getLegacySelfLearningRoute = (resourceUrl = "") => {
  const found = LEGACY_SELF_LEARNING_RESOURCE_ROUTES.find(({ match }) => String(resourceUrl || "").includes(match));
  return found?.route || "";
};

const toEmbeddableUrl = (resourceUrl) => {
  if (!resourceUrl) return "";

  try {
    const parsed = new URL(resourceUrl);

    if (parsed.hostname.includes("drive.google.com")) {
      const match = parsed.pathname.match(/\/file\/d\/([^/]+)\//);
      if (match?.[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }

    if (parsed.hostname.includes("docs.google.com")) {
      parsed.pathname = parsed.pathname.replace(/\/(edit|view)$/, "/preview");
      return parsed.toString();
    }

    return parsed.toString();
  } catch (error) {
    return resourceUrl;
  }
};

const inferAssignmentKeyFromWorkbookUrl = (resourceUrl) => {
  if (!resourceUrl) return "";
  const normalizedUrl = String(resourceUrl).toLowerCase();
  const levelDayMatch = normalizedUrl.match(/\/([abc]\d)-day-(\d+)-/i);
  if (!levelDayMatch) return "";
  const level = levelDayMatch[1].toUpperCase();
  const day = Number(levelDayMatch[2]);
  if (!Number.isFinite(day)) return "";

  const chapterMatch = normalizedUrl.match(/(?:kapitel|chapter)-(\d+)-(\d+)/i);
  if (chapterMatch) {
    return `${level}-${Number(chapterMatch[1])}.${Number(chapterMatch[2])}`;
  }

  return `${level}-DAY-${day}`;
};

const CourseResourceViewerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(1);
  const [embedLoaded, setEmbedLoaded] = useState(false);
  const [embedError, setEmbedError] = useState(false);
  const touchStateRef = useRef({ lastTapTs: 0, initialDistance: null, startZoom: 1 });

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const resourceUrl = query.get("url") || "";
  const label = query.get("label") || "Course resource";
  const legacySelfLearningRoute = useMemo(() => getLegacySelfLearningRoute(resourceUrl), [resourceUrl]);
  const inferredAssignmentKey = useMemo(() => inferAssignmentKeyFromWorkbookUrl(resourceUrl), [resourceUrl]);
  const embedUrl = useMemo(() => toEmbeddableUrl(resourceUrl), [resourceUrl]);
  const zoomStorageKey = `${ZOOM_STORAGE_PREFIX}:${resourceUrl || "default"}`;
  const submitPath = inferredAssignmentKey
    ? `/campus/submit?assignmentKey=${encodeURIComponent(inferredAssignmentKey)}&assignmentId=${encodeURIComponent(inferredAssignmentKey)}`
    : "/campus/submit";
  const campusQuickTabs = [
    { key: "course", label: "My Course", path: "/campus/course" },
    { key: "submit", label: "Submit", path: submitPath },
    { key: "examFile", label: "My Exam File", path: "/campus/examFile" },
    { key: "results", label: "Results", path: "/campus/results" },
    { key: "discussion", label: "Discussion", path: "/campus/discussion" },
    { key: "account", label: "Account", path: "/campus/account" },
  ];

  useEffect(() => {
    if (legacySelfLearningRoute) {
      navigate(legacySelfLearningRoute, { replace: true });
    }
  }, [legacySelfLearningRoute, navigate]);

  useEffect(() => {
    const stored = window.sessionStorage.getItem(zoomStorageKey);
    const parsed = stored ? Number(stored) : NaN;
    if (Number.isFinite(parsed)) {
      setZoom(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, parsed)));
    } else {
      setZoom(1);
    }
  }, [zoomStorageKey]);

  useEffect(() => {
    window.sessionStorage.setItem(zoomStorageKey, String(zoom));
  }, [zoom, zoomStorageKey]);

  useEffect(() => {
    if (!embedUrl || embedLoaded) return undefined;

    const timeout = window.setTimeout(() => {
      setEmbedError(true);
    }, 8000);

    return () => window.clearTimeout(timeout);
  }, [embedLoaded, embedUrl]);

  const updateZoom = (nextZoom) => {
    setZoom(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(nextZoom.toFixed(2)))));
  };

  const onTouchStart = (event) => {
    if (event.touches.length === 2) {
      const [a, b] = event.touches;
      touchStateRef.current.initialDistance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      touchStateRef.current.startZoom = zoom;
      return;
    }

    if (event.touches.length === 1) {
      const now = Date.now();
      if (now - touchStateRef.current.lastTapTs < 300) {
        updateZoom(zoom > 1 ? 1 : 1.6);
      }
      touchStateRef.current.lastTapTs = now;
    }
  };

  const onTouchMove = (event) => {
    if (event.touches.length !== 2) return;

    const [a, b] = event.touches;
    const currentDistance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    const initialDistance = touchStateRef.current.initialDistance;
    if (!initialDistance) return;

    const scale = currentDistance / initialDistance;
    updateZoom(touchStateRef.current.startZoom * scale);
  };

  if (legacySelfLearningRoute) {
    return (
      <div style={{ ...styles.container, display: "grid", gap: 16 }}>
        <div style={styles.card}>
          <h1 style={{ marginTop: 0 }}>Opening updated self-learning lesson…</h1>
          <p style={{ marginBottom: 12 }}>This old workbook link has been replaced by the new guided B2 Day 1 lesson.</p>
          <button type="button" style={styles.primaryButton} onClick={() => navigate(legacySelfLearningRoute, { replace: true })}>
            Open B2 Day 1 lesson
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 12 }}>
        <div style={{ ...styles.nav, justifyContent: "flex-start" }}>
          {campusQuickTabs.map((tab) => (
            <button
              key={tab.key}
              style={tab.key === "course" ? styles.navButtonActive : styles.navButton}
              onClick={() => navigate(tab.path)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <YouTubeSubscribeButton />
        <h1 style={{ ...styles.title, margin: 0 }}>{label}: zoom viewer</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Use the + / − controls to zoom when the source document is too small in-app.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <button
            style={styles.secondaryButton}
            onClick={() => updateZoom(zoom - ZOOM_STEP)}
          >
            − Zoom out
          </button>
          <button
            style={styles.secondaryButton}
            onClick={() => updateZoom(zoom + ZOOM_STEP)}
          >
            + Zoom in
          </button>
          <button style={styles.secondaryButton} onClick={() => updateZoom(1)}>
            Reset
          </button>
          <span style={{ fontSize: 13, color: "#334155" }}>Zoom: {Math.round(zoom * 100)}%</span>
          {resourceUrl ? (
            <p style={{ margin: "0 0 0 auto", fontSize: 13, color: "#334155" }}>
              To view this document full screen, click{" "}
              <a href={resourceUrl} target="_blank" rel="noreferrer">
                this link
              </a>
              .
            </p>
          ) : null}
        </div>
      </div>

      <section style={{ ...styles.card, display: "grid", gap: 8 }}>
        {embedUrl ? (
          <div
            style={{ borderRadius: 10, border: "1px solid #e2e8f0", overflow: "auto", maxHeight: "75vh", position: "relative" }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
          >
            <div style={{ width: `${100 / zoom}%`, transform: `scale(${zoom})`, transformOrigin: "top left" }}>
              <iframe
                title={`${label} resource viewer`}
                src={embedUrl}
                style={{ width: "100%", height: "70vh", border: 0, background: "#fff" }}
                allow="fullscreen"
                onLoad={() => {
                  setEmbedLoaded(true);
                  setEmbedError(false);
                }}
                onError={() => setEmbedError(true)}
              />
            </div>
            <div
              style={{
                position: "fixed",
                right: 16,
                bottom: 16,
                display: "flex",
                gap: 6,
                padding: 8,
                borderRadius: 999,
                background: "rgba(255,255,255,0.95)",
                border: "1px solid #e2e8f0",
              }}
            >
              <button style={styles.secondaryButton} onClick={() => updateZoom(zoom - ZOOM_STEP)}>
                −
              </button>
              <button style={styles.secondaryButton} onClick={() => updateZoom(zoom + ZOOM_STEP)}>
                +
              </button>
            </div>
          </div>
        ) : (
          <p style={{ margin: 0 }}>No resource link provided.</p>
        )}

        {embedError && resourceUrl ? (
          <div style={{ ...styles.card, marginBottom: 0 }}>
            <p style={{ marginTop: 0 }}>Preview unavailable in app for this source.</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <a href={resourceUrl} target="_blank" rel="noreferrer">
                Open original link
              </a>
              <button
                type="button"
                style={styles.secondaryButton}
                onClick={() => navigator.clipboard?.writeText(resourceUrl)}
              >
                Copy link
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default CourseResourceViewerPage;
