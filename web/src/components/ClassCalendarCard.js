import React, { useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../styles";
import { classCatalog, ZOOM_DETAILS } from "../data/classCatalog";
import {
  downloadCalendarAfterHydration,
  downloadClassCalendar,
  formatScheduleSummary,
} from "../services/classCalendar";
import { loadPreferredClass, savePreferredClass } from "../services/classSelectionStorage";
import { useAuth } from "../context/AuthContext";

const ClassCalendarCard = () => {
  const { studentProfile, persistStudentClassName } = useAuth();
  const catalogEntries = useMemo(() => Object.keys(classCatalog), []);
  const fallbackClass = useMemo(() => catalogEntries[0], [catalogEntries]);
  const [selectedClass, setSelectedClass] = useState(
    () => loadPreferredClass() || fallbackClass
  );
  const [cloudSaveWarning, setCloudSaveWarning] = useState("");
  const hydratedClassRef = useRef(null);

  useEffect(() => {
    if (studentProfile?.className) {
      const normalizedClass = studentProfile.className;
      setSelectedClass((current) =>
        current === normalizedClass ? current : normalizedClass
      );
      savePreferredClass(normalizedClass);

      if (hydratedClassRef.current !== normalizedClass) {
        hydratedClassRef.current = normalizedClass;
        downloadCalendarAfterHydration(normalizedClass);
      }
      return;
    }

    setSelectedClass((current) => current || loadPreferredClass() || fallbackClass);
  }, [downloadCalendarAfterHydration, fallbackClass, studentProfile?.className]);

  useEffect(() => {
    if (!selectedClass) return;
    if (classCatalog[selectedClass]) return;
    setSelectedClass(fallbackClass);
  }, [fallbackClass, selectedClass]);

  const classDetails = classCatalog[selectedClass];

  const handleChange = async (event) => {
    const value = event.target.value;
    setCloudSaveWarning("");
    setSelectedClass(value);
    savePreferredClass(value);

    try {
      const result = await persistStudentClassName(value);
      if (result?.reason === "permission-denied") {
        setCloudSaveWarning(
          "We couldn't save your class to the cloud. We'll remember it on this device."
        );
      }
    } catch (error) {
      console.error("Failed to persist class selection", error);
      setCloudSaveWarning(
        "We couldn't sync your class selection right now. We'll keep it saved locally."
      );
    }
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
      {cloudSaveWarning ? (
        <div
          style={{
            ...styles.helperText,
            margin: 0,
            padding: "8px 12px",
            background: "#fff7ed",
            border: "1px solid #fdba74",
            borderRadius: 10,
          }}
        >
          {cloudSaveWarning}
        </div>
      ) : null}

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
          Adds every scheduled session to your calendar with the Zoom link prefilled. Android/desktop users can import the
          ICS file into Google Calendar.
        </span>
      </div>
    </div>
  );
};

export default ClassCalendarCard;
