import { shouldShowRadioFirst } from "./RadioFirstWorkbookGate";

const A2_RADIO_DAYS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28];

test.each(A2_RADIO_DAYS)("A2 Day %i uses the standardized radio-first workbook gate", (day) => {
  expect(shouldShowRadioFirst("A2", day)).toBe(true);
});

test.each([["B2", 1], ["C1", 1]])("%s Day %i uses the standardized radio-first workbook gate", (level, day) => {
  expect(shouldShowRadioFirst(level, day)).toBe(true);
});

test("an A2 workbook without a radio skips the radio-first gate", () => {
  expect(shouldShowRadioFirst("A2", 20)).toBe(false);
});
