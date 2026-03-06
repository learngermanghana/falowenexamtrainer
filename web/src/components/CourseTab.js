import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import { courseSchedules } from "../data/courseSchedule";
import { courseSchedulesByName } from "../data/courseSchedules";
import { classCatalog } from "../data/classCatalog";
import { FRENCH_A1_SCHEDULE } from "../data/frenchCourseSchedule";
import B2SelfLearningCourse from "./B2SelfLearningCourse";
import C1SelfLearningCourse from "./C1SelfLearningCourse";
import ClassMembersTab from "./ClassMembersTab";
import ResourceLinkRow, { RESOURCE_ACTION_LABELS } from "./ResourceLinkRow";
import { resolveAssignmentCanonicalKey } from "../utils/assignmentIdentity";
import { db, doc, runTransaction, serverTimestamp } from "../firebase";

const ASSIGNMENT_STATUSES = {
  notStarted: { key: "courseTab.status.notStarted", color: "#9ca3af" },
  inProgress: { key: "courseTab.status.inProgress", color: "#2563eb" },
  submitted: { key: "courseTab.status.submitted", color: "#16a34a" },
  needsRedo: { key: "courseTab.status.needsRedo", color: "#dc2626" },
  milestoneComplete: { key: "courseTab.status.milestoneComplete", color: "#0f766e" },
};
const STATUS_ORDER = ["notStarted", "inProgress", "submitted", "needsRedo"];

const sortByDay = (entries) => [...entries].sort((a, b) => Number(a.day || 0) - Number(b.day || 0));
const hasTutorMarkedWork = (entry) => {
  if (entry?.assignment) return true;
  return (
    toLessonArray(entry?.lesen_hören).some((lesson) => lesson?.assignment) ||
    toLessonArray(entry?.schreiben_sprechen).some((lesson) => lesson?.assignment)
  );
};
const isTutorMarkedEntry = (entry, level) => extractLevelToken(level) === "A1" && hasTutorMarkedWork(entry);

const extractLevelToken = (value) => {
  if (!value) return "";
  const match = String(value).toUpperCase().match(/\b(A1|A2|B1|B2|C1|C2)\b/);
  return match ? match[1] : "";
};

const normalizeLevel = (level) => extractLevelToken(level);
const LEVEL_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2"];

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
          assignmentId: session.assignmentId || session.chapter || null,
          title: session.title,
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
const isMilestoneEntry = (entry) => Boolean(entry?.completion || /course completed/i.test(String(entry?.topic || "")));

const renderInlineMarkdown = (text, keyPrefix) => {
  if (!text) return null;

  const tokenRegex = /(\*\*([^*]+)\*\*)|(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\))|(https?:\/\/[^\s]+)/g;
  const nodes = [];
  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<React.Fragment key={`${keyPrefix}-txt-${lastIndex}`}>{text.slice(lastIndex, match.index)}</React.Fragment>);
    }

    if (match[2]) {
      nodes.push(<strong key={`${keyPrefix}-bold-${match.index}`}>{match[2]}</strong>);
    } else if (match[4] && match[5]) {
      nodes.push(
        <a key={`${keyPrefix}-mdlink-${match.index}`} href={match[5]} target="_blank" rel="noreferrer">
          {match[4]}
        </a>
      );
    } else if (match[6]) {
      nodes.push(
        <a key={`${keyPrefix}-link-${match.index}`} href={match[6]} target="_blank" rel="noreferrer">
          {match[6]}
        </a>
      );
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(<React.Fragment key={`${keyPrefix}-txt-end`}>{text.slice(lastIndex)}</React.Fragment>);
  }

  return nodes;
};

const renderInstructionBlocks = (instruction = "") => {
  const lines = String(instruction)
    .split(/\n/)
    .map((line) => line.trimEnd());

  const blocks = [];
  let paragraphLines = [];
  let listItems = [];
  let listType = null;

  const flushParagraph = () => {
    if (!paragraphLines.length) return;
    blocks.push({ type: "paragraph", lines: paragraphLines });
    paragraphLines = [];
  };

  const flushList = () => {
    if (!listItems.length) return;
    blocks.push({ type: listType, items: listItems });
    listItems = [];
    listType = null;
  };

  lines.forEach((line) => {
    const ordered = line.match(/^\d+\.\s+(.*)$/);
    const unordered = line.match(/^[-*]\s+(.*)$/);

    if (!line.trim()) {
      flushParagraph();
      flushList();
      return;
    }

    if (ordered) {
      flushParagraph();
      if (listType && listType !== "ordered") flushList();
      listType = "ordered";
      listItems.push(ordered[1]);
      return;
    }

    if (unordered) {
      flushParagraph();
      if (listType && listType !== "unordered") flushList();
      listType = "unordered";
      listItems.push(unordered[1]);
      return;
    }

    flushList();
    paragraphLines.push(line);
  });

  flushParagraph();
  flushList();

  return blocks;
};

const getLessonKey = (lesson) =>
  [
    lesson.chapter || lesson.title || "",
    lesson.video || "",
    lesson.youtube_link || "",
    lesson.assignmentId || "",
    lesson.grammarbook_link || "",
    lesson.workbook_link || "",
    Boolean(lesson.assignment),
  ].join("::");

const LessonList = ({ title, lessons, t }) => {
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
              {lesson.assignment ? <span style={styles.badge}>{t("courseTab.assignment")}</span> : null}
            </div>

            <details open>
              <summary style={{ cursor: "pointer", fontWeight: 700 }}>{t("courseTab.resources")}</summary>
              <ul style={{ ...styles.checklist, margin: "6px 0 0 0" }}>
                {lesson.video || lesson.youtube_link ? (
                  <li>
                    <a href={lesson.video || lesson.youtube_link} target="_blank" rel="noreferrer">
                      {RESOURCE_ACTION_LABELS.video}
                    </a>
                  </li>
                ) : null}
                <ResourceLinkRow label="Grammarbook" url={lesson.grammarbook_link} />
                <ResourceLinkRow label="Workbook" url={lesson.workbook_link} />
              </ul>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
};

const getAllowedCourseLevels = (levels, defaultLevel) => {
  const normalizedDefault = normalizeLevel(defaultLevel);
  const maxIndex = LEVEL_ORDER.indexOf(normalizedDefault);
  if (!normalizedDefault || maxIndex === -1) return levels;

  const allowed = new Set(LEVEL_ORDER.slice(0, maxIndex + 1));
  return levels.filter((level) => allowed.has(level));
};

const getEntryAssignmentKey = (entry, level, occurrence = 1) =>
  resolveAssignmentCanonicalKey({
    level,
    assignmentId: entry.assignmentId || entry.assignment_id,
    assignmentTitle: `Day ${entry.day}${occurrence > 1 ? ` Task ${occurrence}` : ""} ${entry.topic || entry.chapter || ""}`,
  }) || `${String(level || "GENERAL").toUpperCase()}-DAY-${entry.day}${occurrence > 1 ? `-TASK-${occurrence}` : ""}`;

const getStatusForEntry = (dayStatuses, entry, level, occurrence = 1) => {
  const assignmentKey = getEntryAssignmentKey(entry, level, occurrence);
  return dayStatuses[assignmentKey]?.value || dayStatuses[String(entry.day)]?.value || "notStarted";
};


const CourseTab = ({ defaultLevel, defaultClassName, program }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { studentProfile } = useAuth();
  const resolvedDefaultLevel = normalizeLevel(defaultLevel) || normalizeLevel(defaultClassName);
  const isFrenchProgram = program === "french";
  const { schedules, resolvedDerivedLevels } = useMemo(() => {
    if (isFrenchProgram) {
      return { schedules: { A1: FRENCH_A1_SCHEDULE }, resolvedDerivedLevels: new Set() };
    }

    return { schedules: mergedCourseSchedules, resolvedDerivedLevels: derivedLevels };
  }, [isFrenchProgram]);
  const levels = useMemo(() => {
    const baseLevels = Object.keys(schedules);
    const normalizedDefault = resolvedDefaultLevel;
    const merged = normalizedDefault && !baseLevels.includes(normalizedDefault) ? [...baseLevels, normalizedDefault] : baseLevels;
    const allowedLevels = getAllowedCourseLevels(merged, normalizedDefault);
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
  const [hasManualSelection, setHasManualSelection] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [assignmentsOnly, setAssignmentsOnly] = useState(false);
  const [unfinishedOnly, setUnfinishedOnly] = useState(false);
  const [skillFilter, setSkillFilter] = useState("all");
  const [chapterFilter, setChapterFilter] = useState("all");
  const [dayStatuses, setDayStatuses] = useState({});
  const [activeSubTab, setActiveSubTab] = useState("courseBook");

  useEffect(() => {
    const normalizedDefault = resolvedDefaultLevel;
    if (
      !hasManualSelection &&
      normalizedDefault &&
      levels.includes(normalizedDefault) &&
      normalizedDefault !== selectedCourseLevel
    ) {
      setSelectedCourseLevel(normalizedDefault);
      return;
    }
    if (!levels.includes(selectedCourseLevel)) {
      setSelectedCourseLevel(levels[0] || "");
      setHasManualSelection(false);
    }
  }, [hasManualSelection, levels, resolvedDefaultLevel, selectedCourseLevel]);

  useEffect(() => {
    if (!selectedCourseLevel) return;
    const profileStatuses = studentProfile?.courseProgressByLevel?.[selectedCourseLevel];
    setDayStatuses(profileStatuses || {});
  }, [selectedCourseLevel, studentProfile]);

  useEffect(() => {
    if (!selectedCourseLevel || !studentProfile?.id) return;

    const existingStatuses = studentProfile?.courseProgressByLevel?.[selectedCourseLevel] || {};
    if (JSON.stringify(existingStatuses) === JSON.stringify(dayStatuses)) return;

    const syncProgress = async () => {
      try {
        const studentRef = doc(db, "students", studentProfile.id);
        await runTransaction(db, async (tx) => {
          const snap = await tx.get(studentRef);
          const base = snap.data()?.courseProgressByLevel || {};
          tx.set(
            studentRef,
            {
              courseProgressByLevel: {
                ...base,
                [selectedCourseLevel]: dayStatuses,
              },
              courseProgressUpdatedAt: serverTimestamp(),
              updated_at: serverTimestamp(),
            },
            { merge: true }
          );
        });
      } catch (error) {
        console.error("Failed to sync course progress", error);
      }
    };

    syncProgress();
  }, [dayStatuses, selectedCourseLevel, studentProfile]);

  const schedule = useMemo(() => {
    const seenByDay = {};
    return (schedules[selectedCourseLevel] || []).map((entry) => {
      const dayKey = String(entry.day || "");
      seenByDay[dayKey] = (seenByDay[dayKey] || 0) + 1;
      return { ...entry, occurrence: seenByDay[dayKey] };
    });
  }, [schedules, selectedCourseLevel]);
  const isDerivedLevel = useMemo(
    () => resolvedDerivedLevels.has(selectedCourseLevel),
    [resolvedDerivedLevels, selectedCourseLevel]
  );
  const isB2SelfLearning = selectedCourseLevel === "B2";
  const isC1SelfLearning = selectedCourseLevel === "C1";

  const filteredSchedule = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();
    const compactTerm = normalizedTerm.replace(/\s+/g, "");

    const matchesSearch = (entry) => {
      if (!normalizedTerm) return true;

      const dayValue = String(entry.day || "").toLowerCase();
      const dayLabel = `day ${dayValue}`;
      const compactDayValue = dayValue.replace(/\s+/g, "");
      const compactDayLabel = dayLabel.replace(/\s+/g, "");

      return (
        dayValue.includes(normalizedTerm) ||
        dayLabel.includes(normalizedTerm) ||
        compactDayValue.includes(compactTerm) ||
        compactDayLabel.includes(compactTerm) ||
        (entry.topic || "").toLowerCase().includes(normalizedTerm) ||
        (entry.chapter || "").toLowerCase().includes(normalizedTerm) ||
        (entry.grammar_topic || "").toLowerCase().includes(normalizedTerm)
      );
    };

    const hasAssignment = (entry) => hasTutorMarkedWork(entry);

    const matchesSkill = (entry) => {
      if (skillFilter === "all") return true;
      const text = `${entry.topic || ""} ${entry.grammar_topic || ""} ${entry.instruction || ""}`.toLowerCase();
      return text.includes(skillFilter);
    };

    const matchesChapter = (entry) => {
      if (chapterFilter === "all") return true;
      return String(entry.chapter || "").toLowerCase() === chapterFilter;
    };

    return sortByDay(
      schedule.filter(
        (entry) =>
          matchesSearch(entry) &&
          (!assignmentsOnly || hasAssignment(entry)) &&
          (!unfinishedOnly || getStatusForEntry(dayStatuses, entry, selectedCourseLevel, entry.occurrence) !== "submitted") &&
          matchesSkill(entry) &&
          matchesChapter(entry)
      )
    );
  }, [assignmentsOnly, chapterFilter, dayStatuses, schedule, searchTerm, skillFilter, unfinishedOnly]);

  const chapterOptions = useMemo(() => {
    const set = new Set();
    schedule.forEach((entry) => {
      if (entry.chapter) set.add(String(entry.chapter).toLowerCase());
    });
    return [...set].sort();
  }, [schedule]);

  const todayTask = useMemo(
    () =>
      schedule.find((entry) => isTutorMarkedEntry(entry) && getStatusForEntry(dayStatuses, entry, selectedCourseLevel, entry.occurrence) !== "submitted") ||
      filteredSchedule[0],
    [dayStatuses, filteredSchedule, schedule]
  );

  const overview = useMemo(() => {
    const daysCompleted = schedule.filter((entry) => getStatusForEntry(dayStatuses, entry, selectedCourseLevel, entry.occurrence) === "submitted").length;
    const totalAssignments = schedule.filter((entry) => isTutorMarkedEntry(entry)).length;
    const assignmentsSubmitted = schedule.filter(
      (entry) => isTutorMarkedEntry(entry) && getStatusForEntry(dayStatuses, entry, selectedCourseLevel, entry.occurrence) === "submitted"
    ).length;
    let streak = 0;
    for (const entry of schedule) {
      if (getStatusForEntry(dayStatuses, entry, selectedCourseLevel, entry.occurrence) === "submitted") streak += 1;
      else break;
    }
    const lastActivityTs = Object.values(dayStatuses)
      .map((entry) => entry?.updatedAt)
      .filter(Boolean)
      .sort((a, b) => b - a)[0];

    return {
      daysCompleted,
      totalDays: schedule.length,
      totalAssignments,
      assignmentsSubmitted,
      streak,
      lastActivity: lastActivityTs ? new Date(lastActivityTs).toLocaleDateString() : "—",
    };
  }, [dayStatuses, schedule]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            style={activeSubTab === "courseBook" ? styles.navButtonActive : styles.navButton}
            onClick={() => setActiveSubTab("courseBook")}
          >
            {t("courseTab.nav.courseBook")}
          </button>
          <button
            type="button"
            style={activeSubTab === "classMembers" ? styles.navButtonActive : styles.navButton}
            onClick={() => setActiveSubTab("classMembers")}
          >
            {t("courseTab.nav.classMembers")}
          </button>
        </div>

        {activeSubTab === "classMembers" ? <ClassMembersTab /> : null}

        {activeSubTab === "courseBook" ? (
          <>
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ display: "grid", gap: 4 }}>
                  <h2 style={{ ...styles.sectionTitle, margin: 0 }}>{t("courseTab.title")}</h2>
                  <span style={styles.helperText}>{t("courseTab.subtitle")}</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={styles.helperText}>{t("courseTab.level")}</span>
                  <select
                    style={styles.select}
                    value={selectedCourseLevel}
                    onChange={(e) => {
                      setSelectedCourseLevel(e.target.value);
                      setHasManualSelection(true);
                    }}
                  >
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  <button type="button" style={styles.secondaryButton} onClick={() => navigate("/campus/submit")}>
                    {t("courseTab.submit")}
                  </button>
                </div>
              </div>

              {todayTask ? (
                <div style={{ ...styles.card, marginBottom: 0, border: "1px solid #bfdbfe", background: "#eff6ff" }}>
                  <strong>{t("courseTab.todayTask")}: </strong>
                  Day {todayTask.day} · {todayTask.topic}
                </div>
              ) : null}

              <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
                <div style={{ ...styles.card, marginBottom: 0 }}>
                  {t("courseTab.metrics.days", { completed: overview.daysCompleted, total: overview.totalDays })}
                </div>
                <div style={{ ...styles.card, marginBottom: 0 }}>
                  {t("courseTab.metrics.assignments", {
                    submitted: overview.assignmentsSubmitted,
                    total: overview.totalAssignments,
                  })}
                </div>
                <div style={{ ...styles.card, marginBottom: 0 }}>{t("courseTab.metrics.streak", { count: overview.streak })}</div>
                <div style={{ ...styles.card, marginBottom: 0 }}>
                  {t("courseTab.metrics.lastActivity", { date: overview.lastActivity })}
                </div>
              </div>

              {isB2SelfLearning || isC1SelfLearning ? null : (
                <>
                  <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                    <label style={{ display: "grid", gap: 6 }}>
                      <span style={styles.helperText}>{t("courseTab.searchLabel")}</span>
                      <input
                        style={{ ...styles.input, width: "100%" }}
                        placeholder={t("courseTab.searchPlaceholder")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </label>

                    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input type="checkbox" checked={assignmentsOnly} onChange={(e) => setAssignmentsOnly(e.target.checked)} />
                      <span style={styles.helperText}>{t("courseTab.assignmentsOnly")}</span>
                    </label>

                    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input type="checkbox" checked={unfinishedOnly} onChange={(e) => setUnfinishedOnly(e.target.checked)} />
                      <span style={styles.helperText}>{t("courseTab.unfinishedOnly")}</span>
                    </label>

                    <label style={{ display: "grid", gap: 6 }}>
                      <span style={styles.helperText}>{t("courseTab.filterBySkill")}</span>
                      <select style={styles.select} value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}>
                        <option value="all">{t("courseTab.all")}</option>
                        <option value="lesen">Reading</option>
                        <option value="hören">Listening</option>
                        <option value="schreiben">Writing</option>
                        <option value="sprechen">Speaking</option>
                      </select>
                    </label>

                    <label style={{ display: "grid", gap: 6 }}>
                      <span style={styles.helperText}>{t("courseTab.filterByChapter")}</span>
                      <select style={styles.select} value={chapterFilter} onChange={(e) => setChapterFilter(e.target.value)}>
                        <option value="all">{t("courseTab.all")}</option>
                        {chapterOptions.map((chapter) => (
                          <option key={chapter} value={chapter}>
                            {chapter}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button type="button" style={styles.secondaryButton} onClick={() => setSearchTerm("Day 1")}>{t("courseTab.jump.week1")}</button>
                    <button type="button" style={styles.secondaryButton} onClick={() => setSearchTerm("Day 8")}>{t("courseTab.jump.week2")}</button>
                    <button type="button" style={styles.secondaryButton} onClick={() => setSearchTerm("Revision")}>{t("courseTab.jump.revision")}</button>
                    <button type="button" style={styles.secondaryButton} onClick={() => setAssignmentsOnly(true)}>{t("courseTab.jump.assignmentDue")}</button>
                  </div>
                </>
              )}
            </div>

            {isB2SelfLearning || isC1SelfLearning ? (
              isB2SelfLearning ? <B2SelfLearningCourse /> : <C1SelfLearningCourse />
            ) : (
              <>
                <p style={styles.helperText}>
                  {isDerivedLevel
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
                    const milestoneEntry = isMilestoneEntry(entry);
                    const status = milestoneEntry ? "milestoneComplete" : getStatusForEntry(dayStatuses, entry, selectedCourseLevel, entry.occurrence);
                    const entryAssignmentKey = getEntryAssignmentKey(entry, selectedCourseLevel, entry.occurrence);
                    const statusMeta = ASSIGNMENT_STATUSES[status] || ASSIGNMENT_STATUSES.notStarted;
                    const isTutorMarked = isTutorMarkedEntry(entry, selectedCourseLevel);
                    const showAssignmentTypeBadge = selectedCourseLevel === "A1";

                    return (
                      <div key={`day-${entry.day}`} style={{ ...styles.card, marginBottom: 0, display: "grid", gap: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                          <div>
                            <span style={styles.levelPill}>Day {entry.day}</span>
                            <h3 style={{ margin: "6px 0 4px 0" }}>{entry.topic}</h3>
                            {entry.chapter ? (
                              <div style={{ ...styles.helperText, marginBottom: 4 }}>{t("courseTab.chapter")}: {entry.chapter}</div>
                            ) : null}
                          </div>

                          <div style={{ display: "grid", gap: 6, justifyItems: "flex-end" }}>
                            {showAssignmentTypeBadge ? (
                              <span
                                style={{
                                  ...styles.badge,
                                  background: isTutorMarked ? "#fee2e2" : "#dcfce7",
                                  color: isTutorMarked ? "#991b1b" : "#166534",
                                }}
                              >
                                {isTutorMarked ? t("courseTab.tutorMarked") : t("courseTab.selfPractice")}
                              </span>
                            ) : null}
                            <span style={{ ...styles.badge, background: "#fff", color: statusMeta.color, border: `1px solid ${statusMeta.color}` }}>
                              {t(statusMeta.key)}
                            </span>
                            <select
                              style={styles.select}
                              value={status}
                              disabled={milestoneEntry}
                              onChange={(e) =>
                                setDayStatuses((prev) => ({
                                  ...prev,
                                  [entryAssignmentKey]: { value: e.target.value, updatedAt: Date.now(), assignmentKey: entryAssignmentKey },
                                }))
                              }
                            >
                              {(milestoneEntry ? ["milestoneComplete"] : STATUS_ORDER).map((statusOption) => (
                                <option key={statusOption} value={statusOption}>
                                  {t(ASSIGNMENT_STATUSES[statusOption].key)}
                                </option>
                              ))}
                            </select>
                            {isDerivedLevel ? <span style={styles.levelPill}>{t("courseTab.fromClassSchedule")}</span> : null}
                            {entry.grammar_topic ? <span style={styles.levelPill}>{entry.grammar_topic}</span> : null}
                            {isTutorMarked ? (
                              <button
                                type="button"
                                style={styles.secondaryButton}
                                onClick={() =>
                                  navigate(`/campus/submit?assignmentKey=${encodeURIComponent(entryAssignmentKey)}`, {
                                    state: {
                                      assignmentKey: entryAssignmentKey,
                                      assignmentId: entry.assignmentId || null,
                                      day: entry.day,
                                      occurrence: entry.occurrence,
                                      level: selectedCourseLevel,
                                    },
                                  })
                                }
                              >
                                Submit this assignment
                              </button>
                            ) : null}
                          </div>
                        </div>

                        {entry.goal ? <p style={{ margin: 0 }}>{entry.goal}</p> : null}
                        {entry.instruction ? (
                          <div style={{ display: "grid", gap: 6 }}>
                            <span style={styles.badge}>📝 {t("courseTab.instructionLabel")}</span>
                            <div style={{ ...styles.helperText, margin: 0, display: "grid", gap: 8 }}>
                              {renderInstructionBlocks(entry.instruction).map((block, index) => {
                                if (block.type === "ordered") {
                                  return (
                                    <ol key={`ins-ol-${index}`} style={{ margin: 0, paddingLeft: 20 }}>
                                      {block.items.map((item, itemIndex) => (
                                        <li key={`ins-ol-item-${itemIndex}`}>{renderInlineMarkdown(item, `ins-ol-${index}-${itemIndex}`)}</li>
                                      ))}
                                    </ol>
                                  );
                                }
                                if (block.type === "unordered") {
                                  return (
                                    <ul key={`ins-ul-${index}`} style={{ margin: 0, paddingLeft: 20 }}>
                                      {block.items.map((item, itemIndex) => (
                                        <li key={`ins-ul-item-${itemIndex}`}>{renderInlineMarkdown(item, `ins-ul-${index}-${itemIndex}`)}</li>
                                      ))}
                                    </ul>
                                  );
                                }

                                return (
                                  <p key={`ins-p-${index}`} style={{ margin: 0 }}>
                                    {block.lines.map((line, lineIndex) => (
                                      <React.Fragment key={`ins-p-line-${index}-${lineIndex}`}>
                                        {lineIndex ? <br /> : null}
                                        {renderInlineMarkdown(line, `ins-p-${index}-${lineIndex}`)}
                                      </React.Fragment>
                                    ))}
                                  </p>
                                );
                              })}
                            </div>
                            {entry.completion ? (
                              <p style={{ ...styles.helperText, margin: 0 }}>
                                {entry.completion.messageKey
                                  ? t(entry.completion.messageKey, {
                                      level: entry.completion.level,
                                      nextLevel: entry.completion.nextLevel,
                                      defaultValue: entry.completion.message,
                                    })
                                  : entry.completion.message}
                              </p>
                            ) : null}
                            {Array.isArray(entry.completion?.actions) && entry.completion.actions.length ? (
                              <div style={{ display: "grid", gap: 4 }}>
                                {entry.completion.actions.map((action) => (
                                  <a
                                    key={`${entry.day}-${action.href}`}
                                    href={action.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ fontSize: 13, fontWeight: 700, color: "#2563eb", textDecoration: "none" }}
                                  >
                                    {action.labelKey ? t(action.labelKey, { defaultValue: action.label }) : action.label}
                                  </a>
                                ))}
                              </div>
                            ) : null}
                            {entry.instructionLink ? (
                              <a
                                href={entry.instructionLink.to}
                                style={{ fontSize: 13, fontWeight: 700, color: "#2563eb", textDecoration: "none" }}
                              >
                                {entry.instructionLink.label || RESOURCE_ACTION_LABELS.guideOpenInApp}
                              </a>
                            ) : null}
                          </div>
                        ) : null}

                        <LessonList title="Lesen & Hören" lessons={lesenHorenList} t={t} />
                        <LessonList title="Schreiben & Sprechen" lessons={schreibenSprechenList} t={t} />

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
                      <p style={{ margin: 0 }}>{t("courseTab.noResults")}</p>
                    </div>
                  ) : null}
                </div>
              </>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default CourseTab;
