import fs from "fs";
import path from "path";
import { buildResultResubmitTarget, getScoreBreakdownRows, hasStructuredResultFeedback, resolveResultAssignmentTitle, resolveResultScore } from "./ResultHistory";

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
    expect(source).toContain('const distinctFeedback = getDistinctFeedbackText(item)');
    expect(source).toContain('<TextBlock title={t("resultHistory.feedbackTitle")} text={distinctFeedback} />');
  });

  test("objective feedback uses student-friendly review labels instead of raw admin wording", () => {
    const source = fs.readFileSync(path.resolve(__dirname, "ResultHistory.js"), "utf8");

    expect(source).toContain("Questions to review");
    expect(source).toContain("No answer");
    expect(source).toContain("Correct answer");
    expect(source).toContain(">Incorrect</span>");
    expect(source).toContain("Teil ${match[1]} – Question ${match[2]}");
    expect(source).not.toContain(">Wrong objective answers<");
  });

  test("objective cross-check action is prominent and explains what students should do", () => {
    const source = fs.readFileSync(path.resolve(__dirname, "ResultHistory.js"), "utf8");

    expect(source).toContain('t("resultHistory.objectiveReviewTitle")');
    expect(source).toContain('t("resultHistory.objectiveReviewHelp")');
    expect(source).toContain('t("resultHistory.openObjective")');
    expect(source).toContain("...styles.primaryButton");
    expect(source).toContain("item.link && !Number(item.objectiveTotal || 0)");
  });
  test("objective-only results reconcile stale overall scores with the marked objective score", () => {
    expect(
      resolveResultScore({
        score: 100,
        objectiveScore: 20,
        objectiveCorrect: 3,
        objectiveTotal: 15,
        scoreBreakdown: [{ label: "Objective / MCQ", score: "3/15" }],
      }),
    ).toBe(20);
  });

  test("mixed writing and objective results keep their weighted overall score", () => {
    expect(
      resolveResultScore({
        score: 82,
        objectiveScore: 70,
        objectiveCorrect: 7,
        objectiveTotal: 10,
        writingScore: 36,
        maxWritingScore: 40,
      }),
    ).toBe(82);
  });

  test("duplicate objective breakdown rows collapse into one summary row", () => {
    expect(
      getScoreBreakdownRows({
        objectiveScore: 20,
        objectiveCorrect: 3,
        objectiveTotal: 15,
        scoreBreakdown: [
          { label: "Objective / MCQ", score: "3/15", reason: "20% objective score" },
          { label: "Objective / MCQ", score: "3/15", reason: "duplicate" },
        ],
      }),
    ).toHaveLength(1);
  });

  test("boolean-like assignment titles resolve from the curriculum assignment ID", () => {
    expect(
      resolveResultAssignmentTitle({
        assignment: "TRUE",
        assignmentId: "A1-11",
        level: "A1",
      }),
    ).toContain("Instructions");
  });

  test("failed A1 results reopen the exact workbook on Review & Submit", () => {
    const target = buildResultResubmitTarget({
      level: "A1",
      assignmentId: "A1-6",
      assignment: "Objects and Colors",
    });
    const parsed = new URL(target, "https://www.falowen.app");

    expect(parsed.pathname).toBe("/campus/course/a1-day-10-objects-colors-possessive-articles-workbook");
    expect(parsed.searchParams.get("view")).toBe("submit");
    expect(parsed.searchParams.get("workbookTab")).toBe("submit");
    expect(parsed.searchParams.get("assignmentKey")).toBe("A1-6");
    expect(parsed.searchParams.get("assignmentId")).toBe("A1-6");
    expect(parsed.searchParams.get("radio")).toBe("done");
  });

  test("failed A2 and B1 results reopen their exact Submit view", () => {
    const a2Target = new URL(
      buildResultResubmitTarget({
        level: "A2",
        assignmentId: "A2-9.23",
        assignment: "Wie kommst du zur Schule / zur Arbeit?",
      }),
      "https://www.falowen.app",
    );
    expect(a2Target.pathname).toBe("/campus/course/a2-day-23-wie-kommst-du-zur-schule-oder-zur-arbeit-workbook");
    expect(a2Target.searchParams.get("view")).toBe("submit");
    expect(a2Target.searchParams.get("assignmentKey")).toBe("A2-9.23");

    const b1Target = new URL(
      buildResultResubmitTarget({
        level: "B1",
        assignmentId: "B1-7.23",
        assignment: "Erstes Date",
      }),
      "https://www.falowen.app",
    );
    expect(b1Target.pathname).toBe("/campus/course/lesson/B1/23");
    expect(b1Target.searchParams.get("view")).toBe("submit");
    expect(b1Target.searchParams.get("assignmentKey")).toBe("B1-7.23");
  });

  test("newest result is expanded by default while older result details are collapsible", () => {
    const source = fs.readFileSync(path.resolve(__dirname, "ResultHistory.js"), "utf8");

    expect(source).toContain("const newestResultKey = normalized[0]?.key ||");
    expect(source).toContain("setExpandedResultKeys(new Set([newestResultKey]))");
    expect(source).toContain("aria-expanded={isExpanded}");
    expect(source).toContain('t("resultHistory.showDetails")');
    expect(source).toContain('t("resultHistory.hideDetails")');
    expect(source).toContain("{isExpanded ? (");
  });

});
