// Day 8 originally used classroom and phone-number questions (read-1 to
// read-3), and a contact-code writing task. The replacement lesson is about
// family ages and introduces five Hören and five Lesen questions. Never hydrate
// the old answers or tutor review into that different assignment.
export const SWAHILI_DAY_EIGHT_ASSIGNMENT_VERSION = 2;

const DAY_EIGHT_LISTENING_IDS = Object.freeze([
  "listen-age-b",
  "listen-sibling-age",
  "listen-children",
  "listen-first-child",
  "listen-second-child",
]);

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object || {}, key);

// The replacement assignment briefly existed without a version field. Those
// already-submitted v2 answers have all five new listening IDs and both new
// reading IDs, which the old classroom-number task never used.
export const isCurrentSwahiliDayEightSubmission = work =>
  Number(work?.assignmentVersion || work?.readingVersion || 0) >= SWAHILI_DAY_EIGHT_ASSIGNMENT_VERSION ||
  (
    hasOwn(work?.readingAnswers, "read-4") &&
    hasOwn(work?.readingAnswers, "read-5") &&
    DAY_EIGHT_LISTENING_IDS.every(id => hasOwn(work?.listeningAnswers, id))
  );

export const isLegacySwahiliDayEightSubmission = (day, work) =>
  Number(day) === 8 && !isCurrentSwahiliDayEightSubmission(work);

export const swahiliDayEightDraftVersion = day =>
  Number(day) === 8 ? SWAHILI_DAY_EIGHT_ASSIGNMENT_VERSION : null;

// Safely migrate draft answers from the unversioned key only if a field exists
// that was not part of the old Day 8 lesson. Ambiguous drafts stay untouched.
export const isRecognizableSwahiliDayEightNewDraft = draft =>
  hasOwn(draft?.reading, "read-4") ||
  hasOwn(draft?.reading, "read-5") ||
  DAY_EIGHT_LISTENING_IDS.some(id => hasOwn(draft?.listeningAnswers, id));
