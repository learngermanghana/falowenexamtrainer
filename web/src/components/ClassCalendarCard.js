import React, { useMemo, useState } from "react";
import { styles } from "../styles";
import { classCatalog, ZOOM_DETAILS } from "../data/classCatalog";
import { downloadClassCalendar, formatScheduleSummary } from "../services/classCalendar";
import { loadPreferredClass, savePreferredClass } from "../services/classSelectionStorage";
import {
  buildSessionSummary,
  computeNextSession,
  getCourseTitle,
  getDaysUntilEnd,
  getScheduleDetails,
} from "../services/classScheduleTracker";

const ClassCalendarCard = () => {
  const catalogEntries = useMemo(() => Object.keys(classCatalog), []);
  const [selectedClass, setSelectedClass] = useState(
    loadPreferredClass() || catalogEntries[0]
  );

  const classDetails = classCatalog[selectedClass];
  const scheduleDetails = getScheduleDetails(selectedClass);
  const nextSession = useMemo(
    () => computeNextSession(selectedClass, new Date()),
    [selectedClass]
  );
  const daysLeft = useMemo(() => getDaysUntilEnd(selectedClass, new Date()), [selectedClass]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedClass(value);
    savePreferredClass(value);
  };

  if (!classDetails) return null;

  return (
    <div style={{ ...styles.card, display: "grid", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <h2 style={{ ...styles.sectionTitle, margin: 0 }}>Live class access</h2>
        <span style={styles.badge}>Zoom ready</span>
      </div>
      <p style={{ ...styles.helperText, marginBottom: 0 }}>
        Choose your cohort to get the official Zoom link, docs, and a downloadable calendar you can add to your
        phone (ICS for iPhone/Android).
      </p>

      <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        <div style={{ ...styles.field, margin: 0 }}>
          <label style={styles.label}>Your class</label>
          <select style={styles.select} value={selectedClass} onChange={handleChange}>
            {catalogEntries.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
          <p style={{ ...styles.helperText, margin: "4px 0 0" }}>
            {formatScheduleSummary(classDetails.schedule)}
          </p>
        </div>

        <div style={{ ...styles.field, margin: 0 }}>
          <label style={styles.label}>Zoom meeting</label>
          <a href={ZOOM_DETAILS.url} style={{ color: "#2563eb", fontWeight: 700 }} target="_blank" rel="noreferrer">
            Join Zoom Meeting
          </a>
          <p style={{ ...styles.helperText, margin: "4px 0 0" }}>
            Meeting ID: {ZOOM_DETAILS.meetingId} · Passcode: {ZOOM_DETAILS.passcode}
          </p>
        </div>

        <div style={{ ...styles.field, margin: 0 }}>
          <label style={styles.label}>Course docs</label>
          <a href={classDetails.docUrl} style={{ color: "#2563eb", fontWeight: 700 }} target="_blank" rel="noreferrer">
            Open class materials
          </a>
          <p style={{ ...styles.helperText, margin: "4px 0 0" }}>
            {classDetails.startDate} → {classDetails.endDate}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button style={styles.primaryButton} type="button" onClick={() => downloadClassCalendar(selectedClass)}>
          Download calendar (.ics)
        </button>
        <span style={{ ...styles.helperText, margin: 0 }}>
          Adds every scheduled session to your device calendar with the Zoom link prefilled.
        </span>
      </div>

      {scheduleDetails && (
        <div
          style={{
            marginTop: 8,
            padding: 12,
            borderRadius: 8,
            background: "#f0f9ff",
            border: "1px solid #bae6fd",
            display: "grid",
            gap: 6,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <div>
              <div style={{ fontWeight: 700 }}>{getCourseTitle(selectedClass) || scheduleDetails.title}</div>
              <div style={{ ...styles.helperText, margin: 0 }}>{scheduleDetails.className}</div>
            </div>
            <span style={{ ...styles.badge, background: "#0ea5e9", color: "white" }}>Next class</span>
          </div>

          {nextSession ? (
            <>
              <div style={{ fontWeight: 700 }}>
                {nextSession.weekday}, {nextSession.humanDate} · {nextSession.startTime} ({scheduleDetails.timezone})
              </div>
              <div style={{ ...styles.helperText, margin: 0 }}>
                Topics: {buildSessionSummary(nextSession.sessions)}
              </div>
              <div style={{ ...styles.helperText, margin: 0 }}>
                {nextSession.minutesUntilStart} minutes left · {daysLeft ?? "?"} days until course end
              </div>
            </>
          ) : (
            <div style={{ ...styles.helperText, margin: 0 }}>
              All scheduled sessions are complete for this class.
            </div>
          )}

          {scheduleDetails.generatedNote && (
            <div style={{ ...styles.helperText, margin: 0 }}>{scheduleDetails.generatedNote}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassCalendarCard;
