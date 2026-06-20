import React, { useMemo } from "react";
import { styles } from "../styles";
import { GHANA_TIMEZONE } from "../services/classCalendar";
import { formatSessionTimes } from "../services/liveClassCardHelpers";

const card = {
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 14,
  background: "#fff",
  display: "grid",
  gap: 8,
};

const dateLine = (session, formatDate, times) =>
  `${session.weekday}, ${formatDate(session.date)} · ${
    times?.ghanaRange || `${session.startTime}–${session.endTime}`
  } GMT`;

const Topics = ({ label, titles, fallback }) => (
  <p style={{ ...styles.helperText, margin: 0 }}>
    {label}: {titles?.join("; ") || fallback}
  </p>
);

const LiveClassSessionCards = ({
  cancelled,
  today,
  completed,
  next,
  locale,
  formatDate,
  translate,
  zoomUrl,
  joinLabel,
  canJoinNext,
  showCalendarCta,
  onCalendar,
  timeUntil,
}) => {
  const cancelledTimes = useMemo(() => formatSessionTimes(cancelled, locale), [cancelled, locale]);
  const todayTimes = useMemo(() => formatSessionTimes(today, locale), [today, locale]);
  const completedTimes = useMemo(() => formatSessionTimes(completed, locale), [completed, locale]);
  const nextTimes = useMemo(() => formatSessionTimes(next, locale), [next, locale]);
  const deviceZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const showDeviceTime = Boolean(deviceZone && deviceZone !== GHANA_TIMEZONE);

  return (
    <>
      {cancelled ? (
        <section style={{ ...card, borderColor: "#fecaca", background: "#fef2f2" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <h3 style={{ ...styles.sectionTitle, margin: 0 }}>Class cancelled</h3>
            <span style={{ ...styles.badge, background: "#fee2e2", color: "#991b1b" }}>
              Cancelled
            </span>
          </div>
          <p style={{ ...styles.helperText, margin: 0 }}>{dateLine(cancelled, formatDate, cancelledTimes)}</p>
          <p style={{ margin: 0 }}>
            {cancelled.cancellationReason || "This live class has been cancelled by the administrator."}
          </p>
        </section>
      ) : null}

      {today ? (
        <section style={{ ...card, borderColor: "#93c5fd", background: "#eff6ff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <h3 style={{ ...styles.sectionTitle, margin: 0 }}>
              {translate("classCalendar.today.title")}
            </h3>
            <span style={styles.badge}>{translate("classCalendar.today.badge")}</span>
          </div>
          <p style={{ ...styles.helperText, margin: 0 }}>{dateLine(today, formatDate, todayTimes)}</p>
          <Topics label="Chapters" titles={today.titles} fallback="Topics will be added by your administrator." />
          {zoomUrl ? (
            <a href={zoomUrl} target="_blank" rel="noreferrer" style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content" }}>
              {joinLabel}
            </a>
          ) : null}
        </section>
      ) : null}

      {completed ? (
        <section style={{ ...card, background: "#f1f5f9", borderColor: "#cbd5e1" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <h3 style={{ ...styles.sectionTitle, margin: 0 }}>Earlier today</h3>
            <span style={{ ...styles.badge, background: "#dcfce7", color: "#166534" }}>
              Completed
            </span>
          </div>
          <p style={{ ...styles.helperText, margin: 0 }}>{dateLine(completed, formatDate, completedTimes)}</p>
          <Topics label="Chapters" titles={completed.titles} fallback="Today’s live class has ended. The next class appears below." />
        </section>
      ) : null}

      {next ? (
        <section style={{ ...card, borderColor: "#dbeafe" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <h3 style={{ ...styles.sectionTitle, margin: 0 }}>
              {translate("classCalendar.next.title")}
            </h3>
            {timeUntil?.badge ? <span style={styles.badge}>{timeUntil.badge}</span> : null}
          </div>
          <p style={{ ...styles.helperText, margin: 0 }}>{dateLine(next, formatDate, nextTimes)}</p>
          {showDeviceTime && nextTimes?.localRange ? (
            <p style={{ ...styles.helperText, margin: 0 }}>Device time: {nextTimes.localRange}</p>
          ) : null}
          <Topics label="Chapters" titles={next.titles} fallback="Topics will be added by your administrator." />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            {canJoinNext && zoomUrl ? (
              <a href={zoomUrl} target="_blank" rel="noreferrer" style={{ ...styles.primaryButton, textDecoration: "none" }}>
                {joinLabel}
              </a>
            ) : null}
            {showCalendarCta ? (
              <button type="button" style={styles.secondaryButton} onClick={onCalendar}>
                {translate("classCalendar.actions.addToCalendar")}
              </button>
            ) : null}
            {timeUntil?.detail ? <span style={{ ...styles.helperText, margin: 0 }}>{timeUntil.detail}</span> : null}
          </div>
        </section>
      ) : null}
    </>
  );
};

export default LiveClassSessionCards;
