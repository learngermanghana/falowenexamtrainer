// Navigation answers use known Falowen routes instead of relying on AI to guess.
// Keep paths aligned with web/public/falowen-navigation.json and App.js.
export const STUDY_BUDDY_DESTINATIONS = Object.freeze({
  results: { label: "Results", path: "/campus/results" },
  exams: { label: "Exams Room", path: "/exams/overview" },
  examFile: { label: "Exam File", path: "/campus/examFile" },
  courseBook: { label: "Course Book", path: "/campus/course" },
  attendance: { label: "Attendance", path: "/campus/attendance" },
  vocab: { label: "Vocab", path: "/campus/vocab" },
  calendar: { label: "Study Calendar", path: "/exams/study" },
  billing: { label: "Billing", path: "/campus/account?tab=billing" },
  placement: { label: "Placement Test", path: "/placement-test" },
});

const linkTo = (key) => `https://www.falowen.app${STUDY_BUDDY_DESTINATIONS[key].path}`;

const normalize = (value) => String(value || "")
  .normalize("NFKC")
  .toLowerCase()
  .replace(/[’‘]/g, "'")
  .replace(/\s+/g, " ")
  .trim();

const resultWords = /\b(?:results?|grades?|scores?|marks?|corrections?)\b|\bergebnisse?\b|\bnoten\b|\brésultats?\b/;
const mockWords = /\b(?:mock|goethe|exams?|prüfung|prüfungen|test)\b/;
const navigationWords = /\b(?:how|where|access|find|open|view|see|check|show|link|locate|navigate|go to|take me|which page|which tab|can i|could i|i want|i need|help me|look up|wo|wohin|finde|anzeigen|sehen|öffnen|où|comment|voir|trouver|accéder)\b/;
const resultsQuestion = /\b(?:my|the|mein(?:e|en|es)?|mes|mon)\s+(?:results?|grades?|scores?|marks?)\b/;

const requiresNavigation = (message, targetWords) =>
  targetWords.test(message) &&
  (navigationWords.test(message) || resultsQuestion.test(message) || /\?$/.test(message));

const resultsMessage = (message) => {
  const isMock = mockWords.test(message);
  const pending = /\b(?:missing|not showing|not there|not available|not received|haven't|waiting|pending|unmarked|still marking)\b/.test(message);
  return [
    `Open **Results** in your Falowen campus: ${linkTo("results")}. This is where you check your marks, graded assignments, scores and tutor feedback.`,
    pending ? "If a recent result is missing, marking or result synchronisation may still be pending. Do not resubmit the assignment just because the result is not visible." : "",
    isMock ? `For detailed full-mock review or to resume a mock, open **Exams Room**: ${linkTo("exams")}.` : "",
    "Sign in to Falowen first if prompted.",
  ].filter(Boolean).join("\n\n");
};

const makeReply = (key, instruction, note = "") => [
  `${instruction} ${linkTo(key)}.`,
  note,
].filter(Boolean).join("\n\n");

// Return null for grammar/exam-content questions so the lesson-grounded AI
// continues to teach. Deterministic handling is limited to clear page-finding
// intents, which should never cost an AI request or produce invented links.
export const resolveStudyBuddyNavigationReply = (rawMessage, conversationHistory = []) => {
  const message = normalize(rawMessage);
  if (!message) return null;

  let resolvedMessage = message;
  if (/^(?:where|how|can i|and where|what about|où|wo).*\b(?:them|those|it|there)\b\??$/.test(message)) {
    const previousUserMessage = (Array.isArray(conversationHistory) ? conversationHistory : [])
      .filter((entry) => entry?.role === "user").slice(-1)[0]?.content;
    if (resultWords.test(normalize(previousUserMessage))) resolvedMessage = `where are my results ${message}`;
  }

  // Results always win over 'exam' when a learner asks where to see their
  // marks. Taking a mock and viewing its score are different destinations.
  if (requiresNavigation(resolvedMessage, resultWords)) {
    return { destination: "results", reply: resultsMessage(resolvedMessage) };
  }

  if (requiresNavigation(resolvedMessage, /\b(?:exam file|prüfungsakte)\b/)) {
    return { destination: "examFile", reply: makeReply("examFile", "Open **Exam File** from your Falowen campus:") };
  }
  if (requiresNavigation(resolvedMessage, /\b(?:mock exam|mock test|exams room|exam practice|goethe practice|prüfungsübungen)\b/) ||
      /\b(?:start|resume|continue|take|practise|practice|sit)\b.*\b(?:mock|goethe exam)\b/.test(resolvedMessage)) {
    return { destination: "exams", reply: makeReply("exams", "Open **Exams Room** to start or resume an available mock exam:") };
  }
  if (requiresNavigation(resolvedMessage, /\b(?:course book|workbook|my lessons?|lesson material|kursbuch|lehrbuch)\b/)) {
    return { destination: "courseBook", reply: makeReply("courseBook", "Open **Course Book** from your Falowen campus:", "Choose your level and lesson there.") };
  }
  if (requiresNavigation(resolvedMessage, /\b(?:attendance|presence|anwesenheit)\b/)) {
    return { destination: "attendance", reply: makeReply("attendance", "Open **Attendance** in your campus:", "Attendance may not appear for self-learning courses.") };
  }
  if (requiresNavigation(resolvedMessage, /\b(?:vocab|vocabulary|word practice|wortschatz)\b/)) {
    return { destination: "vocab", reply: makeReply("vocab", "Open **Vocab** to practise words:") };
  }
  if (requiresNavigation(resolvedMessage, /\b(?:study calendar|study plan|learning calendar|lernkalender)\b/)) {
    return { destination: "calendar", reply: makeReply("calendar", "Open **Study Calendar** to plan your preparation:") };
  }
  if (requiresNavigation(resolvedMessage, /\b(?:billing|payment history|receipts?|invoice|balance|zahlungen|rechnung)\b/)) {
    return { destination: "billing", reply: makeReply("billing", "Open **Billing** in your account settings:") };
  }
  if (requiresNavigation(resolvedMessage, /\b(?:placement test|level test|einstufungstest|test de niveau)\b/)) {
    return { destination: "placement", reply: makeReply("placement", "Take the **Placement Test** here:") };
  }
  return null;
};

// Only verified first-party HTTPS links become clickable inside Study Buddy.
// AI replies may contain arbitrary text; never render HTML or arbitrary URLs.
export const splitStudyBuddySafeLinks = (content) => {
  const source = String(content || "");
  const parts = source.split(/(https:\/\/(?:www\.)?falowen\.app\/[^\s<>]+)/gi);
  return parts.map((part) => {
    if (!/^https:\/\/(?:www\.)?falowen\.app\//i.test(part)) return { text: part };
    const clean = part.replace(/[.,;!?)]*$/, "");
    const suffix = part.slice(clean.length);
    try {
      const url = new URL(clean);
      if (url.protocol !== "https:" || !["www.falowen.app", "falowen.app"].includes(url.hostname)) return { text: part };
      return { text: clean, href: url.href, suffix };
    } catch (_) {
      return { text: part };
    }
  });
};
