import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { courseSchedules } from "../data/courseSchedule";
import { courseSchedulesByName } from "../data/courseSchedules";

const normalizeLevel = (level) => (level || "").toUpperCase();

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const hasEntryAssignment = (entry) => {
  if (!entry) return false;
  return (
    entry.assignment ||
    toArray(entry.lesen_hören).some((lesson) => lesson.assignment) ||
    toArray(entry.schreiben_sprechen).some((lesson) => lesson.assignment)
  );
};

const extractChapterTokens = (chapter) =>
  String(chapter || "")
    .replace(/kapitel/gi, "")
    .split(/[_\s,]+/)
    .map((token) => token.trim())
    .filter(Boolean);

const buildLessonListFromSession = (session, fallbackChapter) => {
  const lesson = {
    chapter: session.chapter || session.title || fallbackChapter || null,
    title: session.title,
    assignment: Boolean(session.assignment),
    note: session.note,
    type: session.type,
    video: session.video || session.youtube_link || null,
    youtube_link: session.youtube_link || session.video || null,
    grammarbook_link: session.grammarbook_link || null,
    workbook_link: session.workbook_link || null,
  };

  const hasResource =
    lesson.video || lesson.youtube_link || lesson.grammarbook_link || lesson.workbook_link || lesson.note;

  return hasResource ? [lesson] : [];
};

const buildLevelSchedules = () => {
  const derivedSchedules = {};
  const derivedLevels = new Set();

  Object.values(courseSchedulesByName).forEach((schedule) => {
    const level = normalizeLevel(schedule.course);

    if (!level || courseSchedules[level] || derivedSchedules[level]) return;

    derivedLevels.add(level);

    derivedSchedules[level] = (schedule.days || []).map((day) => {
      const sessions = day.sessions || [];
      const primarySession = sessions[0] || {};

      const lessonList = sessions
        .map((session, index) => buildLessonListFromSession(session, `Session ${index + 1}`))
        .flat();

      const notes = lessonList.map((lesson) => lesson.note).filter(Boolean);

      return {
        day: day.dayNumber,
        topic: primarySession.title || primarySession.chapter || `Day ${day.dayNumber}`,
        chapter: primarySession.chapter || primarySession.title || null,
        instruction:
          notes.length > 0
            ? notes.join(" • ")
            : schedule.generatedNote || `Class plan for ${schedule.className}`,
        grammar_topic: primarySession.type || null,
        lesen_hören: lessonList,
      };
    });
  });

  return { schedules: { ...courseSchedules, ...derivedSchedules }, derivedLevels };
};

const buildChapterIndex = (courseSchedule = []) => {
  const index = new Map();

  courseSchedule.forEach((entry) => {
    extractChapterTokens(entry.chapter).forEach((token) => {
      if (!index.has(token)) {
        index.set(token, []);
      }
      index.get(token).push(entry);
    });
  });

  return index;
};

const buildLessonsFromCourseEntry = (entry) => {
  if (!entry) return [];

  return toArray(entry).map((lesson) => ({
    ...lesson,
    chapter: lesson.chapter || entry.chapter || null,
  }));
};

const buildClassScheduleWithCourseData = (classSchedule, courseScheduleForLevel = []) => {
  if (!classSchedule) return null;

  const chapterIndex = buildChapterIndex(courseScheduleForLevel);

  return (classSchedule.days || []).map((day) => {
    const sessions = day.sessions || [];

    const sessionSummaries = sessions.map((session, index) => {
      const chapterTokens = extractChapterTokens(session.chapter || session.title);

      const matchedCourseEntries = chapterTokens
        .map((token) => chapterIndex.get(token) || [])
        .flat();

      const primaryMatch = matchedCourseEntries[0] || {};

      const lesenLessons = matchedCourseEntries
        .map((entry) => buildLessonsFromCourseEntry(entry.lesen_hören))
        .flat();

      const schreibenLessons = matchedCourseEntries
        .map((entry) => buildLessonsFromCourseEntry(entry.schreiben_sprechen))
        .flat();

      const sessionResources = buildLessonListFromSession(session, `Session ${index + 1}`);

      const combinedLesenLessons = [...lesenLessons, ...sessionResources];

      const fallbackLessons = !combinedLesenLessons.length && !schreibenLessons.length
        ? sessionResources
        : [];

      const instructionParts = [session.note, primaryMatch.instruction].filter(Boolean);

      return {
        chapter: session.chapter || session.title || `Session ${index + 1}`,
        topic: session.title || primaryMatch.topic || null,
        goal: primaryMatch.goal || null,
        instruction: instructionParts.length ? instructionParts.join(" • ") : null,
        grammar_topic: session.type || primaryMatch.grammar_topic || null,
        lesen_hören: combinedLesenLessons.length ? combinedLesenLessons : fallbackLessons,
        schreiben_sprechen: schreibenLessons,
        assignment:
          Boolean(session.assignment) ||
          matchedCourseEntries.some(hasEntryAssignment) ||
          fallbackLessons.some((lesson) => lesson.assignment),
      };
    });

    const lesen_hören = sessionSummaries.map((s) => s.lesen_hören).flat();
    const schreiben_sprechen = sessionSummaries.map((s) => s.schreiben_sprechen).flat();

    const topic = sessionSummaries
      .map((s) => s.topic)
      .filter(Boolean)
      .join(" • ") || sessions[0]?.title || `Day ${day.dayNumber}`;

    const chapter = sessionSummaries
      .map((s) => s.chapter)
      .filter(Boolean)
      .join(" • ");

    const instruction = sessionSummaries
      .map((s) => s.instruction)
      .filter(Boolean)
      .join(" • ") || classSchedule.generatedNote || null;

    const grammar_topic =
      sessionSummaries.find((s) => s.grammar_topic)?.grammar_topic || sessions[0]?.type || null;

    const goal = sessionSummaries.find((s) => s.goal)?.goal || null;

    const assignment =
      sessionSummaries.some((s) => s.assignment) ||
      lesen_hören.some((lesson) => lesson.assignment) ||
      schreiben_sprechen.some((lesson) => lesson.assignment);

    return {
      day: day.dayNumber,
      topic,
      chapter,
      instruction,
      grammar_topic,
      goal,
      assignment,
      lesen_hören,
      schreiben_sprechen,
    };
  });
};

const { schedules: mergedCourseSchedules, derivedLevels } = buildLevelSchedules();

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
              {lesson.video || lesson.youtube_link ? (
                <li>
                  <a
                    href={lesson.video || lesson.youtube_link}
                    target="_blank"
                    rel="noreferrer"
                  >
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

const CourseTab = ({ defaultLevel, defaultClassName }) => {
  const levels = useMemo(() => {
    const baseLevels = Object.keys(mergedCourseSchedules);
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

  const studentClassSchedule = useMemo(
    () => courseSchedulesByName[defaultClassName] || null,
    [defaultClassName]
  );

  const studentClassLevel = useMemo(
    () => normalizeLevel(studentClassSchedule?.course),
    [studentClassSchedule]
  );

  const classAlignedSchedule = useMemo(() => {
    if (!studentClassSchedule) return null;

    const dictionarySchedule = courseSchedules[studentClassLevel] || [];
    return buildClassScheduleWithCourseData(studentClassSchedule, dictionarySchedule);
  }, [studentClassLevel, studentClassSchedule]);

  const usingClassSchedule = useMemo(
    () =>
      Boolean(
        classAlignedSchedule &&
          studentClassLevel &&
          normalizeLevel(studentClassLevel) === normalizeLevel(selectedCourseLevel)
      ),
    [classAlignedSchedule, selectedCourseLevel, studentClassLevel]
  );

  const schedule = useMemo(() => {
    if (usingClassSchedule && classAlignedSchedule) {
      return classAlignedSchedule;
    }

    return mergedCourseSchedules[selectedCourseLevel] || [];
  }, [classAlignedSchedule, selectedCourseLevel, usingClassSchedule]);

  const isDerivedLevel = useMemo(
    () => derivedLevels.has(selectedCourseLevel) || usingClassSchedule,
    [selectedCourseLevel, usingClassSchedule]
  );

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
          {usingClassSchedule
            ? `Showing your ${studentClassSchedule?.className || "class"} plan with course book resources for each chapter.`
            : isDerivedLevel
            ? "This level uses the class schedule because the course book dictionary does not yet include it."
            : "Pulling content from the course dictionary. Select a level to see its full day-by-day plan. Use search or the assignment filter to jump straight to what you need."}
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
                    {isDerivedLevel ? (
                      <span style={styles.levelPill}>From class schedule</span>
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
