import fs from "fs";
import path from "path";

const buddy = fs.readFileSync(path.join(__dirname, "StudyBuddyBar.js"), "utf8");
const workbook = fs.readFileSync(path.join(__dirname, "A2B1WorkbookGuidance.js"), "utf8");

test("StudyBuddy offers direct access to results, not the exam room", () => {
  expect(buddy).toContain('key: "results"');
  expect(buddy).toContain('navigate("/campus/results")');
  expect(buddy).toContain('destination: "/campus/results"');
});

test("A2/B1 workbook guide names the current lesson instead of a generic workbook", () => {
  expect(workbook).toContain('resolveA2B1WorkbookDayFromLocation(workbookLevel, window.location.pathname)');
  expect(workbook).toContain('const lessonContext = lessonDay');
  expect(workbook).toContain('{lessonContext} · how to complete this workbook');
  expect(workbook).toContain('The <strong>Submit</strong> tab is for final work only.');
});

test("A2 shared workbook guide reuses the lesson's actual grammar and application task", () => {
  expect(workbook).toContain('const lessonLearning = workbookLevel === "A2"');
  expect(workbook).toContain("lessonLearning.title");
  expect(workbook).toContain("lessonLearning.rule");
  expect(workbook).toContain("lessonLearning.outputPrompt");
});

test("A2 and B1 guidance uses an exact curriculum workbook route, not an ambiguous day guess", () => {
  expect(workbook).toContain('getLessonsByLevel(workbookLevel)');
  expect(workbook).toContain('entry.workbookRoute');
  expect(workbook).toContain('catalogLesson?.title');
  expect(workbook).toContain('catalogLesson?.submissionRequired');
  expect(workbook).toContain('This lesson does not require a graded workbook submission.');
});
