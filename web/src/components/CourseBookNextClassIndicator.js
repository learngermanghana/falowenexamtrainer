import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles";
import { findNextClassSession } from "../services/classCalendar";
import { subscribeCanonicalLiveClass } from "../services/canonicalLiveClassService";
import { GHANA_TIMEZONE, getGhanaDeviceTimeNotice } from "../utils/ghanaClassTime";

const COURSE_BOOK_PATH = "/campus/course";
const CANCELLED_STATUS = "cancelled";
const COMPLETED_STATUS = "completed";
const SELF_LEARNING_LEVELS = new Set(["B2", "C1"]);

const normalizeText = (value = "") => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();

const asDate = (value) => {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  if (typeof value?.seconds === "number") return new Date(value.seconds * 1000);
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const resolveLevel = (studentProfile = {}) => {
  const profile = studentProfile || {};
  const source = `${profile.level || ""} ${profile.classLevel || ""} ${profile.className || ""}`.toUpperCase();
  return source.match(/\b(A1|A2|B1|B2|C1|C2)\b/)?.[1] || "";
};

export const findCourseBookStatGrid = (root = document) => {
  if (!root?.querySelectorAll) return null;
  const heading = Array.from(root.querySelectorAll("h2")).find(
    (element) => normalizeText(element.textContent) === "course book"
  );
  const hero = heading?.closest("section");
  if (!hero) return null;

  const lessonsLabel = Array.from(hero.querySelectorAll("p")).find(
    (element) => normalizeText(element.textContent) === "lessons"
  );
  return lessonsLabel?.parentElement?.parentElement || null;
};

const sessionStatus = (session = {}) => normalizeText(session.status || "scheduled");

const sessionStart = (session = {}) => asDate(session.startsAt || session.startDateTime);
const sessionEnd = (session = {}) => asDate(session.endsAt || session.endDateTime);

export const findCurrentOrNextSession = (sessions = [], now = new Date()) => {
  const nowMs = now.getTime();
  return [...sessions]
    .filter((session) => {
      const status = sessionStatus(session);
      if (status === CANCELLED_STATUS || status === COMPLETED_STATUS) return false;
      const start = sessionStart(session)?.getTime() || 0;
      const end = sessionEnd(session)?.getTime() || 0;
      if (end && end < nowMs) return false;
      if (status === "live") return true;
      return Boolean(start && (start >= nowMs || end >= nowMs));
    })
    .sort((left, right) => (sessionStart(left)?.getTime() || 0) - (sessionStart(right)?.getTime() || 0))[0] || null;
};

export const formatClassCountdown = (session, now = new Date()) => {
  const start = sessionStart(session);
  if (!start) return "Schedule unavailable";
  const end = sessionEnd(session);
  const nowMs = now.getTime();
  const startMs = start.getTime();
  const endMs = end?.getTime() || startMs + 2 * 60 * 60 * 1000;

  if (nowMs > endMs) return "Class has ended";
  if (sessionStatus(session) === "live" || (nowMs >= startMs && nowMs <= endMs)) {
    return "Class is live now";
  }

  const totalMinutes = Math.max(0, Math.ceil((startMs - nowMs) / 60000));
  if (totalMinutes === 0) return "Starting now";
  if (totalMinutes < 60) return `Starts in ${totalMinutes} minute${totalMinutes === 1 ? "" : "s"}`;

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  if (totalHours < 24) {
    const hoursLabel = `${totalHours} hour${totalHours === 1 ? "" : "s"}`;
    const minutesLabel = remainingMinutes
      ? ` ${remainingMinutes} minute${remainingMinutes === 1 ? "" : "s"}`
      : "";
    return `Starts in ${hoursLabel}${minutesLabel}`;
  }

  const days = Math.floor(totalHours / 24);
  const remainingHours = totalHours % 24;
  const daysLabel = `${days} day${days === 1 ? "" : "s"}`;
  const hoursLabel = remainingHours
    ? ` ${remainingHours} hour${remainingHours === 1 ? "" : "s"}`
    : "";
  return `Starts in ${daysLabel}${hoursLabel}`;
};

const formatSessionDateTime = (session, locale = "en") => {
  const start = sessionStart(session);
  if (!start) return "Date and time not available";
  const isEnglish = String(locale || "en").toLowerCase().startsWith("en");
  const resolvedLocale = isEnglish ? "en-GB" : locale;
  const date = new Intl.DateTimeFormat(resolvedLocale, {
    timeZone: GHANA_TIMEZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(start);
  const time = new Intl.DateTimeFormat(resolvedLocale, {
    timeZone: GHANA_TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: isEnglish,
  }).format(start);
  return `${date} · ${time} Ghana time`;
};

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
  const [portalTarget, setPortalTarget] = useState(null);
  const [canonicalStatus, setCanonicalStatus] = useState("idle");
  const [canonicalSummary, setCanonicalSummary] = useState(null);
  const [now, setNow] = useState(() => new Date());

  const className = String(studentProfile?.className || "").trim();
  const classId = String(
    studentProfile?.classId || studentProfile?.classRecordId || studentProfile?.assignedClassId || ""
  ).trim();
  const level = resolveLevel(studentProfile);
  const isSelfLearning = SELF_LEARNING_LEVELS.has(level);
  const isCourseBook = location.pathname.replace(/\/+$/, "") === COURSE_BOOK_PATH;

  useEffect(() => {
    if (!isCourseBook) {
      setPortalTarget(null);
      return undefined;
    }

    const resolveTarget = () => setPortalTarget(findCourseBookStatGrid(document));
    resolveTarget();
    const observer = new MutationObserver(resolveTarget);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [isCourseBook]);

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
    setCanonicalSummary(null);
    if (!isCourseBook || isSelfLearning || (!className && !classId)) {
      setCanonicalStatus("unavailable");
      return undefined;
    }

    setCanonicalStatus("loading");
    return subscribeCanonicalLiveClass({
      classId,
      className,
      onChange: (summary) => {
        setCanonicalSummary(summary);
        setCanonicalStatus("ready");
      },
      onUnavailable: () => setCanonicalStatus("unavailable"),
      onError: (error) => {
        console.warn("Course Book next-class indicator could not load the live schedule", error);
        setCanonicalStatus("unavailable");
      },
    });
  }, [classId, className, isCourseBook, isSelfLearning]);

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
  const countdown = nextSession
    ? formatClassCountdown(nextSession, now)
    : isSelfLearning
      ? "Self-learning course"
      : canonicalStatus === "loading"
        ? "Checking schedule…"
        : className
          ? "No upcoming class"
          : "No class assigned";
  const detail = nextSession
    ? formatSessionDateTime(nextSession, locale)
    : isSelfLearning
      ? "No live class is required"
      : className || "Ask the school to assign your class";
  const fullCalendarLink = `/campus/course/full-class-calendar/${encodeURIComponent(className)}`;
  const isLive = countdown === "Class is live now";
  const timeZoneNotice = getGhanaDeviceTimeNotice(now, locale);

  return createPortal(
    <div
      data-falowen-next-class-indicator="true"
      style={{
        border: "1px solid rgba(255,255,255,0.28)",
        background: isLive ? "rgba(220,252,231,0.22)" : "rgba(255,255,255,0.16)",
        borderRadius: 16,
        padding: 12,
        backdropFilter: "blur(8px)",
        order: -1,
        display: "grid",
        gap: 4,
        minWidth: 0,
      }}
    >
      <p style={{ margin: 0, color: "#bfdbfe", fontSize: 12, fontWeight: 700 }}>Next class</p>
      <p style={{ margin: "4px 0 0", color: "#ffffff", fontSize: 17, fontWeight: 900, lineHeight: 1.2 }}>
        {countdown}
      </p>
      <p style={{ margin: 0, color: "#dbeafe", fontSize: 12, lineHeight: 1.4 }}>{detail}</p>
      {timeZoneNotice ? (
        <p style={{ margin: "4px 0 0", color: "#fef3c7", fontSize: 11, lineHeight: 1.35, fontWeight: 700 }}>
          {timeZoneNotice.message}
        </p>
      ) : null}
      {!isSelfLearning && className ? (
        <a
          href={fullCalendarLink}
          style={{ ...styles.backTextLink, color: "#ffffff", width: "fit-content", marginTop: 3, fontSize: 12 }}
        >
          View class calendar
        </a>
      ) : null}
    </div>,
    portalTarget,
  );
};

export default CourseBookNextClassIndicator;
