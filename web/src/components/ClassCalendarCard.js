import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { classCatalog, ZOOM_DETAILS } from "../data/classCatalog";
import {
  downloadClassCalendar,
  buildGhanaDateTime,
  GHANA_TIMEZONE,
  findTodayClassSession,
  findNextClassSession,
  formatScheduleSummary,
} from "../services/classCalendar";
import { loadPreferredClass, savePreferredClass } from "../services/classSelectionStorage";

const ClassCalendarCard = ({ id, initialClassName }) => {
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
  const todayClass = useMemo(
    () => findTodayClassSession(selectedClass, now),
    [now, selectedClass]
  );
  const timeline = useMemo(() => {
    if (!classDetails?.startDate || !classDetails?.endDate) return null;

    const start = new Date(`${classDetails.startDate}T00:00:00`);
    const end = new Date(`${classDetails.endDate}T23:59:59`);
    const nowTime = now.getTime();
    const dayMs = 24 * 60 * 60 * 1000;

    const totalDuration = Math.max(end - start, dayMs);
    const elapsed = Math.min(Math.max(nowTime - start, 0), totalDuration);

    const percentComplete = Math.round((elapsed / totalDuration) * 100);
    const daysUntilStart = Math.max(0, Math.ceil((start - nowTime) / dayMs));
    const daysUntilEnd = Math.max(0, Math.ceil((end - nowTime) / dayMs));

    let status;
    if (nowTime < start) {
      status = `Starts in ${daysUntilStart} day${daysUntilStart === 1 ? "" : "s"}`;
    } else if (nowTime > end) {
      status = "Course finished";
    } else {
      status = `${daysUntilEnd} day${daysUntilEnd === 1 ? "" : "s"} left`;
    }

    return { percentComplete, daysUntilStart, daysUntilEnd, status };
  }, [classDetails?.endDate, classDetails?.startDate, now]);
  const minutesUntil = useMemo(() => {
    if (!nextClass?.startDateTime) return null;
    return Math.max(0, Math.round((nextClass.startDateTime - now) / 60000));
  }, [nextClass?.startDateTime, now]);

  const timeUntilDisplay = useMemo(() => {
    if (minutesUntil === null) return null;

    const minutesInDay = 24 * 60;
    if (minutesUntil === 0) {
      return { badge: "Starting now", detail: "Starting now" };
    }

    if (minutesUntil >= minutesInDay) {
      const daysUntil = Math.ceil(minutesUntil / minutesInDay);
      const suffix = daysUntil === 1 ? "" : "s";
      return {
        badge: `${daysUntil} day${suffix} left`,
        detail: `Starts in ${daysUntil} day${suffix}`,
      };
    }

    const suffix = minutesUntil === 1 ? "" : "s";
    return {
      badge: `${minutesUntil} min left`,
      detail: `Starts in ${minutesUntil} minute${suffix}`,
    };
  }, [minutesUntil]);

  const nextClassTimes = useMemo(() => {
    if (!nextClass?.date || !nextClass?.startTime) return null;
    const start = buildGhanaDateTime(nextClass.date, nextClass.startTime);
    const end = nextClass.endTime ? buildGhanaDateTime(nextClass.date, nextClass.endTime) : null;
    if (!start) return null;

    const ghanaFormatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: GHANA_TIMEZONE,
      hour: "2-digit",
      minute: "2-digit",
    });
    const localFormatter = new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });

    const ghanaRange = `${ghanaFormatter.format(start)}${end ? `–${ghanaFormatter.format(end)}` : ""}`;
    const localRange = `${localFormatter.format(start)}${end ? `–${localFormatter.format(end)}` : ""}`;

    return { ghanaRange, localRange };
  }, [nextClass?.date, nextClass?.endTime, nextClass?.startTime]);

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
    <div id={id} style={{ ...styles.card, display: "grid", gap: 10 }}>
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

        {timeline ? (
          <div style={{ ...styles.field, margin: 0 }}>
            <label style={styles.label}>Timeline</label>
            <div style={{ ...styles.card, background: "#f3f4f6", margin: 0, gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700 }}>{timeline.status}</span>
                <span style={styles.badge}>{timeline.percentComplete}% done</span>
              </div>
              <div style={{ position: "relative", height: 10, background: "#e5e7eb", borderRadius: 999 }}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: `${timeline.percentComplete}%`,
                    background: "linear-gradient(90deg, #2563eb, #7c3aed)",
                    borderRadius: 999,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              <p style={{ ...styles.helperText, margin: 0 }}>
                {timeline.daysUntilStart > 0
                  ? `${timeline.daysUntilStart} day${timeline.daysUntilStart === 1 ? "" : "s"} until kickoff`
                  : timeline.daysUntilEnd > 0
                  ? `${timeline.daysUntilEnd} day${timeline.daysUntilEnd === 1 ? "" : "s"} until graduation`
                  : "This class has finished."}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {todayClass ? (
        <div style={{ ...styles.card, background: "#f8fafc", margin: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <h3 style={{ ...styles.sectionTitle, margin: 0 }}>Today&apos;s lesson</h3>
            <span style={styles.badge}>Today</span>
          </div>
          <p style={{ ...styles.helperText, margin: "6px 0" }}>
            {todayClass.weekday}, {todayClass.date} · {todayClass.startTime}–{todayClass.endTime}
          </p>
          <p style={{ ...styles.helperText, margin: "0 0 6px 0" }}>
            Chapters: {todayClass.titles?.join("; ")}
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
            <span style={{ ...styles.helperText, margin: 0 }}>Session in progress today.</span>
          </div>
        </div>
      ) : null}

      {nextClass ? (
        <div style={{ ...styles.card, background: "#f9fafb", margin: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <h3 style={{ ...styles.sectionTitle, margin: 0 }}>Next live class</h3>
            {timeUntilDisplay?.badge ? <span style={styles.badge}>{timeUntilDisplay.badge}</span> : null}
          </div>
          <p style={{ ...styles.helperText, margin: "6px 0" }}>
            {nextClass.weekday}, {nextClass.date} · {nextClassTimes?.ghanaRange || `${nextClass.startTime}–${nextClass.endTime}`}{" "}
            (GMT, Ghana)
          </p>
          {nextClassTimes?.localRange ? (
            <p style={{ ...styles.helperText, margin: "0 0 6px 0" }}>Your local time: {nextClassTimes.localRange}</p>
          ) : null}
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
            {timeUntilDisplay?.detail ? (
              <span style={{ ...styles.helperText, margin: 0 }}>{timeUntilDisplay.detail}</span>
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
