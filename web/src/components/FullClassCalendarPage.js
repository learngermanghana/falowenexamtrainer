import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";
import { classCatalog } from "../data/classCatalog";
import { courseSchedulesByName } from "../data/courseSchedules";
import { subscribeCanonicalLiveClass } from "../services/canonicalLiveClassService";
import {
  GHANA_TIMEZONE,
  asLiveClassDate,
  liveClassAssignmentLabel,
  liveClassCleanTitle,
  liveClassLessonLabel,
  liveClassLessonLink,
  liveClassLevel,
  liveClassSessionStatus,
} from "../utils/liveClassCardPresentation";

const INACTIVE_SESSION_STATUSES = new Set(["cancelled", "superseded", "deleted"]);

const parseDate = (value) => {
  const canonical = asLiveClassDate(value);
  if (canonical) return canonical;
  const raw = String(value || "").trim();
  if (!raw) return null;
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(raw)
    ? new Date(`${raw}T00:00:00`)
    : new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDate = (value, locale = "en") => {
  const date = parseDate(value);
  if (!date) return "—";
  return new Intl.DateTimeFormat(locale, {
    timeZone: GHANA_TIMEZONE,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const formatTime = (value, locale = "en") => {
  const date = parseDate(value);
  if (!date) return "—";
  return new Intl.DateTimeFormat(locale, {
    timeZone: GHANA_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

const sessionTimestamp = (session = {}) => asLiveClassDate(session.startsAt)?.getTime() || 0;

const isActiveSessionRecord = (session = {}) => {
  const status = String(session.status || session.sessionStatus || "scheduled").trim().toLowerCase();
  return !INACTIVE_SESSION_STATUSES.has(status) && session.superseded !== true && session.isSuperseded !== true;
};

const timetableActionStyle = {
  ...styles.secondaryButton,
  minHeight: 40,
  width: "fit-content",
  borderRadius: 11,
  padding: "9px 13px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  fontWeight: 800,
  textDecoration: "none",
};

const statusBadgeStyle = (status) => {
  if (status === "Live now") return { ...styles.badge, background: "#dcfce7", color: "#166534" };
  if (status === "Today") return { ...styles.badge, background: "#fef3c7", color: "#92400e" };
  if (status === "Completed") return { ...styles.badge, background: "#f1f5f9", color: "#475569" };
  return { ...styles.badge, background: "#dbeafe", color: "#1e40af" };
};

const FullClassCalendarPage = () => {
  const { className: encodedClassName = "" } = useParams();
  const className = useMemo(() => {
    try {
      return decodeURIComponent(encodedClassName);
    } catch (error) {
      return encodedClassName;
    }
  }, [encodedClassName]);

  const [now, setNow] = useState(() => new Date());
  const [resolution, setResolution] = useState(() => ({
    identity: className,
    summary: null,
    status: className ? "loading" : "idle",
  }));

  useEffect(() => {
    if (!className) {
      setResolution({ identity: "", summary: null, status: "idle" });
      return undefined;
    }

    setResolution({ identity: className, summary: null, status: "loading" });
    return subscribeCanonicalLiveClass({
      className,
      onChange: (summary) => {
        setResolution({ identity: className, summary, status: "ready" });
      },
      onUnavailable: () => {
        setResolution({ identity: className, summary: null, status: "unavailable" });
      },
      onError: (error) => {
        console.warn("Full class timetable could not refresh canonical class data", error);
        setResolution((current) => ({
          identity: className,
          summary: current.identity === className ? current.summary : null,
          status: "error",
        }));
      },
    });
  }, [className]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const currentResolution = resolution.identity === className
    ? resolution
    : { identity: className, summary: null, status: "loading" };
  const summary = currentResolution.summary;
  const canonicalSessions = useMemo(
    () => [...(summary?.sessions || [])]
      .filter(isActiveSessionRecord)
      .sort((left, right) => sessionTimestamp(left) - sessionTimestamp(right)),
    [summary],
  );
  const resolvedClassName = summary?.klass?.name || summary?.klass?.className || className;
  const level = liveClassLevel(summary, canonicalSessions[0] || {});
  const firstSession = canonicalSessions[0] || null;
  const lastSession = canonicalSessions[canonicalSessions.length - 1] || null;
  const useStaticFallback = !summary && ["unavailable", "error"].includes(currentResolution.status);
  const classMeta = useStaticFallback ? classCatalog[className] || null : null;
  const fallbackSchedule = useStaticFallback ? courseSchedulesByName[className] || null : null;

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "grid", gap: 4 }}>
            <h1 style={{ ...styles.title, margin: 0 }}>Full class timetable</h1>
            <p style={{ ...styles.subtitle, margin: 0 }}>{resolvedClassName || "Class not found"}</p>
          </div>
          {summary ? (
            <span style={{ ...styles.badge, background: "#dcfce7", color: "#166534" }}>Live timetable</span>
          ) : currentResolution.status === "loading" ? (
            <span style={{ ...styles.badge, background: "#dbeafe", color: "#1e40af" }}>Checking latest timetable…</span>
          ) : useStaticFallback ? (
            <span style={{ ...styles.badge, background: "#fef3c7", color: "#92400e" }}>Offline timetable fallback</span>
          ) : null}
        </div>
        <p style={{ ...styles.helperText, margin: 0, fontSize: 13 }}>
          {summary
            ? "This timetable uses the same current class-session records as the Home next-class card, including rescheduled sessions."
            : currentResolution.status === "loading"
              ? "Loading the current class record…"
              : "The live timetable is temporarily unavailable."}
        </p>
      </div>

      {summary ? (
        <section style={{ ...styles.card, display: "grid", gap: 10 }}>
          <h2 style={{ ...styles.sectionTitle, margin: 0 }}>Class overview</h2>
          <p style={{ ...styles.helperText, margin: 0 }}>
            {firstSession ? formatDate(firstSession.startsAt) : formatDate(summary?.klass?.startDate)}
            {" → "}
            {lastSession ? formatDate(lastSession.endsAt || lastSession.startsAt) : formatDate(summary?.klass?.endDate)}
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {level ? <span style={{ ...styles.badge, background: "#eef2ff", color: "#3730a3" }}>{level}</span> : null}
            <span style={{ ...styles.badge, background: "#f1f5f9", color: "#334155" }}>
              {canonicalSessions.length} current session{canonicalSessions.length === 1 ? "" : "s"}
            </span>
          </div>
        </section>
      ) : null}

      {summary && canonicalSessions.length ? (
        <section style={{ ...styles.card, display: "grid", gap: 10 }}>
          <h2 style={{ ...styles.sectionTitle, margin: 0 }}>Session plan</h2>
          <div style={{ display: "grid", gap: 9 }}>
            {canonicalSessions.map((session) => {
              const status = liveClassSessionStatus(session, now);
              const assignment = liveClassAssignmentLabel(session);
              const lessonLabel = liveClassLessonLabel(session, level);
              return (
                <article
                  key={session.id || `${sessionTimestamp(session)}-${lessonLabel}`}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 13,
                    padding: 12,
                    display: "grid",
                    gap: 7,
                    background: status === "Live now" ? "#f0fdf4" : "#ffffff",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: "#2563eb", fontSize: 12, fontWeight: 900 }}>{lessonLabel}</div>
                      <div style={{ marginTop: 2, fontWeight: 800, color: "#0f172a" }}>{liveClassCleanTitle(session)}</div>
                    </div>
                    <span style={statusBadgeStyle(status)}>{status}</span>
                  </div>
                  <div style={{ color: "#475569", fontSize: 14 }}>
                    <strong>{formatDate(session.startsAt)}</strong>
                    {" · "}{formatTime(session.startsAt)}–{formatTime(session.endsAt)} Ghana time
                    {assignment ? ` · ${assignment}` : ""}
                  </div>
                  <a href={liveClassLessonLink(summary, session)} style={timetableActionStyle}>
                    Open lesson <span aria-hidden="true">→</span>
                  </a>
                </article>
              );
            })}
          </div>
        </section>
      ) : summary ? (
        <section style={styles.card}>
          <p style={{ margin: 0 }}>No current sessions were found for this class.</p>
        </section>
      ) : currentResolution.status === "loading" ? (
        <section style={{ ...styles.card, display: "grid", gap: 5 }}>
          <strong>Loading current sessions…</strong>
          <p style={{ ...styles.helperText, margin: 0 }}>The old generated timetable is not shown while the current class record is loading.</p>
        </section>
      ) : null}

      {useStaticFallback && classMeta ? (
        <section style={{ ...styles.card, display: "grid", gap: 10 }}>
          <h2 style={{ ...styles.sectionTitle, margin: 0 }}>Class overview</h2>
          <p style={{ ...styles.helperText, margin: 0 }}>
            {formatDate(classMeta.startDate)} → {formatDate(classMeta.endDate)}
          </p>
          <div style={{ display: "grid", gap: 6 }}>
            {(classMeta.schedule || []).map((slot) => (
              <div key={`${slot.day}-${slot.startTime}`} style={{ display: "flex", gap: 8 }}>
                <strong>{slot.day}</strong>
                <span>{slot.startTime} - {slot.endTime}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {useStaticFallback && fallbackSchedule?.days?.length ? (
        <section style={{ ...styles.card, display: "grid", gap: 10 }}>
          <h2 style={{ ...styles.sectionTitle, margin: 0 }}>Saved session plan</h2>
          <div style={{ display: "grid", gap: 8 }}>
            {fallbackSchedule.days.map((day) => (
              <div key={`${day.dayNumber}-${day.date}`} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 10 }}>
                <div style={{ fontWeight: 700 }}>
                  Day {day.dayNumber} · {formatDate(day.date)}
                </div>
                <div style={{ marginTop: 4, color: "#334155", fontSize: 14 }}>
                  {(day.sessions || []).map((session) => session.title || session.chapter || session.type).filter(Boolean).join(" • ") || "Session details coming soon"}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : useStaticFallback && !classMeta ? (
        <section style={styles.card}>
          <p style={{ margin: 0 }}>No timetable data was found for this class.</p>
        </section>
      ) : null}
    </div>
  );
};

export default FullClassCalendarPage;
