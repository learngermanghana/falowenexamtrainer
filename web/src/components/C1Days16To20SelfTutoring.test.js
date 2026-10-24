import { getC1Day16To20SpeakingScaffold } from "../data/c1Day16To20SpeakingScaffolds";
import day16 from "../data/selfLearningLessons/c1/day16TechnologieImAlltag";
import { getC1KnowledgeItems } from "./C1KnowledgeChoicePractice";

describe("C1 Days 16-20 self-tutoring coverage", () => {
  test("Day 16 exposes its canonical clickable grammar questions", () => {
    const items = getC1KnowledgeItems(day16);
    expect(items.length).toBeGreaterThanOrEqual(4);
    expect(items.every((item) => item.options.includes(item.answer) && item.explanation)).toBe(true);
  });

  test("Days 16-20 have real speaking scaffolds", () => {
    [16, 17, 18, 19, 20].forEach((day) => {
      const branches = getC1Day16To20SpeakingScaffold(day);
      expect(branches.length).toBeGreaterThanOrEqual(6);
      expect(branches.every((branch) => branch.title && branch.prompt && branch.example && branch.starter)).toBe(true);
      expect(branches.every((branch) => Array.isArray(branch.keywords) && branch.keywords.length >= 4)).toBe(true);
    });
  });
});
