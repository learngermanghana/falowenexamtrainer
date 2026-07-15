import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { classCatalog, ZOOM_DETAILS } from "../data/classCatalog";
import { frenchClassCatalog } from "../data/french/classCatalog";
import {
  downloadClassCalendar,
  findNextClassSession,
  formatScheduleSummary,
} from "../services/classCalendar";
import { loadPreferredClass, savePreferredClass } from "../services/classSelectionStorage";
import { subscribeCanonicalLiveClass } from "../services/canonicalLiveClassService";
import NextLiveClassCard from "./NextLiveClassCard";
import {
  GHANA_TIMEZONE,
  asLiveClassDate,
  canJoinLiveClass,
  liveClassAssignmentLabel,
  liveClassCleanTitle,
  liveClassLessonLabel,
  liveClassSessionStatus,
  loadLiveClassSummaryCache,
  saveLiveClassSummaryCache,
} from "../utils/liveClassCardPresentation";

const BACKSLASH = String.fromCharCode(92);
const NEWLINE = String.fromCharCode(10);

const infoCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 14,
  background: "#ffffff",
  display: "grid",
  gap: 8,
};

const formatDate = (value, locale = "en") => {
  const date = asLiveClassDate(value);
  if (!date) return "-";
  return new Intl.DateTimeFormat(locale, {
    timeZone: GHANA_TIMEZONE,
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatTime = (value, locale = "en", timeZone = GHANA_TIMEZONE) => {
  const date = asLiveClassDate(value);
  if (!date) return "--:--";
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

const formatRange = (session, locale = "en") =>
  `${formatTime(session?.startsAt, locale)}–${formatTime(session?.endsAt, locale)}`;

const normalizeStatus = (value) => String(value || "scheduled").trim().toLowerCase();

const activeSessions = (summary = {}, now = new Date()) => [...(summary.sessions || [])]
  .filter((session) => {
    const status = normalizeStatus(session.status || session.sessionStatus);
    if (["cancelled", "superseded", "deleted"].includes(status) || session.superseded === true) return false;
    const end = asLiveClassDate(session.endsAt)?.getTime() || 0;
    return !end || end >= now.getTime();
  })
  .sort((left, right) => (asLiveClassDate(left.startsAt)?.getTime() || 0) - (asLiveClassDate(right.startsAt)?.getTime() || 0));

const resolveNextSession = (summary = {}, now = new Date()) =>
  activeSessions(summary, now)[0] || summary.nextSession || null;

const statusColors = (status) => {
  if (status === "Cancelled") return { background: "#fee2e2", color: "#991b1b" };
  if (status === "Completed") return { background: "#dcfce7", color: "#166534" };
  if (status === "Live now") return { background: "#fef3c7", color: "#92400e" };
  if (status === "Today") return { background: "#ffedd5", color: "#9a3412" };
  return { background: "#dbeafe", color: "#1e40af" };
};

const escapeIcs = (value) => String(value || "")
  .split(BACKSLASH).join(`${BACKSLASH}${BACKSLASH}`)
  .split(NEWLINE).join(`${BACKSLASH}n`)
  .split(",").join(`${BACKSLASH},`)
  .split(";").join(`${BACKSLASH};`);

const toIcsDate = (value) => {
  const date = asLiveClassDate(value);
  return date ? date.toISOString().replace(/[-:]/g, "").replace(/[.]\d{3}Z$/, "Z") : "";
};

const downloadCanonicalCalendar = (summary) => {
  if (!summary?.klass) return;
  const events = (summary.sessions || [])
    .filter((session) => session.startsAt && session.endsAt)
    .map((session) => [
      "BEGIN:VEVENT",
      `UID:${escapeIcs(session.id)}@falowen.app`,
      `SEQUENCE:${Number(session.sequence || 0)}`,
      `DTSTAMP:${toIcsDate(new Date())}`,
      `DTSTART:${toIcsDate(session.startsAt)}`,
      `DTEND:${toIcsDate(session.endsAt)}`,
      `SUMMARY:${escapeIcs(`${summary.klass.name}: ${liveClassCleanTitle(session)}`)}`,
      `DESCRIPTION:${escapeIcs(session.cancellationReason || session.rescheduleReason || "Falowen live class")}`,
      normalizeStatus(session.status) === "cancelled" ? "STATUS:CANCELLED" : "STATUS:CONFIRMED",
      "END:VEVENT",
    ].join("\r\n"));

  const content = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Falowen//Live Classes//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${summary.klass.slug || "falowen-class"}.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

function SessionRow({ session, index, now, locale, zoom }) {
  const status = liveClassSessionStatus(session, now);
  const assignment = liveClassAssignmentLabel(session);
  return (
    <article style={{ border: "1px solid #dbe3ee", borderRadius: 12, padding: 11, background: "#fff", display: "grid", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div>
          <strong>{liveClassLessonLabel(session)}</strong>
          <div style={{ ...styles.helperText, marginTop: 3 }}>{formatDate(session.startsAt, locale)} · {formatRange(session, locale)} Ghana time</div>
        </div>
        <span style={{ ...styles.badge, ...statusColors(status) }}>{status}</span>
      </div>
      <div style={{ fontWeight: 800 }}>{liveClassCleanTitle(session)}</div>
      {assignment ? <div style={{ ...styles.helperText, margin: 0 }}>Assignment: {assignment}</div> : null}
      {session.cancellationReason ? <div style={{ color: "#991b1b", fontSize: 13 }}>Reason: {session.cancellationReason}</div> : null}
      {status !== "Cancelled" && canJoinLiveClass(session, now) && zoom?.url ? (
        <a href={zoom.url} target="_blank" rel="noreferrer" style={{ ...styles.primaryButton, width: "fit-content", textDecoration: "none" }}>Join this session</a>
      ) : null}
      {index !== undefined ? <span style={{ color: "#94a3b8", fontSize: 10 }}>Session {index + 1}</span> : null}
    </article>
  );
}

function SessionsPreview({ summary, zoom, now, locale }) {
  const sessions = useMemo(
    () => [...(summary.sessions || [])].sort((left, right) => (asLiveClassDate(left.startsAt)?.getTime() || 0) - (asLiveClassDate(right.startsAt)?.getTime() || 0)),
    [summary.sessions],
  );
  const upcoming = activeSessions(summary, now);
  const preview = upcoming.slice(0, 3);
  const hiddenOutOfRange = Number(summary.hiddenOutOfDateRangeSessionCount || 0);

  return (
    <section id="full-session-timetable" style={{ ...infoCardStyle, background: "#f8fafc" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <h3 style={{ ...styles.sectionTitle, margin: 0 }}>Upcoming sessions</h3>
          <p style={{ ...styles.helperText, margin: "4px 0 0" }}>{upcoming.length} remaining · showing the next {Math.min(3, upcoming.length)}</p>
        </div>
        <span style={styles.badge}>{sessions.length} total</span>
      </div>

      {preview.length ? (
        <div style={{ display: "grid", gap: 8 }}>
          {preview.map((session) => <SessionRow key={session.id || session.startsAt} session={session} now={now} locale={locale} zoom={zoom} />)}
        </div>
      ) : <p style={styles.helperText}>No upcoming non-cancelled session is scheduled.</p>}

      <details style={{ borderTop: "1px solid #dbe3ee", paddingTop: 10 }}>
        <summary style={{ cursor: "pointer", fontWeight: 900 }}>Show all {sessions.length} sessions</summary>
        <p style={{ ...styles.helperText, margin: "8px 0 0" }}>These are the actual sessions saved in Falowen Admin. Reschedules and cancellations update automatically.</p>
        {hiddenOutOfRange > 0 ? <p style={{ ...styles.helperText, color: "#92400e" }}>{hiddenOutOfRange} session{hiddenOutOfRange === 1 ? "" : "s"} outside the official class dates were hidden.</p> : null}
        <div style={{ display: "grid", gap: 8, marginTop: 10, maxHeight: 560, overflowY: "auto", paddingRight: 4 }}>
          {sessions.map((session, index) => <SessionRow key={session.id || `${session.startsAt}-${index}`} session={session} index={index} now={now} locale={locale} zoom={zoom} />)}
        </div>
      </details>
    </section>
  );
}

function LegacyClassCard({ selectedClass, classDetails, now }) {
  const nextClass = findNextClassSession(selectedClass, now);
  return (
    <>
      <section style={{ ...infoCardStyle, background: "#fffbeb", borderColor: "#fde68a" }}>
        <strong>Legacy timetable</strong>
        <span style={styles.helperText}>This class has not yet been migrated to Live Classes in Falowen Admin.</span>
      </section>
      <section style={{ ...infoCardStyle, background: "linear-gradient(135deg, #eff6ff, #ffffff)", borderColor: "#bfdbfe" }}>
        <h3 style={{ margin: 0 }}>{selectedClass}</h3>
        <p style={{ ...styles.helperText, margin: 0 }}>{formatScheduleSummary(classDetails?.schedule)}</p>
        {nextClass ? <p style={{ margin: 0 }}><strong>Next:</strong> {nextClass.weekday}, {nextClass.date} · {nextClass.startTime}–{nextClass.endTime}</p> : null}
        <a href={ZOOM_DETAILS.url} target="_blank" rel="noreferrer" style={{ ...styles.primaryButton, width: "fit-content", textDecoration: "none" }}>Join live class</a>
      </section>
      <button type="button" style={styles.primaryButton} onClick={() => downloadClassCalendar(selectedClass)}>Download class calendar</button>
    </>
  );
}

function ClassEndedNotice({ summary, locale }) {
  const endedLabel = summary?.classEndedAt ? formatDate(summary.classEndedAt, locale) : "the official end date";
  return (
    <section style={{ ...infoCardStyle, borderColor: "#86efac", background: "#f0fdf4" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <h3 style={{ ...styles.sectionTitle, margin: 0 }}>Class ended</h3>
        <span style={{ ...styles.badge, background: "#dcfce7", color: "#166534" }}>Completed</span>
      </div>
      <p style={{ ...styles.helperText, margin: 0 }}>This class finished on {endedLabel}. No more live sessions are scheduled for this cohort.</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <a href="/exams/overview" style={{ ...styles.primaryButton, width: "fit-content", textDecoration: "none" }}>Open Exams Room</a>
        <a href="/campus/course" style={{ ...styles.secondaryButton, width: "fit-content", textDecoration: "none" }}>Revise Course Book</a>
      </div>
    </section>
  );
}

const ClassCalendarCardV2 = ({ id, initialClassName, initialClassId, program }) => {
  const { i18n } = useTranslation();
  const locale = i18n.language || "en";
  const resolvedCatalog = useMemo(() => program === "french" ? frenchClassCatalog : classCatalog, [program]);
  const availableClasses = useMemo(() => {
    const names = Object.keys(resolvedCatalog);
    if (initialClassName && !names.includes(initialClassName)) return [initialClassName, ...names];
    return names;
  }, [initialClassName, resolvedCatalog]);
  const defaultClass = useMemo(() => {
    if (initialClassName) return initialClassName;
    const stored = loadPreferredClass();
    return stored && availableClasses.includes(stored) ? stored : availableClasses[0] || "";
  }, [availableClasses, initialClassName]);

  const [selectedClass, setSelectedClass] = useState(defaultClass);
  const cacheIdentity = useMemo(() => ({ classId: initialClassId, className: selectedClass }), [initialClassId, selectedClass]);
  const [canonicalStatus, setCanonicalStatus] = useState("loading");
  const [canonicalSummary, setCanonicalSummary] = useState(() => loadLiveClassSummaryCache(cacheIdentity));
  const [now, setNow] = useState(new Date());

  useEffect(() => setSelectedClass(defaultClass), [defaultClass]);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (program === "french" || (!selectedClass && !initialClassId)) {
      setCanonicalStatus("unavailable");
      return undefined;
    }
    const cached = loadLiveClassSummaryCache(cacheIdentity);
    if (cached) setCanonicalSummary(cached);
    setCanonicalStatus("loading");
    return subscribeCanonicalLiveClass({
      classId: initialClassId,
      className: selectedClass,
      onChange: (summary) => {
        setCanonicalSummary(summary);
        saveLiveClassSummaryCache(cacheIdentity, summary);
        setCanonicalStatus("ready");
      },
      onUnavailable: () => setCanonicalStatus(cached ? "cached" : "unavailable"),
      onError: (error) => {
        console.warn("Canonical live class data is unavailable", error);
        setCanonicalStatus(cached ? "cached" : "unavailable");
      },
    });
  }, [cacheIdentity, initialClassId, program, selectedClass]);

  const classDetails = resolvedCatalog[selectedClass];
  const studentClassLocked = Boolean(initialClassName || initialClassId);
  const nextSession = canonicalSummary ? resolveNextSession(canonicalSummary, now) : null;
  const completedSession = canonicalSummary?.latestCompletedSession || null;
  const classEnded = Boolean(canonicalSummary?.classEnded);
  const cancelledSessions = (canonicalSummary?.cancelledSessions || []).filter((session) => {
    const start = asLiveClassDate(session.startsAt)?.getTime() || 0;
    return start >= now.getTime() - 7 * 24 * 60 * 60 * 1000;
  }).slice(0, 3);
  const zoom = canonicalSummary?.zoom?.url
    ? canonicalSummary.zoom
    : !canonicalSummary?.klass?.zoomProfileId
      ? ZOOM_DETAILS
      : canonicalSummary?.zoom || {};

  const handleClassChange = (event) => {
    const value = event.target.value;
    setSelectedClass(value);
    savePreferredClass(value);
  };

  return (
    <div id={id} style={{ ...styles.card, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ ...styles.sectionTitle, margin: 0 }}>Live class access & calendar</h2>
          <p style={{ ...styles.helperText, margin: "4px 0 0" }}>Your next lesson, timetable, Zoom access and course progress.</p>
        </div>
        <span style={{ ...styles.badge, background: canonicalStatus === "ready" ? "#dcfce7" : "#fef3c7", color: canonicalStatus === "ready" ? "#166534" : "#92400e" }}>
          {canonicalStatus === "ready" ? "Live from Admin" : canonicalStatus === "loading" ? "Updating schedule…" : canonicalStatus === "cached" ? "Last known schedule" : "Legacy schedule"}
        </span>
      </div>

      <section style={infoCardStyle}>
        <label htmlFor={`${id || "class-calendar"}-select`} style={{ fontWeight: 700 }}>Your class</label>
        {studentClassLocked ? <h3 style={{ margin: 0 }}>{selectedClass}</h3> : (
          <select id={`${id || "class-calendar"}-select`} style={styles.select} value={selectedClass} onChange={handleClassChange}>
            {availableClasses.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        )}
      </section>

      {canonicalSummary ? (
        <>
          {classEnded ? <ClassEndedNotice summary={canonicalSummary} locale={locale} /> : nextSession ? (
            <NextLiveClassCard
              summary={canonicalSummary}
              session={nextSession}
              zoom={zoom}
              now={now}
              locale={locale}
              fullCalendarLink="#full-session-timetable"
              updating={canonicalStatus === "loading" || canonicalStatus === "cached"}
            />
          ) : <section style={infoCardStyle}><strong>No upcoming class</strong><span style={styles.helperText}>Check the timetable below for completed or cancelled sessions.</span></section>}

          {cancelledSessions.map((session) => (
            <section key={session.id} style={{ ...infoCardStyle, background: "#fef2f2", borderColor: "#fecaca" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <strong>Important cancellation</strong>
                <span style={{ ...styles.badge, background: "#fee2e2", color: "#991b1b" }}>Cancelled</span>
              </div>
              <p style={{ ...styles.helperText, margin: 0 }}>{formatDate(session.startsAt, locale)} · {formatRange(session, locale)} Ghana time</p>
              <p style={{ margin: 0 }}>{session.cancellationReason || "This class session was cancelled by the administrator."}</p>
            </section>
          ))}

          <section style={infoCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
              <strong>{canonicalSummary.klass.levelId || canonicalSummary.klass.level || "Course"} progress</strong>
              <span style={styles.badge}>{canonicalSummary.progress}%</span>
            </div>
            <div style={{ height: 10, background: "#e5e7eb", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${canonicalSummary.progress}%`, height: "100%", background: "linear-gradient(90deg, #2563eb, #7c3aed)" }} />
            </div>
            <p style={{ ...styles.helperText, margin: 0 }}>
              {classEnded
                ? "Class has ended. Progress is complete according to the official class dates."
                : canonicalSummary.progressMode === "timeline"
                  ? "Calculated from the official class start and graduation dates."
                  : `${canonicalSummary.completedCount} of ${canonicalSummary.totalCount} non-cancelled sessions completed.`}
            </p>
          </section>

          <section style={{ ...infoCardStyle, background: "linear-gradient(135deg, #f8fafc, #ffffff)", borderColor: "#cbd5e1" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
              <div>
                <h3 style={{ margin: 0 }}>{canonicalSummary.klass.name}</h3>
                <p style={{ ...styles.helperText, margin: "6px 0 0" }}>{(canonicalSummary.klass.scheduleRules || []).map((rule) => `${rule.day} ${rule.startTime}`).join(" · ") || "Dates managed by Falowen Admin"}</p>
              </div>
              <span style={styles.badge}>{classEnded ? "ended" : canonicalSummary.klass.status || "active"}</span>
            </div>
            {canonicalSummary.klass.startDate && canonicalSummary.klass.endDate ? <p style={{ ...styles.helperText, margin: 0 }}>{canonicalSummary.klass.startDate} → {canonicalSummary.klass.endDate}</p> : null}
            {zoom.meetingId || zoom.passcode ? <div style={{ padding: "10px 12px", borderRadius: 12, background: "#eff6ff", color: "#1e3a8a" }}><strong>Zoom details</strong><br />{zoom.meetingId ? `Meeting ID: ${zoom.meetingId}` : ""}{zoom.meetingId && zoom.passcode ? " · " : ""}{zoom.passcode ? `Passcode: ${zoom.passcode}` : ""}</div> : null}
          </section>

          {completedSession ? (
            <details style={{ ...infoCardStyle, background: "#f1f5f9", borderColor: "#cbd5e1" }}>
              <summary style={{ cursor: "pointer", fontWeight: 800 }}>Latest completed class</summary>
              <p style={{ ...styles.helperText, margin: "8px 0 0" }}>{formatDate(completedSession.startsAt, locale)} · {formatRange(completedSession, locale)} Ghana time</p>
              <p style={{ margin: 0 }}>{liveClassCleanTitle(completedSession)}</p>
            </details>
          ) : null}

          <SessionsPreview summary={canonicalSummary} zoom={zoom} now={now} locale={locale} />

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" style={styles.primaryButton} onClick={() => downloadCanonicalCalendar(canonicalSummary)}>Download class calendar</button>
            <a href="/campus/course" style={{ ...styles.secondaryButton, textDecoration: "none" }}>Open Course Book</a>
          </div>
        </>
      ) : canonicalStatus === "loading" ? (
        <section style={infoCardStyle}><span style={styles.helperText}>Loading the latest class schedule…</span></section>
      ) : classDetails ? (
        <LegacyClassCard selectedClass={selectedClass} classDetails={classDetails} now={now} />
      ) : (
        <section style={{ ...infoCardStyle, background: "#fef2f2", borderColor: "#fecaca" }}>
          <strong>Class schedule unavailable</strong>
          <span style={styles.helperText}>Ask the administrator to create “{selectedClass}” under Live Classes.</span>
        </section>
      )}
    </div>
  );
};

export default ClassCalendarCardV2;
