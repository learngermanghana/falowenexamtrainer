import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { A2_DAYS_26_TO_28_LEARNING } from "./A2Days26To28LearningUpgrade";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

describe("A2 Days 26-28 final learning upgrade", () => {
  test.each([26, 27, 28].map((day) => [day, A2_DAYS_26_TO_28_LEARNING[day]]))(
    "Day %s has concise teaching, clickable checks and production support",
    (_day, lesson) => {
      expect(lesson.rule).toBeTruthy();
      expect(lesson.examples.length).toBeGreaterThanOrEqual(4);
      expect(lesson.questions.length).toBeGreaterThanOrEqual(4);
      lesson.questions.forEach((question) => {
        expect(question.options.length).toBeGreaterThanOrEqual(3);
        expect(Number.isInteger(question.answer)).toBe(true);
        expect(question.explanation).toBeTruthy();
      });
      expect(lesson.outputPrompt).toBeTruthy();
      expect(lesson.starters.length).toBeGreaterThanOrEqual(3);
    },
  );

  test("prebuild chain wires Day 26 through the enabled shared fallback and Days 27-28 directly", () => {
    const patch = fs.readFileSync(path.join(root, "../scripts/patchA2Days26To28LearningUpgrade.mjs"), "utf8");
    const mobilePatch = fs.readFileSync(path.join(root, "../scripts/patchA2B1MobileFloatingActions.mjs"), "utf8");
    expect(patch).toContain('patchFile("web/src/components/A2B1WorkbookGuidance.js"');
    expect(patch).toContain("A2Days26To28FallbackLearning");
    expect(patch).toContain("workbookDay !== 26");
    expect(patch).toContain("<A2Days26To28LearningUpgrade day={26} />");
    expect(patch).not.toContain('patchFile("web/src/components/A2LegacyStandardWorkbookNavigationImpl.js"');
    expect(patch).toContain("day={27}");
    expect(patch).toContain("day={28}");
    expect(mobilePatch).toContain('patchA2Days26To28LearningUpgrade.mjs');
  });
});
