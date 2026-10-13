/**
 * Signed-in Falowen Home encouragement. English supports the existing English
 * homepage, while the student's German level supplies occasional relevant cues.
 *
 * No Firestore, API calls or server-side state: the message belongs to the
 * current browser login session, not to a persistent student profile.
 */
export const HOME_MOTIVATION_SESSION_KEY = "falowen:home-motivation:session:v1";
export const HOME_MOTIVATION_LAST_KEY = "falowen:home-motivation:last:v1";

const commonMessages = [
  "every lesson brings you closer to fluency.",
  "your German grows every time you practise.",
  "small steps today open bigger opportunities tomorrow.",
  "consistency matters more than perfection.",
  "every new word is another step forward.",
  "keep going; your future self will thank you.",
  "even ten focused minutes can move you forward.",
  "your effort today is building tomorrow's confidence.",
  "confidence grows through practice, not shortcuts.",
  "a difficult lesson can become your next breakthrough.",
  "every sentence you try is valuable practice.",
  "you are building a skill that can travel with you.",
  "make today another chapter in your learning journey.",
  "progress is the result of showing up again.",
  "one conversation at a time, German becomes more natural.",
  "mistakes are useful when you learn from them.",
  "you do not need to know everything to improve today.",
  "a new phrase learned today can help you tomorrow.",
  "make room for one more German success today.",
  "keep practising, even when progress feels quiet.",
  "curiosity is one of your strongest learning tools.",
  "your next breakthrough may be one lesson away.",
  "take pride in the practice you put in.",
  "regular revision helps knowledge become confidence.",
  "one clear sentence is a great place to start.",
  "your goals become closer with consistent effort.",
  "stay curious, patient and ready to try again.",
  "today's practice is an investment in your future.",
  "the more you use German, the more familiar it feels.",
  "a good learning habit can take you far.",
  "keep building your vocabulary, day by day.",
  "a thoughtful correction is part of real progress.",
  "speak, write, listen and read: every skill matters.",
  "you are learning to express more of your world.",
  "learning a language is a journey worth continuing.",
  "your steady effort is worth celebrating.",
].map((headline, index) => Object.freeze({ id: `general-${index + 1}`, headline }));

const levelHeadlines = {
  A1: [
    "each greeting and introduction is a fresh beginning.",
    "simple German sentences are powerful first steps.",
    "every verb you practise strengthens your foundation.",
    "your first conversations begin with small, brave attempts.",
  ],
  A2: [
    "you are turning familiar words into everyday conversations.",
    "every clear email helps you express yourself better.",
    "linking your ideas makes your German more confident.",
    "today is a good day to practise speaking in full sentences.",
  ],
  B1: [
    "your opinions deserve clear and confident German.",
    "organizing your ideas brings you closer to exam readiness.",
    "every reason and example makes your writing stronger.",
    "you are learning to express more complex ideas in German.",
  ],
  B2: [
    "each nuanced argument makes your German more precise.",
    "reading critically helps you communicate with confidence.",
    "you are building the vocabulary for real discussions.",
    "clear structure turns advanced ideas into strong answers.",
  ],
  C1: [
    "your growing precision makes difficult topics easier to explain.",
    "each thoughtful argument sharpens your academic German.",
    "strong language skills grow through curiosity and reflection.",
    "every challenging text is an opportunity to deepen fluency.",
  ],
  C2: [
    "mastery grows through nuance, clarity and deliberate practice.",
    "your attention to register brings new depth to German.",
    "each subtle distinction strengthens your command of language.",
    "excellent German is built through thoughtful refinement.",
  ],
};

export const HOME_MOTIVATIONS_BY_LEVEL = Object.freeze(
  Object.fromEntries(
    Object.entries(levelHeadlines).map(([level, headlines]) => [
      level,
      Object.freeze(headlines.map((headline, index) =>
        Object.freeze({ id: `${level.toLowerCase()}-${index + 1}`, headline }))),
    ]),
  ),
);
export const HOME_MOTIVATIONS = Object.freeze(commonMessages);
const allMotivations = [...HOME_MOTIVATIONS, ...Object.values(HOME_MOTIVATIONS_BY_LEVEL).flat()];
const byId = new Map(allMotivations.map((message) => [message.id, message]));

function storageFromWindow(name) {
  try { return typeof window !== "undefined" ? window[name] : null; } catch { return null; }
}

function readJson(storage, key) {
  try { return JSON.parse(storage?.getItem(key) || "null"); } catch { return null; }
}

function writeJson(storage, key, value) {
  try { storage?.setItem(key, JSON.stringify(value)); } catch { /* Storage is optional. */ }
}

export function clearHomeMotivationSession(storage = storageFromWindow("sessionStorage")) {
  try { storage?.removeItem(HOME_MOTIVATION_SESSION_KEY); } catch { /* Best effort. */ }
}

/**
 * Session-stable on refresh/navigation, scoped to one authenticated learner.
 * Log out clears the session key; the last message remains locally only to
 * avoid repeating the same greeting at the next login.
 */
export function getSessionHomeMotivation({
  studentId,
  level,
  sessionStorage = storageFromWindow("sessionStorage"),
  localStorage = storageFromWindow("localStorage"),
  random = Math.random,
} = {}) {
  const owner = String(studentId || "").trim();
  if (!owner) return { id: "fallback", headline: "your campus is ready." };

  const prior = readJson(sessionStorage, HOME_MOTIVATION_SESSION_KEY);
  if (prior?.owner === owner && byId.has(prior.id)) return byId.get(prior.id);

  const normalizedLevel = String(level || "").trim().toUpperCase();
  const pool = [
    ...HOME_MOTIVATIONS,
    ...(HOME_MOTIVATIONS_BY_LEVEL[normalizedLevel] || []),
  ];
  const last = readJson(localStorage, HOME_MOTIVATION_LAST_KEY);
  const value = Number(random());
  const unit = Number.isFinite(value) ? Math.max(0, Math.min(0.999999, value)) : 0;
  let position = Math.floor(unit * pool.length);
  if (pool.length > 1 && last?.owner === owner && pool[position].id === last.id) {
    position = (position + 1) % pool.length;
  }
  const selected = pool[position];
  writeJson(sessionStorage, HOME_MOTIVATION_SESSION_KEY, { owner, id: selected.id });
  writeJson(localStorage, HOME_MOTIVATION_LAST_KEY, { owner, id: selected.id });
  return selected;
}
