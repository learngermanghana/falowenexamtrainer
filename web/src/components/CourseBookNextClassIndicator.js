import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NextLiveClassCard from "./NextLiveClassCard";
import { findNextClassSession } from "../services/classCalendar";
import { subscribeCanonicalLiveClass } from "../services/canonicalLiveClassService";
import {
  COURSE_BOOK_NEXT_CLASS_SLOT_ATTRIBUTE,
  findCourseBookStatGrid,
  findCurrentOrNextSession,
  findOrCreateCourseBookNextClassMount,
  formatClassCountdown,
  resolveLevel,
} from "../utils/courseBookNextClassLogic";
import {
  loadLiveClassSummaryCache,
  saveLiveClassSummaryCache,
} from "../utils/liveClassCardPresentation";

export {
  findCourseBookStatGrid,
  findCurrentOrNextSession,
  findOrCreateCourseBookNextClassMount,
  formatClassCountdown,
  resolveLevel,
} from "../utils/courseBookNextClassLogic";

const COURSE_BOOK_PATH = "/campus/course";
const SELF_LEARNING_LEVELS = new Set(["B2", "C1"]);

const normalizeLegacySession = (session) => session
  ? {
      ...session,
      startsAt: session.startDateTime,
      endsAt: session.endDateTime,
      topic: session.titles?.join("; ") || "Live class",
    }
  : null;

const CourseBookNextClassIndicator = () => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const { studentProfile } = useAuth();

  const className = String(studentProfile?.className || "").trim();
  const classId = String(
    studentProfile?.classId || studentProfile?.classRecordId || studentProfile?.assignedClassId || ""
  ).trim();
  const level = resolveLevel(studentProfile);
  const isSelfLearning = SELF_LEARNING_LEVELS.has(level);
  const isCourseBook = location.pathname.replace(/\/+$/, "") === COURSE_BOOK_PATH;
  const cacheIdentity = useMemo(() => ({ classId, className }), [classId, className]);

  const [portalTarget, setPortalTarget] = useState(null);
  const [canonicalStatus, setCanonicalStatus] = useState("idle");
  const [canonicalSummary, setCanonicalSummary] = useState(() => loadLiveClassSummaryCache(cacheIdentity));
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!isCourseBook) {
      setPortalTarget(null);
      return undefined;
    }

    let standaloneMount = null;
    const resolveTarget = () => {
      const target = findOrCreateCourseBookNextClassMount(document, level);
      if (target?.getAttribute?.(COURSE_BOOK_NEXT_CLASS_SLOT_ATTRIBUTE) === "true") {
        standaloneMount = target;
      }
      setPortalTarget(target);
    };
    resolveTarget();
    const observer = new MutationObserver(resolveTarget);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      if (standaloneMount?.parentNode) standaloneMount.parentNode.removeChild(standaloneMount);
    };
  }, [isCourseBook, level]);

  useEffect(() => {
    if (!isCourseBook) return undefined;

    const refreshNow = () => setNow(new Date());
    const refreshWhenVisible = () => {
      if (!document.hidden) refreshNow();
    };

    refreshNow();
    const timer = window.setInterval(refreshNow, 30000);
    window.addEventListener("focus", refreshNow);
    window.addEventListener("pageshow", refreshNow);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refreshNow);
      window.removeEventListener("pageshow", refreshNow);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [isCourseBook]);

  useEffect(() => {
    if (!isCourseBook || isSelfLearning || (!className && !classId)) {
      setCanonicalStatus("unavailable");
      return undefined;
    }

    const cached = loadLiveClassSummaryCache(cacheIdentity);
    if (cached) setCanonicalSummary(cached);
    setCanonicalStatus("loading");
    return subscribeCanonicalLiveClass({
      classId,
      className,
      onChange: (summary) => {
        setCanonicalSummary(summary);
        saveLiveClassSummaryCache(cacheIdentity, summary);
        setCanonicalStatus("ready");
      },
      onUnavailable: () => setCanonicalStatus(cached ? "cached" : "unavailable"),
      onError: (error) => {
        console.warn("Course Book next-class indicator could not load the live schedule", error);
        setCanonicalStatus(cached ? "cached" : "unavailable");
      },
    });
  }, [cacheIdentity, classId, className, isCourseBook, isSelfLearning]);

  const nextSession = useMemo(() => {
    if (isSelfLearning) return null;
    const canonicalSessions = canonicalSummary?.sessions || [];
    const canonicalNext = findCurrentOrNextSession(canonicalSessions, now)
      || (!canonicalSessions.length ? canonicalSummary?.nextSession : null)
      || null;
    if (canonicalNext) return canonicalNext;
    return normalizeLegacySession(findNextClassSession(className, now));
  }, [canonicalSummary, className, isSelfLearning, now]);

  if (!isCourseBook || !portalTarget) return null;

  const locale = i18n.language || "en";
  const fullCalendarLink = `/campus/course/full-class-calendar/${encodeURIComponent(className)}`;
  const displaySummary = canonicalSummary || {
    klass: { name: className || "Your class", levelId: level },
    sessions: nextSession ? [nextSession] : [],
  };
  const standalone = portalTarget.getAttribute?.(COURSE_BOOK_NEXT_CLASS_SLOT_ATTRIBUTE) === "true";

  return createPortal(
    nextSession ? (
      <NextLiveClassCard
        summary={displaySummary}
        session={nextSession}
        zoom={canonicalSummary?.zoom || {}}
        now={now}
        locale={locale}
        fullCalendarLink={fullCalendarLink}
        compact={!standalone}
        updating={canonicalStatus === "loading" || canonicalStatus === "cached"}
      />
    ) : (
      <div
        data-falowen-next-class-indicator="true"
        style={{
          border: standalone ? "1px solid #bfdbfe" : "1px solid rgba(255,255,255,0.28)",
          background: standalone
            ? "linear-gradient(145deg, #eff6ff 0%, #ffffff 62%, #eef2ff 100%)"
            : "rgba(255,255,255,0.16)",
          borderRadius: 16,
          padding: 12,
          backdropFilter: "blur(8px)",
          boxShadow: standalone ? "0 12px 28px rgba(37,99,235,0.10)" : undefined,
          order: standalone ? undefined : -1,
          display: "grid",
          gap: 4,
          minWidth: 0,
        }}
      >
        <p style={{ margin: 0, color: standalone ? "#1d4ed8" : "#bfdbfe", fontSize: 12, fontWeight: 700 }}>Next class</p>
        <p style={{ margin: "4px 0 0", color: standalone ? "#0f172a" : "#ffffff", fontSize: 17, fontWeight: 900, lineHeight: 1.2 }}>
          {isSelfLearning
            ? "Self-learning course"
            : canonicalStatus === "loading"
              ? "Checking schedule…"
              : className
                ? "No upcoming class"
                : "No class assigned"}
        </p>
        <p style={{ margin: 0, color: standalone ? "#475569" : "#dbeafe", fontSize: 12, lineHeight: 1.4 }}>
          {isSelfLearning ? "No live class is required" : className || "Ask the school to assign your class"}
        </p>
        {!isSelfLearning && className ? <a href={fullCalendarLink} style={{ color: standalone ? "#1d4ed8" : "#ffffff", width: "fit-content", marginTop: 3, fontSize: 12 }}>View class calendar</a> : null}
      </div>
    ),
    portalTarget,
  );
};

export default CourseBookNextClassIndicator;
