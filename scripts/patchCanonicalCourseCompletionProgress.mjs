import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const homePath = path.join(root, "web/src/components/HomeMetrics.js");
const courseTabPath = path.join(root, "web/src/components/CourseTab.js");
const writingPath = path.join(root, "web/src/components/GuidedWritingWorkspace.js");

let home = fs.readFileSync(homePath, "utf8");
let courseTab = fs.readFileSync(courseTabPath, "utf8");
let writing = fs.readFileSync(writingPath, "utf8");

const replaceOnce = (source, from, to, label) => {
  if (source.includes(to)) return source;
  if (!source.includes(from)) throw new Error(`Could not patch ${label}.`);
  return source.replace(from, to);
};

// Dashboard: render the same canonical completion result used by the Course Book.
home = replaceOnce(
  home,
  'import { detectLevelKey } from "../lib/day0Workbook";',
  'import { detectLevelKey } from "../lib/day0Workbook";\nimport CourseCompletionProgressCard from "./CourseCompletionProgressCard";\nimport useCourseCompletionProgress from "../hooks/useCourseCompletionProgress";',
  "HomeMetrics course-completion imports",
);

const homeLevelAnchor = '  const shouldShowHomeMetrics = ["A1", "A2", "B1"].includes(levelKey);';
const homeProgressHook = `${homeLevelAnchor}\n  const {\n    progress: courseCompletion,\n    loading: courseCompletionLoading,\n    error: courseCompletionError,\n  } = useCourseCompletionProgress({ studentProfile, user, level: levelKey });`;
home = replaceOnce(home, homeLevelAnchor, homeProgressHook, "HomeMetrics completion hook");

const legacyCompleter = `  const isCourseCompleter = useMemo(() => {
    const targetIdentifier = completionIdentifiersByLevel[levelKey];
    if (!targetIdentifier || !assignmentStats?.lastAssignment) return false;
    return extractIdentifiers(assignmentStats.lastAssignment).includes(targetIdentifier);
  }, [assignmentStats?.lastAssignment, levelKey]);`;
home = replaceOnce(
  home,
  legacyCompleter,
  '  const isCourseCompleter = Boolean(courseCompletion?.courseWorkCompleted);',
  "HomeMetrics canonical course-completer state",
);

const homeSectionAnchor = '    <section style={{ ...styles.card, display: "grid", gap: 12 }}>';
const homeCardMarkup = `${homeSectionAnchor}\n      <CourseCompletionProgressCard\n        progress={courseCompletion}\n        loading={courseCompletionLoading}\n        error={courseCompletionError}\n        onContinue={courseCompletion?.next?.route ? () => navigate(courseCompletion.next.route) : undefined}\n      />`;
home = replaceOnce(home, homeSectionAnchor, homeCardMarkup, "HomeMetrics completion card");

home = home.replace(
  "Home metrics are currently available for A1, A2, and B1. B2 and C1 students should start with Day 0 above.",
  "Score, attendance and leaderboard metrics are available for tutor-marked A1–B1 courses. Course completion above is available across A1–C1.",
);

// Course Book: replace page-count progress with the canonical completion engine.
courseTab = replaceOnce(
  courseTab,
  'import { getNextCourseBookEntry, isCourseBookEntryComplete } from "../utils/courseBookProgression";',
  'import { getNextCourseBookEntry, isCourseBookEntryComplete } from "../utils/courseBookProgression";\nimport { buildCourseCompletionProgress, findCourseBookEntryForRequirement, readSelfLearningProgressByDay } from "../data/courseCompletionJourney";',
  "CourseTab completion-engine import",
);

const oldCourseProgressBlock = `  const courseLessons = decoratedSchedule.filter((entry) => !entry.isMilestone);
  const assignmentCount = courseLessons.filter((entry) => entry.isTutorMarked).length;
  const completedCount = courseLessons.filter((entry) => isCourseBookEntryComplete(entry, practiceProgress)).length;
  const progressPercent = courseLessons.length ? Math.round((completedCount / courseLessons.length) * 100) : 0;
  const nextLesson = getNextCourseBookEntry(courseLessons, practiceProgress);`;
const newCourseProgressBlock = `  const courseLessons = decoratedSchedule.filter((entry) => !entry.isMilestone);
  const courseCompletion = useMemo(
    () =>
      buildCourseCompletionProgress({
        level: normalizedSelectedCourseLevel,
        progressByAssignmentId,
        selfLearningProgressByDay: readSelfLearningProgressByDay(normalizedSelectedCourseLevel),
      }),
    [normalizedSelectedCourseLevel, practiceProgress, progressByAssignmentId],
  );
  const assignmentCount = courseCompletion.total;
  const completedCount = courseCompletion.completed;
  const progressPercent = courseCompletion.completionPercent;
  const nextLesson = findCourseBookEntryForRequirement(courseLessons, courseCompletion.next);`;
courseTab = replaceOnce(courseTab, oldCourseProgressBlock, newCourseProgressBlock, "CourseTab canonical progress calculation");

courseTab = courseTab.replace(
  '<p style={courseBookStyles.statLabel}>Assignments</p>',
  '<p style={courseBookStyles.statLabel}>Required work</p>',
);

const practiceStat = `              <div style={courseBookStyles.statCard}>
                <p style={courseBookStyles.statLabel}>Practice</p>
                <p style={{ ...courseBookStyles.statValue, fontSize: 16 }}>Practical completed: {practicalCompletedCount}/{practiceEntries.length}</p>
              </div>`;
const masteryStat = `              <div style={courseBookStyles.statCard}>
                <p style={courseBookStyles.statLabel}>Mastery</p>
                <p style={{ ...courseBookStyles.statValue, fontSize: 16 }}>
                  {courseCompletion.masteryAvailable ? \`${"${courseCompletion.masteryPercent ?? 0}"}% passed\` : "Self-learning"}
                </p>
              </div>`;
courseTab = replaceOnce(courseTab, practiceStat, masteryStat, "CourseTab mastery stat");

courseTab = courseTab.replace(
  '<p style={{ margin: 0, color: "#dbeafe", fontSize: 13 }}>{completedCount} of {courseLessons.length} lessons completed</p>',
  '<p style={{ margin: 0, color: "#dbeafe", fontSize: 13 }}>{completedCount} of {courseCompletion.total} required {courseCompletion.mode === "self-learning" ? "lessons" : "assignments"} completed</p>',
);

courseTab = courseTab.replace(
  ': `Complete this lesson, then mark it complete here to unlock ${followingLessonTitle ? `“${followingLessonTitle}”` : "the next course item"}.`}',
  ': isSelfLearningLevel\n                        ? "Complete Learn, Speak and Write, then use Finish inside the lesson. Videos and Ref do not increase course completion."\n                        : `Complete this lesson, then mark it complete here to unlock ${followingLessonTitle ? `“${followingLessonTitle}”` : "the next course item"}.`}',
);

courseTab = courseTab.replace(
  '{!nextLesson.isTutorMarked ? (\n                    <label',
  '{!nextLesson.isTutorMarked && !isSelfLearningLevel ? (\n                    <label',
);

const lessonPracticeState = `                    const practiceState = practiceProgress[entry.assignmentKey] || {};
                    const practiceMeta = practiceState.completed ? ASSIGNMENT_STATUSES.selfMarkedComplete : ASSIGNMENT_STATUSES.practiceOnly;`;
const canonicalLessonPracticeState = `                    const practiceState = practiceProgress[entry.assignmentKey] || {};
                    const canonicalSelfLearningState = isSelfLearningLevel
                      ? courseCompletion.states.find((item) => Number(item.requirement?.day) === Number(entry.day)) || null
                      : null;
                    const canonicalSelfLearningComplete = Boolean(canonicalSelfLearningState?.completed);
                    const practiceMeta = isSelfLearningLevel
                      ? (canonicalSelfLearningComplete ? ASSIGNMENT_STATUSES.milestoneComplete : ASSIGNMENT_STATUSES.inProgress)
                      : (practiceState.completed ? ASSIGNMENT_STATUSES.selfMarkedComplete : ASSIGNMENT_STATUSES.practiceOnly);`;
courseTab = replaceOnce(courseTab, lessonPracticeState, canonicalLessonPracticeState, "CourseTab self-learning card state");

courseTab = courseTab.replace(
  '<input type="checkbox" checked={Boolean(practiceState.completed)} onChange={(e) => updatePracticeEntry(entry, { completed: e.target.checked })} />\n                                    Completed',
  '<input type="checkbox" disabled={isSelfLearningLevel} checked={isSelfLearningLevel ? canonicalSelfLearningComplete : Boolean(practiceState.completed)} onChange={(e) => updatePracticeEntry(entry, { completed: e.target.checked })} />\n                                    {isSelfLearningLevel ? "Complete inside lesson" : "Completed"}',
);

courseTab = courseTab.replaceAll(
  'practiceState.completed ? (',
  '(isSelfLearningLevel ? canonicalSelfLearningComplete : practiceState.completed) ? (',
);

// Guided writing: publish a monotonic Write-complete signal into the standard
// B2/C1 lesson progress key. Ref/video activity never writes this marker.
writing = replaceOnce(
  writing,
  'import { styles } from "../styles";',
  'import { styles } from "../styles";\nimport { getSelfLearningProgressStorageKey } from "../data/courseCompletionJourney";',
  "GuidedWriting completion storage import",
);

const nextWritingEffect = `  useEffect(() => {
    if (singleBoxMode) return;`;
const writingCompletionEffect = `  useEffect(() => {
    if (!cloudLoaded || typeof window === "undefined") return;
    const level = String(config.level || "").trim().toUpperCase();
    const day = Number(config.day || lessonDay || 0);
    const writingComplete = allComplete && Boolean(finalEssay.trim());
    if (!writingComplete || !["B2", "C1"].includes(level) || !day) return;

    try {
      const progressKey = getSelfLearningProgressStorageKey(level, day);
      const saved = JSON.parse(window.localStorage.getItem(progressKey) || "{}");
      if (saved.writeDone === true) return;
      const completedAt = new Date().toISOString();
      window.localStorage.setItem(
        progressKey,
        JSON.stringify({ ...saved, writeDone: true, writeCompletedAt: completedAt, updatedAt: completedAt }),
      );
      window.dispatchEvent(new CustomEvent("falowen:course-completion-progress", { detail: { level, day, section: "write" } }));
    } catch {
      // Device storage can be unavailable in private/restricted browser modes.
    }
  }, [allComplete, cloudLoaded, config.day, config.level, finalEssay, lessonDay]);

${nextWritingEffect}`;
writing = replaceOnce(writing, nextWritingEffect, writingCompletionEffect, "GuidedWriting self-learning write completion");

const requiredHomeMarkers = [
  "useCourseCompletionProgress",
  "<CourseCompletionProgressCard",
  "Boolean(courseCompletion?.courseWorkCompleted)",
];
requiredHomeMarkers.forEach((marker) => {
  if (!home.includes(marker)) throw new Error(`HomeMetrics missing course completion marker: ${marker}`);
});

const requiredCourseMarkers = [
  "buildCourseCompletionProgress",
  "findCourseBookEntryForRequirement",
  "courseCompletion.masteryAvailable",
  "Complete inside lesson",
];
requiredCourseMarkers.forEach((marker) => {
  if (!courseTab.includes(marker)) throw new Error(`CourseTab missing canonical completion marker: ${marker}`);
});

if (!writing.includes("getSelfLearningProgressStorageKey") || !writing.includes('section: "write"')) {
  throw new Error("Guided writing does not publish the self-learning Write completion signal.");
}

fs.writeFileSync(homePath, home, "utf8");
fs.writeFileSync(courseTabPath, courseTab, "utf8");
fs.writeFileSync(writingPath, writing, "utf8");
console.log("Canonical A1-C1 course completion is wired into Home, Course Book and self-learning writing progress.");
await import("./patchCourseCompletionSnapshotPersistence.mjs");
