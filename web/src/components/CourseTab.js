import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { courseSchedules } from "../data/courseSchedule";
import { courseSchedulesByName } from "../data/courseSchedules";
import { classCatalog } from "../data/classCatalog";

const normalizeLevel = (level) => (level || "").toUpperCase();

const LEVEL_FALLBACK_RESOURCES = {
  A2: {
    video: "https://youtu.be/a1-day0-tutorial",
    grammarbook_link: classCatalog?.["A2 Bonn Klasse"]?.docUrl || null,
    workbook_link: classCatalog?.["A2 Bonn Klasse"]?.docUrl || null,
    instructionNote:
      "Course book links use the A2 class folder until the full A2 course book dictionary is loaded.",
  },
};

const buildLevelSchedules = () => {
  const derivedSchedules = {};
  const derivedLevels = new Set();

  Object.values(courseSchedulesByName).forEach((schedule) => {
    const level = normalizeLevel(schedule.course);
    if (!level || courseSchedules[level] || derivedSchedules[level]) return;

    derivedLevels.add(level);
    const fallback = LEVEL_FALLBACK_RESOURCES[level] || {};

    derivedSchedules[level] = (schedule.days || []).map((day) => {
      const sessions = day.sessions || [];
      const primarySession = sessions[0] || {};
      let usedFallbackResource = false;

      const lessonList = sessions.map((session, index) => {
        const video = session.video || session.youtube_link || fallback.video || null;
        const grammarbook_link = session.grammarbook_link ?? fallback.grammarbook_link ?? null;
        const workbook_link = session.workbook_link ?? fallback.workbook_link ?? null;

        usedFallbackResource =
          usedFallbackResource ||
          (!session.video && !session.youtube_link && Boolean(fallback.video)) ||
          (!session.grammarbook_link && Boolean(fallback.grammarbook_link)) ||
          (!session.workbook_link && Boolean(fallback.workbook_link));

        return {
          chapter: session.chapter || session.title || `Session ${index + 1}`,
          title: session.title,
          // ✅ FIX: keep real assignment value if it exists
          assignment: Boolean(session.assignment),
          note: session.note,
          type: session.type,
          video,
          youtube_link: session.youtube_link || session.video || fallback.video || null,
          grammarbook_link,
          workbook_link,
        };
      });

      const notes = lessonList.map((lesson) => lesson.note).filter(Boolean);
      const instructionNote =
        usedFallbackResource && fallback.instructionNote ? ` ${fallback.instructionNote}` : "";

      return {
        day: day.dayNumber,
        topic: primarySession.title || primarySession.chapter || `Day ${day.dayNumber}`,
        chapter: primarySession.chapter || primarySession.title || null,
        instruction:
          notes.length > 0
            ? `${notes.join(" • ")}${instructionNote}`
            : `${schedule.generatedNote || `Class plan for ${schedule.className}`}${instructionNote}`,
        grammar_topic: primarySession.type || null,
        lesen_hören: lessonList,
      };
    });
  });

  return { schedules: { ...courseSchedules, ...derivedSchedules }, derivedLevels };
};

const { schedules: mergedCourseSchedules, derivedLevels } = buildLevelSchedules();

const toLessonArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const getLessonKey = (lesson) =>
  [
    lesson.chapter || lesson.title || "",
    lesson.video || "",
    lesson.youtube_link || "",
    lesson.grammarbook_link || "",
    lesson.workbook_link || "",
    Boolean(lesson.assignment),
  ].join("::");

const LessonList = ({ title, lessons }) => {
  const uniqueLessons = useMemo(() => {
    const seen = new Set();
    return lessons.filter((lesson) => {
      const key = getLessonKey(lesson);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [lessons]);

  if (!uniqueLessons.length) return null;

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <h4 style={{ margin: 0 }}>{title}</h4>
      <div style={{ display: "grid", gap: 8 }}>
        {uniqueLessons.map((lesson, index) => (
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
              <div style={{ fontWeight: 700 }}>{lesson.chapter ? `Kapitel ${lesson.chapter}` : "Resource"}</div>
              {lesson.assignment ? <span style={styles.badge}>Assignment</span> : null}
            </div>

            <ul style={{ ...styles.checklist, margin: 0 }}>
              {lesson.video || lesson.youtube_link ? (
                <li>
                  <a href={lesson.video || lesson.youtube_link} target="_blank" rel="noreferrer">
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

const CourseTab = ({ defaultLevel }) => {
  const levels = useMemo(() => {
    const baseLevels = Object.keys(mergedCourseSchedules);
    const normalizedDefault = normalizeLevel(defaultLevel);
    const merged = normalizedDefault && !baseLevels.includes(normalizedDefault) ? [...baseLevels, normalizedDefault] : baseLevels;
    // optional: stable order
    return merged.sort((a, b) => a.localeCompare(b));
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
    if (normalizedDefault && levels.includes(normalizedDefault) && normalizedDefault !== selectedCourseLevel) {
      setSelectedCourseLevel(normalizedDefault);
    }
  }, [defaultLevel, levels, selectedCourseLevel]);

  const schedule = useMemo(() => mergedCourseSchedules[selectedCourseLevel] || [], [selectedCourseLevel]);
  const isDerivedLevel = useMemo(() => derivedLevels.has(selectedCourseLevel), [selectedCourseLevel]);

  const filteredSchedule = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    const matchesSearch = (entry) => {
      if (!normalizedTerm) return true;
      return (
        `${entry.day}`.includes(normalizedTerm) ||
        (entry.topic || "").toLowerCase().includes(normalizedTerm) ||
        (entry.chapter || "").toLowerCase().includes(normalizedTerm) ||
        (entry.grammar_topic || "").toLowerCase().includes(normalizedTerm)
      );
    };

    const hasAssignment = (entry) => {
      if (entry.assignment) return true;
      return (
        toLessonArray(entry.lesen_hören).some((lesson) => lesson.assignment) ||
        toLessonArray(entry.schreiben_sprechen).some((lesson) => lesson.assignment)
      );
    };

    return schedule.filter((entry) => matchesSearch(entry) && (!assignmentsOnly || hasAssignment(entry)));
  }, [schedule, searchTerm, assignmentsOnly]);

  const quickActions = useMemo(() => {
    const entry = filteredSchedule[0];
    if (!entry) return null;

    const lessons = [...toLessonArray(entry.lesen_hören), ...toLessonArray(entry.schreiben_sprechen)];
    const findLink = (key) => lessons.find((lesson) => lesson?.[key])?.[key] || null;
    const videoLesson = lessons.find((lesson) => lesson?.video || lesson?.youtube_link);

    return {
      day: entry.day,
      topic: entry.topic,
      video: videoLesson?.video || videoLesson?.youtube_link || null,
      grammarbook: findLink("grammarbook_link"),
      workbook: findLink("workbook_link"),
    };
  }, [filteredSchedule]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <h2 style={styles.sectionTitle}>Course Book</h2>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <span style={styles.helperText}>Course level:</span>
              <select style={styles.select} value={selectedCourseLevel} onChange={(e) => setSelectedCourseLevel(e.target.value)}>
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
              <input type="checkbox" checked={assignmentsOnly} onChange={(e) => setAssignmentsOnly(e.target.checked)} />
              <span style={styles.helperText}>Show only items with assignments</span>
            </label>
          </div>
        </div>

        <p style={styles.helperText}>
          {isDerivedLevel
            ? "This level uses the class schedule because the course book dictionary does not yet include it."
            : "Pulling content from the course dictionary. Select a level to see its full day-by-day plan. Use search or the assignment filter to jump straight to what you need."}
        </p>

        {quickActions && (quickActions.video || quickActions.grammarbook || quickActions.workbook) ? (
          <div style={{ ...styles.card, marginBottom: 0, padding: 12, display: "grid", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
              <div style={{ fontWeight: 700 }}>Quick actions</div>
              <div style={styles.helperText}>
                From Day {quickActions.day}: {quickActions.topic}
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {quickActions.video ? (
                <a href={quickActions.video} target="_blank" rel="noreferrer">
                  ▶️ Video
                </a>
              ) : null}
              {quickActions.grammarbook ? (
                <a href={quickActions.grammarbook} target="_blank" rel="noreferrer">
                  📘 Grammar book
                </a>
              ) : null}
              {quickActions.workbook ? (
                <a href={quickActions.workbook} target="_blank" rel="noreferrer">
                  📗 Workbook
                </a>
              ) : null}
            </div>
          </div>
        ) : null}

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
                    {entry.chapter ? (
                      <div style={{ ...styles.helperText, marginBottom: 4 }}>Chapter: {entry.chapter}</div>
                    ) : null}
                  </div>

                  <div style={{ display: "grid", gap: 6, justifyItems: "flex-end" }}>
                    {entry.assignment !== undefined ? (
                      <span style={styles.badge}>{entry.assignment ? "Assignment" : "Self-practice"}</span>
                    ) : null}
                    {isDerivedLevel ? <span style={styles.levelPill}>From class schedule</span> : null}
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
              <p style={{ margin: 0 }}>
                No course days match your filters. Try another search term or turn off the assignment filter.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CourseTab;
