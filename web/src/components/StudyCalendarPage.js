import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { goetheExamLevels } from "../data/goetheExamSchedule";
import { downloadStudyCalendar } from "../services/examCalendar";

const DAYS_OF_WEEK = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 0 },
];

const formatInputDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
};

const shiftDate = (value, days) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  date.setDate(date.getDate() + days);
  return formatInputDate(date);
};

const StudyCalendarPage = () => {
  const [selectedLevel, setSelectedLevel] = useState(goetheExamLevels[0]?.level || "B1");
  const [examDate, setExamDate] = useState("");
  const [startDate, setStartDate] = useState(formatInputDate(new Date()));
  const [endDate, setEndDate] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("18:00");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [reminderMinutes, setReminderMinutes] = useState(1440);
  const [activeDays, setActiveDays] = useState([1, 2, 3, 4, 5]);

  const levelInfo = useMemo(
    () => goetheExamLevels.find((level) => level.level === selectedLevel) || goetheExamLevels[0],
    [selectedLevel]
  );

  const examDates = useMemo(() => levelInfo?.exams || [], [levelInfo]);

  useEffect(() => {
    if (examDates.length > 0) {
      setExamDate(examDates[0].date);
    } else {
      setExamDate("");
    }
  }, [examDates]);

  useEffect(() => {
    if (!examDate) {
      setEndDate("");
      return;
    }
    setEndDate(shiftDate(examDate, -1));
  }, [examDate]);

  const toggleDay = (value) => {
    setActiveDays((prev) =>
      prev.includes(value) ? prev.filter((day) => day !== value) : [...prev, value]
    );
  };

  const isFormReady = Boolean(selectedLevel && startDate && endDate && activeDays.length > 0);

  const handleDownload = () => {
    if (!isFormReady) return;
    downloadStudyCalendar({
      level: selectedLevel,
      startDate,
      endDate,
      daysOfWeek: activeDays,
      timeOfDay,
      durationMinutes: Number(durationMinutes),
      reminderMinutes: Number(reminderMinutes),
    });
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={styles.card}>
        <p style={{ ...styles.helperText, margin: 0 }}>Study calendar builder</p>
        <h2 style={{ ...styles.sectionTitle, margin: "4px 0" }}>Create a Goethe study calendar</h2>
        <p style={{ ...styles.helperText, margin: "6px 0 0 0" }}>
          Pick your exam date, set how often you want to study, and download a calendar file to add
          to your phone.
        </p>
      </section>

      <section style={{ ...styles.card, display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <label style={styles.helperText}>Exam level</label>
          <select
            value={selectedLevel}
            onChange={(event) => setSelectedLevel(event.target.value)}
            style={{ ...styles.input, padding: "8px 10px", borderRadius: 8 }}
          >
            {goetheExamLevels.map((level) => (
              <option key={level.level} value={level.level}>
                {level.level} · {level.title}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <label style={styles.helperText}>Exam date</label>
          {examDates.length > 0 ? (
            <select
              value={examDate}
              onChange={(event) => setExamDate(event.target.value)}
              style={{ ...styles.input, padding: "8px 10px", borderRadius: 8 }}
            >
              {examDates.map((exam) => (
                <option key={`${selectedLevel}-${exam.date}`} value={exam.date}>
                  {formatInputDate(exam.date)} · {levelInfo.location}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="date"
              value={examDate}
              onChange={(event) => setExamDate(event.target.value)}
              style={{ ...styles.input, padding: "8px 10px", borderRadius: 8 }}
            />
          )}
          <p style={{ ...styles.helperText, margin: 0 }}>
            Don’t see a listed exam date? Enter one manually to build your plan.
          </p>
        </div>

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <div style={{ display: "grid", gap: 8 }}>
            <label style={styles.helperText}>Study start date</label>
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              style={{ ...styles.input, padding: "8px 10px", borderRadius: 8 }}
            />
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            <label style={styles.helperText}>Study end date</label>
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              style={{ ...styles.input, padding: "8px 10px", borderRadius: 8 }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <label style={styles.helperText}>Study days</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day.label}
                type="button"
                onClick={() => toggleDay(day.value)}
                style={activeDays.includes(day.value) ? styles.navButtonActive : styles.navButton}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <div style={{ display: "grid", gap: 8 }}>
            <label style={styles.helperText}>Study time</label>
            <input
              type="time"
              value={timeOfDay}
              onChange={(event) => setTimeOfDay(event.target.value)}
              style={{ ...styles.input, padding: "8px 10px", borderRadius: 8 }}
            />
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            <label style={styles.helperText}>Session length</label>
            <select
              value={durationMinutes}
              onChange={(event) => setDurationMinutes(event.target.value)}
              style={{ ...styles.input, padding: "8px 10px", borderRadius: 8 }}
            >
              {[30, 45, 60, 90].map((value) => (
                <option key={value} value={value}>
                  {value} minutes
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            <label style={styles.helperText}>Reminder</label>
            <select
              value={reminderMinutes}
              onChange={(event) => setReminderMinutes(event.target.value)}
              style={{ ...styles.input, padding: "8px 10px", borderRadius: 8 }}
            >
              <option value={0}>No reminder</option>
              <option value={60}>1 hour before</option>
              <option value={180}>3 hours before</option>
              <option value={720}>12 hours before</option>
              <option value={1440}>1 day before</option>
            </select>
          </div>
        </div>

        <button type="button" style={styles.primaryButton} onClick={handleDownload} disabled={!isFormReady}>
          Download study calendar (.ics)
        </button>
        {!isFormReady ? (
          <p style={{ ...styles.helperText, margin: 0 }}>
            Select dates and at least one study day to generate your calendar.
          </p>
        ) : null}
      </section>

      <section style={styles.card}>
        <h3 style={{ ...styles.sectionTitle, margin: "0 0 6px 0" }}>How reminders work</h3>
        <ul style={{ ...styles.checklist, margin: 0 }}>
          <li>Add the downloaded file to Google Calendar, iOS Calendar, or Outlook.</li>
          <li>Each study session gets its own reminder based on your selected lead time.</li>
          <li>You can edit or delete sessions later in your calendar app.</li>
        </ul>
      </section>
    </div>
  );
};

export default StudyCalendarPage;
