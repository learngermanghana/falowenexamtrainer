import fs from "fs";
import path from "path";
import { B2_SKILL_DAYS, getB2DayTabs, getB2SkillFocus } from "../data/b2SkillCycle";
import { B2_LISTENING_PRACTICE } from "../data/b2ListeningPractice";
import { B2_READING_PRACTICE } from "../data/b2ReadingPractice";

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

  test("connects Day 2 to its real R2 audio while later Hören days stay pending", () => {
    expect(Object.keys(B2_LISTENING_PRACTICE).map(Number)).toEqual([2, 6, 10, 14, 18, 22, 26]);

    const day2 = B2_LISTENING_PRACTICE[2];
    expect(day2.audioKey).toBe("b2/day-02/day.02.m4a");
    expect(day2.audioUrl).toBeUndefined();
    expect(Array.isArray(day2.transcript)).toBe(true);
    expect(day2.transcript.length).toBeGreaterThanOrEqual(10);
    expect(day2.vocabulary).toHaveLength(8);
    expect(day2.questions).toHaveLength(5);
    day2.questions.forEach((question) => {
      expect(question.options).toHaveLength(4);
      expect(Number.isInteger(question.answerIndex)).toBe(true);
      expect(question.explanation.length).toBeGreaterThan(20);
    });

    [6, 10, 14, 18, 22, 26].forEach((day) => {
      const practice = B2_LISTENING_PRACTICE[day];
      expect(practice.audioKey).toBe("");
      expect(practice.transcript).toBe("");
      expect(practice.audioUrl).toBeUndefined();
    });
  });

  test("provides full reading practice on all seven Lesen days", () => {
    expect(Object.keys(B2_READING_PRACTICE).map(Number)).toEqual([1, 5, 9, 13, 17, 21, 25]);
    Object.values(B2_READING_PRACTICE).forEach((practice) => {
      expect(practice.paragraphs).toHaveLength(5);
      expect(practice.questions).toHaveLength(5);
      practice.questions.forEach((question) => {
        expect(question.options).toHaveLength(4);
        expect(Number.isInteger(question.answerIndex)).toBe(true);
      });
      expect(practice.paragraphs.join(" ").split(/\s+/).length).toBeGreaterThan(250);
    });
  });

  test("routes every B2 day through the unified workbook", () => {
    expect(registry).toContain('import B2UnifiedGuidedWorkbookPage from "./B2UnifiedGuidedWorkbookPage"');
    expect(registry).toContain('normalizedLevel === "B2" && day >= 1 && day <= 28');
    expect(registry).toContain("<B2UnifiedGuidedWorkbookPage");
    expect(registry).toContain('shouldShowRadioFirst("B2", day)');
    expect(registry).toContain('<RadioFirstWorkbookGate level="B2" day={day}>');
  });

  test("uses non-sticky rotating navigation like C2", () => {
    expect(nav).toContain('import { getB2DayTabs } from "../data/b2SkillCycle"');
    expect(nav).toContain('normalizedLevel === "B2"');
    expect(nav).toContain('getB2DayTabs(day)');
    expect(nav).toContain('["B2", "C2"].includes(normalizedLevel)');
  });

  test("keeps reading feedback, private Hören, cloud sync, automatic completion and the new Review design", () => {
    expect(page).toContain("getB2ReadingPractice");
    expect(page).toContain("Textverständnis");
    expect(page).toContain("Erster Versuch:");
    expect(page).toContain('data-b2-listening-awaiting-source="true"');
    expect(page).toContain('data-b2-r2-audio="true"');
    expect(page).toContain('data-b2-listening-vocabulary="true"');
    expect(page).toContain("Vor dem Hören · wichtige Wörter");
    expect(page).toContain("fetchB2AudioPlaybackUrl");
    expect(page).toContain("Transkript anzeigen");
    expect(page).toContain("Transkript ausblenden");
    expect(page).toContain('field: "progress"');
    expect(page).toContain("useB2CloudDraftField");
    expect(page).not.toContain("B2KnowledgeChoicePractice");
    expect(page).toContain("Hörquelle wird ergänzt");
    expect(page).toContain('data-b2-grammar-video-status="missing"');
    expect(page).toContain("Grammar video not added yet");
    expect(page).toContain("Falowen zeigt bewusst kein altes oder themenfremdes Video.");
    expect(page).toContain("Review · B2 Day");
    expect(page).toContain("Day complete ✓");
    expect(page).toContain("Das Wichtigste heute");
    expect(page).toContain("Next up");
    expect(page).toContain("Review is revision only");
    expect(page).toContain("completedAt: new Date().toISOString()");
  });
});
