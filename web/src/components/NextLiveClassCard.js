import React from "react";
import { styles } from "../styles";
import {
  GHANA_TIMEZONE,
  asLiveClassDate,
  canJoinLiveClass,
  isRescheduledLiveClass,
  liveClassAssignmentLabel,
  liveClassCleanTitle,
  liveClassJoinOpensAt,
  liveClassLessonLabel,
  liveClassLessonLink,
  liveClassLevel,
  liveClassSessionStatus,
  upcomingLiveClassSessions,
} from "../utils/liveClassCardPresentation";

const cardStyle = {
  border: "2px solid #60a5fa",
  borderRadius: 18,
  padding: 16,
  background: "linear-gradient(145deg, #eff6ff 0%, #ffffff 58%, #eef2ff 100%)",
  display: "grid",
  gap: 12,
  boxShadow: "0 14px 34px rgba(37, 99, 235, 0.12)",
};

const compactCardStyle = {
  border: "1px solid rgba(255,255,255,0.32)",
  borderRadius: 16,
  padding: 13,
  background: "rgba(255,255,255,0.16)",
  backdropFilter: "blur(8px)",
  display: "grid",
  gap: 8,
  minWidth: 0,
};

const formatDate = (value, locale = "en", timeZone = GHANA_TIMEZONE) => {
  const date = asLiveClassDate(value);
  if (!date) return "Date unavailable";
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
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

const formatRange = (session, locale = "en", timeZone = GHANA_TIMEZONE) =>
  `${formatTime(session?.startsAt, locale, timeZone)}–${formatTime(session?.endsAt, locale, timeZone)}`;

const countdown = (session, now = new Date()) => {
  const start = asLiveClassDate(session?.startsAt);
  const end = asLiveClassDate(session?.endsAt);
  if (!start) return "Schedule unavailable";
  const current = now.getTime();
  if (current >= start.getTime() && current <= (end?.getTime() || start.getTime() + 2 * 60 * 60 * 1000)) return "Live now";
  const minutes = Math.max(0, Math.ceil((start.getTime() - current) / 60000));
  if (minutes === 0) return "Starting now";
  if (minutes < 60) return `Starts in ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours < 24) return `Starts in ${hours}h${remainingMinutes ? ` ${remainingMinutes}m` : ""}`;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return `Starts in ${days}d${remainingHours ? ` ${remainingHours}h` : ""}`;
};

const badgeStyle = (status, compact) => {
  const palette = status === "Live now"
    ? { background: "#dcfce7", color: "#166534" }
    : status === "Today"
      ? { background: "#fef3c7", color: "#92400e" }
      : { background: compact ? "rgba(255,255,255,0.22)" : "#dbeafe", color: compact ? "#ffffff" : "#1e40af" };
  return { ...styles.badge, ...palette, whiteSpace: "nowrap" };
};

const buttonRowStyle = { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" };

export default function NextLiveClassCard({
  summary,
  session,
  zoom = {},
  now = new Date(),
  locale = "en",
  fullCalendarLink = "#full-session-timetable",
  compact = false,
  updating = false,
}) {
  if (!session) return null;

  const level = liveClassLevel(summary, session);
  const lessonLabel = liveClassLessonLabel(session, level);
  const title = liveClassCleanTitle(session);
  const assignment = liveClassAssignmentLabel(session);
  const status = liveClassSessionStatus(session, now);
  const rescheduled = isRescheduledLiveClass(session);
  const joinEnabled = canJoinLiveClass(session, now) && Boolean(zoom?.url);
  const lessonLink = liveClassLessonLink(summary, session);
  const afterThis = upcomingLiveClassSessions(summary, session, now, 2);
  const deviceTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const ghanaRange = formatRange(session, locale, GHANA_TIMEZONE);
  const deviceRange = formatRange(session, locale, deviceTimeZone);
  const showDeviceTime = deviceTimeZone !== GHANA_TIMEZONE && deviceRange !== ghanaRange;
  const previousStart = asLiveClassDate(session.previousStartsAt || session.originalStartsAt);
  const className = summary?.klass?.name || summary?.klass?.className || session.className || "Your class";
  const textColor = compact ? "#ffffff" : "#0f172a";
  const mutedColor = compact ? "#dbeafe" : "#475569";

  return (
    <section data-next-live-class-card="true" style={compact ? compactCardStyle : cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
        <div>
          <div style={{ color: compact ? "#bfdbfe" : "#1d4ed8", fontSize: 12, fontWeight: 900, letterSpacing: "0.08em" }}>
            NEXT LIVE CLASS
          </div>
          {updating ? <div style={{ color: compact ? "#fef3c7" : "#92400e", fontSize: 11, fontWeight: 700, marginTop: 3 }}>Updating timetable…</div> : null}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {rescheduled ? <span style={{ ...styles.badge, background: "#ffedd5", color: "#9a3412" }}>Rescheduled</span> : null}
          <span style={badgeStyle(status, compact)}>{status}</span>
        </div>
      </div>

      <div style={{ display: "grid", gap: 4 }}>
        <div style={{ color: compact ? "#bfdbfe" : "#2563eb", fontSize: compact ? 13 : 15, fontWeight: 900 }}>{lessonLabel}</div>
        <h3 style={{ margin: 0, color: textColor, fontSize: compact ? 19 : 25, lineHeight: 1.18 }}>{title}</h3>
        <div style={{ color: mutedColor, fontSize: compact ? 12 : 14, fontWeight: 700 }}>
          {className}{assignment ? ` · ${assignment}` : ""}
        </div>
      </div>

      <div style={{ borderRadius: 12, padding: compact ? "9px 10px" : "11px 12px", background: compact ? "rgba(15,23,42,0.18)" : "rgba(255,255,255,0.75)", display: "grid", gap: 4 }}>
        <strong style={{ color: textColor, fontSize: compact ? 13 : 15 }}>{formatDate(session.startsAt, locale)} · {ghanaRange} Ghana time</strong>
        <span style={{ color: compact ? "#fef3c7" : "#1d4ed8", fontSize: compact ? 12 : 14, fontWeight: 900 }}>{countdown(session, now)}</span>
        {showDeviceTime ? <span style={{ color: mutedColor, fontSize: 12 }}>Your device: {deviceRange} ({deviceTimeZone})</span> : null}
        {rescheduled && previousStart ? (
          <span style={{ color: compact ? "#fed7aa" : "#9a3412", fontSize: 12 }}>
            Previously: {formatDate(previousStart, locale)} · {formatTime(previousStart, locale)} Ghana time
          </span>
        ) : null}
      </div>

      <div style={buttonRowStyle}>
        <a href={lessonLink} style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content", padding: compact ? "8px 10px" : undefined }}>
          Open lesson
        </a>
        <a href={fullCalendarLink} style={{ ...styles.secondaryButton, textDecoration: "none", width: "fit-content", padding: compact ? "8px 10px" : undefined, color: compact ? "#ffffff" : undefined, borderColor: compact ? "rgba(255,255,255,0.5)" : undefined }}>
          View timetable
        </a>
        {joinEnabled ? (
          <a href={zoom.url} target="_blank" rel="noreferrer" style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content", background: "#16a34a", padding: compact ? "8px 10px" : undefined }}>
            Join class
          </a>
        ) : (
          <button type="button" disabled style={{ ...styles.secondaryButton, width: "fit-content", opacity: 0.7, cursor: "not-allowed", padding: compact ? "8px 10px" : undefined }}>
            {zoom?.url ? liveClassJoinOpensAt(session, locale) : "Join link pending"}
          </button>
        )}
      </div>

      {afterThis.length ? (
        <div style={{ borderTop: compact ? "1px solid rgba(255,255,255,0.2)" : "1px solid #bfdbfe", paddingTop: 10, display: "grid", gap: 7 }}>
          <strong style={{ color: textColor, fontSize: 12 }}>After this</strong>
          {afterThis.map((item) => (
            <a key={item.id || item.startsAt} href={liveClassLessonLink(summary, item)} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 8, color: textColor, textDecoration: "none", alignItems: "start" }}>
              <span style={{ color: compact ? "#bfdbfe" : "#2563eb", fontSize: 11, fontWeight: 900 }}>{liveClassLessonLabel(item, level)}</span>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", fontSize: compact ? 12 : 13, fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{liveClassCleanTitle(item)}</span>
                <span style={{ display: "block", color: mutedColor, fontSize: 11 }}>{formatDate(item.startsAt, locale)} · {formatTime(item.startsAt, locale)}</span>
              </span>
            </a>
          ))}
        </div>
      ) : null}
    </section>
  );
}
