// Day 4 originally had three short-answer Lesen questions and no Hören quiz.
// Old reading IDs overlap with the five new multiple-choice questions.
export const isLegacySwahiliDayFourSubmission = (day, work) =>
  Number(day) === 4 && Number(work?.readingVersion || 1) < 2;

export const swahiliDayFourDraftVersion = day => Number(day) === 4 ? 2 : null;
