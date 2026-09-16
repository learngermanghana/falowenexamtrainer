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
  '  const usesSharedA2B1Design = normalizedSelectedCourseLevel === "A2" || normalizedSelectedCourseLevel === "B1";\n  const isCourseConclusionLevel = ["A1", "A2", "B1", "B2", "C1", "C2"].includes(normalizedSelectedCourseLevel);',
  "course conclusion level flag",
);

replaceOnce(
  '  const assignmentCount = courseCompletion.total;\n  const completedCount = courseCompletion.completed;',
  '  const assignmentCount = courseCompletion.total;\n  const passedAssignmentCount = courseCompletion.passed;\n  const completedCount = courseCompletion.completed;',
  "canonical passed assignment count",
);

replaceOnce(
  '  const nextLesson = findCourseBookEntryForRequirement(courseLessons, courseCompletion.next);',
  '  const nextLesson = findCourseBookEntryForRequirement(courseLessons, courseCompletion.next);\n  const courseIsComplete = isCourseConclusionLevel && courseCompletion.courseWorkCompleted;',
  "course completion state",
);

replaceOnce(
  '      decoratedSchedule.filter((entry) => {\n        if (!lessonMatchesSearch(entry, searchTerm)) return false;',
  '      decoratedSchedule.filter((entry) => {\n        if (isCourseConclusionLevel && entry.isMilestone) return false;\n        if (!lessonMatchesSearch(entry, searchTerm)) return false;',
  "hide milestone lesson cards",
);

replaceOnce(
  '    [decoratedSchedule, searchTerm, activeFilter, nextLesson]\n  );',
  '    [decoratedSchedule, searchTerm, activeFilter, nextLesson, isCourseConclusionLevel]\n  );',
  "visible lesson dependencies",
);

// Retire the old generic completion card wherever the dedicated conclusion is used.
source = source.replace(
  'normalizedSelectedCourseLevel === "A2" ? null : (',
  'isCourseConclusionLevel ? null : (',
);

const lessonListTail = `          ) : (\n            <section style={courseBookStyles.emptyState}>\n              <h3 style={{ marginTop: 0 }}>No lessons found</h3>\n              <p style={{ ...styles.helperText, margin: 0 }}>Try another search word or choose a different filter.</p>\n            </section>\n          )}\n        </>`;
const lessonListTailWithConclusion = `          ) : (\n            <section style={courseBookStyles.emptyState}>\n              <h3 style={{ marginTop: 0 }}>No lessons found</h3>\n              <p style={{ ...styles.helperText, margin: 0 }}>Try another search word or choose a different filter.</p>\n            </section>\n          )}\n\n          {isCourseConclusionLevel ? (\n            <CourseCompletionConclusion\n              level={normalizedSelectedCourseLevel}\n              isComplete={courseIsComplete}\n              completedRequirements={completedCount}\n              totalRequirements={courseCompletion.total}\n              passedAssignments={passedAssignmentCount}\n              totalAssignments={assignmentCount}\n              needsImprovement={courseCompletion.needsImprovement}\n              awaitingReview={courseCompletion.awaitingReview}\n              onExploreNextLevel={() => {\n                const nextLevel = { A1: "A2", A2: "B1", B1: "B2", B2: "C1", C1: "C2" }[normalizedSelectedCourseLevel];\n                if (nextLevel) navigate(\`/campus/course/preview/\${nextLevel}\`);\n              }}\n            />\n          ) : null}\n        </>`;
replaceOnce(lessonListTail, lessonListTailWithConclusion, "bottom course completion conclusion");

const requiredMarkers = [
  'import CourseCompletionConclusion from "./CourseCompletionConclusion";',
  'const isCourseConclusionLevel = ["A1", "A2", "B1", "B2", "C1", "C2"].includes(normalizedSelectedCourseLevel);',
  'const passedAssignmentCount = courseCompletion.passed;',
  'const courseIsComplete = isCourseConclusionLevel && courseCompletion.courseWorkCompleted;',
  'if (isCourseConclusionLevel && entry.isMilestone) return false;',
  '{isCourseConclusionLevel ? (',
  'isComplete={courseIsComplete}',
  '<CourseCompletionConclusion',
  'needsImprovement={courseCompletion.needsImprovement}',
  'navigate(`/campus/course/preview/${nextLevel}`)',
];

requiredMarkers.forEach((marker) => {
  if (!source.includes(marker)) throw new Error(`Course completion conclusion marker missing: ${marker}`);
});

fs.writeFileSync(courseTabPath, source, "utf8");

const appPath = path.join(root, "web/src/App.js");
let appSource = fs.readFileSync(appPath, "utf8");
const replaceAppOnce = (before, after, label) => {
  if (appSource.includes(after)) return;
  if (!appSource.includes(before)) throw new Error(`Could not patch ${label}: App.js anchor missing.`);
  appSource = appSource.replace(before, after);
};

replaceAppOnce(
  'import CourseTab from "./components/CourseTab";',
  'import CourseTab from "./components/CourseTab";\nimport NextLevelPreviewPage from "./components/NextLevelPreviewPage";',
  "next-level preview import",
);

replaceAppOnce(
  '          <Route path="/campus/course/lesson/:level/:day" element={<CourseLessonPage />} />',
  '          <Route path="/campus/course/preview/:level" element={<NextLevelPreviewPage />} />\n          <Route path="/campus/course/lesson/:level/:day" element={<CourseLessonPage />} />',
  "next-level preview route",
);

[
  'import NextLevelPreviewPage from "./components/NextLevelPreviewPage";',
  '<Route path="/campus/course/preview/:level" element={<NextLevelPreviewPage />} />',
].forEach((marker) => {
  if (!appSource.includes(marker)) throw new Error(`Next-level preview App.js marker missing: ${marker}`);
});

fs.writeFileSync(appPath, appSource, "utf8");
console.log("Course completion now removes Study Calendar, routes Explore to a locked next-level preview, and supports A1 through C2 progression.");
