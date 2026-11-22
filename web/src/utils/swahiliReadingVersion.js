// Day 7's new shopping Lesen questions reuse IDs from an older picnic passage.
// Always keep old submissions and drafts separate from the revised exercise.
export function isLegacySwahiliDaySevenReading(day, submission) {
  return Number(day) === 7 && Number(submission?.readingVersion || 1) < 2;
}

export function swahiliReadingDraftVersion(day) {
  return Number(day) === 7 ? 2 : null;
}
