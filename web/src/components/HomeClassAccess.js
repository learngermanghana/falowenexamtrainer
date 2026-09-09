import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { ZOOM_DETAILS } from "../data/classCatalog";
import { subscribeCanonicalLiveClass } from "../services/canonicalLiveClassService";
import {
  loadLiveClassSummaryCache,
  saveLiveClassSummaryCache,
} from "../utils/liveClassCardPresentation";

const clean = (value) => String(value ?? "").trim();

const HomeClassAccess = ({ className = "", program = "german" }) => {
  const normalizedClassName = clean(className);
  const cacheIdentity = useMemo(() => ({ className: normalizedClassName }), [normalizedClassName]);
  const [resolution, setResolution] = useState(() => {
    const cached = normalizedClassName ? loadLiveClassSummaryCache(cacheIdentity) : null;
    return {
      identity: normalizedClassName,
      summary: cached || null,
      status: normalizedClassName ? (cached ? "ready" : "loading") : "idle",
    };
  });

  useEffect(() => {
    if (!normalizedClassName) {
      setResolution({ identity: "", summary: null, status: "idle" });
      return undefined;
    }

    const cached = loadLiveClassSummaryCache(cacheIdentity);
    setResolution({
      identity: normalizedClassName,
      summary: cached || null,
      status: cached ? "ready" : "loading",
    });

    return subscribeCanonicalLiveClass({
      className: normalizedClassName,
      onChange: (nextSummary) => {
        setResolution({ identity: normalizedClassName, summary: nextSummary, status: "ready" });
        saveLiveClassSummaryCache(cacheIdentity, nextSummary);
      },
      onUnavailable: () => {
        setResolution({ identity: normalizedClassName, summary: null, status: "unavailable" });
      },
      onError: (error) => {
        console.warn("Compact class access could not refresh live class data", error);
        setResolution((current) => {
          if (current.identity === normalizedClassName && current.summary) return current;
          return { identity: normalizedClassName, summary: null, status: "error" };
        });
      },
    });
  }, [cacheIdentity, normalizedClassName]);

  if (!normalizedClassName) return null;

  const currentResolution = resolution.identity === normalizedClassName
    ? resolution
    : { identity: normalizedClassName, summary: null, status: "loading" };
  const summary = currentResolution.summary;
  const fallbackZoom = String(program || "").toLowerCase() === "french" ? {} : ZOOM_DETAILS;
  const canonicalZoom = summary?.zoom || {};
  const hasCanonicalZoomProfile = Boolean(clean(summary?.klass?.zoomProfileId));
  const canonicalLookupCompleted = currentResolution.status === "ready";
  const noCanonicalClass = currentResolution.status === "unavailable";
  const allowLegacyFallback = (canonicalLookupCompleted && !hasCanonicalZoomProfile) || noCanonicalClass;
  const zoom = canonicalZoom?.url
    ? canonicalZoom
    : allowLegacyFallback
      ? fallbackZoom
      : canonicalZoom;

  const zoomUrl = clean(zoom?.url);
  const meetingId = clean(zoom?.meetingId);
  const passcode = clean(zoom?.passcode);
  const hasZoomDetails = Boolean(zoomUrl || meetingId || passcode);

  if (!hasZoomDetails && currentResolution.status === "loading") {
    return (
      <section
        aria-label="Live class Zoom access"
        style={{ ...styles.card, padding: 14, border: "1px solid #bfdbfe", background: "#f8fbff" }}
      >
        <span style={{ ...styles.helperText, margin: 0, fontSize: 12 }}>Live class</span>
        <strong style={{ display: "block", marginTop: 3 }}>{normalizedClassName}</strong>
        <span style={{ ...styles.helperText, display: "block", marginTop: 3, fontSize: 12 }}>
          Checking the correct Zoom room…
        </span>
      </section>
    );
  }

  if (!hasZoomDetails && (currentResolution.status === "error" || hasCanonicalZoomProfile)) {
    return (
      <section
        aria-label="Live class Zoom access"
        style={{ ...styles.card, padding: 14, border: "1px solid #bfdbfe", background: "#f8fbff" }}
      >
        <span style={{ ...styles.helperText, margin: 0, fontSize: 12 }}>Live class</span>
        <strong style={{ display: "block", marginTop: 3 }}>{normalizedClassName}</strong>
        <span style={{ ...styles.helperText, display: "block", marginTop: 3, fontSize: 12 }}>
          Zoom details are temporarily unavailable. Please try again shortly.
        </span>
      </section>
    );
  }

  if (!hasZoomDetails) return null;

  return (
    <section
      aria-label="Live class Zoom access"
      style={{
        ...styles.card,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        flexWrap: "wrap",
        padding: 14,
        border: "1px solid #bfdbfe",
        background: "#f8fbff",
      }}
    >
      <div style={{ display: "grid", gap: 3, minWidth: 0 }}>
        <span style={{ ...styles.helperText, margin: 0, fontSize: 12 }}>Live class</span>
        <strong>{normalizedClassName || summary?.klass?.name || "Zoom access"}</strong>
        {meetingId || passcode ? (
          <span style={{ ...styles.helperText, margin: 0, fontSize: 12 }}>
            {meetingId ? `Meeting ID: ${meetingId}` : ""}
            {meetingId && passcode ? " · " : ""}
            {passcode ? `Passcode: ${passcode}` : ""}
          </span>
        ) : null}
      </div>

      {zoomUrl ? (
        <a
          href={zoomUrl}
          target="_blank"
          rel="noreferrer"
          style={{ ...styles.primaryButton, width: "fit-content", textDecoration: "none", whiteSpace: "nowrap" }}
        >
          Join Zoom
        </a>
      ) : null}
    </section>
  );
};

export default HomeClassAccess;
