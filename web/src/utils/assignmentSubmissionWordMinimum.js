export const DEFAULT_ASSIGNMENT_SUBMISSION_WORDS = 20;
export const NO_ASSIGNMENT_SUBMISSION_WORD_MINIMUM = 0;
export const A1_STANDARD_ASSIGNMENT_MINIMUM_WORDS = 10;
export const A1_LETTER_ASSIGNMENT_MINIMUM_WORDS = 50;
export const A1_FIFTY_WORD_CHAPTERS = Object.freeze(["12.3", "13", "14.1"]);
export const A1_STANDARD_WRITING_CHAPTERS = Object.freeze([
  "1.1",
  "1.2",
  "2",
  "3",
  "4",
  "6",
  "9",
  "10",
  "11",
]);
export const A1_OBJECTIVE_ASSIGNMENT_CHAPTERS = Object.freeze([
  "0.1",
  "0.2",
  "5",
  "7",
  "8",
  "12.1",
  "12.2",
]);

const normalizeLevel = (level = "") => String(level).trim().toUpperCase();
const normalizeChapter = (chapter = "") => String(chapter).trim();

const isA1FiftyWordAssignment = ({ level = "", chapter = "" } = {}) =>
  normalizeLevel(level) === "A1" && A1_FIFTY_WORD_CHAPTERS.includes(normalizeChapter(chapter));

const isA1StandardWritingAssignment = ({ level = "", chapter = "" } = {}) =>
  normalizeLevel(level) === "A1" && A1_STANDARD_WRITING_CHAPTERS.includes(normalizeChapter(chapter));

const isA1ObjectiveAssignment = ({ level = "", chapter = "" } = {}) =>
  normalizeLevel(level) === "A1" && A1_OBJECTIVE_ASSIGNMENT_CHAPTERS.includes(normalizeChapter(chapter));

export const getAssignmentSubmissionWordMinimum = ({ level = "", chapter = "" } = {}) => {
  if (isA1FiftyWordAssignment({ level, chapter })) return A1_LETTER_ASSIGNMENT_MINIMUM_WORDS;
  if (isA1ObjectiveAssignment({ level, chapter })) return NO_ASSIGNMENT_SUBMISSION_WORD_MINIMUM;
  if (isA1StandardWritingAssignment({ level, chapter })) return A1_STANDARD_ASSIGNMENT_MINIMUM_WORDS;
  if (normalizeLevel(level) === "A1") return A1_STANDARD_ASSIGNMENT_MINIMUM_WORDS;
  return DEFAULT_ASSIGNMENT_SUBMISSION_WORDS;
};

export const buildAssignmentSubmissionWordProgressText = ({ wordCount, minimumWords } = {}) => {
  const current = Math.max(0, Number(wordCount) || 0);
  const target = Math.max(0, Number(minimumWords) || 0);
  if (!target) return "";

  const remaining = Math.max(0, target - current);
  if (!remaining) return `${current} / ${target} words · Ready to submit.`;
  return `${current} / ${target} words · Add ${remaining} more word${remaining === 1 ? "" : "s"}.`;
};

export const buildAssignmentSubmissionWordError = ({ wordCount, minimumWords, level, chapter } = {}) => {
  const current = Math.max(0, Number(wordCount) || 0);
  const target = Math.max(0, Number(minimumWords) || 0);
  if (!target) return "";

  const remaining = Math.max(0, target - current);
  const normalizedChapter = normalizeChapter(chapter);
  if (isA1FiftyWordAssignment({ level, chapter })) {
    const requirement = normalizedChapter === "12.3"
      ? "both letters"
      : "the letter-writing task and answers";
    return `Your answer has ${current} word${current === 1 ? "" : "s"}. You need at least ${target} words for ${requirement}. Add ${remaining} more word${remaining === 1 ? "" : "s"} before submitting.`;
  }

  return `Your answer has ${current} word${current === 1 ? "" : "s"}. You need at least ${target} words. Add ${remaining} more word${remaining === 1 ? "" : "s"} before submitting.`;
};
