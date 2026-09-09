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
  const [summary, setSummary] = useState(() =>
    normalizedClassName ? loadLiveClassSummaryCache(cacheIdentity) : null
  );

  useEffect(() => {
    if (!normalizedClassName) return undefined;

    const cached = loadLiveClassSummaryCache(cacheIdentity);
    if (cached) setSummary(cached);

    return subscribeCanonicalLiveClass({
      className: normalizedClassName,
      onChange: (nextSummary) => {
        setSummary(nextSummary);
        saveLiveClassSummaryCache(cacheIdentity, nextSummary);
      },
      onUnavailable: () => {},
      onError: (error) => {
        console.warn("Compact class access could not refresh live class data", error);
      },
    });
  }, [cacheIdentity, normalizedClassName]);

  const fallbackZoom = String(program || "").toLowerCase() === "french" ? {} : ZOOM_DETAILS;
  const canonicalZoom = summary?.zoom || {};
  const zoom = canonicalZoom?.url
    ? canonicalZoom
    : summary?.klass?.zoomProfileId
      ? canonicalZoom
      : fallbackZoom;

  const zoomUrl = clean(zoom?.url);
  const meetingId = clean(zoom?.meetingId);
  const passcode = clean(zoom?.passcode);

  if (!zoomUrl && !meetingId && !passcode) return null;

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
