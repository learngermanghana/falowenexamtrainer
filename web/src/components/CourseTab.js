import React, { useEffect, useMemo, useState } from "react";
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
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import { resolveAssignmentCanonicalKey } from "../utils/assignmentIdentity";
import { getAccessibleLevels, LEVEL_ORDER, normalizeCourseLevel } from "../utils/levelAccess";
import { db, doc, serverTimestamp, setDoc } from "../firebase";
import { useLessonProgress } from "../hooks/useLessonProgress";

const toLessonArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);
const normalizeLevel = (level) => normalizeCourseLevel(level);
const normalizeKey = (value) => String(value || "").trim().toUpperCase();
const normalizeStatus = (value) => String(value || "").trim().toLowerCase();

const ASSIGNMENT_STATUSES = {
  notStarted: { key: "Not started", color: "#64748b", background: "#f8fafc", border: "#cbd5e1" },
  inProgress: { key: "In progress", color: "#2563eb", background: "#eff6ff", border: "#bfdbfe" },
  passed: { key: "Passed", color: "#0f766e", background: "#ecfdf5", border: "#99f6e4" },
  failed: { key: "Needs correction", color: "#dc2626", background: "#fef2f2", border: "#fecaca" },
  submitted: { key: "Submitted", color: "#16a34a", background: "#f0fdf4", border: "#bbf7d0" },
  resubmitted: { key: "Resubmitted", color: "#7c3aed", background: "#f5f3ff", border: "#ddd6fe" },
  milestoneComplete: { key: "Complete", color: "#0f766e", background: "#ecfdf5", border: "#99f6e4" },
  practiceOnly: { key: "Practice only", color: "#475569", background: "#f8fafc", border: "#e2e8f0" },
  selfMarkedComplete: { key: "Self-marked complete", color: "#0f766e", background: "#ecfdf5", border: "#99f6e4" },
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

const PRACTICE_CLUSTER_BADGES = [
  { key: "foundation-speaker", label: "🧩 Foundation Speaker", days: [5, 6] },
];

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

const lookupScheduleDictionaryEntry = (params) => {
  if (typeof getCourseScheduleDictionaryEntry !== "function") return null;
  return getCourseScheduleDictionaryEntry(params);
};

const buildLevelSchedules = () => {
  const derivedSchedules = {};
  const derivedLevels = new Set();

  Object.values(courseSchedulesByName || {}).forEach((schedule) => {
    const level = normalizeLevel(schedule.course);
    if (!level || courseSchedules[level] || derivedSchedules[level]) return;

    derivedLevels.add(level);
    const fallback = LEVEL_FALLBACK_RESOURCES[level] || {};

    derivedSchedules[level] = (schedule.days || []).map((day) => {
      const sessions = day.sessions || [];
      const primarySession = sessions[0] || {};
      let usedFallbackResource = false;

      const lessonList = sessions.map((session, index) => {
        const dictionaryEntry = lookupScheduleDictionaryEntry({
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
            lookupScheduleDictionaryEntry({
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
    assignmentId: entry?.assignmentId || entry?.assignment_id || entry?.assignmentKey || entry?.chapter,
    assignmentTitle: `Day ${entry?.day}${occurrence > 1 ? ` Task ${occurrence}` : ""} ${entry?.topic || entry?.chapter || ""}`,
  }) || `${String(level || "GENERAL").toUpperCase()}-DAY-${entry?.day}${occurrence > 1 ? `-TASK-${occurrence}` : ""}`;

const buildEntryLabel = (entry) => entry?.topic || entry?.title || entry?.chapter || `Day ${entry?.day}`;

const getEntryAssignmentId = (entry, level, occurrence = 1) => {
  if (!entry) return "";
  const normalizedLevel = normalizeLevel(level);
  const dictionaryMatch =
    lookupScheduleDictionaryEntry({
      level: normalizedLevel,
      assignmentId: entry.assignmentId || entry.assignment_id || entry.assignmentKey,
      chapter: entry.chapter,
      assignmentDay: entry.day,
    }) || lookupScheduleDictionaryEntry({ level: normalizedLevel, chapter: entry.chapter, assignmentDay: entry.day });

  if (dictionaryMatch?.assignment_id) return dictionaryMatch.assignment_id;

  const direct = resolveAssignmentCanonicalKey({
    level,
    assignmentId: entry.assignmentId || entry.assignment_id || entry.assignmentKey || entry.chapter,
    assignmentTitle: buildEntryLabel(entry),
  });
  if (direct) return direct;

  return getEntryAssignmentKey(entry, level, occurrence);
};

const collectTutorAssignmentLessons = (entry) => {
  const lessons = [
    ...toLessonArray(entry?.lesen_hören),
    ...toLessonArray(entry?.schreiben_sprechen),
  ].filter((lesson) => lesson?.assignment || lesson?.assignmentId || lesson?.assignment_id || lesson?.assignmentKey);

  if (lessons.length) {
    return lessons.map((lesson) => ({
      ...lesson,
      day: entry.day,
      topic: lesson.topic || lesson.title || entry.topic,
      chapter: lesson.chapter || lesson.assignmentId || lesson.assignment_id || entry.chapter,
    }));
  }

  return entry?.assignment ? [entry] : [];
};

const uniqueAssignmentIds = (ids) => [...new Set(ids.map(normalizeKey).filter(Boolean))];

export const getRequiredAssignmentIdsForEntry = (entry, level, occurrence = 1) => {
  const lessons = collectTutorAssignmentLessons(entry);
  if (!lessons.length) {
    const assignmentId = getEntryAssignmentId(entry, level, occurrence);
    return assignmentId ? [normalizeKey(assignmentId)] : [];
  }

  return uniqueAssignmentIds(
    lessons.map((lesson, index) => getEntryAssignmentId(lesson, level, lessons.length > 1 ? index + 1 : occurrence))
  );
};

const toCourseTabStatus = (status = "") => {
  switch (normalizeStatus(status)) {
    case "passed":
      return "passed";
    case "failed":
    case "needs_correction":
      return "failed";
    case "resubmitted":
      return "resubmitted";
    case "submitted":
      return "submitted";
    case "in_progress":
    case "inprogress":
    case "in-progress":
      return "inProgress";
    case "milestonecomplete":
      return "milestoneComplete";
    default:
      return "notStarted";
  }
};

const statusFromProgressRecord = (record = {}) => {
  const statusFromStatusField = toCourseTabStatus(record.status || record.value || record.state);
  let statusFromFlags = "notStarted";
  if (record.passed === true) statusFromFlags = "passed";
  else if (record.failed === true) statusFromFlags = "failed";
  else if (record.submitted === true) statusFromFlags = toCourseTabStatus(record.status) === "resubmitted" ? "resubmitted" : "submitted";
  else if (record.inProgress === true || record.hasDraft === true) statusFromFlags = "inProgress";

  const finalStatus = statusFromFlags !== "notStarted" ? statusFromFlags : statusFromStatusField;
  return { statusFromStatusField, statusFromFlags, finalStatus };
};

const getProgressRecord = (progressByAssignmentId = {}, assignmentId) => {
  const key = normalizeKey(assignmentId);
  return progressByAssignmentId[key] || progressByAssignmentId[assignmentId] || null;
};

export const getStatusForEntry = (progressByAssignmentId = {}, entry, level, occurrence = 1) => {
  const statusInfo = getAutoStatusForEntry({ progressByAssignmentId, entry, level, occurrence });
  return statusInfo.finalStatus;
};

export const getAutoStatusForEntry = ({ progressByAssignmentId = {}, entry, level, occurrence = 1 } = {}) => {
  const assignmentId = normalizeKey(getEntryAssignmentId(entry, level, occurrence));
  if (isMilestoneEntry(entry)) {
    return { status: "milestoneComplete", finalStatus: "milestoneComplete", assignmentId, requiredAssignmentIds: [assignmentId].filter(Boolean) };
  }

  const requiredAssignmentIds = getRequiredAssignmentIdsForEntry(entry, level, occurrence);
  const records = requiredAssignmentIds
    .map((requiredId) => ({ assignmentId: requiredId, record: getProgressRecord(progressByAssignmentId, requiredId) }))
    .filter((item) => item.record);

  if (!requiredAssignmentIds.length || !records.length) {
    const fallbackRecord = getProgressRecord(progressByAssignmentId, assignmentId);
    if (!fallbackRecord) {
      return {
        status: "notStarted",
        finalStatus: "notStarted",
        assignmentId,
        requiredAssignmentIds: requiredAssignmentIds.length ? requiredAssignmentIds : [assignmentId].filter(Boolean),
        statusDebug: { finalStatus: "notStarted" },
      };
    }
    const statusParts = statusFromProgressRecord(fallbackRecord);
    return {
      status: statusParts.statusFromStatusField,
      finalStatus: statusParts.finalStatus,
      assignmentId,
      requiredAssignmentIds: [assignmentId].filter(Boolean),
      statusDebug: { mergedStatus: fallbackRecord.status, ...statusParts },
    };
  }

  const statuses = records.map(({ record }) => statusFromProgressRecord(record).finalStatus);
  const allRequiredHaveRecords = records.length === requiredAssignmentIds.length;

  let finalStatus = "notStarted";
  if (allRequiredHaveRecords && statuses.every((status) => status === "passed")) {
    finalStatus = "passed";
  } else if (allRequiredHaveRecords && statuses.some((status) => status === "failed")) {
    finalStatus = "failed";
  } else if (allRequiredHaveRecords && statuses.every((status) => ["passed", "submitted", "resubmitted"].includes(status))) {
    finalStatus = statuses.includes("resubmitted") ? "resubmitted" : "submitted";
  } else if (statuses.some((status) => status !== "notStarted")) {
    finalStatus = "inProgress";
  }

  const primaryRecord = records[0]?.record || {};
  const statusParts = statusFromProgressRecord(primaryRecord);
  return {
    status: statusParts.statusFromStatusField,
    finalStatus,
    assignmentId: requiredAssignmentIds[0] || assignmentId,
    requiredAssignmentIds,
    statusDebug: {
      mergedStatus: primaryRecord.status,
      mergedPassed: primaryRecord.passed,
      mergedFailed: primaryRecord.failed,
      mergedSubmitted: primaryRecord.submitted,
      mergedInProgress: primaryRecord.inProgress,
      ...statusParts,
      finalStatus,
    },
  };
};

export const getScoreBadgeForEntry = ({ statusInfo = {}, progressByAssignmentId = {} } = {}) => {
  const requiredAssignmentIds = statusInfo.requiredAssignmentIds?.length
    ? statusInfo.requiredAssignmentIds
    : [statusInfo.assignmentId].filter(Boolean);
  const records = requiredAssignmentIds.map((id) => getProgressRecord(progressByAssignmentId, id)).filter(Boolean);

  const scoredRecords = records
    .filter((record) => typeof (record.bestScore ?? record.latestScore) === "number")
    .sort((left, right) => new Date(right.lastUpdatedAt || 0).getTime() - new Date(left.lastUpdatedAt || 0).getTime());

  if (scoredRecords.length) {
    const score = scoredRecords[0].bestScore ?? scoredRecords[0].latestScore;
    return { tone: "scored", text: `Best score: ${score}/100` };
  }

  if (["submitted", "resubmitted"].includes(statusInfo.finalStatus || statusInfo.status)) {
    return { tone: "awaiting", text: "Awaiting score" };
  }

  return null;
};

const toUpdatedMillis = (record = {}) => {
  const value = record.updatedAt || record.lastUpdatedAt || record.submittedAt || record.markedAt || record.createdAt || 0;
  const parsed = new Date(value).getTime();
  if (Number.isFinite(parsed)) return parsed;
  return Number(value) || 0;
};

export const mergeCourseProgressStatuses = (localStatuses = {}, profileStatuses = {}) => {
  const merged = { ...(profileStatuses || {}) };
  Object.entries(localStatuses || {}).forEach(([key, value]) => {
    const existing = merged[key];
    if (!existing || toUpdatedMillis(value) >= toUpdatedMillis(existing)) {
      merged[key] = value;
    }
  });
  return merged;
};

export const collectUnresolvedTutorAssignmentDiagnostics = (entries = [], level = "") =>
  entries
    .filter((entry) => isTutorMarkedEntry(entry, level))
    .map((entry) => {
      const assignmentId = getEntryAssignmentId(entry, level, entry.occurrence || 1);
      const isSynthetic = /-DAY-\d+/i.test(assignmentId);
      return isSynthetic
        ? {
            issue: "missingCanonicalAssignmentId",
            level,
            day: entry.day,
            occurrence: entry.occurrence || 1,
            chapter: entry.chapter || "",
            topic: entry.topic || "",
            fallbackAssignmentId: assignmentId,
            fallbackReason: "syntheticAssignmentId",
            tutorLessons: collectTutorAssignmentLessons(entry),
          }
        : null;
    })
    .filter(Boolean);

export const aggregateUnresolvedTutorDiagnostics = (diagnostics = []) => {
  const grouped = new Map();
  diagnostics.forEach((item) => {
    const key = `${item.level}-${item.day}-${item.chapter}-${item.fallbackReason}`;
    if (!grouped.has(key)) {
      grouped.set(key, {
        ...item,
        occurrences: 0,
        fallbackAssignmentIds: [],
        fallbackReasonCounts: {},
      });
    }
    const current = grouped.get(key);
    current.occurrences += 1;
    if (item.fallbackAssignmentId && !current.fallbackAssignmentIds.includes(item.fallbackAssignmentId)) {
      current.fallbackAssignmentIds.push(item.fallbackAssignmentId);
    }
    current.fallbackReasonCounts[item.fallbackReason] = (current.fallbackReasonCounts[item.fallbackReason] || 0) + 1;
  });
  return [...grouped.values()];
};

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
  heroHeader: { display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap" },
  heroEyebrow: { margin: 0, color: "#bfdbfe", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.6 },
  heroTitle: { margin: "4px 0 6px", fontSize: 28, lineHeight: 1.08, letterSpacing: -0.6 },
  heroText: { margin: 0, color: "#dbeafe", fontSize: 14, lineHeight: 1.5, maxWidth: 640 },
  heroActions: { display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-end", flexWrap: "wrap" },
  heroSelect: { ...styles.select, minWidth: 110, background: "rgba(255,255,255,0.96)", border: "1px solid rgba(255,255,255,0.35)" },
  statGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 },
  statCard: { border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.12)", borderRadius: 16, padding: 12, backdropFilter: "blur(8px)" },
  statLabel: { margin: 0, color: "#bfdbfe", fontSize: 12, fontWeight: 700 },
  statValue: { margin: "4px 0 0", color: "#ffffff", fontSize: 20, fontWeight: 900 },
  progressShell: { height: 10, borderRadius: 999, background: "rgba(255,255,255,0.22)", overflow: "hidden", border: "1px solid rgba(255,255,255,0.18)" },
  progressFill: { height: "100%", borderRadius: 999, background: "linear-gradient(90deg, #dcfce7, #86efac)" },
  toolbar: { ...styles.card, marginBottom: 0, display: "grid", gap: 12, borderRadius: 18, padding: 14 },
  toolbarTop: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" },
  filterRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  filterButton: { ...styles.secondaryButton, padding: "8px 12px", fontWeight: 700, background: "#ffffff" },
  filterButtonActive: { ...styles.primaryButton, padding: "8px 12px", boxShadow: "0 8px 18px rgba(37, 99, 235, 0.22)" },
  searchInput: { ...styles.input, minHeight: 42, borderRadius: 14, background: "#f8fafc" },
  nextCard: { border: "1px solid #bfdbfe", background: "linear-gradient(135deg, #eff6ff, #ffffff)", borderRadius: 18, padding: 14, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" },
  weekSection: { display: "grid", gap: 10 },
  weekHeader: { display: "flex", alignItems: "center", gap: 10, margin: "6px 0 0" },
  weekTitle: { margin: 0, fontSize: 14, color: "#1e3a8a", fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.5 },
  weekLine: { height: 1, background: "#dbeafe", flex: 1 },
  lessonCard: { background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 18, padding: 14, boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)", display: "grid", gap: 10 },
  lessonCardCurrent: { border: "1px solid #2563eb", background: "linear-gradient(135deg, #eff6ff, #ffffff 60%)", boxShadow: "0 18px 34px rgba(37, 99, 235, 0.16)" },
  lessonTop: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap" },
  lessonMain: { display: "flex", gap: 12, flex: "1 1 320px", minWidth: 0 },
  dayBubble: { width: 48, height: 48, borderRadius: 16, background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1d4ed8", display: "grid", placeItems: "center", flexShrink: 0, fontWeight: 900, lineHeight: 1.1, textAlign: "center", fontSize: 12 },
  lessonTitle: { margin: 0, fontSize: 17, lineHeight: 1.25, color: "#0f172a" },
  lessonMeta: { display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 },
  chip: { display: "inline-flex", alignItems: "center", gap: 4, borderRadius: 999, padding: "5px 9px", background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569", fontSize: 12, fontWeight: 700 },
  statusChip: { display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 999, padding: "6px 10px", fontSize: 12, fontWeight: 800, whiteSpace: "nowrap" },
  lessonActions: { display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-end", flexWrap: "wrap" },
  floatingSubmitButton: {
    position: "fixed",
    right: "max(18px, env(safe-area-inset-right))",
    bottom: "max(18px, env(safe-area-inset-bottom))",
    zIndex: 40,
    alignItems: "center",
    background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
    border: "1px solid rgba(255,255,255,0.5)",
    borderRadius: 999,
    boxShadow: "0 18px 36px rgba(37,99,235,0.35)",
    color: "#ffffff",
    cursor: "pointer",
    display: "inline-flex",
    fontWeight: 900,
    gap: 8,
    minHeight: 54,
    padding: "0 20px",
  },
  submitOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 70,
  },
  submitBackdrop: {
    position: "absolute",
    inset: 0,
    background: "rgba(15,23,42,0.42)",
  },
  submitPanel: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "min(920px, 100%)",
    overflowY: "auto",
    background: "#f8fafc",
    boxShadow: "-24px 0 48px rgba(15,23,42,0.24)",
    padding: "clamp(14px, 3vw, 24px)",
  },
  submitPanelHeader: {
    position: "sticky",
    top: 0,
    zIndex: 2,
    alignItems: "center",
    background: "rgba(248,250,252,0.96)",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
    padding: "8px 0 12px",
  },
  practiceControls: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 8 },
  emptyState: { ...styles.card, marginBottom: 0, textAlign: "center", borderRadius: 18, padding: 24 },
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

const groupLessonsByWeek = (entries) =>
  entries.reduce((groups, entry, index) => {
    const numericDay = Number(entry.day || index + 1);
    const weekNumber = Math.max(1, Math.ceil(numericDay / 5));
    const key = `Week ${weekNumber}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(entry);
    return groups;
  }, {});

const getPracticeStorageKey = ({ studentCode, level }) => `coursePracticeProgress:${studentCode || "student"}:${level || "course"}`;

const readPracticeProgress = (key) => {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
};

const CourseTab = ({ defaultLevel, defaultClassName, program }) => {
  const navigate = useNavigate();
  const { studentProfile, user } = useAuth();
  const resolvedStudentLevel = normalizeLevel(studentProfile?.level) || normalizeLevel(studentProfile?.className);
  const resolvedDefaultLevel = resolvedStudentLevel || normalizeLevel(defaultLevel) || normalizeLevel(defaultClassName);
  const isFrenchProgram = program === "french";
  const studentCode = studentProfile?.studentCode || studentProfile?.studentcode || studentProfile?.id || user?.uid || "";

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
  const [courseSubmitOpen, setCourseSubmitOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [practiceProgress, setPracticeProgress] = useState({});

  useEffect(() => {
    if (!selectedCourseLevel && levels[0]) setSelectedCourseLevel(levels[0]);
  }, [levels, selectedCourseLevel]);

  const practiceStorageKey = useMemo(
    () => getPracticeStorageKey({ studentCode, level: selectedCourseLevel }),
    [selectedCourseLevel, studentCode]
  );

  useEffect(() => {
    setPracticeProgress(readPracticeProgress(practiceStorageKey));
  }, [practiceStorageKey]);

  const { progressByAssignmentId, loading: loadingLessonProgress, error: lessonProgressError } = useLessonProgress({
    studentProfile,
    user,
    level: selectedCourseLevel,
  });

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
        const statusInfo = getAutoStatusForEntry({ progressByAssignmentId, entry, level: selectedCourseLevel, occurrence: entry.occurrence });
        const status = milestoneEntry ? "milestoneComplete" : statusInfo.finalStatus;
        const entryAssignmentKey = statusInfo.assignmentId || getEntryAssignmentId(entry, selectedCourseLevel, entry.occurrence);
        const scoreBadge = getScoreBadgeForEntry({ statusInfo, progressByAssignmentId });
        return {
          ...entry,
          assignmentKey: entryAssignmentKey,
          requiredAssignmentIds: statusInfo.requiredAssignmentIds,
          isMilestone: milestoneEntry,
          isTutorMarked,
          status,
          statusInfo,
          scoreBadge,
          statusMeta: ASSIGNMENT_STATUSES[status] || ASSIGNMENT_STATUSES.notStarted,
        };
      }),
    [progressByAssignmentId, schedule, selectedCourseLevel]
  );

  const isSelfLearningLevel = SELF_LEARNING_ONLY_LEVELS.has(String(selectedCourseLevel || "").toUpperCase());
  const isDerivedLevel = resolvedDerivedLevels.has(selectedCourseLevel);
  const assignmentCount = decoratedSchedule.filter((entry) => entry.isTutorMarked).length;
  const completedCount = decoratedSchedule.filter((entry) => entry.status === "passed").length;
  const progressPercent = decoratedSchedule.length ? Math.round((completedCount / decoratedSchedule.length) * 100) : 0;
  const nextLesson =
    decoratedSchedule.find((entry) => !entry.isMilestone && !["passed", "submitted", "resubmitted"].includes(entry.status)) ||
    decoratedSchedule.find((entry) => !entry.isMilestone) ||
    decoratedSchedule[0];

  const practiceEntries = useMemo(() => decoratedSchedule.filter((entry) => !entry.isTutorMarked && !entry.isMilestone), [decoratedSchedule]);
  const practicalCompletedCount = practiceEntries.filter((entry) => practiceProgress[entry.assignmentKey]?.completed).length;
  const completedPracticeDays = new Set(
    practiceEntries.filter((entry) => practiceProgress[entry.assignmentKey]?.completed).map((entry) => Number(entry.day))
  );
  const earnedBadges = PRACTICE_CLUSTER_BADGES.filter((badge) => badge.days.every((day) => completedPracticeDays.has(day)));

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

  const persistPracticeProgress = async (assignmentKey, nextValue) => {
    if (!db || !studentCode || !assignmentKey) return;
    const docId = `${String(studentCode).toLowerCase()}_${String(selectedCourseLevel).toLowerCase()}_${String(assignmentKey).toLowerCase().replace(/[^a-z0-9._-]/g, "_")}`;
    await setDoc(
      doc(db, "coursePracticeProgress", docId),
      {
        studentCode,
        level: selectedCourseLevel,
        assignmentKey,
        ...nextValue,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

  const updatePracticeEntry = (entry, updates) => {
    const assignmentKey = entry.assignmentKey;
    setPracticeProgress((prev) => {
      const nextValue = { ...(prev[assignmentKey] || {}), ...updates, updatedAt: new Date().toISOString() };
      const next = { ...prev, [assignmentKey]: nextValue };
      if (typeof window !== "undefined") window.localStorage.setItem(practiceStorageKey, JSON.stringify(next));
      persistPracticeProgress(assignmentKey, nextValue).catch((error) => console.warn("Could not save practice progress", error));
      return next;
    });
  };

  const openLesson = (entry) => {
    navigate(`/campus/course/lesson/${selectedCourseLevel}/${entry.day}`, {
      state: {
        level: selectedCourseLevel,
        day: entry.day,
        entry,
        assignmentKey: entry.assignmentKey,
        status: entry.status,
        scoreText: entry.scoreBadge?.text || "",
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
                <p style={courseBookStyles.heroText}>
                  Follow the lessons in order. Your badges now use real submissions and marked scores from Falowen.
                  {loadingLessonProgress ? " Syncing progress..." : ""}
                </p>
                {lessonProgressError ? <p style={{ margin: "6px 0 0", color: "#fee2e2", fontSize: 13 }}>{lessonProgressError}</p> : null}
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
                {!isSelfLearningLevel ? (
                  <button type="button" style={{ ...styles.secondaryButton, background: "rgba(255,255,255,0.95)", fontWeight: 800 }} onClick={() => setCourseSubmitOpen(true)}>
                    Submit work
                  </button>
                ) : null}
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
                <p style={courseBookStyles.statLabel}>Practice</p>
                <p style={{ ...courseBookStyles.statValue, fontSize: 16 }}>Practical completed: {practicalCompletedCount}/{practiceEntries.length}</p>
              </div>
              <div style={courseBookStyles.statCard}>
                <p style={courseBookStyles.statLabel}>Mode</p>
                <p style={{ ...courseBookStyles.statValue, fontSize: 16 }}>{isSelfLearningLevel ? "Self-learning" : isDerivedLevel ? "Class plan" : "Tutor guided"}</p>
              </div>
            </div>

            {earnedBadges.length ? (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {earnedBadges.map((badge) => (
                  <span key={badge.key} style={{ ...courseBookStyles.chip, background: "rgba(255,255,255,0.92)", color: "#14532d" }}>{badge.label}</span>
                ))}
              </div>
            ) : null}

            <div style={{ display: "grid", gap: 8 }}>
              <div style={courseBookStyles.progressShell}>
                <div style={{ ...courseBookStyles.progressFill, width: `${progressPercent}%` }} />
              </div>
              <p style={{ margin: 0, color: "#dbeafe", fontSize: 13 }}>{completedCount} of {decoratedSchedule.length} lessons passed</p>
            </div>
          </section>


          {!isSelfLearningLevel ? (
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded={courseSubmitOpen}
              onClick={() => setCourseSubmitOpen(true)}
              style={courseBookStyles.floatingSubmitButton}
            >
              <span style={{ fontSize: 18 }} aria-hidden="true">✍️</span>
              <span>Submit</span>
            </button>
          ) : null}

          {courseSubmitOpen ? (
            <div role="dialog" aria-modal="true" aria-label={`${selectedCourseLevel} assignment submit`} style={courseBookStyles.submitOverlay}>
              <div style={courseBookStyles.submitBackdrop} onClick={() => setCourseSubmitOpen(false)} />
              <section style={courseBookStyles.submitPanel}>
                <div style={courseBookStyles.submitPanelHeader}>
                  <div>
                    <p style={{ margin: 0, color: "#1d4ed8", fontSize: 12, fontWeight: 900, letterSpacing: ".04em", textTransform: "uppercase" }}>
                      {selectedCourseLevel} assignment submit
                    </p>
                    <h3 style={{ margin: "3px 0 0", color: "#0f172a" }}>Submit your workbook answers</h3>
                  </div>
                  <button type="button" style={styles.secondaryButton} onClick={() => setCourseSubmitOpen(false)}>
                    Close
                  </button>
                </div>
                <div className="course-book-drawer-submission-page">
                  <style>{`.course-book-drawer-submission-page > div > section:first-child { display: none !important; }`} </style>
                  <AssignmentSubmissionPage submissionContext={{ level: selectedCourseLevel }} />
                </div>
              </section>
            </div>
          ) : null}

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
                  <button key={filter.key} type="button" style={activeFilter === filter.key ? courseBookStyles.filterButtonActive : courseBookStyles.filterButton} onClick={() => setActiveFilter(filter.key)}>
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by day, topic, chapter or grammar point..." style={courseBookStyles.searchInput} />
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
                    const practiceState = practiceProgress[entry.assignmentKey] || {};
                    const practiceMeta = practiceState.completed ? ASSIGNMENT_STATUSES.selfMarkedComplete : ASSIGNMENT_STATUSES.practiceOnly;
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
                              {!entry.isTutorMarked ? (
                                <div style={courseBookStyles.practiceControls}>
                                  <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#334155", fontWeight: 700 }}>
                                    <input type="checkbox" checked={Boolean(practiceState.completed)} onChange={(e) => updatePracticeEntry(entry, { completed: e.target.checked })} />
                                    Completed
                                  </label>
                                  <select value={practiceState.confidence || ""} onChange={(e) => updatePracticeEntry(entry, { confidence: e.target.value })} style={{ ...styles.select, minHeight: 34, padding: "4px 8px" }}>
                                    <option value="">Confidence</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                  </select>
                                  {practiceState.completed ? (
                                    <span style={{ ...courseBookStyles.statusChip, color: practiceMeta.color, border: `1px solid ${practiceMeta.border}`, background: practiceMeta.background }}>
                                      {practiceMeta.key}
                                    </span>
                                  ) : (
                                    <span style={{ ...courseBookStyles.statusChip, color: practiceMeta.color, border: `1px solid ${practiceMeta.border}`, background: practiceMeta.background }}>
                                      {practiceMeta.key}
                                    </span>
                                  )}
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div style={courseBookStyles.lessonActions}>
                            {entry.isTutorMarked ? (
                              <>
                                <span style={{ ...courseBookStyles.statusChip, color: entry.statusMeta.color, border: `1px solid ${entry.statusMeta.border}`, background: entry.statusMeta.background }}>
                                  {entry.statusMeta.key}
                                </span>
                                {entry.scoreBadge ? (
                                  <span style={{ ...courseBookStyles.chip, background: entry.scoreBadge.tone === "awaiting" ? "#fffbeb" : "#ecfdf5", borderColor: entry.scoreBadge.tone === "awaiting" ? "#fde68a" : "#a7f3d0", color: entry.scoreBadge.tone === "awaiting" ? "#92400e" : "#065f46" }}>
                                    {entry.scoreBadge.text}
                                  </span>
                                ) : null}
                              </>
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
