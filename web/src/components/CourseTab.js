import React, { useMemo, useState } from "react";
import { styles } from "../styles";
import { courseOverview } from "../data/courseData";
import { courseSchedules } from "../data/courseSchedule";

const StatCard = ({ label, value, helper }) => (
  <div style={{ ...styles.card, marginBottom: 0 }}>
    <div style={{ fontSize: 13, color: "#4b5563" }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{value}</div>
    {helper ? <div style={{ ...styles.helperText, margin: "6px 0 0" }}>{helper}</div> : null}
  </div>
);

const LessonList = ({ title, lessons }) => {
  if (!lessons.length) return null;

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <h4 style={{ margin: 0 }}>{title}</h4>
      <div style={{ display: "grid", gap: 8 }}>
        {lessons.map((lesson, index) => (
          <div
            key={`${lesson.chapter || title}-${index}`}
            style={{
              padding: 10,
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              background: "#f9fafb",
              display: "grid",
              gap: 6,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
              <div style={{ fontWeight: 700 }}>
                {lesson.chapter ? `Kapitel ${lesson.chapter}` : "Resource"}
              </div>
              {lesson.assignment ? <span style={styles.badge}>Assignment</span> : null}
            </div>
            <ul style={{ ...styles.checklist, margin: 0 }}>
              {lesson.video ? (
                <li>
                  <a href={lesson.video} target="_blank" rel="noreferrer">
                    Video ansehen
                  </a>
                </li>
              ) : null}
              {lesson.grammarbook_link ? (
                <li>
                  <a href={lesson.grammarbook_link} target="_blank" rel="noreferrer">
                    Grammarbook
                  </a>
                </li>
              ) : null}
              {lesson.workbook_link ? (
                <li>
                  <a href={lesson.workbook_link} target="_blank" rel="noreferrer">
                    Workbook
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

const CourseTab = () => {
  const levels = Object.keys(courseSchedules);
  const [selectedCourseLevel, setSelectedCourseLevel] = useState(levels[0] || "");

  const schedule = useMemo(() => courseSchedules[selectedCourseLevel] || [], [selectedCourseLevel]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <h2 style={styles.sectionTitle}>Course Home</h2>
          <span style={styles.badge}>Live aus Kurs-Dictionary</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          <StatCard
            label="Assignment Streak"
            value={`${courseOverview.assignmentStreak} Tage`}
            helper="Halte die Serie – jede Aufgabe zählt."
          />
          <StatCard
            label="Anwesenheit"
            value={`${courseOverview.attendanceRate}%`}
            helper={courseOverview.attendanceSummary}
          />
          <StatCard
            label="Nächste Session"
            value={courseOverview.upcomingSession.topic}
            helper={`${courseOverview.upcomingSession.materials} · Fokus: ${courseOverview.upcomingSession.focus}`}
          />
        </div>

        <div style={{ ...styles.card, display: "grid", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
            <h3 style={{ margin: 0 }}>Nächste empfohlene Aufgabe</h3>
            <span style={styles.levelPill}>Due: {courseOverview.nextAssignment.dueDate}</span>
          </div>
          <p style={{ ...styles.helperText, margin: 0 }}>{courseOverview.nextAssignment.title}</p>
          <p style={{ margin: 0 }}>{courseOverview.nextAssignment.description}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={styles.badge}>Kapitel 5</span>
            <span style={styles.badge}>Schreiben</span>
            <span style={styles.badge}>80–100 Wörter</span>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <h2 style={styles.sectionTitle}>Course Book</h2>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={styles.helperText}>Course level:</span>
            <select
              style={styles.select}
              value={selectedCourseLevel}
              onChange={(e) => setSelectedCourseLevel(e.target.value)}
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p style={styles.helperText}>
          Pulling content from the course dictionary. Select a level to see its full day-by-day plan.
        </p>

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {schedule.map((entry) => {
            const lesenHorenList = Array.isArray(entry.lesen_hören)
              ? entry.lesen_hören
              : entry.lesen_hören
              ? [entry.lesen_hören]
              : [];
            const schreibenSprechenList = entry.schreiben_sprechen
              ? Array.isArray(entry.schreiben_sprechen)
                ? entry.schreiben_sprechen
                : [entry.schreiben_sprechen]
              : [];

            return (
              <div key={`day-${entry.day}`} style={{ ...styles.card, marginBottom: 0, display: "grid", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <div>
                    <span style={styles.levelPill}>Day {entry.day}</span>
                    <h3 style={{ margin: "6px 0 4px 0" }}>{entry.topic}</h3>
                    {entry.chapter ? <div style={{ ...styles.helperText, marginBottom: 4 }}>Chapter: {entry.chapter}</div> : null}
                  </div>
                  <div style={{ display: "grid", gap: 6, justifyItems: "flex-end" }}>
                    {entry.assignment !== undefined ? (
                      <span style={styles.badge}>{entry.assignment ? "Assignment" : "Self-practice"}</span>
                    ) : null}
                    {entry.grammar_topic ? <span style={styles.levelPill}>{entry.grammar_topic}</span> : null}
                  </div>
                </div>

                {entry.goal ? <p style={{ margin: 0 }}>{entry.goal}</p> : null}
                {entry.instruction ? <p style={{ ...styles.helperText, margin: 0 }}>{entry.instruction}</p> : null}

                <LessonList title="Lesen & Hören" lessons={lesenHorenList} />
                <LessonList title="Schreiben & Sprechen" lessons={schreibenSprechenList} />

                {entry.schreiben ? (
                  <div style={{ display: "grid", gap: 6 }}>
                    <h4 style={{ margin: 0 }}>Schreiben</h4>
                    <p style={{ margin: 0 }}>{entry.schreiben}</p>
                  </div>
                ) : null}
                {entry.sprechen ? (
                  <div style={{ display: "grid", gap: 6 }}>
                    <h4 style={{ margin: 0 }}>Sprechen</h4>
                    <p style={{ margin: 0 }}>{entry.sprechen}</p>
                  </div>
                ) : null}
                {entry.zusatzmaterial ? (
                  <div style={{ display: "grid", gap: 6 }}>
                    <h4 style={{ margin: 0 }}>Zusatzmaterial</h4>
                    <p style={{ margin: 0 }}>{entry.zusatzmaterial}</p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseTab;
