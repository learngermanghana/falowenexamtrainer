import {
  buildStandardLessonFromCanonical,
  getStandardBrainMap,
  getStandardWritingConfig,
} from "./standardLessonJourney";

test.each([
  ["B1", 160],
  ["B2", 200],
  ["C1", 230],
])("creates six guided writing questions for %s", (level, targetWords) => {
  const config = getStandardWritingConfig({
    level,
    day: 8,
    title: "Testthema",
  });

  expect(config.questions).toHaveLength(6);
  expect(config.targetWords).toBe(targetWords);
  expect(
    config.questions.reduce((sum, question) => sum + question.minimumWords, 0),
  ).toBe(targetWords);
});

test("keeps the special B2 Day 1 and C1 Day 2 question builders", () => {
  const b2 = getStandardWritingConfig({ level: "B2", day: 1 });
  const c1 = getStandardWritingConfig({ level: "C1", day: 2 });

  expect(b2.title).toBe("Persönliche Identität online und offline");
  expect(c1.title).toBe("Kultur und Identität");
  expect(b2.questions).toHaveLength(6);
  expect(c1.questions).toHaveLength(6);
});

test("converts a canonical B1 lesson into the shared journey structure", () => {
  const lesson = buildStandardLessonFromCanonical({
    level: "B1",
    day: 3,
    chapter: "1.3",
    topic: "Freundschaft",
    resources: {
      aiVideo: { url: "https://youtu.be/example", title: "AI video" },
      grammarBook: { url: "/grammar" },
      workbook: { url: "/workbook" },
    },
    raw: {
      day: 3,
      chapter: "1.3",
      topic: "Freundschaft",
      goal: "Über Freundschaft sprechen.",
      grammar_topic: "Relativsätze",
      assignment: true,
    },
  });

  expect(lesson.level).toBe("B1");
  expect(lesson.title).toBe("Freundschaft");
  expect(lesson.videoResource.url).toBe("https://youtu.be/example");
  expect(lesson.grammarFocus).toBe("Relativsätze");
  expect(getStandardBrainMap(lesson)).toHaveLength(5);
});
