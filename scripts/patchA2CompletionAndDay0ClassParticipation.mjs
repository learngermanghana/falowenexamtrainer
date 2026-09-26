import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const courseTabPath = path.join(root, "web/src/components/CourseTab.js");
const schedulePath = path.join(root, "web/src/data/courseSchedule.js");
const day0Paths = [
  ["A1", path.join(root, "web/src/components/A1Day0OrientationKnowledgeTestWorkbookPage.js")],
  ["A2", path.join(root, "web/src/components/A2Day0OrientationKnowledgeTestWorkbookPage.js")],
  ["B1", path.join(root, "web/src/components/B1Day0OrientationKnowledgeTestWorkbookPage.js")],
];

const PARTICIPATION_ROUTE = "/campus/account?tab=participation";
const PARTICIPATION_COPY =
  "Review teacher-recorded class responses, correct answers and the areas you need to revise after live lessons.";

const insertAfterClosingTag = (source, startMarker, insertion, label) => {
  if (source.includes(insertion.trim())) return source;
  const start = source.indexOf(startMarker);
  if (start === -1) throw new Error(`Could not patch ${label}: start marker missing.`);
  const end = source.indexOf("</a>", start);
  if (end === -1) throw new Error(`Could not patch ${label}: closing link missing.`);
  const insertionPoint = end + "</a>".length;
  return `${source.slice(0, insertionPoint)}${insertion}${source.slice(insertionPoint)}`;
};

const addClassParticipationToDay0 = (source, level) => {
  if (!source.includes('<TabGuide title="Class Participation">')) {
    const classMembersStart = source.indexOf('<TabGuide title="Class Members">');
    if (classMembersStart === -1) throw new Error(`${level} Day 0 Class Members guide anchor missing.`);
    const classMembersEnd = source.indexOf("</TabGuide>", classMembersStart);
    if (classMembersEnd === -1) throw new Error(`${level} Day 0 Class Members guide closing tag missing.`);
    const insertionPoint = classMembersEnd + "</TabGuide>".length;
    const guide = `\n          <TabGuide title="Class Participation">\n            ${PARTICIPATION_COPY}\n          </TabGuide>`;
    source = `${source.slice(0, insertionPoint)}${guide}${source.slice(insertionPoint)}`;
  }

  if (!source.includes(`href="${PARTICIPATION_ROUTE}"`)) {
    source = insertAfterClosingTag(
      source,
      'href="/campus/attendance"',
      `\n          <a href="${PARTICIPATION_ROUTE}" style={{ ...styles.secondaryButton, textDecoration: "none" }}>Open Class Participation</a>`,
      `${level} Day 0 Class Participation action`,
    );
  }

  if (!source.includes('<TabGuide title="Class Participation">') || !source.includes(`href="${PARTICIPATION_ROUTE}"`)) {
    throw new Error(`${level} Day 0 Class Participation guide/action was not applied.`);
  }
  return source;
};

let courseTab = fs.readFileSync(courseTabPath, "utf8");

// A2 has a canonical Day 30 completion milestone after the Day 29 exam orientation.
// Do not duplicate it in the generic next-lesson slot at the top.
const completionText = "Course Book complete";
if (!courseTab.includes('normalizedSelectedCourseLevel === "A2" ? null : (')) {
  const completionTextIndex = courseTab.indexOf(completionText);
  if (completionTextIndex === -1) throw new Error("Course Book generic completion card anchor missing.");
  const branchStart = courseTab.lastIndexOf("            ) : (", completionTextIndex);
  if (branchStart === -1) throw new Error("Course Book completion ternary branch start missing.");
  const branchEndMarker = '\n\n          <section className="course-book-toolbar"';
  const branchEnd = courseTab.indexOf(branchEndMarker, completionTextIndex);
  if (branchEnd === -1) throw new Error("Course Book completion branch end marker missing.");

  const completionBranch = courseTab.slice(branchStart, branchEnd);
  if (!completionBranch.includes("You have completed every available lesson.")) {
    throw new Error("Unexpected Course Book completion branch content.");
  }
  const guardedBranch = completionBranch.replace(
    "            ) : (",
    '            ) : normalizedSelectedCourseLevel === "A2" ? null : (',
  );
  courseTab = `${courseTab.slice(0, branchStart)}${guardedBranch}${courseTab.slice(branchEnd)}`;
}

if (!courseTab.includes('normalizedSelectedCourseLevel === "A2" ? null : (')) {
  throw new Error("A2 generic top completion card was not suppressed.");
}

let schedule = fs.readFileSync(schedulePath, "utf8");
if (!schedule.includes('day: 30,\n    topic: "Course Completed!"')) {
  throw new Error(
    "A2 Day 30 completion milestone is missing after Day 29 exam orientation; cannot suppress the duplicate top message safely.",
  );
}

// Retire the old email-based completion wording at the data source too. This
// prevents any older milestone renderer from bringing the previous conclusion
// back even if it reads the schedule object directly.
const legacyCompletionStart = schedule.indexOf('const COMPLETION_CONTACT_EMAIL = "info@falowen.app";');
const legacyCompletionEnd = schedule.indexOf("const buildA2Lesson", legacyCompletionStart);
if (legacyCompletionStart !== -1 && legacyCompletionEnd !== -1) {
  const modernCompletionData = `const COMPLETION_ACTIONS = [
  { label: "Review Results", labelKey: "courseTab.completion.actions.reviewResults", href: "/campus/results" },
  { label: "Review Attendance", labelKey: "courseTab.completion.actions.reviewAttendance", href: "/campus/attendance" },
  { label: "Review Class Participation", labelKey: "courseTab.completion.actions.reviewParticipation", href: "/campus/account?tab=participation" },
  { label: "Prepare for exam", labelKey: "courseTab.completion.actions.openExams", href: "/exams/question" },
  { label: "Study Calendar", labelKey: "courseTab.completion.actions.downloadStudyCalendar", href: "/exams/study?force=1" },
];

const buildCompletionMessage = ({ level, nextLevel }) => ({
  goal: "Review your course records, strengthen weak areas and prepare for your next step.",
  instruction: \`You have reached the final checkpoint of your \${level} Course Book. Review Results, Attendance and Class Participation, complete any outstanding required work, and continue with focused \${level} exam preparation. Move to \${nextLevel} when your progression is confirmed.\`,
  completion: {
    messageKey: "courseTab.completion.message",
    message: \`Final \${level} checkpoint: review your course records, prepare for the exam and continue to \${nextLevel} when ready.\`,
    level,
    nextLevel,
    actions: COMPLETION_ACTIONS,
    nonActionableStatus: "milestoneComplete",
  },
});

`;
  schedule = `${schedule.slice(0, legacyCompletionStart)}${modernCompletionData}${schedule.slice(legacyCompletionEnd)}`;
}

if (schedule.includes("Please tell us what you would like to do next by emailing") || schedule.includes("COMPLETION_CONTACT_EMAIL")) {
  throw new Error("Legacy email-based course completion wording is still present.");
}

fs.writeFileSync(courseTabPath, courseTab, "utf8");
fs.writeFileSync(schedulePath, schedule, "utf8");

for (const [level, day0Path] of day0Paths) {
  const source = fs.readFileSync(day0Path, "utf8");
  fs.writeFileSync(day0Path, addClassParticipationToDay0(source, level), "utf8");
}

console.log(
  "Legacy completion copy retired; A2 Day 30 milestone remains bottom-only after Day 29 exam orientation, and A1-A2-B1 Day 0 includes Class Participation.",
);
