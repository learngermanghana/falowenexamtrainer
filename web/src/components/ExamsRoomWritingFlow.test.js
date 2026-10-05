import fs from "fs";
import path from "path";

const read = (relativePath) =>
  fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("Exams Room simplified Schreiben flow", () => {
  const writingPage = read("WritingPage.js");
  const app = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");

  test("uses only the main marking surface in Exams Room", () => {
    expect(app).toContain(
      '<WritingPage mode="exam" enabledTabs={["mark"]} hideTabList simplifiedExamFlow />',
    );
    expect(writingPage).toContain("Choose a letter question");
    expect(writingPage).toContain("isSimplifiedExamFlow");
    expect(writingPage).toContain("letterPattern");
  });

  test("saves the marked original letter directly to tutor review", () => {
    expect(writingPage).toContain('source: isSimplifiedExamFlow ? "exam-room-simple-writing" : "exam-room"');
    expect(writingPage).toContain("Save marked letter for tutor");
    expect(writingPage).toContain("Your original letter and AI feedback will be saved to the tutor review queue.");
    expect(writingPage).toContain('revisedDraft: isSimplifiedExamFlow ? "" : revisedDraftText');
  });

  test("does not require the improvement workflow for the simplified flow", () => {
    expect(writingPage).toContain(
      "if (!isSimplifiedExamFlow && (!revisionSummary.changed || !workflowComplete))",
    );
    expect(writingPage).toContain("markFeedback && isExamMode && !isSimplifiedExamFlow");
  });
});
