const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const canonicalPath = path.join(repoRoot, "shared/curriculumCanonical.json");
const canonical = JSON.parse(fs.readFileSync(canonicalPath, "utf8"));
const b1Day20 = canonical.find((lesson) => lesson.id === "B1-6.20");
if (!b1Day20) throw new Error("B1-6.20 was not found in the canonical curriculum");
b1Day20.workbookRoute = "/campus/course/lesson/B1/20?view=workbook";
fs.writeFileSync(canonicalPath, `${JSON.stringify(canonical, null, 2)}\n`, "utf8");

const entriesPath = path.join(repoRoot, "web/src/utils/courseBookEntries.js");
let entriesSource = fs.readFileSync(entriesPath, "utf8");

const replaceOnce = (before, after, label) => {
  const first = entriesSource.indexOf(before);
  if (first < 0) throw new Error(`${label}: expected source was not found`);
  if (entriesSource.indexOf(before, first + before.length) >= 0) {
    throw new Error(`${label}: expected source was not unique`);
  }
  entriesSource = `${entriesSource.slice(0, first)}${after}${entriesSource.slice(first + before.length)}`;
};

replaceOnce(
  'import { applyCourseBookCurriculumCorrection } from "../data/courseBookCurriculumCorrections";\n',
  'import { applyCourseBookCurriculumCorrection } from "../data/courseBookCurriculumCorrections";\nimport { A1_COURSE_BOOK_CARDS } from "../data/a1CourseBookCards";\n',
  "A1 card import",
);

replaceOnce(
  `export const expandCourseBookEntry = (entry = {}, options = {}) => {\n  const normalizedEntry = normalizeCourseBookEntry(entry, options);\n  const tasks = TASK_SECTIONS.flatMap((section) =>\n    toArray(normalizedEntry?.[section]).filter(Boolean).map((task) => ({ section, task }))\n  );\n\n  if (tasks.length <= 1) return [normalizedEntry];\n\n  return tasks.map(({ section, task }, index) => {\n    const chapter = getTaskChapter(task, normalizedEntry);\n    const assignmentId = getTaskAssignmentId(task, normalizedEntry);\n    const assignment = task.assignment === undefined ? Boolean(normalizedEntry.assignment) : Boolean(task.assignment);\n\n    return normalizeCourseBookEntry(\n      {\n        ...normalizedEntry,\n        topic: getTaskTitle(task, normalizedEntry),\n        title: task.title || task.topic || normalizedEntry.title,\n        lessonTitle: getTaskTitle(task, normalizedEntry),`,
  `export const expandCourseBookEntry = (entry = {}, options = {}) => {\n  const normalizedEntry = normalizeCourseBookEntry(entry, options);\n  const tasks = TASK_SECTIONS.flatMap((section) =>\n    toArray(normalizedEntry?.[section]).filter(Boolean).map((task) => ({ section, task }))\n  );\n\n  if (tasks.length <= 1) return [normalizedEntry];\n\n  const entryLevel = getEntryLevel(normalizedEntry, {}, options.level);\n  const canonicalDayCards = entryLevel === "A1"\n    ? A1_COURSE_BOOK_CARDS.filter(\n        (card) => Number(card.displayDay) === Number(normalizedEntry.displayDay ?? normalizedEntry.day)\n      )\n    : [];\n  const canAlignCanonicalCards = canonicalDayCards.length === tasks.length;\n\n  return tasks.map(({ section, task }, index) => {\n    const alignedCard = canAlignCanonicalCards ? canonicalDayCards[index] : null;\n    const chapter = alignedCard?.chapter || getTaskChapter(task, normalizedEntry);\n    const assignmentId = alignedCard?.assignmentId || getTaskAssignmentId(task, normalizedEntry);\n    const assignment = alignedCard\n      ? alignedCard.assessmentType === COURSE_BOOK_ASSESSMENT_TYPES.tutorMarked\n      : task.assignment === undefined\n        ? Boolean(normalizedEntry.assignment)\n        : Boolean(task.assignment);\n    const taskTitle = alignedCard?.title || getTaskTitle(task, normalizedEntry);\n\n    return normalizeCourseBookEntry(\n      {\n        ...normalizedEntry,\n        topic: taskTitle,\n        title: alignedCard?.title || task.title || task.topic || normalizedEntry.title,\n        lessonTitle: taskTitle,`,
  "canonical multi-card alignment",
);

fs.writeFileSync(entriesPath, entriesSource, "utf8");
execFileSync(process.execPath, [path.join(repoRoot, "scripts/syncCurriculumManifest.js")], {
  cwd: repoRoot,
  stdio: "inherit",
});

for (const temporaryPath of [
  "scripts/applyCanonicalCiRepairs.js",
  ".github/workflows/apply-canonical-ci-repairs.yml",
]) {
  const absolutePath = path.join(repoRoot, temporaryPath);
  if (fs.existsSync(absolutePath)) fs.unlinkSync(absolutePath);
}

console.log("Canonical B1 route and A1 legacy multi-card compatibility repaired.");
