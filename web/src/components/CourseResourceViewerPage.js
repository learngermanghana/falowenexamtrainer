import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { styles } from "../styles";

const MIN_ZOOM = 0.8;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.2;

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

const CourseResourceViewerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(1);

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const resourceUrl = query.get("url") || "";
  const label = query.get("label") || "Course resource";
  const embedUrl = useMemo(() => toEmbeddableUrl(resourceUrl), [resourceUrl]);

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 12 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, margin: 0 }}>{label}: zoom viewer</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Use the + / − controls to zoom when the source document is too small in-app.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <button
            style={styles.secondaryButton}
            onClick={() => setZoom((value) => Math.max(MIN_ZOOM, Number((value - ZOOM_STEP).toFixed(1))))}
          >
            − Zoom out
          </button>
          <button
            style={styles.secondaryButton}
            onClick={() => setZoom((value) => Math.min(MAX_ZOOM, Number((value + ZOOM_STEP).toFixed(1))))}
          >
            + Zoom in
          </button>
          <button style={styles.secondaryButton} onClick={() => setZoom(1)}>
            Reset
          </button>
          <span style={{ fontSize: 13, color: "#334155" }}>Zoom: {Math.round(zoom * 100)}%</span>
          {resourceUrl ? (
            <a href={resourceUrl} target="_blank" rel="noreferrer" style={{ marginLeft: "auto" }}>
              Open original link
            </a>
          ) : null}
        </div>
      </div>

      <section style={{ ...styles.card, display: "grid", gap: 8 }}>
        {embedUrl ? (
          <div style={{ borderRadius: 10, border: "1px solid #e2e8f0", overflow: "auto", maxHeight: "75vh" }}>
            <div style={{ width: `${100 / zoom}%`, transform: `scale(${zoom})`, transformOrigin: "top left" }}>
              <iframe
                title={`${label} resource viewer`}
                src={embedUrl}
                style={{ width: "100%", height: "70vh", border: 0, background: "#fff" }}
                allow="fullscreen"
              />
            </div>
          </div>
        ) : (
          <p style={{ margin: 0 }}>No resource link provided.</p>
        )}
      </section>
    </div>
  );
};

export default CourseResourceViewerPage;
