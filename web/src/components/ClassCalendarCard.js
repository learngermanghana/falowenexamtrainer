import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { classCatalog, ZOOM_DETAILS } from "../data/classCatalog";
import {
  downloadClassCalendar,
  findNextClassSession,
  formatScheduleSummary,
} from "../services/classCalendar";
import { loadPreferredClass, savePreferredClass } from "../services/classSelectionStorage";

const ClassCalendarCard = ({ initialClassName }) => {
  const catalogEntries = useMemo(() => Object.keys(classCatalog), []);
  const defaultClass = useMemo(() => {
    if (initialClassName && catalogEntries.includes(initialClassName)) {
      return initialClassName;
    }
    const stored = loadPreferredClass();
    if (stored && catalogEntries.includes(stored)) return stored;
    return catalogEntries[0];
  }, [catalogEntries, initialClassName]);

  const [selectedClass, setSelectedClass] = useState(defaultClass);
  const [now, setNow] = useState(new Date());

  const classDetails = classCatalog[selectedClass];
  const nextClass = useMemo(
    () => findNextClassSession(selectedClass, now),
    [now, selectedClass]
  );
  const minutesUntil = useMemo(() => {
    if (!nextClass?.startDateTime) return null;
    return Math.max(0, Math.round((nextClass.startDateTime - now) / 60000));
  }, [nextClass?.startDateTime, now]);

  useEffect(() => {
    setSelectedClass(defaultClass);
  }, [defaultClass]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

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
        Choose your cohort to get the official Zoom link, docs, and a downloadable calendar. The ICS file works on
        iPhone, Android (import into Google Calendar), and desktop calendars.
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

      {nextClass ? (
        <div style={{ ...styles.card, background: "#f9fafb", margin: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <h3 style={{ ...styles.sectionTitle, margin: 0 }}>Next live class</h3>
            {minutesUntil !== null ? (
              <span style={styles.badge}>
                {minutesUntil === 0 ? "Starting now" : `${minutesUntil} min left`}
              </span>
            ) : null}
          </div>
          <p style={{ ...styles.helperText, margin: "6px 0" }}>
            {nextClass.weekday}, {nextClass.date} · {nextClass.startTime}–{nextClass.endTime}
          </p>
          <p style={{ ...styles.helperText, margin: "0 0 6px 0" }}>
            Chapters: {nextClass.titles?.join("; ")}
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <a
              href={ZOOM_DETAILS.url}
              target="_blank"
              rel="noreferrer"
              style={{ ...styles.primaryButton, textDecoration: "none", textAlign: "center" }}
            >
              Join now
            </a>
            {minutesUntil !== null ? (
              <span style={{ ...styles.helperText, margin: 0 }}>
                Starts in {minutesUntil} minute{minutesUntil === 1 ? "" : "s"}
              </span>
            ) : null}
          </div>
        </div>
      ) : (
        <div style={{ ...styles.helperText, margin: 0 }}>
          No upcoming sessions found for this class. Choose a different class to refresh the schedule.
        </div>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button style={styles.primaryButton} type="button" onClick={() => downloadClassCalendar(selectedClass)}>
          Download calendar (.ics)
        </button>
        <span style={{ ...styles.helperText, margin: 0 }}>
          Adds every scheduled session to your calendar with the Zoom link prefilled. Android/desktop users can import the
          ICS file into Google Calendar.
        </span>
      </div>
    </div>
  );
};

export default ClassCalendarCard;
