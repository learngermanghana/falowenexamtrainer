import React from "react";
import { styles } from "../styles";
import { formatPercent } from "../lib/formatters";
import { formatScheduleSummary } from "../services/classCalendar";

const card = {
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 14,
  background: "#fff",
  display: "grid",
  gap: 8,
};

const LiveClassOverview = ({
  id,
  translate,
  live,
  locked,
  selectedClass,
  names,
  onClassChange,
  details,
  formatDate,
  zoom,
  joinLabel,
  timeline,
  locale,
  formatTimeUnit,
}) => (
  <>
    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
      <div>
        <h2 style={{ ...styles.sectionTitle, margin: 0 }}>
          {translate("classCalendar.heading")}
        </h2>
        <p style={{ ...styles.helperText, margin: "4px 0 0" }}>
          {translate("classCalendar.shortHelper", {
            defaultValue: "Use this page to join Zoom and add your class dates to your calendar.",
          })}
        </p>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {live ? (
          <span style={{ ...styles.badge, background: "#dbeafe", color: "#1e40af" }}>
            Live schedule
          </span>
        ) : null}
        <span style={{ ...styles.badge, background: "#dcfce7", color: "#166534" }}>
          {translate("classCalendar.zoomReady")}
        </span>
      </div>
    </div>

    <section style={{ ...card, background: "linear-gradient(135deg, #eff6ff, #fff)", borderColor: "#bfdbfe" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <div>
          <span style={{ ...styles.helperText, fontWeight: 800, color: "#1e40af" }}>
            Your class
          </span>
          {locked ? (
            <h3 style={{ margin: "4px 0 0", fontSize: 22 }}>
              {live?.klass?.name || selectedClass}
            </h3>
          ) : (
            <select
              id={id ? `${id}-class-select` : "class-calendar-select"}
              style={{ ...styles.select, marginTop: 6 }}
              value={selectedClass}
              onChange={onClassChange}
            >
              {names.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          )}
          <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
            {formatScheduleSummary(details.schedule || [])}
          </p>
        </div>
        {details.startDate && details.endDate ? (
          <span style={{ ...styles.badge, background: "#e0f2fe", color: "#0f172a" }}>
            {formatDate(details.startDate)} → {formatDate(details.endDate)}
          </span>
        ) : null}
      </div>

      {zoom.url ? (
        <a
          href={zoom.url}
          target="_blank"
          rel="noreferrer"
          style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content" }}
        >
          {joinLabel}
        </a>
      ) : null}

      <div style={{ ...card, padding: "10px 12px", background: "#eff6ff", color: "#1e3a8a" }}>
        <strong>Zoom details</strong>
        <span>
          {zoom.meetingId || zoom.passcode
            ? translate("classCalendar.zoomDetails", {
                meetingId: zoom.meetingId || "Not provided",
                passcode: zoom.passcode || "Not provided",
              })
            : "Zoom details will appear when Falowen Admin assigns a meeting profile."}
        </span>
      </div>
    </section>

    {timeline ? (
      <section style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <strong>{timeline.status}</strong>
          <span style={styles.badge}>
            {translate("classCalendar.percentDone", {
              percent: formatPercent(timeline.percentComplete / 100, { locale }),
            })}
          </span>
        </div>
        <div style={{ height: 10, background: "#e5e7eb", borderRadius: 999 }}>
          <div
            style={{
              height: "100%",
              width: `${timeline.percentComplete}%`,
              background: "linear-gradient(90deg, #2563eb, #7c3aed)",
              borderRadius: 999,
            }}
          />
        </div>
        <p style={{ ...styles.helperText, margin: 0 }}>
          {timeline.daysUntilStart > 0
            ? translate("classCalendar.timeline.untilKickoff", {
                time: formatTimeUnit("day", timeline.daysUntilStart),
              })
            : timeline.daysUntilEnd > 0
              ? translate("classCalendar.timeline.untilGraduation", {
                  time: formatTimeUnit("day", timeline.daysUntilEnd),
                })
              : translate("classCalendar.timeline.finished")}
        </p>
      </section>
    ) : null}
  </>
);

export default LiveClassOverview;
