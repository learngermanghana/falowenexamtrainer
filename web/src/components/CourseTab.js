import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import { courseSchedules, getCourseScheduleDictionaryEntry } from "../data/courseSchedule";
import { courseSchedulesByName } from "../data/courseSchedules";
import { classCatalog } from "../data/classCatalog";
import { getAssignmentDisplayTitle, getAssignmentDisplayType } from "../data/germanAssignmentCatalog";
import { FRENCH_A1_SCHEDULE } from "../data/frenchCourseSchedule";
import ClassMembersTab from "./ClassMembersTab";
import YouTubeSubscribeButton from "./YouTubeSubscribeButton";
import { resolveAssignmentCanonicalKey } from "../utils/assignmentIdentity";
import { getAccessibleLevels, LEVEL_ORDER, normalizeCourseLevel } from "../utils/levelAccess";

const toLessonArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);
const normalizeLevel = (level) => normalizeCourseLevel(level);

const ASSIGNMENT_STATUSES = {
  notStarted: { key: "Not started", color: "#64748b", background: "#f8fafc", border: "#cbd5e1" },
  inProgress: { key: "In progress", color: "#2563eb", background: "#eff6ff", border: "#bfdbfe" },
  passed: { key: "Passed", color: "#0f766e", background: "#ecfdf5", border: "#99f6e4" },
  failed: { key: "Failed", color: "#dc2626", background: "#fef2f2", border: "#fecaca" },
  submitted: { key: "Submitted", color: "#16a34a", background: "#f0fdf4", border: "#bbf7d0" },
  milestoneComplete: { key: "Complete", color: "#0f766e", background: "#ecfdf5", border: "#99f6e4" },
};

const COURSE_BOOK_FILTERS = [
  { key: "all", label: "All lessons" },
  { key: "next", label: "Next lesson" },
  { key: "assignments", label: "Assignments" },
  { key: "selfLearning", label: "Self-learning" },
];

const SELF_LEARNING_ONLY_LEVELS = new Set(["B2", "C1"]);
const LEVEL_FALLBACK_RESOURCES = {
  A2: {
    video: "https://youtu.be/a1-day0-tutorial",
    grammarbook_link: classCatalog?.["A2 Bonn Klasse"]?.docUrl || null,
    workbook_link: classCatalog?.["A2 Bonn Klasse"]?.docUrl || null,
    instructionNote: "Course book links use the A2 class folder until the full A2 course book dictionary is loaded.",
  },
};

const sortByDay = (entries) => [...entries].sort((a, b) => Number(a.day || 0) - Number(b.day || 0));
const isMilestoneEntry = (entry) => Boolean(entry?.completion || /course completed/i.test(String(entry?.topic || "")));

const hasTutorMarkedWork = (entry) => {
  if (entry?.assignment) return true;
  return (
    toLessonArray(entry?.lesen_hören).some((lesson) => lesson?.assignment) ||
    toLessonArray(entry?.schreiben_sprechen).some((lesson) => lesson?.assignment)
  );
};

const isTutorMarkedEntry = (entry, level) => {
  if (SELF_LEARNING_ONLY_LEVELS.has(normalizeLevel(level))) return false;
  return hasTutorMarkedWork(entry);
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
        const dictionaryEntry = getCourseScheduleDictionaryEntry({
          level,
          assignmentId: session.assignmentId,
          chapter: session.chapter,
        });
        const video = session.video || session.youtube_link || fallback.video || null;
        const grammarbook_link = session.grammarbook_link ?? fallback.grammarbook_link ?? null;
        const workbook_link = session.workbook_link ?? fallback.workbook_link ?? null;

        usedFallbackResource =
          usedFallbackResource ||
          (!session.video && !session.youtube_link && Boolean(fallback.video)) ||
          (!session.grammarbook_link && Boolean(fallback.grammarbook_link)) ||
          (!session.workbook_link && Boolean(fallback.workbook_link));

        return {
          chapter: dictionaryEntry?.chapter || session.chapter || session.title || `Session ${index + 1}`,
          assignmentId: dictionaryEntry?.assignment_id || session.assignmentId || session.chapter || null,
          title: session.title || getAssignmentDisplayTitle(dictionaryEntry, { preferEnglish: true }),
          assignment: Boolean(session.assignment),
          note: session.note,
          type: session.type || getAssignmentDisplayType(dictionaryEntry),
          video,
          youtube_link: session.youtube_link || session.video || fallback.video || null,
          grammarbook_link,
          workbook_link,
        };
      });

      const notes = lessonList.map((lesson) => lesson.note).filter(Boolean);
      const instructionNote = usedFallbackResource && fallback.instructionNote ? ` ${fallback.instructionNote}` : "";

      return {
        day: day.dayNumber,
        topic:
          primarySession.title ||
          getAssignmentDisplayTitle(
            getCourseScheduleDictionaryEntry({
              level,
              assignmentId: primarySession.assignmentId,
              chapter: primarySession.chapter,
            }),
            { preferEnglish: true }
          ) ||
          primarySession.chapter ||
          `Day ${day.dayNumber}`,
        chapter: primarySession.chapter || primarySession.title || null,
        instruction: notes.length > 0 ? `${notes.join(" • ")}${instructionNote}` : `${schedule.generatedNote || `Class plan for ${schedule.className}`}${instructionNote}`,
        grammar_topic: primarySession.type || null,
        lesen_hören: lessonList,
      };
    });
  });

  return { schedules: { ...courseSchedules, ...derivedSchedules }, derivedLevels };
};

const { schedules: mergedCourseSchedules, derivedLevels } = buildLevelSchedules();

export const getEntryAssignmentKey = (entry, level, occurrence = 1) =>
  resolveAssignmentCanonicalKey({
    level,
    assignmentId: entry.assignmentId || entry.assignment_id,
    assignmentTitle: `Day ${entry.day}${occurrence > 1 ? ` Task ${occurrence}` : ""} ${entry.topic || entry.chapter || ""}`,
  }) || `${String(level || "GENERAL").toUpperCase()}-DAY-${entry.day}${occurrence > 1 ? `-TASK-${occurrence}` : ""}`;

const getEntryAssignmentId = (entry, level, occurrence = 1) => {
  if (!entry) return "";
  const normalizedLevel = normalizeLevel(level);
  const dictionaryMatch =
    getCourseScheduleDictionaryEntry({
      level: normalizedLevel,
      assignmentId: entry.assignmentId || entry.assignment_id,
      chapter: entry.chapter,
      assignmentDay: entry.day,
    }) || getCourseScheduleDictionaryEntry({ level: normalizedLevel, chapter: entry.chapter, assignmentDay: entry.day });

  if (dictionaryMatch?.assignment_id) return dictionaryMatch.assignment_id;

  const direct = resolveAssignmentCanonicalKey({
    level,
    assignmentId: entry.assignmentId || entry.assignment_id,
    assignmentTitle: entry.topic || entry.chapter || `Day ${entry.day}`,
  });
  if (direct) return direct;

  return getEntryAssignmentKey(entry, level, occurrence);
};

export const getStatusForEntry = () => "notStarted";

export const getAutoStatusForEntry = ({ entry, level, occurrence }) => {
  const assignmentId = getEntryAssignmentId(entry, level, occurrence);
  if (isMilestoneEntry(entry)) {
    return { status: "milestoneComplete", finalStatus: "milestoneComplete", assignmentId };
  }
  return { status: "notStarted", finalStatus: "notStarted", assignmentId };
};

export const getScoreBadgeForEntry = () => null;
export const collectUnresolvedTutorAssignmentDiagnostics = () => [];
export const aggregateUnresolvedTutorDiagnostics = () => [];

const courseBookStyles = {
  hero: {
    borderRadius: 24,
    padding: 20,
    background: "linear-gradient(135deg, #172554 0%, #2563eb 54%, #38bdf8 100%)",
    color: "#f8fafc",
    boxShadow: "0 22px 50px rgba(37, 99, 235, 0.28)",
    display: "grid",
    gap: 16,
  },
  heroHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  heroEyebrow: {
    margin: 0,
    color: "#bfdbfe",
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  heroTitle: {
    margin: "4px 0 6px",
    fontSize: 28,
    lineHeight: 1.08,
    letterSpacing: -0.6,
  },
  heroText: {
    margin: 0,
    color: "#dbeafe",
    fontSize: 14,
    lineHeight: 1.5,
    maxWidth: 640,
  },
  heroActions: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    justifyContent: "flex-end",
    flexWrap: "wrap",
  },
  heroSelect: {
    ...styles.select,
    minWidth: 110,
    background: "rgba(255,255,255,0.96)",
    border: "1px solid rgba(255,255,255,0.35)",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 10,
  },
  statCard: {
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: 12,
    backdropFilter: "blur(8px)",
  },
  statLabel: {
    margin: 0,
    color: "#bfdbfe",
    fontSize: 12,
    fontWeight: 700,
  },
  statValue: {
    margin: "4px 0 0",
    color: "#ffffff",
    fontSize: 20,
    fontWeight: 900,
  },
  progressShell: {
    height: 10,
    borderRadius: 999,
    background: "rgba(255,255,255,0.22)",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.18)",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    background: "linear-gradient(90deg, #dcfce7, #86efac)",
  },
  toolbar: {
    ...styles.card,
    marginBottom: 0,
    display: "grid",
    gap: 12,
    borderRadius: 18,
    padding: 14,
  },
  toolbarTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
  },
  filterRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  filterButton: {
    ...styles.secondaryButton,
    padding: "8px 12px",
    fontWeight: 700,
    background: "#ffffff",
  },
  filterButtonActive: {
    ...styles.primaryButton,
    padding: "8px 12px",
    boxShadow: "0 8px 18px rgba(37, 99, 235, 0.22)",
  },
  searchInput: {
    ...styles.input,
    minHeight: 42,
    borderRadius: 14,
    background: "#f8fafc",
  },
  nextCard: {
    border: "1px solid #bfdbfe",
    background: "linear-gradient(135deg, #eff6ff, #ffffff)",
    borderRadius: 18,
    padding: 14,
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
  },
  weekSection: {
    display: "grid",
    gap: 10,
  },
  weekHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    margin: "6px 0 0",
  },
  weekTitle: {
    margin: 0,
    fontSize: 14,
    color: "#1e3a8a",
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  weekLine: {
    height: 1,
    background: "#dbeafe",
    flex: 1,
  },
  lessonCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 18,
    padding: 14,
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
    display: "grid",
    gap: 10,
  },
  lessonCardCurrent: {
    border: "1px solid #2563eb",
    background: "linear-gradient(135deg, #eff6ff, #ffffff 60%)",
    boxShadow: "0 18px 34px rgba(37, 99, 235, 0.16)",
  },
  lessonTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  lessonMain: {
    display: "flex",
    gap: 12,
    flex: "1 1 320px",
    minWidth: 0,
  },
  dayBubble: {
    width: 48,
    height: 48,
    borderRadius: 16,
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    color: "#1d4ed8",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    fontWeight: 900,
    lineHeight: 1.1,
    textAlign: "center",
    fontSize: 12,
  },
  lessonTitle: {
    margin: 0,
    fontSize: 17,
    lineHeight: 1.25,
    color: "#0f172a",
  },
  lessonMeta: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
    marginTop: 8,
  },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    borderRadius: 999,
    padding: "5px 9px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#475569",
    fontSize: 12,
    fontWeight: 700,
  },
  statusChip: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 800,
    whiteSpace: "nowrap",
  },
  lessonActions: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    justifyContent: "flex-end",
    flexWrap: "wrap",
  },
  emptyState: {
    ...styles.card,
    marginBottom: 0,
    textAlign: "center",
    borderRadius: 18,
    padding: 24,
  },
};

const normalizeSearchText = (value) => String(value || "").trim().toLowerCase();

const lessonMatchesSearch = (entry, searchTerm) => {
  const query = normalizeSearchText(searchTerm);
  if (!query) return true;
  const haystack = [entry.topic, entry.chapter, entry.grammar_topic, entry.goal, entry.instruction]
    .map((value) => String(value || "").toLowerCase())
    .join(" ");
  return haystack.includes(query);
};

const groupLessonsByWeek = (entries) => {
  return entries.reduce((groups, entry, index) => {
    const numericDay = Number(entry.day || index + 1);
    const weekNumber = Math.max(1, Math.ceil(numericDay / 5));
    const key = `Week ${weekNumber}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(entry);
    return groups;
  }, {});
};

const CourseTab = ({ defaultLevel, defaultClassName, program }) => {
  const navigate = useNavigate();
  const { studentProfile } = useAuth();
  const resolvedStudentLevel = normalizeLevel(studentProfile?.level) || normalizeLevel(studentProfile?.className);
  const resolvedDefaultLevel = resolvedStudentLevel || normalizeLevel(defaultLevel) || normalizeLevel(defaultClassName);
  const isFrenchProgram = program === "french";
  const { schedules, resolvedDerivedLevels } = useMemo(() => {
    if (isFrenchProgram) return { schedules: { A1: FRENCH_A1_SCHEDULE }, resolvedDerivedLevels: new Set() };
    return { schedules: mergedCourseSchedules, resolvedDerivedLevels: derivedLevels };
  }, [isFrenchProgram]);

  const levels = useMemo(() => {
    const baseLevels = Object.keys(schedules);
    const normalizedDefault = resolvedDefaultLevel;
    const merged = normalizedDefault && !baseLevels.includes(normalizedDefault) ? [...baseLevels, normalizedDefault] : baseLevels;
    const allowedLevels = getAccessibleLevels(normalizedDefault, merged);
    return allowedLevels.sort((a, b) => {
      const aIndex = LEVEL_ORDER.indexOf(a);
      const bIndex = LEVEL_ORDER.indexOf(b);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [resolvedDefaultLevel, schedules]);

  const [selectedCourseLevel, setSelectedCourseLevel] = useState(() => {
    const normalizedDefault = resolvedDefaultLevel;
    if (normalizedDefault && levels.includes(normalizedDefault)) return normalizedDefault;
    return levels[0] || "";
  });
  const [activeSubTab, setActiveSubTab] = useState("courseBook");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const schedule = useMemo(() => {
    const seenByDay = {};
    return sortByDay(
      (schedules[selectedCourseLevel] || []).map((entry) => {
        const dayKey = String(entry.day || "");
        seenByDay[dayKey] = (seenByDay[dayKey] || 0) + 1;
        return { ...entry, occurrence: seenByDay[dayKey] };
      })
    );
  }, [schedules, selectedCourseLevel]);

  const decoratedSchedule = useMemo(
    () =>
      schedule.map((entry) => {
        const milestoneEntry = isMilestoneEntry(entry);
        const isTutorMarked = isTutorMarkedEntry(entry, selectedCourseLevel);
        const status = milestoneEntry ? "milestoneComplete" : "notStarted";
        const entryAssignmentKey = getEntryAssignmentId(entry, selectedCourseLevel, entry.occurrence);
        return {
          ...entry,
          assignmentKey: entryAssignmentKey,
          isMilestone: milestoneEntry,
          isTutorMarked,
          status,
          statusMeta: ASSIGNMENT_STATUSES[status] || ASSIGNMENT_STATUSES.notStarted,
        };
      }),
    [schedule, selectedCourseLevel]
  );

  const isSelfLearningLevel = SELF_LEARNING_ONLY_LEVELS.has(String(selectedCourseLevel || "").toUpperCase());
  const isDerivedLevel = resolvedDerivedLevels.has(selectedCourseLevel);
  const assignmentCount = decoratedSchedule.filter((entry) => entry.isTutorMarked).length;
  const completedCount = decoratedSchedule.filter((entry) => ["passed", "submitted"].includes(entry.status)).length;
  const progressPercent = decoratedSchedule.length ? Math.round((completedCount / decoratedSchedule.length) * 100) : 0;
  const nextLesson = decoratedSchedule.find((entry) => !entry.isMilestone && entry.status !== "passed" && entry.status !== "submitted") || decoratedSchedule[0];

  const visibleLessons = useMemo(
    () =>
      decoratedSchedule.filter((entry) => {
        if (!lessonMatchesSearch(entry, searchTerm)) return false;
        if (activeFilter === "next") return entry.assignmentKey === nextLesson?.assignmentKey;
        if (activeFilter === "assignments") return entry.isTutorMarked;
        if (activeFilter === "selfLearning") return !entry.isTutorMarked;
        return true;
      }),
    [decoratedSchedule, searchTerm, activeFilter, nextLesson]
  );

  const groupedLessons = useMemo(() => groupLessonsByWeek(visibleLessons), [visibleLessons]);
  const weekEntries = Object.entries(groupedLessons);

  const openLesson = (entry) => {
    navigate(`/campus/course/lesson/${selectedCourseLevel}/${entry.day}`, {
      state: {
        level: selectedCourseLevel,
        day: entry.day,
        entry,
        assignmentKey: entry.assignmentKey,
        status: entry.status,
        scoreText: "",
      },
    });
  };

  return (
    <div style={{ display: "grid", gap: 14, paddingBottom: 80 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" style={activeSubTab === "courseBook" ? styles.navButtonActive : styles.navButton} onClick={() => setActiveSubTab("courseBook")}>
          Course Book
        </button>
        {!isSelfLearningLevel ? (
          <button type="button" style={activeSubTab === "classMembers" ? styles.navButtonActive : styles.navButton} onClick={() => setActiveSubTab("classMembers")}>
            Class Members
          </button>
        ) : null}
      </div>

      {!isSelfLearningLevel && activeSubTab === "classMembers" ? <ClassMembersTab /> : null}

      {activeSubTab === "courseBook" ? (
        <>
          <section style={courseBookStyles.hero}>
            <div style={courseBookStyles.heroHeader}>
              <div>
                <p style={courseBookStyles.heroEyebrow}>{selectedCourseLevel || "Course"} learning journey</p>
                <h2 style={courseBookStyles.heroTitle}>Course Book</h2>
                <p style={courseBookStyles.heroText}>Follow the lessons in order, open your next task quickly, and use the filters when you only want assignments or self-learning work.</p>
              </div>
              <div style={courseBookStyles.heroActions}>
                <label style={{ display: "grid", gap: 4, minWidth: 120 }}>
                  <span style={{ color: "#dbeafe", fontSize: 12, fontWeight: 800 }}>Level</span>
                  <select style={courseBookStyles.heroSelect} value={selectedCourseLevel} onChange={(e) => setSelectedCourseLevel(e.target.value)}>
                    {levels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </label>
                <button type="button" style={{ ...styles.primaryButton, background: "#dcfce7", color: "#14532d" }} onClick={() => nextLesson && openLesson(nextLesson)}>
                  Continue learning
                </button>
                <button type="button" style={{ ...styles.secondaryButton, background: "rgba(255,255,255,0.95)", fontWeight: 800 }} onClick={() => navigate("/campus/submit", { state: { level: selectedCourseLevel } })}>
                  Submit work
                </button>
                <YouTubeSubscribeButton />
              </div>
            </div>

            <div style={courseBookStyles.statGrid}>
              <div style={courseBookStyles.statCard}>
                <p style={courseBookStyles.statLabel}>Lessons</p>
                <p style={courseBookStyles.statValue}>{decoratedSchedule.length}</p>
              </div>
              <div style={courseBookStyles.statCard}>
                <p style={courseBookStyles.statLabel}>Assignments</p>
                <p style={courseBookStyles.statValue}>{assignmentCount}</p>
              </div>
              <div style={courseBookStyles.statCard}>
                <p style={courseBookStyles.statLabel}>Progress</p>
                <p style={courseBookStyles.statValue}>{progressPercent}%</p>
              </div>
              <div style={courseBookStyles.statCard}>
                <p style={courseBookStyles.statLabel}>Mode</p>
                <p style={{ ...courseBookStyles.statValue, fontSize: 16 }}>{isSelfLearningLevel ? "Self-learning" : isDerivedLevel ? "Class plan" : "Tutor guided"}</p>
              </div>
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <div style={courseBookStyles.progressShell}>
                <div style={{ ...courseBookStyles.progressFill, width: `${progressPercent}%` }} />
              </div>
              <p style={{ margin: 0, color: "#dbeafe", fontSize: 13 }}>{completedCount} of {decoratedSchedule.length} lessons completed</p>
            </div>
          </section>

          {nextLesson ? (
            <section style={courseBookStyles.nextCard}>
              <div>
                <p style={{ ...styles.helperText, margin: 0, color: "#1d4ed8", fontWeight: 900 }}>Next lesson</p>
                <h3 style={{ margin: "4px 0 3px", color: "#0f172a" }}>Day {nextLesson.day}: {nextLesson.topic}</h3>
                <p style={{ ...styles.helperText, margin: 0 }}>{nextLesson.grammar_topic || nextLesson.chapter || "Open this lesson to continue."}</p>
              </div>
              <button type="button" style={styles.primaryButton} onClick={() => openLesson(nextLesson)}>
                Open next lesson
              </button>
            </section>
          ) : null}

          <section style={courseBookStyles.toolbar}>
            <div style={courseBookStyles.toolbarTop}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18 }}>Lessons</h3>
                <p style={{ ...styles.helperText, margin: "4px 0 0" }}>{visibleLessons.length} shown from {decoratedSchedule.length}</p>
              </div>
              <div style={courseBookStyles.filterRow}>
                {COURSE_BOOK_FILTERS.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    style={activeFilter === filter.key ? courseBookStyles.filterButtonActive : courseBookStyles.filterButton}
                    onClick={() => setActiveFilter(filter.key)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by day, topic, chapter or grammar point..."
              style={courseBookStyles.searchInput}
            />
          </section>

          {weekEntries.length ? (
            <div style={{ display: "grid", gap: 14 }}>
              {weekEntries.map(([weekLabel, lessons]) => (
                <section key={weekLabel} style={courseBookStyles.weekSection}>
                  <div style={courseBookStyles.weekHeader}>
                    <h3 style={courseBookStyles.weekTitle}>{weekLabel}</h3>
                    <div style={courseBookStyles.weekLine} />
                  </div>
                  {lessons.map((entry) => {
                    const isCurrent = entry.assignmentKey === nextLesson?.assignmentKey;
                    return (
                      <article key={`day-${entry.day}-occurrence-${entry.occurrence || 1}`} style={{ ...courseBookStyles.lessonCard, ...(isCurrent ? courseBookStyles.lessonCardCurrent : {}) }}>
                        <div style={courseBookStyles.lessonTop}>
                          <div style={courseBookStyles.lessonMain}>
                            <div style={courseBookStyles.dayBubble}>Day<br />{entry.day}</div>
                            <div style={{ minWidth: 0 }}>
                              <h3 style={courseBookStyles.lessonTitle}>{entry.topic}</h3>
                              <div style={courseBookStyles.lessonMeta}>
                                {isCurrent ? <span style={{ ...courseBookStyles.chip, background: "#dbeafe", borderColor: "#93c5fd", color: "#1d4ed8" }}>Current</span> : null}
                                {entry.chapter ? <span style={courseBookStyles.chip}>Chapter {entry.chapter}</span> : null}
                                {entry.grammar_topic ? <span style={courseBookStyles.chip}>{entry.grammar_topic}</span> : null}
                                {entry.isTutorMarked ? <span style={courseBookStyles.chip}>Tutor-marked</span> : <span style={courseBookStyles.chip}>Self-learning</span>}
                              </div>
                            </div>
                          </div>
                          <div style={courseBookStyles.lessonActions}>
                            {entry.isTutorMarked ? (
                              <span
                                style={{
                                  ...courseBookStyles.statusChip,
                                  color: entry.statusMeta.color,
                                  border: `1px solid ${entry.statusMeta.border}`,
                                  background: entry.statusMeta.background,
                                }}
                              >
                                {entry.statusMeta.key}
                              </span>
                            ) : null}
                            <button type="button" style={styles.primaryButton} onClick={() => openLesson(entry)}>
                              Open Lesson
                            </button>
                          </div>
                        </div>
                        {entry.goal ? <p style={{ margin: 0, fontSize: 14, color: "#475569", lineHeight: 1.45 }}>{entry.goal}</p> : null}
                      </article>
                    );
                  })}
                </section>
              ))}
            </div>
          ) : (
            <section style={courseBookStyles.emptyState}>
              <h3 style={{ marginTop: 0 }}>No lessons found</h3>
              <p style={{ ...styles.helperText, margin: 0 }}>Try another search word or choose a different filter.</p>
            </section>
          )}
        </>
      ) : null}
    </div>
  );
};

export default CourseTab;
