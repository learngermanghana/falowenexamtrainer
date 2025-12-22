import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { courseSchedules } from "../data/courseSchedule";

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

const normalizeLevel = (level) => (level || "").toUpperCase();

const CourseTab = ({ defaultLevel }) => {
  const levels = useMemo(() => {
    const baseLevels = Object.keys(courseSchedules);
    const normalizedDefault = normalizeLevel(defaultLevel);

    if (normalizedDefault && !baseLevels.includes(normalizedDefault)) {
      return [...baseLevels, normalizedDefault];
    }

    return baseLevels;
  }, [defaultLevel]);
  const [selectedCourseLevel, setSelectedCourseLevel] = useState(() => {
    const normalizedDefault = normalizeLevel(defaultLevel);
    if (normalizedDefault && levels.includes(normalizedDefault)) return normalizedDefault;
    return levels[0] || "";
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [assignmentsOnly, setAssignmentsOnly] = useState(false);

  useEffect(() => {
    const normalizedDefault = normalizeLevel(defaultLevel);
    if (
      normalizedDefault &&
      levels.includes(normalizedDefault) &&
      normalizedDefault !== selectedCourseLevel
    ) {
      setSelectedCourseLevel(normalizedDefault);
    }
  }, [defaultLevel, levels, selectedCourseLevel]);

  const schedule = useMemo(() => courseSchedules[selectedCourseLevel] || [], [selectedCourseLevel]);

  const filteredSchedule = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    const matchesSearch = (entry) => {
      if (!normalizedTerm) return true;
      const dayMatches = `${entry.day}`.includes(normalizedTerm);
      const topicMatches = (entry.topic || "").toLowerCase().includes(normalizedTerm);
      const chapterMatches = (entry.chapter || "").toLowerCase().includes(normalizedTerm);
      const grammarMatches = (entry.grammar_topic || "").toLowerCase().includes(normalizedTerm);

      return dayMatches || topicMatches || chapterMatches || grammarMatches;
    };

    const hasAssignment = (entry) => {
      if (entry.assignment) return true;

      const toArray = (value) =>
        Array.isArray(value) ? value : value ? [value] : [];

      return (
        toArray(entry.lesen_hören).some((lesson) => lesson.assignment) ||
        toArray(entry.schreiben_sprechen).some((lesson) => lesson.assignment)
      );
    };

    return schedule.filter((entry) => matchesSearch(entry) && (!assignmentsOnly || hasAssignment(entry)));
  }, [schedule, searchTerm, assignmentsOnly]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gap: 12 }}>
        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >
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
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
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

          <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={styles.helperText}>Search by day, topic, or grammar focus</span>
              <input
                style={{ ...styles.input, width: "100%" }}
                placeholder="e.g., Day 4 or Pronouns"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={assignmentsOnly}
                onChange={(e) => setAssignmentsOnly(e.target.checked)}
              />
              <span style={styles.helperText}>Show only items with assignments</span>
            </label>
          </div>
        </div>
        <p style={styles.helperText}>
          Pulling content from the course dictionary. Select a level to see its full day-by-day plan. Use search or the
          assignment filter to jump straight to what you need.
        </p>

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {filteredSchedule.map((entry) => {
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
          {!filteredSchedule.length ? (
            <div style={{ ...styles.card, marginBottom: 0 }}>
              <p style={{ margin: 0 }}>No course days match your filters. Try another search term or turn off the assignment filter.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CourseTab;
