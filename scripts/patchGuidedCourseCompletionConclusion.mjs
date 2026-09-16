import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const courseTabPath = path.join(root, "web/src/components/CourseTab.js");
let source = fs.readFileSync(courseTabPath, "utf8");

const replaceOnce = (before, after, label) => {
  if (source.includes(after)) return;
  if (!source.includes(before)) throw new Error(`Could not patch ${label}: source anchor missing.`);
  source = source.replace(before, after);
};

replaceOnce(
  'import YouTubeSubscribeButton from "./YouTubeSubscribeButton";',
  'import YouTubeSubscribeButton from "./YouTubeSubscribeButton";\nimport CourseCompletionConclusion from "./CourseCompletionConclusion";',
  "Course completion component import",
);

replaceOnce(
  '  const usesSharedA2B1Design = normalizedSelectedCourseLevel === "A2" || normalizedSelectedCourseLevel === "B1";',
  '  const usesSharedA2B1Design = normalizedSelectedCourseLevel === "A2" || normalizedSelectedCourseLevel === "B1";\n  const isGuidedCompletionLevel = ["A1", "A2", "B1"].includes(normalizedSelectedCourseLevel);',
  "guided completion level flag",
);

replaceOnce(
  '  const assignmentCount = courseCompletion.total;\n  const completedCount = courseCompletion.completed;',
  '  const assignmentCount = courseCompletion.total;\n  const passedAssignmentCount = courseCompletion.passed;\n  const completedCount = courseCompletion.completed;',
  "canonical passed assignment count",
);

replaceOnce(
  '  const nextLesson = findCourseBookEntryForRequirement(courseLessons, courseCompletion.next);',
  '  const nextLesson = findCourseBookEntryForRequirement(courseLessons, courseCompletion.next);\n  const courseIsComplete = isGuidedCompletionLevel && courseCompletion.courseWorkCompleted;',
  "guided course completion state",
);

replaceOnce(
  '      decoratedSchedule.filter((entry) => {\n        if (!lessonMatchesSearch(entry, searchTerm)) return false;',
  '      decoratedSchedule.filter((entry) => {\n        if (isGuidedCompletionLevel && entry.isMilestone) return false;\n        if (!lessonMatchesSearch(entry, searchTerm)) return false;',
  "hide guided milestone lesson cards",
);

replaceOnce(
  '    [decoratedSchedule, searchTerm, activeFilter, nextLesson]\n  );',
  '    [decoratedSchedule, searchTerm, activeFilter, nextLesson, isGuidedCompletionLevel]\n  );',
  "visible lesson dependencies",
);

// The previous A2 patch suppresses the old generic completion card only for A2.
// Extend that guard to all three tutor-guided completion levels.
source = source.replace(
  'normalizedSelectedCourseLevel === "A2" ? null : (',
  'isGuidedCompletionLevel ? null : (',
);

const lessonListTail = `          ) : (\n            <section style={courseBookStyles.emptyState}>\n              <h3 style={{ marginTop: 0 }}>No lessons found</h3>\n              <p style={{ ...styles.helperText, margin: 0 }}>Try another search word or choose a different filter.</p>\n            </section>\n          )}\n        </>`;
const lessonListTailWithConclusion = `          ) : (\n            <section style={courseBookStyles.emptyState}>\n              <h3 style={{ marginTop: 0 }}>No lessons found</h3>\n              <p style={{ ...styles.helperText, margin: 0 }}>Try another search word or choose a different filter.</p>\n            </section>\n          )}\n\n          {courseIsComplete ? (\n            <CourseCompletionConclusion\n              level={normalizedSelectedCourseLevel}\n              completedRequirements={completedCount}\n              totalRequirements={courseCompletion.total}\n              passedAssignments={passedAssignmentCount}\n              totalAssignments={assignmentCount}\n              needsImprovement={courseCompletion.needsImprovement}\n              awaitingReview={courseCompletion.awaitingReview}\n              onExploreNextLevel={() => {\n                const nextLevel = { A1: "A2", A2: "B1", B1: "B2" }[normalizedSelectedCourseLevel];\n                if (nextLevel && levels.includes(nextLevel)) {\n                  setSelectedCourseLevel(nextLevel);\n                  setActiveFilter("all");\n                  setSearchTerm("");\n                  return;\n                }\n                navigate("/classes/");\n              }}\n            />\n          ) : null}\n        </>`;
replaceOnce(lessonListTail, lessonListTailWithConclusion, "bottom guided completion conclusion");

const requiredMarkers = [
  'import CourseCompletionConclusion from "./CourseCompletionConclusion";',
  'const isGuidedCompletionLevel = ["A1", "A2", "B1"].includes(normalizedSelectedCourseLevel);',
  'const passedAssignmentCount = courseCompletion.passed;',
  'const courseIsComplete = isGuidedCompletionLevel && courseCompletion.courseWorkCompleted;',
  'if (isGuidedCompletionLevel && entry.isMilestone) return false;',
  '<CourseCompletionConclusion',
  'needsImprovement={courseCompletion.needsImprovement}',
  'navigate("/classes/")',
];

requiredMarkers.forEach((marker) => {
  if (!source.includes(marker)) throw new Error(`Guided completion conclusion marker missing: ${marker}`);
});

fs.writeFileSync(courseTabPath, source, "utf8");
console.log("A1-A2-B1 now use one bottom completion conclusion with canonical progress, Results, Attendance, Class Participation, exam prep and next-level actions.");
