import { b2Day2SpeakingQuestion, b2Day2SpeakingTopics } from "./StandardFourStageLessonPageV3";

test("B2 Day 2 uses the compact Day 1 speaking structure", () => {
  expect(b2Day2SpeakingQuestion).toContain("Kommunikation");
  expect(b2Day2SpeakingQuestion.endsWith("?")).toBe(true);
  expect(b2Day2SpeakingTopics.map((topic) => topic.title)).toEqual([
    "Beziehungstypen",
    "Gute Kommunikation",
    "Missverständnisse und Konflikte",
    "Höfliche Reaktionen",
    "Hypothetische Lösungen",
    "Vorteile respektvoller Kommunikation",
  ]);

  b2Day2SpeakingTopics.forEach((topic) => {
    expect(topic.keywords.length).toBeGreaterThanOrEqual(6);
  });
});
