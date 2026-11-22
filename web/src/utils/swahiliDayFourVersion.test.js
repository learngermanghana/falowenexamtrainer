import { isLegacySwahiliDayFourSubmission, swahiliDayFourDraftVersion } from "./swahiliDayFourVersion";

test("old Day 4 short answers cannot be restored into new multiple-choice Lesen", () => {
  expect(isLegacySwahiliDayFourSubmission(4, {})).toBe(true);
  expect(isLegacySwahiliDayFourSubmission(4, { readingVersion: 1 })).toBe(true);
  expect(isLegacySwahiliDayFourSubmission(4, { readingVersion: 2 })).toBe(false);
  expect(isLegacySwahiliDayFourSubmission(7, {})).toBe(false);
  expect(swahiliDayFourDraftVersion(4)).toBe(2);
  expect(swahiliDayFourDraftVersion(7)).toBeNull();
});
