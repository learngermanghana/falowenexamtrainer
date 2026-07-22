import fs from "fs";
import path from "path";

const source = fs.readFileSync(
  path.resolve(__dirname, "C1Day11GoetheSpeakingSelfLearningPage.js"),
  "utf8",
);

describe("C1 Day 11 Goethe speaking UI", () => {
  test("keeps the exam speaking coach embedded before the workbook", () => {
    expect(source).toContain('data-c1-day11-goethe-speaking-page="true"');
    expect(source).toContain('data-c1-day11-speaking-ui="embedded"');
    expect(source).toContain('<SpeakingPage mode="exam" />');
    expect(source).toContain("<C1Day11EngagementUndEhrenamtWorkbookPage />");
  });
});
