import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { ZOOM_DETAILS } from "../data/classCatalog";
import { findNextClassSession } from "../services/classCalendar";
import { subscribeCanonicalLiveClass } from "../services/canonicalLiveClassService";
import { findCurrentOrNextSession } from "../utils/courseBookNextClassLogic";
import {
  loadLiveClassSummaryCache,
  saveLiveClassSummaryCache,
} from "../utils/liveClassCardPresentation";
import NextLiveClassCard from "./NextLiveClassCard";

const clean = (value) => String(value ?? "").trim();

const normalizeLegacySession = (session) => session
  ? {
      ...session,
      startsAt: session.startDateTime,
      endsAt: session.endDateTime,
      topic: session.titles?.join("; ") || "Live class",
    }
  : null;

export default function HomeNextClassCard({ className = "", program = "german" }) {
  const { i18n } = useTranslation();
  const normalizedClassName = clean(className);
  const cacheIdentity = useMemo(() => ({ className: normalizedClassName }), [normalizedClassName]);
  const [now, setNow] = useState(() => new Date());
  const [resolution, setResolution] = useState(() => {
    const cached = normalizedClassName ? loadLiveClassSummaryCache(cacheIdentity) : null;
    return {
      identity: normalizedClassName,
      summary: cached || null,
      status: normalizedClassName ? "loading" : "idle",
    };
  });

  useEffect(() => {
    if (!normalizedClassName) {
      setResolution({ identity: "", summary: null, status: "idle" });
      return undefined;
    }

    const cached = loadLiveClassSummaryCache(cacheIdentity);
    setResolution({ identity: normalizedClassName, summary: cached || null, status: "loading" });

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
        console.warn("Homepage next class could not refresh live class data", error);
        setResolution((current) => ({
          identity: normalizedClassName,
          summary: current.identity === normalizedClassName ? current.summary : null,
          status: "error",
        }));
      },
    });
  }, [cacheIdentity, normalizedClassName]);

  useEffect(() => {
    const refresh = () => setNow(new Date());
    const refreshVisible = () => {
      if (!document.hidden) refresh();
    };
    const timer = window.setInterval(refresh, 30000);
    window.addEventListener("focus", refresh);
    window.addEventListener("pageshow", refresh);
    document.addEventListener("visibilitychange", refreshVisible);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("pageshow", refresh);
      document.removeEventListener("visibilitychange", refreshVisible);
    };
  }, []);

  if (!normalizedClassName) return null;

  const currentResolution = resolution.identity === normalizedClassName
    ? resolution
    : { identity: normalizedClassName, summary: null, status: "loading" };
  const summary = currentResolution.summary;
  const canonicalSessions = summary?.sessions || [];
  const canonicalNext = findCurrentOrNextSession(canonicalSessions, now)
    || (!canonicalSessions.length ? summary?.nextSession : null)
    || null;
  const shouldUseLegacySchedule = ["ready", "unavailable", "error"].includes(currentResolution.status);
  const nextSession = canonicalNext || (shouldUseLegacySchedule
    ? normalizeLegacySession(findNextClassSession(normalizedClassName, now))
    : null);

  const fallbackZoom = String(program || "").toLowerCase() === "french" ? {} : ZOOM_DETAILS;
  const canonicalZoom = summary?.zoom || {};
  const hasCanonicalZoomProfile = Boolean(clean(summary?.klass?.zoomProfileId));
  const canonicalLookupCompleted = currentResolution.status === "ready";
  const noCanonicalClass = currentResolution.status === "unavailable";
  const allowLegacyFallback = (canonicalLookupCompleted && !hasCanonicalZoomProfile) || noCanonicalClass;
  const zoom = canonicalLookupCompleted && (canonicalZoom?.url || canonicalZoom?.meetingId || canonicalZoom?.passcode)
    ? canonicalZoom
    : allowLegacyFallback
      ? fallbackZoom
      : {};

  if (nextSession) {
    const displaySummary = summary || {
      klass: { name: normalizedClassName },
      sessions: [nextSession],
    };
    return (
      <NextLiveClassCard
        summary={displaySummary}
        session={nextSession}
        zoom={zoom}
        now={now}
        locale={i18n.language || "en"}
        fullCalendarLink={`/campus/course/full-class-calendar/${encodeURIComponent(normalizedClassName)}`}
        updating={currentResolution.status === "loading"}
      />
    );
  }

  return (
    <section
      aria-label="Next class"
      style={{ ...styles.card, display: "grid", gap: 4, padding: 14, border: "1px solid #bfdbfe", background: "#f8fbff" }}
    >
      <span style={{ ...styles.helperText, margin: 0, fontSize: 12, fontWeight: 800 }}>NEXT CLASS</span>
      <strong>{currentResolution.status === "loading" ? "Checking timetable…" : "No upcoming class"}</strong>
      <span style={{ ...styles.helperText, margin: 0, fontSize: 12 }}>{normalizedClassName}</span>
    </section>
  );
}
