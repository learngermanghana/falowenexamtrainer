import React, { useMemo } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { useParams } from "react-router-dom";
import { styles } from "../styles";
import { classCatalog } from "../data/classCatalog";
import { courseSchedulesByName } from "../data/courseSchedules";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
});

const formatDate = (value) => {
  if (!value) return "—";
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? value : dateFormatter.format(parsed);
};

const FullClassCalendarPage = () => {
  const { className: encodedClassName = "" } = useParams();
  const className = useMemo(() => {
    try {
      return decodeURIComponent(encodedClassName);
    } catch (error) {
      return encodedClassName;
    }
  }, [encodedClassName]);

  const classMeta = classCatalog[className] || null;
  const schedule = courseSchedulesByName[className] || null;

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <h1 style={{ ...styles.title, margin: 0 }}>Full class calendar</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>{className || "Class not found"}</p>
      </div>

      {classMeta ? (
        <section style={{ ...styles.card, display: "grid", gap: 10 }}>
          <h2 style={{ ...styles.sectionTitle, margin: 0 }}>Class overview</h2>
          <p style={{ ...styles.helperText, margin: 0 }}>
            {formatDate(classMeta.startDate)} → {formatDate(classMeta.endDate)}
          </p>
          <div style={{ display: "grid", gap: 6 }}>
            {(classMeta.schedule || []).map((slot) => (
              <div key={`${slot.day}-${slot.startTime}`} style={{ display: "flex", gap: 8 }}>
                <strong>{slot.day}</strong>
                <span>{slot.startTime} - {slot.endTime}</span>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section style={styles.card}>
          <p style={{ margin: 0 }}>No class calendar metadata was found for this route.</p>
        </section>
      )}

      {schedule?.days?.length ? (
        <section style={{ ...styles.card, display: "grid", gap: 10 }}>
          <h2 style={{ ...styles.sectionTitle, margin: 0 }}>Session plan</h2>
          <div style={{ display: "grid", gap: 8 }}>
            {schedule.days.map((day) => (
              <div key={`${day.dayNumber}-${day.date}`} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 10 }}>
                <div style={{ fontWeight: 700 }}>
                  Day {day.dayNumber} · {formatDate(day.date)}
                </div>
                <div style={{ marginTop: 4, color: "#334155", fontSize: 14 }}>
                  {(day.sessions || []).map((session) => session.title || session.chapter || session.type).filter(Boolean).join(" • ") || "Session details coming soon"}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section style={styles.card}>
          <p style={{ margin: 0 }}>No generated schedule days found yet for this class.</p>
        </section>
      )}
    </div>
  );
};

export default FullClassCalendarPage;
