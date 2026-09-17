import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const patchPath = path.join(root, "scripts/patchCompactStudentNavigation.mjs");
let source = fs.readFileSync(patchPath, "utf8");

const replacements = [
  [
    '${location.pathname.startsWith("/campus") ? " has-campus-bottom-nav" : ""}',
    '\\${location.pathname.startsWith("/campus") ? " has-campus-bottom-nav" : ""}',
  ],
  [
    '${isCampusNavigationItemActive(item, location) ? " is-active" : ""}',
    '\\${isCampusNavigationItemActive(item, location) ? " is-active" : ""}',
  ],
  [
    '${active ? " is-active" : ""}',
    '\\${active ? " is-active" : ""}',
  ],
  [
    '${moreActive ? " is-active" : ""}',
    '\\${moreActive ? " is-active" : ""}',
  ],
];

replacements.forEach(([before, after]) => {
  source = source.replaceAll(before, after);
});

// Keep the student-facing destination name explicit on desktop and mobile.
source = source.replaceAll('key: "learn", label: "Learn"', 'key: "learn", label: "Course Book"');

// Course Book lives inside Campus, but the Falowen logo should not be the only way back.
const heroActionsAnchor = '              <div data-a1-coursebook-hero-actions="true" className="course-book-hero-actions" style={courseBookStyles.heroActions}>';
if (!source.includes('className="course-book-back-to-campus"')) {
  if (!source.includes(heroActionsAnchor)) {
    throw new Error("Compact navigation patch anchor missing: Course Book Back to Campus action");
  }
  source = source.replace(
    heroActionsAnchor,
    `${heroActionsAnchor}\n                <button\n                  type="button"\n                  className="course-book-back-to-campus"\n                  style={{ ...styles.secondaryButton, minHeight: 44, background: "#ffffff", fontWeight: 800 }}\n                  onClick={() => navigate("/")}\n                >\n                  ← Back to Campus\n                </button>`,
  );
}

fs.writeFileSync(patchPath, source, "utf8");
await import(`${pathToFileURL(patchPath).href}?compact-navigation-fixed=1`);
await import("./patchA1Day5WorkbookNavigationAndWQuestions.mjs");
await import("./patchA2CompletionAndDay0ClassParticipation.mjs");
await import("./patchGuidedCourseCompletionConclusion.mjs");
await import("./patchC2TopicDrivenCurriculum.mjs");
await import("./patchC2CourseBookVisibility.mjs");
await import("./patchStudentHomeAndCourseBookCleanup.mjs");
await import("./patchC2All28ExamStandardization.mjs");