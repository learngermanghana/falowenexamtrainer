import b2Day1PersoenlicheIdentitaet from "../selfLearningLessons/b2/day1PersoenlicheIdentitaet";
import c1Day15BildungUndLebenslangesLernen from "../selfLearningLessons/c1/day15BildungUndLebenslangesLernen";
import { validateSpeakingMindMapConfig } from "./index";

describe("targeted advanced speaking-map rollout", () => {
  test("B2 Day 1 uses the complete B2 connected map", () => {
    const map = b2Day1PersoenlicheIdentitaet.speakingMindMap;

    expect(
      validateSpeakingMindMapConfig(map, {
        requiredLevel: "B2",
        requiredDay: 1,
        requiredLessonId: "b2-day-1-persoenliche-identitaet",
      }),
    ).toBe(true);
    expect(Boolean(map.focusMode)).toBe(false);
    expect(map.branches).toHaveLength(7);
  });

  test("C1 Day 15 uses a complete thesis-to-conclusion map", () => {
    const map = c1Day15BildungUndLebenslangesLernen.speakingMindMap;

    expect(
      validateSpeakingMindMapConfig(map, {
        requiredLevel: "C1",
        requiredDay: 15,
        requiredLessonId: "c1-day-15-bildung-und-lebenslanges-lernen",
      }),
    ).toBe(true);
    expect(map.focusMode).toBe(false);
    expect(map.speakingRoute).toEqual([
      "thesis",
      "context",
      "evidence",
      "evaluation",
      "objection",
      "qualification",
      "conclusion",
    ]);
  });
});
