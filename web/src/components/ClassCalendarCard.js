import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { classCatalog, ZOOM_DETAILS } from "../data/classCatalog";
import { frenchClassCatalog } from "../data/french/classCatalog";
import {
  downloadClassCalendar,
  findArchivedTodayClassSession,
  findNextClassSession,
  formatScheduleSummary,
} from "../services/classCalendar";
import { loadPreferredClass, savePreferredClass } from "../services/classSelectionStorage";
import { subscribeCanonicalLiveClass } from "../services/canonicalLiveClassService";

const GHANA_TIMEZONE = "Africa/Accra";

const infoCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 14,
  background: "#ffffff",
  display: "grid",
  gap: 8,
};

const zoomDetailsStyle = {
  border: "1px solid #dbeafe",
  borderRadius: 12,
  padding: "10px 12px",
  background: "#eff6ff",
  color: "#1e3a8a",
  display: "grid",
  gap: 4,
};

function asDate(value) {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDate(value, locale, options = {}) {
  const date = asDate(value);
  if (!date) return "-";
  return new Intl.DateTimeFormat(locale, {
    timeZone: GHANA_TIMEZONE,
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  }).format(date);
}

function formatTime(value, locale, timeZone = GHANA_TIMEZONE) {
  const date = asDate(value);
  if (!date) return "-";
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function formatRange(session, locale, timeZone = GHANA_TIMEZONE) {
  if (!session) return "-";
  const start = formatTime(session.startsAt, locale, timeZone);
  const end = formatTime(session.endsAt, locale, timeZone);
  return `${start}–${end}`;
}

function sameGhanaDate(left, right = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: GHANA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const leftDate = asDate(left);
  return Boolean(leftDate && formatter.format(leftDate) === formatter.format(right));
}

function sessionTopic(session, fallback = "Live class") {
  return String(
    session?.topic ||
    (session?.assignmentIds || []).join(", ") ||
    fallback,
  ).trim();
}

function formatCanonicalSchedule(rules = []) {
  if (!rules.length) return "Class dates are managed by Falowen Admin.";
  return rules
    .map((rule) => `${rule.day || "Day"} ${rule.startTime || ""}`.trim())
    .join(" · ");
}

function countdownLabel(value, now) {
  const start = asDate(value);
  if (!start) return "";
  const minutes = Math.max(0, Math.ceil((start.getTime() - now.getTime()) / 60000));
  if (minutes === 0) return "Starting now";
  if (minutes < 60) return `Starts in ${minutes} minute${minutes === 1 ? "" : "s"}`;
  const hours = Math.ceil(minutes / 60);
  if (hours < 24) return `Starts in ${hours} hour${hours === 1 ? "" : "s"}`;
  const days = Math.ceil(hours / 24);
  return `Starts in ${days} day${days === 1 ? "" : "s"}`;
}

function canJoinSession(session, now) {
  const start = asDate(session?.startsAt)?.getTime();
  const end = asDate(session?.endsAt)?.getTime();
  if (!start) return false;
  const current = now.getTime();
  return current >= start - 15 * 60000 && current <= (end || start + 2 * 60 * 60000) + 15 * 60000;
}

function escapeIcs(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function toIcsDate(value) {
  const date = asDate(value);
  if (!date) return "";
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function downloadCanonicalCalendar(summary) {
  if (!summary?.klass) return;
  const events = summary.sessions
    .filter((session) => session.startsAt && session.endsAt)
    .map((session) => [
      "BEGIN:VEVENT",
      `UID:${escapeIcs(session.id)}@falowen.app`,
      `SEQUENCE:${Number(session.sequence || 0)}`,
      `DTSTAMP:${toIcsDate(new Date())}`,
      `DTSTART:${toIcsDate(session.startsAt)}`,
      `DTEND:${toIcsDate(session.endsAt)}`,
      `SUMMARY:${escapeIcs(`${summary.klass.name}: ${sessionTopic(session)}`)}`,
      `DESCRIPTION:${escapeIcs(session.cancellationReason || "Falowen live class")}`,
      session.status === "cancelled" ? "STATUS:CANCELLED" : "STATUS:CONFIRMED",
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
}

function StaticClassCard({ selectedClass, classDetails, locale, now }) {
  const nextClass = findNextClassSession(selectedClass, now);
  const completedToday = findArchivedTodayClassSession(selectedClass, now);
  const scheduleSummary = formatScheduleSummary(classDetails?.schedule);

  return (
    <>
      <section style={{ ...infoCardStyle, background: "#fffbeb", borderColor: "#fde68a" }}>
        <strong>Legacy timetable</strong>
        <span style={styles.helperText}>This class has not yet been migrated to Live Classes in Falowen Admin. Existing dates remain available during the migration.</span>
      </section>

      <section style={{ ...infoCardStyle, background: "linear-gradient(135deg, #eff6ff, #ffffff)", borderColor: "#bfdbfe" }}>
        <h3 style={{ margin: 0 }}>{selectedClass}</h3>
        <p style={{ ...styles.helperText, margin: 0 }}>{scheduleSummary}</p>
        {classDetails?.startDate && classDetails?.endDate ? (
          <p style={{ ...styles.helperText, margin: 0 }}>{classDetails.startDate} → {classDetails.endDate}</p>
        ) : null}
        <a href={ZOOM_DETAILS.url} target="_blank" rel="noreferrer" style={{ ...styles.primaryButton, width: "fit-content", textDecoration: "none" }}>Join live class</a>
        <div style={zoomDetailsStyle}>
          <strong>Zoom details</strong>
          <span>Meeting ID: {ZOOM_DETAILS.meetingId} · Passcode: {ZOOM_DETAILS.passcode}</span>
        </div>
      </section>

      {completedToday ? (
        <section style={{ ...infoCardStyle, background: "#f1f5f9", borderColor: "#cbd5e1" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <strong>Earlier today</strong>
            <span style={{ ...styles.badge, background: "#dcfce7", color: "#166534" }}>Completed</span>
          </div>
          <p style={{ ...styles.helperText, margin: 0 }}>{completedToday.weekday}, {completedToday.date} · {completedToday.startTime}–{completedToday.endTime} Ghana time</p>
          <p style={{ ...styles.helperText, margin: 0 }}>{completedToday.titles?.join("; ") || "Today’s class has ended."}</p>
        </section>
      ) : null}

      {nextClass ? (
        <section style={{ ...infoCardStyle, borderColor: "#dbeafe" }}>
          <strong>Next live class</strong>
          <p style={{ ...styles.helperText, margin: 0 }}>{nextClass.weekday}, {nextClass.date} · {nextClass.startTime}–{nextClass.endTime} Ghana time</p>
          <p style={{ ...styles.helperText, margin: 0 }}>{nextClass.titles?.join("; ") || "Lesson details will appear here."}</p>
        </section>
      ) : <p style={styles.helperText}>No upcoming class is listed.</p>}

      <button type="button" style={styles.primaryButton} onClick={() => downloadClassCalendar(selectedClass)}>Download class calendar</button>
      {classDetails?.docUrl ? <a href={classDetails.docUrl} target="_blank" rel="noreferrer" style={{ ...styles.secondaryButton, width: "fit-content", textDecoration: "none" }}>Open course materials</a> : null}
    </>
  );
}

const ClassCalendarCard = ({ id, initialClassName, initialClassId, program }) => {
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
  const [canonicalStatus, setCanonicalStatus] = useState("loading");
  const [canonicalSummary, setCanonicalSummary] = useState(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => setSelectedClass(defaultClass), [defaultClass]);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setCanonicalSummary(null);
    if (program === "french" || (!selectedClass && !initialClassId)) {
      setCanonicalStatus("unavailable");
      return undefined;
    }
    setCanonicalStatus("loading");
    return subscribeCanonicalLiveClass({
      classId: initialClassId,
      className: selectedClass,
      onChange: (summary) => {
        setCanonicalSummary(summary);
        setCanonicalStatus("ready");
      },
      onUnavailable: () => setCanonicalStatus("unavailable"),
      onError: (error) => {
        console.warn("Canonical live class data is unavailable", error);
        setCanonicalStatus("unavailable");
      },
    });
  }, [initialClassId, program, selectedClass]);

  const classDetails = resolvedCatalog[selectedClass];
  const studentClassLocked = Boolean(initialClassName);
  const nextSession = canonicalSummary?.nextSession || null;
  const completedSession = canonicalSummary?.latestCompletedSession || null;
  const cancelledSessions = canonicalSummary?.cancelledSessions?.filter((session) => {
    const start = asDate(session.startsAt)?.getTime() || 0;
    return start >= now.getTime() - 7 * 24 * 60 * 60 * 1000;
  }).slice(0, 3) || [];
  const zoom = canonicalSummary?.zoom?.url ? canonicalSummary.zoom : (!canonicalSummary?.klass?.zoomProfileId ? ZOOM_DETAILS : canonicalSummary?.zoom || {});
  const deviceTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const ghanaNextTime = nextSession ? formatRange(nextSession, locale, GHANA_TIMEZONE) : "";
  const deviceNextTime = nextSession ? formatRange(nextSession, locale, deviceTimeZone) : "";
  const showDeviceTime = Boolean(deviceNextTime && deviceTimeZone !== GHANA_TIMEZONE && deviceNextTime !== ghanaNextTime);

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
          <p style={{ ...styles.helperText, margin: "4px 0 0" }}>Class dates, cancellations, Zoom access, curriculum and progress in one place.</p>
        </div>
        <span style={{ ...styles.badge, background: canonicalStatus === "ready" ? "#dcfce7" : "#fef3c7", color: canonicalStatus === "ready" ? "#166534" : "#92400e" }}>
          {canonicalStatus === "ready" ? "Live from Admin" : canonicalStatus === "loading" ? "Checking schedule…" : "Legacy schedule"}
        </span>
      </div>

      <section style={infoCardStyle}>
        <label htmlFor={`${id || "class-calendar"}-select`} style={{ fontWeight: 700 }}>Your class</label>
        {studentClassLocked ? (
          <h3 style={{ margin: 0 }}>{selectedClass}</h3>
        ) : (
          <select id={`${id || "class-calendar"}-select`} style={styles.select} value={selectedClass} onChange={handleClassChange}>
            {availableClasses.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        )}
      </section>

      {canonicalStatus === "ready" && canonicalSummary ? (
        <>
          <section style={{ ...infoCardStyle, background: "linear-gradient(135deg, #eff6ff, #ffffff)", borderColor: "#bfdbfe" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
              <div>
                <h3 style={{ margin: 0 }}>{canonicalSummary.klass.name}</h3>
                <p style={{ ...styles.helperText, margin: "6px 0 0" }}>{formatCanonicalSchedule(canonicalSummary.klass.scheduleRules)}</p>
              </div>
              <span style={styles.badge}>{canonicalSummary.klass.status || "active"}</span>
            </div>
            {canonicalSummary.klass.startDate && canonicalSummary.klass.endDate ? <p style={{ ...styles.helperText, margin: 0 }}>{canonicalSummary.klass.startDate} → {canonicalSummary.klass.endDate}</p> : null}
            {zoom.url ? <a href={zoom.url} target="_blank" rel="noreferrer" style={{ ...styles.primaryButton, width: "fit-content", textDecoration: "none" }}>Join live class</a> : <p style={{ ...styles.helperText, margin: 0 }}>Zoom has not yet been assigned by the administrator.</p>}
            {(zoom.meetingId || zoom.passcode) ? (
              <div style={zoomDetailsStyle}>
                <strong>Zoom details</strong>
                <span>{zoom.meetingId ? `Meeting ID: ${zoom.meetingId}` : ""}{zoom.meetingId && zoom.passcode ? " · " : ""}{zoom.passcode ? `Passcode: ${zoom.passcode}` : ""}</span>
              </div>
            ) : null}
          </section>

          <section style={infoCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
              <strong>Course progress</strong>
              <span style={styles.badge}>{canonicalSummary.progress}%</span>
            </div>
            <div style={{ height: 10, background: "#e5e7eb", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${canonicalSummary.progress}%`, height: "100%", background: "linear-gradient(90deg, #2563eb, #7c3aed)" }} />
            </div>
            <p style={{ ...styles.helperText, margin: 0 }}>{canonicalSummary.completedCount} of {canonicalSummary.totalCount} non-cancelled sessions completed.</p>
          </section>

          {cancelledSessions.map((session) => (
            <section key={session.id} style={{ ...infoCardStyle, background: "#fef2f2", borderColor: "#fecaca" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <strong>Class cancelled</strong>
                <span style={{ ...styles.badge, background: "#fee2e2", color: "#991b1b" }}>Cancelled</span>
              </div>
              <p style={{ ...styles.helperText, margin: 0 }}>{formatDate(session.startsAt, locale)} · {formatRange(session, locale)} Ghana time</p>
              <p style={{ margin: 0 }}>{session.cancellationReason || "This class session was cancelled by the administrator."}</p>
            </section>
          ))}

          {completedSession ? (
            <section style={{ ...infoCardStyle, background: "#f1f5f9", borderColor: "#cbd5e1" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <strong>{sameGhanaDate(completedSession.startsAt, now) ? "Earlier today" : "Latest completed class"}</strong>
                <span style={{ ...styles.badge, background: "#dcfce7", color: "#166534" }}>Completed</span>
              </div>
              <p style={{ ...styles.helperText, margin: 0 }}>{formatDate(completedSession.startsAt, locale)} · {formatRange(completedSession, locale)} Ghana time</p>
              <p style={{ ...styles.helperText, margin: 0 }}>{sessionTopic(completedSession)}</p>
            </section>
          ) : null}

          {nextSession ? (
            <section style={{ ...infoCardStyle, borderColor: "#93c5fd", background: "#eff6ff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                <h3 style={{ ...styles.sectionTitle, margin: 0 }}>Next live class</h3>
                <span style={styles.badge}>{countdownLabel(nextSession.startsAt, now)}</span>
              </div>
              <p style={{ ...styles.helperText, margin: 0 }}>{formatDate(nextSession.startsAt, locale)} · {ghanaNextTime} Ghana time</p>
              {showDeviceTime ? <p style={{ ...styles.helperText, margin: 0 }}>Device time: {deviceNextTime} ({deviceTimeZone})</p> : null}
              <p style={{ ...styles.helperText, margin: 0 }}>{sessionTopic(nextSession)}</p>
              {canJoinSession(nextSession, now) && zoom.url ? <a href={zoom.url} target="_blank" rel="noreferrer" style={{ ...styles.primaryButton, width: "fit-content", textDecoration: "none" }}>Join live class</a> : null}
            </section>
          ) : <p style={styles.helperText}>No upcoming non-cancelled session is scheduled.</p>}

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" style={styles.primaryButton} onClick={() => downloadCanonicalCalendar(canonicalSummary)}>Download class calendar</button>
            {canonicalSummary.klass.classUrl ? <a href={canonicalSummary.klass.classUrl} style={{ ...styles.secondaryButton, textDecoration: "none" }}>Open class page</a> : null}
          </div>
        </>
      ) : canonicalStatus === "loading" ? (
        <section style={infoCardStyle}><span style={styles.helperText}>Loading the latest class schedule…</span></section>
      ) : classDetails ? (
        <StaticClassCard selectedClass={selectedClass} classDetails={classDetails} locale={locale} now={now} />
      ) : (
        <section style={{ ...infoCardStyle, background: "#fef2f2", borderColor: "#fecaca" }}>
          <strong>Class schedule unavailable</strong>
          <span style={styles.helperText}>Ask the administrator to create “{selectedClass}” under Live Classes.</span>
        </section>
      )}
    </div>
  );
};

export default ClassCalendarCard;
