import {
  FULL_ESSAY_START_DAY,
  getAdvancedWritingPhase,
  getGenericGuidedWritingConfig,
} from "./advancedWritingProgression";
import c1Day2QuestionWritingBuilder from "./writingQuestionBuilders/c1Day2KulturUndIdentitaet";

describe("advanced writing progression", () => {
  test.each([
    ["B2", 1],
    ["B2", 19],
    ["C1", 2],
    ["C1", 19],
  ])("keeps %s Day %i in guided writing", (level, day) => {
    expect(getAdvancedWritingPhase(level, day)).toBe("guided");
  });

  test.each([
    ["B2", FULL_ESSAY_START_DAY],
    ["C1", 20],
    ["C1", 28],
  ])("starts full essays for %s on Day %i", (level, day) => {
    expect(getAdvancedWritingPhase(level, day)).toBe("full-essay");
  });

  test("leaves other levels on their standard workflow", () => {
    expect(getAdvancedWritingPhase("B1", 2)).toBe("standard");
  });

  test("uses five generic guided questions without a conclusion task", () => {
    const config = getGenericGuidedWritingConfig("C1", 3);
    expect(config.questions).toHaveLength(5);
    expect(config.questions.map((item) => item.id)).not.toContain("conclusion");
  });

  test("uses five questions for C1 Day 2 and delays the conclusion", () => {
    expect(c1Day2QuestionWritingBuilder.questions).toHaveLength(5);
    expect(c1Day2QuestionWritingBuilder.questions.map((item) => item.id)).not.toContain("conclusion");
    expect(c1Day2QuestionWritingBuilder.targetWords).toBe(200);
  });
});
