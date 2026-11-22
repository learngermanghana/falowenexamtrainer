import { isLegacySwahiliDaySevenReading, swahiliReadingDraftVersion } from "./swahiliReadingVersion";

test("older Day 7 picnic submissions are not interpreted using revised Lesen questions", () => {
  expect(isLegacySwahiliDaySevenReading(7, { readingAnswers: { "read-1": "Chai." } })).toBe(true);
  expect(isLegacySwahiliDaySevenReading(7, { readingVersion: 1 })).toBe(true);
  expect(isLegacySwahiliDaySevenReading(7, { readingVersion: 2 })).toBe(false);
  expect(isLegacySwahiliDaySevenReading(6, {})).toBe(false);
  expect(isLegacySwahiliDaySevenReading(11, {})).toBe(false);
});

test("revised Day 7 answers use a version-specific local draft key", () => {
  expect(swahiliReadingDraftVersion(7)).toBe(2);
  expect(swahiliReadingDraftVersion(6)).toBeNull();
  expect(swahiliReadingDraftVersion(11)).toBeNull();
});
