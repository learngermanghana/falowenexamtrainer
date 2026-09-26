import { addDoc, collection, db, isFirebaseConfigured, serverTimestamp } from "../firebase";
import { callAI } from "./aiClient";
import { getStudyBuddyLessonContext } from "./studyBuddyLessonContext";
import { fetchLearnerSupportState } from "./learnerSupportService";

const DEFAULT_STUDY_BUDDY_MODE = "lesson";
const STUDY_BUDDY_MODE_LABELS = {
  lesson: "Lesson",
  speaking: "Speaking",
  writing: "Writing",
};
const STUDY_BUDDY_HISTORY_PREFIX = "studyBuddyConversationHistory";
const STUDY_BUDDY_HISTORY_MAX_MESSAGES = 10;
const STUDY_BUDDY_HISTORY_MAX_MESSAGE_CHARS = 1200;

const FALOWEN_NAVIGATION_GUIDANCE = [
  "FALOWEN NAVIGATION SUPPORT (authoritative):",
  "Falowen navigation and product-help questions are always in scope. Answer the navigation question directly before any language coaching. Do not redirect a Falowen navigation question back to German practice.",
  "Course Book: in the signed-in campus, tap/click the visible Learn navigation item. Learn opens the Course Book at https://www.falowen.app/campus/course.",
  "Mobile: Learn is the first item in the bottom navigation. Desktop: Learn is in the campus navigation row.",
  "Practice opens vocabulary practice at https://www.falowen.app/campus/vocab. Results opens https://www.falowen.app/campus/results. Attendance opens https://www.falowen.app/campus/attendance when available for the learner.",
  "Exam File: https://www.falowen.app/campus/examFile. Exams Room: https://www.falowen.app/exams/overview. Study Calendar: https://www.falowen.app/exams/study.",
  "Account settings are opened from the profile menu. Billing: https://www.falowen.app/campus/account?tab=billing.",
  "Never invent Falowen navigation labels or pages. In particular, do not tell learners to use 'My Library', 'Learning Hub', or 'My Hub'; these are not current Falowen navigation labels.",
].join("\n");

const getStoredStudyBuddyMode = () => DEFAULT_STUDY_BUDDY_MODE;

const getModeLabel = (modeKey) => STUDY_BUDDY_MODE_LABELS[modeKey] || STUDY_BUDDY_MODE_LABELS[DEFAULT_STUDY_BUDDY_MODE];

const getBrowserLessonContext = () => {
  if (typeof window === "undefined" || typeof document === "undefined") return {};

  const structured = getStudyBuddyLessonContext();
  const route = `${window.location.pathname || ""}${window.location.search || ""}`;
  const pageTitle = document.title || "Falowen course page";
  const headings = Array.from(document.querySelectorAll("h1, h2, h3"))
    .map((node) => String(node.textContent || "").trim())
    .filter(Boolean)
    .slice(0, 6);
  const visibleBadges = Array.from(document.querySelectorAll("span, button"))
    .map((node) => String(node.textContent || "").trim())
    .filter((text) => /^(A1|A2|B1|B2|C1|C2|Day\s+\d+|Teil\s+\d+|Learn|Lesen|Hören|Speak|Write|Review|Ref|Finish)$/i.test(text))
    .slice(0, 12);

  return {
    route,
    pageTitle,
    lessonTitle: structured.title || headings[0] || pageTitle,
    topic: structured.topic || headings.slice(1, 4).join(" · "),
    visibleHeadings: headings.join(" | "),
    visibleBadges: visibleBadges.join(" | "),
    ...structured,
  };
};

const decodeTokenIdentity = (idToken) => {
  if (!idToken || typeof idToken !== "string") return "session";
  try {
    const payloadPart = idToken.split(".")[1];
    if (!payloadPart) return "session";
    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = JSON.parse(atob(padded));
    return String(decoded?.user_id || decoded?.sub || decoded?.uid || "session");
  } catch (error) {
    return "session";
  }
};

const sanitizeHistoryMessage = (entry) => {
  const role = entry?.role === "assistant" ? "assistant" : entry?.role === "user" ? "user" : null;
  const content = String(entry?.content || "").trim().slice(0, STUDY_BUDDY_HISTORY_MAX_MESSAGE_CHARS);
  if (!role || !content) return null;
  return { role, content };
};

const getConversationStorageKey = ({ idToken, level }) => {
  const identity = decodeTokenIdentity(idToken);
  const normalizedLevel = String(level || "unknown").trim().toUpperCase() || "UNKNOWN";
  return `${STUDY_BUDDY_HISTORY_PREFIX}:${identity}:${normalizedLevel}`;
};

export const readStudyBuddyConversationHistory = ({ idToken, level }) => {
  if (typeof window === "undefined" || !window.localStorage) return [];
  try {
    const raw = window.localStorage.getItem(getConversationStorageKey({ idToken, level }));
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(sanitizeHistoryMessage)
      .filter(Boolean)
      .slice(-STUDY_BUDDY_HISTORY_MAX_MESSAGES);
  } catch (error) {
    return [];
  }
};

const writeStudyBuddyConversationHistory = ({ idToken, level, history }) => {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    const normalized = (Array.isArray(history) ? history : [])
      .map(sanitizeHistoryMessage)
      .filter(Boolean)
      .slice(-STUDY_BUDDY_HISTORY_MAX_MESSAGES);
    window.localStorage.setItem(getConversationStorageKey({ idToken, level }), JSON.stringify(normalized));
  } catch (error) {
    // Ignore storage errors (privacy mode, quota limits, etc.).
  }
};

export const clearStudyBuddyConversationHistory = ({ idToken, level }) => {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.removeItem(getConversationStorageKey({ idToken, level }));
  } catch (error) {
    // Ignore storage errors.
  }
};

const buildCourseFocusedMessage = ({ message, mode, lessonContext, conversationHistory = [] }) => {
  const selectedMode = mode || getStoredStudyBuddyMode();
  const browserContext = getBrowserLessonContext();
  const context = {
    ...browserContext,
    ...(lessonContext && typeof lessonContext === "object" ? lessonContext : {}),
  };
  const taskItems = Array.isArray(context.currentTask?.items)
    ? context.currentTask.items
      .map((item) => {
        const options = Array.isArray(item?.options) && item.options.length
          ? ` Options: ${item.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`).join(" / ")}`
          : "";
        return `${item?.number || "?"}. ${item?.question || ""}${options}`;
      })
      .filter(Boolean)
      .join(" | ")
    : "";
  const progressSummary = context.progress && typeof context.progress === "object"
    ? Object.entries(context.progress).map(([key, value]) => `${key}=${value}`).join(", ")
    : "";

  const learnerState = context.learnerSupportState && typeof context.learnerSupportState === "object"
    ? context.learnerSupportState
    : null;
  const supportNextAction = learnerState?.nextAction || null;
  const supportReview = learnerState?.review || null;
  const supportCourse = learnerState?.course || null;
  const supportAccess = learnerState?.access || null;

  const contextLines = [
    `Context source: ${context.source || "page"}`,
    `Falowen access state: ${supportAccess?.state || "Not provided"}`,
    `Falowen access reason: ${supportAccess?.reason || "Not provided"}`,
    `Course completion: ${supportCourse?.completionPercent !== null && supportCourse?.completionPercent !== undefined ? `${supportCourse.completionPercent}%` : "Not provided"}`,
    `Latest review status: ${supportReview?.status || "Not provided"}`,
    `Latest review score: ${supportReview?.score ?? "Not provided"}`,
    `Authoritative next action: ${supportNextAction?.label || "Not provided"}`,
    `Authoritative next URL: ${supportNextAction?.url || "Not provided"}`,
    `Level: ${context.level || "Use the student profile level or the level visible on the page"}`,
    `Day: ${context.day || "Not provided"}`,
    `Chapter: ${context.chapter || "Not provided"}`,
    `Current page: ${context.pageTitle || "Course page"}`,
    `Route: ${context.route || ""}`,
    `Lesson title: ${context.title || context.lessonTitle || "Not provided"}`,
    `Topic: ${context.topic || context.visibleHeadings || "Use the current lesson topic if visible"}`,
    `Goal: ${context.goal || "Not provided"}`,
    `Grammar focus: ${context.grammarFocus || "Not provided"}`,
    `Main skill: ${context.mainSkill || "Not provided"}`,
    `Active section: ${context.activeView || "Not provided"}`,
    `Vocabulary: ${Array.isArray(context.vocabulary) && context.vocabulary.length ? context.vocabulary.join(" | ") : "Not provided"}`,
    `Current task: ${context.currentTask?.title || "Not provided"}`,
    `Current task instruction: ${context.currentTask?.instruction || "Not provided"}`,
    `Current task items: ${taskItems || "Not provided"}`,
    `Student progress on this day: ${progressSummary || "Not provided"}`,
    `Visible badges/tabs: ${context.visibleBadges || ""}`,
    `Mode: ${getModeLabel(selectedMode)}`,
  ];

  const modeRules = {
    lesson: "Mode rule: Explain the current lesson clearly, then give one small practice step.",
    speaking: "Mode rule: Help the student build a spoken answer. Give short sentence starters and ask them to say their own version. Do not write a full final speech.",
    writing: "Mode rule: Help the student plan, structure and improve writing. Give ideas, Redemittel and correction guidance. Do not write the full final answer for them.",
  };

  const historyLines = (Array.isArray(conversationHistory) ? conversationHistory : [])
    .map(sanitizeHistoryMessage)
    .filter(Boolean)
    .slice(-STUDY_BUDDY_HISTORY_MAX_MESSAGES)
    .map((entry) => `${entry.role === "assistant" ? "STUDY BUDDY" : "STUDENT"}: ${entry.content}`);

  return [
    "You are Falowen Course Assistant inside Falowen.",
    FALOWEN_NAVIGATION_GUIDANCE,
    "For language-learning questions, stay focused on the current lesson, level and task below.",
    "When structured course context is present, treat it as authoritative over guessed page text. Use the exact day, topic, grammar focus, vocabulary, main skill and current task.",
    "When Falowen access/review/next-action state is provided, treat it as authoritative. Do not invent a different reason for blocked access, marking state, payment requirement, or next step.",
    "If Falowen says Radio state is unknown, do not claim Radio is complete. The lesson route itself enforces Radio when required.",
    "If the student refers to a numbered Lesen/Hören question such as 'question 3', use the matching Current task item. Give a hint or explain the relevant language first; do not reveal the correct option before the student has tried unless they explicitly ask for the answer.",
    "For grammar questions such as 'Why is this Dativ?', explain the rule using the current lesson's grammar focus and vocabulary before adding a generic example.",
    "Use the progress summary to avoid telling the student to repeat sections they have already completed unless revision is useful.",
    "Falowen navigation/support questions are not unrelated. Answer them directly using the authoritative Falowen navigation guidance above.",
    "If the student asks about something unrelated to both Falowen support and the lesson, briefly redirect them back to the lesson and give one useful lesson-based example.",
    "Do not give a full final assignment answer. Guide the student step by step and ask them to try.",
    "Keep the answer short and phone-friendly. Do not give many corrections at once; correct only the 1-2 most important mistakes per turn.",
    "Use the recent conversation only to understand references and follow-up questions such as 'why?', 'what do you mean?', or 'give me another example'. If old conversation conflicts with the CURRENT LESSON CONTEXT, follow the current lesson context.",
    "Level rules: A1/A2 = simple English explanation + simple German examples. B1 = correct and help build longer connected sentences. B2 = improve argumentation, connectors and natural expression. C1 = upgrade to advanced, natural, precise German.",
    "For C1 useful replies, include exactly this compact pattern: a short natural response; 'Besser / C1-Version:' with one upgraded sentence; 'Nützlicher Ausdruck:' with one strong C1 phrase and English meaning; one deeper follow-up question. Do not only correct; upgrade.",
    "Current-info safety: if the student asks about current politics, current office holders, current government, current prices, latest news, or anything that may change, do not answer with certainty unless live/current data is provided. Say: 'Bei aktuellen Informationen kann ich mich irren. Bitte prüfe eine aktuelle Quelle.' Then continue language practice with a safe sentence frame.",
    modeRules[selectedMode] || modeRules.lesson,
    "",
    "CURRENT LESSON CONTEXT:",
    ...contextLines,
    "",
    ...(historyLines.length ? ["RECENT CONVERSATION:", ...historyLines, ""] : []),
    "STUDENT MESSAGE:",
    message,
  ]
    .filter((line) => line !== null && typeof line !== "undefined")
    .join("\n");
};

export const requestStudyBuddyReply = async ({ message, level, idToken, mode, lessonContext }) => {
  const conversationHistory = readStudyBuddyConversationHistory({ idToken, level });
  const structuredLessonContext = lessonContext && typeof lessonContext === "object" && Object.keys(lessonContext).length
    ? lessonContext
    : getStudyBuddyLessonContext();
  const currentRoute = typeof window !== "undefined"
    ? `${window.location.pathname || ""}${window.location.search || ""}`
    : "";
  const learnerSupportState = idToken
    ? await fetchLearnerSupportState({ idToken, route: currentRoute }).catch((error) => {
        console.warn("Study Buddy could not load authoritative learner state", error);
        return null;
      })
    : null;
  const groundedLessonContext = {
    ...(structuredLessonContext || {}),
    learnerSupportState,
  };
  const response = await callAI({
    path: "/chatbuddy/respond",
    payload: {
      message: buildCourseFocusedMessage({ message, mode, lessonContext: groundedLessonContext, conversationHistory }),
      level,
      mode: mode || getStoredStudyBuddyMode(),
      lessonContext: groundedLessonContext || null,
    },
    idToken,
  });

  if (response?.reply) {
    writeStudyBuddyConversationHistory({
      idToken,
      level,
      history: [
        ...conversationHistory,
        { role: "user", content: message },
        { role: "assistant", content: response.reply },
      ],
    });
  }

  return response;
};

const EVENT_LABELS = {
  quick_question: "Asked Study Buddy AI",
  quick_question_reply: "Received Study Buddy reply",
  weekly_plan_toggle: "Updated weekly plan task",
  shortcut_click: "Clicked Study Buddy shortcut",
  open: "Opened Study Buddy",
  reopen: "Reopened Study Buddy",
  expand: "Expanded Study Buddy",
  collapse: "Collapsed Study Buddy",
  dismiss: "Dismissed Study Buddy",
  high_contrast_toggle: "Changed Study Buddy contrast",
  weekly_plan_expand: "Expanded weekly plan",
  weekly_plan_collapse: "Collapsed weekly plan",
  umlaut_insert: "Inserted German special character",
  next_action_open: "Opened authoritative next action",
};

const sanitizeMetadata = (metadata = {}) => {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return {};
  return Object.fromEntries(
    Object.entries(metadata)
      .filter(([, value]) => ["string", "number", "boolean"].includes(typeof value) || value === null)
      .map(([key, value]) => [key, value === undefined ? null : value])
  );
};

export const logStudentActivity = async ({
  event,
  feature = "study_buddy",
  action,
  label,
  studentCode,
  studentEmail,
  studentName,
  className,
  userId,
  level,
  metadata = {},
}) => {
  if (!event || !isFirebaseConfigured || !db) return null;

  const payload = {
    event,
    eventType: event,
    feature,
    action: action || EVENT_LABELS[event] || event,
    label: label || EVENT_LABELS[event] || event,
    studentCode: studentCode || null,
    studentEmail: studentEmail || null,
    studentName: studentName || null,
    className: className || null,
    userId: userId || null,
    level: level || null,
    metadata: sanitizeMetadata(metadata),
    source: "falowen_student_app",
    createdAt: serverTimestamp(),
  };

  try {
    return await addDoc(collection(db, "studentActivityEvents"), payload);
  } catch (error) {
    console.warn("Student activity logging failed", error);
    return null;
  }
};

export const logStudyBuddyUsage = async ({
  event,
  studentCode,
  studentEmail,
  studentName,
  className,
  userId,
  level,
  questionLength,
  itemId,
  completed,
  weekStart,
  shortcutKey,
  shortcutLabel,
  metadata = {},
}) => {
  if (!event || !isFirebaseConfigured || !db) return null;

  const legacyPayload = {
    event,
    studentCode: studentCode || null,
    studentEmail: studentEmail || null,
    studentName: studentName || null,
    className: className || null,
    userId: userId || null,
    level: level || null,
    questionLength: Number.isFinite(questionLength) ? questionLength : null,
    itemId: itemId || null,
    completed: typeof completed === "boolean" ? completed : null,
    weekStart: weekStart || null,
    shortcutKey: shortcutKey || null,
    shortcutLabel: shortcutLabel || null,
    metadata: sanitizeMetadata(metadata),
    createdAt: serverTimestamp(),
  };

  const activityMetadata = {
    questionLength: Number.isFinite(questionLength) ? questionLength : null,
    itemId: itemId || null,
    completed: typeof completed === "boolean" ? completed : null,
    weekStart: weekStart || null,
    shortcutKey: shortcutKey || null,
    shortcutLabel: shortcutLabel || null,
    ...sanitizeMetadata(metadata),
  };

  const writes = [
    addDoc(collection(db, "studyBuddyUsage"), legacyPayload).catch((error) => {
      console.warn("Study Buddy usage logging failed", error);
      return null;
    }),
    logStudentActivity({
      event,
      feature: "study_buddy",
      studentCode,
      studentEmail,
      studentName,
      className,
      userId,
      level,
      metadata: activityMetadata,
      label: shortcutLabel || undefined,
    }),
  ];

  return Promise.all(writes);
};
