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
  notStarted: { key: "Not started", color: "#9ca3af" },
  inProgress: { key: "In progress", color: "#2563eb" },
  passed: { key: "Passed", color: "#0f766e" },
  failed: { key: "Failed", color: "#dc2626" },
  submitted: { key: "Submitted", color: "#16a34a" },
  milestoneComplete: { key: "Complete", color: "#0f766e" },
};

const CANONICAL_ASSIGNMENT_ID_PATTERN = /^(A1|A2|B1|B2|C1|C2)-\d+(?:\.\d+)?$/i;
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
const isCanonicalAssignmentId = (value = "") => CANONICAL_ASSIGNMENT_ID_PATTERN.test(String(value || "").trim());
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

  const isSelfLearningLevel = SELF_LEARNING_ONLY_LEVELS.has(String(selectedCourseLevel || "").toUpperCase());
  const isDerivedLevel = resolvedDerivedLevels.has(selectedCourseLevel);
  const assignmentCount = schedule.filter((entry) => hasTutorMarkedWork(entry)).length;

  return (
    <div style={{ display: "grid", gap: 12 }}>
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
          <section style={{ ...styles.card, marginBottom: 0, display: "grid", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "grid", gap: 4 }}>
                <h2 style={{ ...styles.sectionTitle, margin: 0 }}>Course Book</h2>
                <span style={styles.helperText}>Choose your day and open the lesson resources.</span>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <span style={styles.helperText}>Level</span>
                <select style={{ ...styles.select, minWidth: 110 }} value={selectedCourseLevel} onChange={(e) => setSelectedCourseLevel(e.target.value)}>
                  {levels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                <button type="button" style={styles.secondaryButton} onClick={() => navigate("/campus/submit", { state: { level: selectedCourseLevel } })}>
                  Submit work
                </button>
                <YouTubeSubscribeButton />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={styles.badge}>{schedule.length} lessons</span>
              <span style={styles.badge}>{assignmentCount} assignments</span>
              {isDerivedLevel ? <span style={styles.badge}>Class schedule</span> : null}
            </div>
          </section>

          <div style={{ display: "grid", gap: 10 }}>
            {schedule.map((entry) => {
              const milestoneEntry = isMilestoneEntry(entry);
              const isTutorMarked = isTutorMarkedEntry(entry, selectedCourseLevel);
              const status = milestoneEntry ? "milestoneComplete" : "notStarted";
              const entryAssignmentKey = getEntryAssignmentId(entry, selectedCourseLevel, entry.occurrence);
              const statusMeta = ASSIGNMENT_STATUSES[status] || ASSIGNMENT_STATUSES.notStarted;

              return (
                <article key={`day-${entry.day}-occurrence-${entry.occurrence || 1}`} style={{ ...styles.card, marginBottom: 0, display: "grid", gap: 8, padding: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
                    <div style={{ flex: "1 1 210px", minWidth: 0 }}>
                      <span style={styles.levelPill}>Day {entry.day}</span>
                      <h3 style={{ margin: "6px 0 3px", fontSize: 18, lineHeight: 1.2 }}>{entry.topic}</h3>
                      {entry.chapter ? <div style={{ ...styles.helperText, marginBottom: 0 }}>Chapter: {entry.chapter}</div> : null}
                      {entry.grammar_topic ? <div style={{ ...styles.helperText, marginBottom: 0 }}>{entry.grammar_topic}</div> : null}
                    </div>
                    <div style={{ display: "grid", gap: 6, justifyItems: "flex-end" }}>
                      {isTutorMarked ? <span style={{ ...styles.badge, background: "#fff", color: statusMeta.color, border: `1px solid ${statusMeta.color}` }}>{statusMeta.key}</span> : null}
                      {!isTutorMarked ? <span style={styles.badge}>Self-learning</span> : null}
                      <button
                        type="button"
                        style={styles.primaryButton}
                        onClick={() =>
                          navigate(`/campus/course/lesson/${selectedCourseLevel}/${entry.day}`, {
                            state: {
                              level: selectedCourseLevel,
                              day: entry.day,
                              entry,
                              assignmentKey: entryAssignmentKey,
                              status,
                              scoreText: "",
                            },
                          })
                        }
                      >
                        Open Lesson
                      </button>
                    </div>
                  </div>
                  {entry.goal ? <p style={{ margin: 0, fontSize: 14, lineHeight: 1.45 }}>{entry.goal}</p> : null}
                </article>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default CourseTab;
