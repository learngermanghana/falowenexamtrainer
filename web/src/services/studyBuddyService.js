import { addDoc, collection, db, isFirebaseConfigured, serverTimestamp } from "../firebase";
import { callAI } from "./aiClient";

const DEFAULT_STUDY_BUDDY_MODE = "lesson";
const STUDY_BUDDY_MODE_LABELS = {
  lesson: "Lesson",
  speaking: "Speaking",
  writing: "Writing",
};

const getStoredStudyBuddyMode = () => DEFAULT_STUDY_BUDDY_MODE;

const getModeLabel = (modeKey) => STUDY_BUDDY_MODE_LABELS[modeKey] || STUDY_BUDDY_MODE_LABELS[DEFAULT_STUDY_BUDDY_MODE];

const getBrowserLessonContext = () => {
  if (typeof window === "undefined" || typeof document === "undefined") return {};

  const route = `${window.location.pathname || ""}${window.location.search || ""}`;
  const pageTitle = document.title || "Falowen course page";
  const headings = Array.from(document.querySelectorAll("h1, h2, h3"))
    .map((node) => String(node.textContent || "").trim())
    .filter(Boolean)
    .slice(0, 6);
  const visibleBadges = Array.from(document.querySelectorAll("span, button"))
    .map((node) => String(node.textContent || "").trim())
    .filter((text) => /^(A1|A2|B1|B2|C1|Day\s+\d+|Teil\s+\d+|Learn|Speak|Write|Finish)$/i.test(text))
    .slice(0, 8);

  return {
    route,
    pageTitle,
    lessonTitle: headings[0] || pageTitle,
    topic: headings.slice(1, 4).join(" · "),
    visibleHeadings: headings.join(" | "),
    visibleBadges: visibleBadges.join(" | "),
  };
};

const buildCourseFocusedMessage = ({ message, mode, lessonContext }) => {
  const selectedMode = mode || getStoredStudyBuddyMode();
  const browserContext = getBrowserLessonContext();
  const context = {
    ...browserContext,
    ...(lessonContext && typeof lessonContext === "object" ? lessonContext : {}),
  };
  const contextLines = [
    `Level: ${context.level || "Use the student profile level or the level visible on the page"}`,
    `Current page: ${context.pageTitle || "Course page"}`,
    `Route: ${context.route || ""}`,
    `Lesson title: ${context.lessonTitle || "Not provided"}`,
    `Topic/headings: ${context.topic || context.visibleHeadings || "Use the current lesson topic if visible"}`,
    `Visible badges/tabs: ${context.visibleBadges || ""}`,
    `Mode: ${getModeLabel(selectedMode)}`,
  ];

  const modeRules = {
    lesson: "Mode rule: Explain the current lesson clearly, then give one small practice step.",
    speaking: "Mode rule: Help the student build a spoken answer. Give short sentence starters and ask them to say their own version. Do not write a full final speech.",
    writing: "Mode rule: Help the student plan, structure and improve writing. Give ideas, Redemittel and correction guidance. Do not write the full final answer for them.",
  };

  return [
    "You are Falowen Course Assistant inside the Course Book.",
    "Stay focused on the current lesson, level and task below.",
    "If the student asks something unrelated, briefly redirect them back to this lesson and give one useful lesson-based example.",
    "Do not give a full final assignment answer. Guide the student step by step and ask them to try.",
    "Keep the answer short and phone-friendly. Do not give many corrections at once; correct only the 1-2 most important mistakes per turn.",
    "Level rules: A1/A2 = simple English explanation + simple German examples. B1 = correct and help build longer connected sentences. B2 = improve argumentation, connectors and natural expression. C1 = upgrade to advanced, natural, precise German.",
    "For C1 useful replies, include exactly this compact pattern: a short natural response; 'Besser / C1-Version:' with one upgraded sentence; 'Nützlicher Ausdruck:' with one strong C1 phrase and English meaning; one deeper follow-up question. Do not only correct; upgrade.",
    "Current-info safety: if the student asks about current politics, current office holders, current government, current prices, latest news, or anything that may change, do not answer with certainty unless live/current data is provided. Say: 'Bei aktuellen Informationen kann ich mich irren. Bitte prüfe eine aktuelle Quelle.' Then continue language practice with a safe sentence frame.",
    modeRules[selectedMode] || modeRules.lesson,
    "",
    "CURRENT LESSON CONTEXT:",
    ...contextLines,
    "",
    "STUDENT MESSAGE:",
    message,
  ]
    .filter((line) => line !== null && typeof line !== "undefined")
    .join("\n");
};

export const requestStudyBuddyReply = async ({ message, level, idToken, mode, lessonContext }) =>
  callAI({
    path: "/chatbuddy/respond",
    payload: {
      message: buildCourseFocusedMessage({ message, mode, lessonContext }),
      level,
      mode: mode || getStoredStudyBuddyMode(),
      lessonContext: lessonContext || null,
    },
    idToken,
  });

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
