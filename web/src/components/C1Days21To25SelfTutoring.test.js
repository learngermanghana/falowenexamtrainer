import fs from "fs";
import path from "path";
import scaffolds, { getC1Day21To25SpeakingScaffold } from "../data/c1Day21To25SpeakingScaffolds";

describe("C1 Days 21-25 self-tutoring coverage", () => {
  test.each([21, 22, 23, 24, 25])("Day %i has a full speaking idea bank", (day) => {
    const branches = getC1Day21To25SpeakingScaffold(day);
    expect(branches).toHaveLength(6);
    branches.forEach((branch) => {
      expect(branch.prompt).toBeTruthy();
      expect(branch.example).toBeTruthy();
      expect(branch.starter).toBeTruthy();
      expect(branch.keywords.length).toBeGreaterThanOrEqual(4);
    });
    expect(scaffolds[day]).toEqual(branches);
  });

  test("Days 21-25 route through the unified self-tutoring page", () => {
    const source = fs.readFileSync(path.resolve(__dirname, "./StandardLessonWritingCoachPage.js"), "utf8");
    expect(source).toContain('import C1Day21To25SelfTutoringPage from "./C1Day21To25SelfTutoringPage"');
    expect(source).toContain('day >= 21 && day <= 25');
    expect(source).toContain('? C1Day21To25SelfTutoringPage');
  });

  test("the unified page includes grammar notes, clickable checks, speaking support and writing", () => {
    const source = fs.readFileSync(path.resolve(__dirname, "./C1Day21To25SelfTutoringPage.js"), "utf8");
    expect(source).toContain("C1GrammarQuickCheck");
    expect(source).toContain("C1SpeakGrammarGuide");
    expect(source).toContain("GuidedWritingWorkspace");
    expect(source).toContain("Prüfungsmodus");
  });
});

describe("A1 Day 0 Tutorial direct route", () => {
  test("legacy Tutorial URL redirects to the existing Day 0 workbook", () => {
    const source = fs.readFileSync(path.resolve(__dirname, "../index.jsx"), "utf8");
    expect(source).toContain("const A1_DAY0_TUTORIAL_ROUTE = '/campus/course/lesson/A1/0'");
    expect(source).toContain("const A1_DAY0_WORKBOOK_ROUTE = '/campus/course/a1-day-0-orientation-and-knowledge-test-workbook'");
    expect(source).toContain("<Navigate to={A1_DAY0_WORKBOOK_ROUTE} replace />");
  });
});
