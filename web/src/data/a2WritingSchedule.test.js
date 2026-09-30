import {
  A2_NO_WRITING_DAYS,
  A2_REQUIRED_WRITING_DAYS,
  isA2WritingRequired,
} from "./a2WritingSchedule";

describe("A2 writing cadence", () => {
  test("keeps 18 required Schreiben days across the 28-day course", () => {
    expect(A2_REQUIRED_WRITING_DAYS).toEqual([
      1, 3, 4, 6, 7, 9, 10, 12, 13, 15, 16, 18, 20, 21, 22, 24, 26, 28,
    ]);
    expect(A2_NO_WRITING_DAYS).toEqual([2, 5, 8, 11, 14, 17, 19, 23, 25, 27]);
  });

  test("marks only the selected days as required writing", () => {
    expect(isA2WritingRequired(24)).toBe(true);
    expect(isA2WritingRequired(27)).toBe(false);
    expect(isA2WritingRequired(28)).toBe(true);
  });
});
