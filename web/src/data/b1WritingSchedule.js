export const B1_REQUIRED_WRITING_DAYS = Object.freeze([
  1, 3, 4, 6, 8, 9,
  12, 13, 14, 16, 18,
  20, 21, 23, 24, 26, 27, 28,
]);

const requiredWritingDays = new Set(B1_REQUIRED_WRITING_DAYS);

export const isB1WritingRequired = (day) => requiredWritingDays.has(Number(day));

export const B1_NO_WRITING_DAYS = Object.freeze(
  Array.from({ length: 28 }, (_, index) => index + 1)
    .filter((day) => !requiredWritingDays.has(day)),
);

export default B1_REQUIRED_WRITING_DAYS;
