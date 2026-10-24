import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const courseTabPath = path.join(root, "web/src/components/CourseTab.js");
const regressionPath = path.join(root, "web/src/components/A2B1CourseBook.test.js");

const mobileActionsBlock = `          {usesSharedA2B1Design ? (\n            <nav className="course-book-mobile-actions" aria-label="Course Book actions">\n              <button type="button" disabled={!nextLesson} onClick={() => nextLesson && openLesson(nextLesson)}>\n                Continue\n              </button>\n              <button type="button" onClick={() => setCourseSubmitOpen(true)}>\n                Submit\n              </button>\n            </nav>\n          ) : null}\n`;

let courseTab = fs.readFileSync(courseTabPath, "utf8");
if (courseTab.includes(mobileActionsBlock)) {
  courseTab = courseTab.replace(mobileActionsBlock, "");
} else if (courseTab.includes('className="course-book-mobile-actions"')) {
  throw new Error("Could not remove the A2/B1 floating mobile action bar safely.");
}
fs.writeFileSync(courseTabPath, courseTab);

let regression = fs.readFileSync(regressionPath, "utf8");
regression = regression.replace(
  `expect(courseTabSource).toContain('className="course-book-mobile-actions"');`,
  `expect(courseTabSource).not.toContain('className="course-book-mobile-actions"');`,
);
fs.writeFileSync(regressionPath, regression);

await import("./patchA2Day25StandardNavigation.mjs");
await import("./patchA2Days26To28LearningUpgrade.mjs");

// Keep the A2/B1 writing page intentionally simple: task copy is owned by the
// workbook, while the shared workspace contains only the German draft box and
// Analyse action. Also make workbook opening settle on the section navigation.
await import("./patchA2B1WritingAndNavigationCleanup.mjs");

// This script is deliberately the final lifecycle step in prestart/prebuild/pretest.
// Re-apply the structured submission lifecycle here so no earlier/later workbook
// codemod can leave production with the legacy free-text submit page.
await import("./patchWorkbookSubmissionAutoSelection.mjs");

// Mount the workbook answer-capture runtime after the structured submit patch so
// every build/test/start finishes with clickable Teil 3/4 answers and Teil 2 autosave.
await import("./patchA2B1MappedSubmissionCapture.mjs");

// Final presentation pass: keep the objective guidance/progress and completion
// review on top of the mapped-submit runtime that production actually ships.
await import("./patchA2B1WorkbookProgressReview.mjs");

// Keep all learner-facing instructions consistent with the mapped workflow:
// answer in the workbook, review the mapped draft, and edit the final text before submit.
await import("./patchMappedWorkbookInteractionCopy.mjs");

console.log("Removed the A2/B1 floating Continue and Submit mobile action bar, applied final A2 learning upgrades, simplified Teil 2 writing, aligned workbook opening to section navigation, re-asserted structured submission ownership, mapped workbook answers into Submit, added answer progress plus incomplete-submit review, and aligned A1/A2/B1 learner guidance with editable final review.");
