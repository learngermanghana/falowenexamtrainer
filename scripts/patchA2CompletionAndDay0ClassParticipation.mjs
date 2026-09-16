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

// A2 already has a canonical Day 29 completion milestone at the bottom of its
// schedule. Do not duplicate that message in the generic next-lesson slot at
// the top once the final required lesson is complete.
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

const schedule = fs.readFileSync(schedulePath, "utf8");
if (!schedule.includes('day: 29,\n    topic: "Course Completed!"')) {
  throw new Error("A2 Day 29 completion milestone is missing; cannot suppress the duplicate top message safely.");
}

fs.writeFileSync(courseTabPath, courseTab, "utf8");

for (const [level, day0Path] of day0Paths) {
  const source = fs.readFileSync(day0Path, "utf8");
  fs.writeFileSync(day0Path, addClassParticipationToDay0(source, level), "utf8");
}

console.log(
  "A2 completion stays at the bottom Day 29 milestone; A1-A2-B1 Day 0 now explains and links Class Participation.",
);
