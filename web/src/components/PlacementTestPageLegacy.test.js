import {
  buildLevelStats,
  getPlacementLevel,
  getReadinessLabel,
  placementTest,
} from "./PlacementTestPageLegacy";

const correctAnswers = () =>
  Object.fromEntries(
    placementTest.sections.flatMap((section) =>
      section.questions.map((question) => [question.id, question.correct])
    )
  );

const makeIncorrect = (answers, level, count) => {
  const section = placementTest.sections.find((item) => item.level === level);
  section.questions.slice(0, count).forEach((question) => {
    answers[question.id] = question.options.find((option) => option !== question.correct);
  });
  return answers;
};

describe("placement-test diagnostics", () => {
  test("covers A1 through C1 with enough evidence per level", () => {
    expect(placementTest.sections.map((section) => section.level)).toEqual(["A1", "A2", "B1", "B2", "C1"]);
    expect(placementTest.sections.find((section) => section.level === "A1").questions).toHaveLength(6);
    expect(placementTest.sections.find((section) => section.level === "A2").questions).toHaveLength(6);
    expect(placementTest.sections.find((section) => section.level === "B1").questions).toHaveLength(6);
    expect(placementTest.sections.find((section) => section.level === "B2").questions).toHaveLength(6);
    expect(placementTest.sections.find((section) => section.level === "C1").questions).toHaveLength(5);
  });

  test("assigns C1 only when the advanced checkpoint is strong", () => {
    const stats = buildLevelStats(placementTest.sections, correctAnswers());
    expect(getPlacementLevel(stats)).toBe("C1");
  });

  test("keeps a learner at B2 when C1 readiness is not yet strong", () => {
    const answers = makeIncorrect(correctAnswers(), "C1", 2);
    const stats = buildLevelStats(placementTest.sections, answers);
    expect(stats.C1.correct).toBe(3);
    expect(getPlacementLevel(stats)).toBe("B2");
  });

  test("requires at least four of six items to progress through A2-B2", () => {
    const b2Answers = makeIncorrect(correctAnswers(), "B2", 3);
    expect(getPlacementLevel(buildLevelStats(placementTest.sections, b2Answers))).toBe("B1");

    const b1Answers = makeIncorrect(correctAnswers(), "B1", 3);
    expect(getPlacementLevel(buildLevelStats(placementTest.sections, b1Answers))).toBe("A2");

    const a2Answers = makeIncorrect(correctAnswers(), "A2", 3);
    expect(getPlacementLevel(buildLevelStats(placementTest.sections, a2Answers))).toBe("A1");
  });

  test("labels section readiness consistently", () => {
    expect(getReadinessLabel({ ratio: 1 })).toBe("Strong");
    expect(getReadinessLabel({ ratio: 2 / 3 })).toBe("Developing");
    expect(getReadinessLabel({ ratio: 0.5 })).toBe("Needs work");
  });
});
