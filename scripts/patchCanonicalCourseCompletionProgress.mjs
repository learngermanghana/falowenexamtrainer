import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const homePath = path.join(root, "web/src/components/HomeMetrics.js");
const generalHomePath = path.join(root, "web/src/components/GeneralHome.js");
const courseTabPath = path.join(root, "web/src/components/CourseTab.js");
const writingPath = path.join(root, "web/src/components/GuidedWritingWorkspace.js");

let home = fs.readFileSync(homePath, "utf8");
let generalHome = fs.readFileSync(generalHomePath, "utf8");
let courseTab = fs.readFileSync(courseTabPath, "utf8");
let writing = fs.readFileSync(writingPath, "utf8");

const replaceOnce = (source, from, to, label) => {
  if (source.includes(to)) return source;
  if (!source.includes(from)) throw new Error(`Could not patch ${label}.`);
  return source.replace(from, to);
};

// Home owns operational metrics only. Course progress belongs in Course Book.
// These cleanup replacements also make repeated local prestart/pretest runs safe
// when an older version of this patch has already modified the working tree.
const homeLevelAnchor = '  const shouldShowHomeMetrics = ["A1", "A2", "B1"].includes(levelKey);';
const homeProgressHook = `${homeLevelAnchor}\n  const {\n    progress: courseCompletion,\n    loading: courseCompletionLoading,\n    error: courseCompletionError,\n  } = useCourseCompletionProgress({ studentProfile, user, level: levelKey });`;

const legacyCompleter = `  const isCourseCompleter = useMemo(() => {
    const targetIdentifier = completionIdentifiersByLevel[levelKey];
    if (!targetIdentifier || !assignmentStats?.lastAssignment) return false;
    return extractIdentifiers(assignmentStats.lastAssignment).includes(targetIdentifier);
  }, [assignmentStats?.lastAssignment, levelKey]);`;

const homeSectionAnchor = '    <section style={{ ...styles.card, display: "grid", gap: 12 }}>';
const homeCardMarkup = `${homeSectionAnchor}\n      <CourseCompletionProgressCard\n        progress={courseCompletion}\n        loading={courseCompletionLoading}\n        error={courseCompletionError}\n        onContinue={courseCompletion?.next?.route ? () => navigate(courseCompletion.next.route) : undefined}\n      />`;

home = home.replace(
  '\nimport CourseCompletionProgressCard from "./CourseCompletionProgressCard";\nimport useCourseCompletionProgress from "../hooks/useCourseCompletionProgress";',
  "",
);
home = home.replace(homeProgressHook, homeLevelAnchor);
home = home.replace('  const isCourseCompleter = Boolean(courseCompletion?.courseWorkCompleted);', legacyCompleter);
home = home.replace(homeCardMarkup, homeSectionAnchor);
home = home.replace(
  "Score, attendance and leaderboard metrics are available for tutor-marked A1–B1 courses. Course completion above is available across A1–C1.",
  "Home metrics are currently available for A1, A2, and B1. Course progress is available in Course Book.",
);

[
  'CourseCompletionProgressCard from "./CourseCompletionProgressCard"',
  'useCourseCompletionProgress from "../hooks/useCourseCompletionProgress"',
  "<CourseCompletionProgressCard",
  "progress: courseCompletion",
].forEach((marker) => {
  if (home.includes(marker)) throw new Error(`HomeMetrics must not own course progress: ${marker}`);
});

// Keep access and navigation help visible on Home without duplicating learning actions.
const guideStartMarker = "const CompactCourseGuide = (";
const guideEndMarker = "\n\nconst AnnouncementSection =";
const guideStart = generalHome.indexOf(guideStartMarker);
const guideEnd = generalHome.indexOf(guideEndMarker, guideStart);
if (guideStart === -1 || guideEnd === -1) {
  throw new Error("Could not locate the Home course guide block.");
}

const openCourseGuide = `const CompactCourseGuide = ({ studentProfile, levelKey }) => {
  const className = studentProfile?.className || "Not assigned yet";
  const courseName = levelKey ? \`${"${levelKey}"} ${"${selfLearningLevels.has(levelKey) ? \\\"Self-learning\\\" : \\\"Course\\\"}"}\` : "Course not selected";

  return (
    <section
      data-home-course-access-guide="open"
      style={{ ...styles.card, display: "grid", gap: 14, border: "1px solid #bfdbfe", background: "#f8fafc" }}
    >
      <SectionHeader
        eyebrow="Course access"
        title="Course access and navigation"
        subtitle="Your course, class and access details are shown here. Use the guide below whenever you need help finding a Campus area."
      />

      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, background: "#ffffff" }}>
          <p style={{ ...styles.helperText, margin: 0, fontSize: 12 }}>Course</p>
          <strong>{courseName}</strong>
        </div>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, background: "#ffffff" }}>
          <p style={{ ...styles.helperText, margin: 0, fontSize: 12 }}>Assigned class</p>
          <strong>{className}</strong>
        </div>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, background: "#ffffff" }}>
          <p style={{ ...styles.helperText, margin: 0, fontSize: 12 }}>Access</p>
          <strong>{formatContractStatus(studentProfile)}</strong>
        </div>
      </div>

      <p style={{ ...styles.helperText, margin: 0 }}>
        Study flow: Course Book → Learn → Speak → Write → Finish. Your Course Book keeps your learning progress and next step together.
      </p>

      <div style={{ borderTop: "1px solid #dbe3ee", paddingTop: 12 }}>
        <NavigationGuide />
      </div>
    </section>
  );
};`;

generalHome = `${generalHome.slice(0, guideStart)}${openCourseGuide}${generalHome.slice(guideEnd)}`;

[
  "Expand course guide, access and navigation help",
  "Open Day 0 Orientation",
  "Continue Course Book",
].forEach((marker) => {
  if (generalHome.includes(marker)) throw new Error(`Home course guide still contains retired UI: ${marker}`);
});
if (!generalHome.includes('data-home-course-access-guide="open"') || !generalHome.includes("Course access and navigation")) {
  throw new Error("Home course access/navigation guide is not permanently open.");
}

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
fs.writeFileSync(generalHomePath, generalHome, "utf8");
fs.writeFileSync(courseTabPath, courseTab, "utf8");
fs.writeFileSync(writingPath, writing, "utf8");
console.log("Canonical A1-C1 course completion stays in Course Book; Home keeps an always-open access/navigation guide without course-progress duplication.");
await import("./patchCourseCompletionSnapshotPersistence.mjs");