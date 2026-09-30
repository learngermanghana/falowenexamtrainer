import {
  B1_NO_WRITING_DAYS,
  B1_REQUIRED_WRITING_DAYS,
  isB1WritingRequired,
} from "./b1WritingSchedule";

describe("B1 writing cadence", () => {
  test("keeps 18 required Schreiben days across the 28-day course", () => {
    expect(B1_REQUIRED_WRITING_DAYS).toEqual([
      1, 3, 4, 6, 8, 9, 12, 13, 14, 16, 18, 20, 21, 23, 24, 26, 27, 28,
    ]);
    expect(B1_NO_WRITING_DAYS).toEqual([2, 5, 7, 10, 11, 15, 17, 19, 22, 25]);
  });

  test("marks only the selected days as required writing", () => {
    expect(isB1WritingRequired(21)).toBe(true);
    expect(isB1WritingRequired(22)).toBe(false);
    expect(isB1WritingRequired(28)).toBe(true);
  });
});
