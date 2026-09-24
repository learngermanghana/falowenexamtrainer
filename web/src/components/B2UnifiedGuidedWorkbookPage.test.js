import fs from "fs";
import path from "path";
import { B2_SKILL_DAYS, getB2DayTabs, getB2SkillFocus } from "../data/b2SkillCycle";
import { B2_LISTENING_PRACTICE } from "../data/b2ListeningPractice";

const read = (relativePath) =>
  fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("B2 unified C2-style course structure", () => {
  const page = read("B2UnifiedGuidedWorkbookPage.js");
  const registry = read("SelfLearningLessonRegistry.js");
  const nav = read("StandardWorkbookComponents.js");

  test("uses the agreed four-day rotating main-skill cycle", () => {
    expect(B2_SKILL_DAYS.lesen).toEqual([1, 5, 9, 13, 17, 21, 25]);
    expect(B2_SKILL_DAYS.hoeren).toEqual([2, 6, 10, 14, 18, 22, 26]);
    expect(B2_SKILL_DAYS.speak).toEqual([3, 7, 11, 15, 19, 23, 27]);
    expect(B2_SKILL_DAYS.write).toEqual([4, 8, 12, 16, 20, 24, 28]);
    expect(getB2SkillFocus(1)).toBe("lesen");
    expect(getB2SkillFocus(2)).toBe("hoeren");
    expect(getB2SkillFocus(28)).toBe("write");
  });

  test("replaces Finish with Review and shows only today's main skill", () => {
    expect(getB2DayTabs(1).map((tab) => tab.key)).toEqual(["learn", "lesen", "review", "references"]);
    expect(getB2DayTabs(2).map((tab) => tab.key)).toEqual(["learn", "hoeren", "review", "references"]);
    expect(getB2DayTabs(3).map((tab) => tab.key)).toEqual(["learn", "speak", "review", "references"]);
    expect(getB2DayTabs(4).map((tab) => tab.key)).toEqual(["learn", "write", "review", "references"]);
    expect(getB2DayTabs(4).map((tab) => tab.key)).not.toContain("finish");
  });

  test("prepares only the seven designated Hören days for real source/transcript content", () => {
    expect(Object.keys(B2_LISTENING_PRACTICE).map(Number)).toEqual([2, 6, 10, 14, 18, 22, 26]);
    Object.values(B2_LISTENING_PRACTICE).forEach((practice) => {
      expect(practice.audioKey).toBe("");
      expect(practice.audioUrl).toBe("");
      expect(practice.transcript).toBe("");
    });
  });

  test("routes every B2 day through the unified workbook", () => {
    expect(registry).toContain('import B2UnifiedGuidedWorkbookPage from "./B2UnifiedGuidedWorkbookPage"');
    expect(registry).toContain('normalizedLevel === "B2" && day >= 1 && day <= 28');
    expect(registry).toContain("<B2UnifiedGuidedWorkbookPage");
  });

  test("uses non-sticky rotating navigation like C2", () => {
    expect(nav).toContain('import { getB2DayTabs } from "../data/b2SkillCycle"');
    expect(nav).toContain('normalizedLevel === "B2"');
    expect(nav).toContain('getB2DayTabs(day)');
    expect(nav).toContain('["B2", "C2"].includes(normalizedLevel)');
  });

  test("keeps reading feedback, pending Hören, automatic completion and the new Review design", () => {
    expect(page).toContain("Textverständnis");
    expect(page).toContain("Erster Versuch:");
    expect(page).toContain('data-b2-listening-awaiting-source="true"');
    expect(page).toContain("Hörquelle wird ergänzt");
    expect(page).toContain("Review · B2 Day");
    expect(page).toContain("Day complete ✓");
    expect(page).toContain("Das Wichtigste heute");
    expect(page).toContain("Next up");
    expect(page).toContain("Review is revision only");
    expect(page).toContain("completedAt: new Date().toISOString()");
  });
});
