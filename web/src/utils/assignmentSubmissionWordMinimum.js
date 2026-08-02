export const DEFAULT_ASSIGNMENT_SUBMISSION_WORDS = 20;
export const A1_LETTER_ASSIGNMENT_MINIMUM_WORDS = 50;
export const A1_FIFTY_WORD_CHAPTERS = Object.freeze(["12.3", "13", "14.1"]);

const normalizeLevel = (level = "") => String(level).trim().toUpperCase();
const normalizeChapter = (chapter = "") => String(chapter).trim();

const isA1FiftyWordAssignment = ({ level = "", chapter = "" } = {}) =>
  normalizeLevel(level) === "A1" && A1_FIFTY_WORD_CHAPTERS.includes(normalizeChapter(chapter));

export const getAssignmentSubmissionWordMinimum = ({ level = "", chapter = "" } = {}) =>
  isA1FiftyWordAssignment({ level, chapter })
    ? A1_LETTER_ASSIGNMENT_MINIMUM_WORDS
    : DEFAULT_ASSIGNMENT_SUBMISSION_WORDS;

export const buildAssignmentSubmissionWordError = ({ wordCount, minimumWords, level, chapter } = {}) => {
  const current = Math.max(0, Number(wordCount) || 0);
  const target = Math.max(1, Number(minimumWords) || DEFAULT_ASSIGNMENT_SUBMISSION_WORDS);

  const normalizedChapter = normalizeChapter(chapter);
  if (isA1FiftyWordAssignment({ level, chapter })) {
    const requirement = normalizedChapter === "12.3"
      ? "both letters"
      : "the letter-writing task and answers";
    return `A1 ${normalizedChapter} requires ${requirement}. Please submit at least ${target} words in total. You currently have ${current} word${current === 1 ? "" : "s"}; add ${Math.max(0, target - current)} more.`;
  }

  return `Please submit at least ${target} words. You currently have ${current}.`;
};
