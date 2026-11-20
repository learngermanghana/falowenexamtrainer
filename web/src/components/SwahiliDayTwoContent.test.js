import { SWAHILI_A1_PRACTICE_UNITS } from "../web/src/data/swahili/a1PracticeUnits";

test("Day 2 reading and listening are five selectable questions each, with no answer key in learner lesson", () => {
  const day = SWAHILI_A1_PRACTICE_UNITS[2];
  expect(day.reading.questions).toHaveLength(5);
  expect(day.listening.questions).toHaveLength(5);
  expect(day.listening.audioUrlEndpoint).toBe("/api/course-media/swahili/a1/day-2/audio-url");
  for (const section of [day.reading, day.listening]) for (const question of section.questions) {
    expect(question.choices).toHaveLength(4);
    expect(question.id).toBeTruthy();
    expect(question).not.toHaveProperty("answer");
    expect(question).not.toHaveProperty("correctAnswer");
  }
  expect(day.reading.text).toContain("Shikamoo");
  expect(day.grammarSections.length).toBeGreaterThanOrEqual(3);
});
