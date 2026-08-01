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

console.log("Removed the A2/B1 floating Continue and Submit mobile action bar.");
