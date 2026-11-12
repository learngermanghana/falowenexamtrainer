import fs from "fs";
import path from "path";

const buddy = fs.readFileSync(path.join(__dirname, "StudyBuddyBar.js"), "utf8");
const workbook = fs.readFileSync(path.join(__dirname, "A2B1WorkbookGuidance.js"), "utf8");

test("StudyBuddy offers direct access to results, not the exam room", () => {
  expect(buddy).toContain('key: "results"');
  expect(buddy).toContain('navigate("/campus/results")');
  expect(buddy).toContain('destination: "/campus/results"');
});

test("A2 workbook guidance keeps lesson-specific grammar practice", () => {
  expect(workbook).toContain("A2Days11To15QuickLearning");
  expect(workbook).toContain("A2_DAYS_11_TO_15_LEARNING[workbookDay]");
  expect(workbook).toContain("<A2MiniLearningBlock {...lesson} />");
});
