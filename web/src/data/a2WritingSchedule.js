export const A2_REQUIRED_WRITING_DAYS = Object.freeze([
  1, 3,
  4, 6,
  7, 9,
  10, 12,
  13, 15,
  16, 18,
  20, 21,
  22, 24,
  26, 28,
]);

const requiredWritingDays = new Set(A2_REQUIRED_WRITING_DAYS);

export const isA2WritingRequired = (day) => requiredWritingDays.has(Number(day));

export const A2_NO_WRITING_DAYS = Object.freeze(
  Array.from({ length: 28 }, (_, index) => index + 1)
    .filter((day) => !requiredWritingDays.has(day)),
);

export default A2_REQUIRED_WRITING_DAYS;
