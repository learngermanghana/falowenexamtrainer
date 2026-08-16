import fs from "fs";
import path from "path";
import { hasStructuredResultFeedback } from "./ResultHistory";

describe("Sheet result feedback presentation", () => {
  test("a basic Sheet row with one comments column is not expanded into duplicate feedback sections", () => {
    expect(
      hasStructuredResultFeedback({
        score: "30",
        numericScore: 30,
        comments:
          "Excellent work. You answered every objective question correctly and your writing fully met the task with accurate, clear language.",
        corrections: [],
        wrongAnswers: [],
        scoreBreakdown: [],
      }),
    ).toBe(false);
  });

  test("richer marking data still enables Why, corrections and Next step sections", () => {
    expect(
      hasStructuredResultFeedback({
        comments: "Good effort.",
        markingReason: "The writing task missed one required point.",
        corrections: ["Ich gehen → Ich gehe"],
      }),
    ).toBe(true);
  });

  test("the patched result card keeps one comments block and conditions generated sections", () => {
    const source = fs.readFileSync(path.resolve(__dirname, "ResultHistory.js"), "utf8");

    expect(source).toContain("const hasStructuredFeedback = hasStructuredResultFeedback(item)");
    expect(source).toContain("const correctionPoints = hasStructuredFeedback ? getCorrectionPoints(item) : []");
    expect(source).toContain("{hasStructuredFeedback ? (");
    expect(source).toContain('<TextBlock title={t("resultHistory.feedbackTitle")} text={item.comments} />');
  });

  test("objective feedback uses student-friendly review labels instead of raw admin wording", () => {
    const source = fs.readFileSync(path.resolve(__dirname, "ResultHistory.js"), "utf8");

    expect(source).toContain("Questions to review");
    expect(source).toContain("No answer");
    expect(source).toContain("Correct answer");
    expect(source).toContain(">Incorrect</td>");
    expect(source).toContain("Teil ${match[1]} – Question ${match[2]}");
    expect(source).not.toContain(">Wrong objective answers<");
  });
});
