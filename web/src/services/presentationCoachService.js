import { callAI } from "./aiClient";
import {
  DEFAULT_CUSTOM_SPEAKING_CHAT_DURATION_MINUTES,
  normalizeSpeakingChatDurationMinutes,
  speakingChatSessionSeconds,
} from "../lib/speakingSessionDuration";

export const CUSTOM_SPEAKING_CHAT_SESSION_SECONDS = speakingChatSessionSeconds(
  DEFAULT_CUSTOM_SPEAKING_CHAT_DURATION_MINUTES,
);

const getCourseSpeakingContext = () => {
  if (typeof window === "undefined") return null;
  return window.__FALOWEN_COURSE_SPEAKING_CONTEXT__ || null;
};

const buildTopicLockedMessage = ({ message, mode, lessonContext, sessionContext }) => {
  const context = lessonContext || getCourseSpeakingContext();
  const isCourseSpeaking = String(mode || "").toLowerCase() === "speaking" && context?.topicLock;
  if (!isCourseSpeaking) return message;

  const durationMinutes = normalizeSpeakingChatDurationMinutes(sessionContext?.durationMinutes);
  const topic = context.topic || context.question || context.lessonTitle || "the current workbook speaking topic";
  const allowedScope = context.allowedScope || context.instructions || context.support || "Ask follow-up questions only inside this topic.";

  return `TOPIC-LOCKED COURSE SPEAKING CHAT
Lesson topic: ${topic}
Allowed scope: ${allowedScope}
Rules for the assistant:
1. Stay on the lesson topic for the full ${durationMinutes}-minute session.
2. You may ask follow-up questions, but every question must connect directly to the lesson topic.
3. If the student changes to an unrelated topic, briefly answer only if necessary, then redirect back to the lesson topic.
4. Do not switch to politics, religion, celebrity gossip, or unrelated social issues unless the lesson topic itself is about that.
5. Keep the German level appropriate and correct the student gently.

Student message:
${message}`;
};

export const requestPresentationCoachReply = async ({ message, level, history, idToken }) =>
  callAI({
    path: "/speaking/presentation-chat",
    payload: {
      message,
      level,
      history,
    },
    idToken,
  });

export const requestPresentationUpgrade = async ({ answer, level, mode, idToken }) =>
  callAI({
    path: "/speaking/presentation-upgrade",
    payload: {
      answer,
      level,
      mode,
    },
    idToken,
  });

export const savePresentationSession = async ({ payload, idToken }) =>
  callAI({
    path: "/speaking/presentation-session",
    payload,
    idToken,
  });

export const updatePresentationSession = async ({ sessionId, payload, idToken }) =>
  callAI({
    path: "/speaking/presentation-session",
    payload: {
      ...payload,
      sessionId,
    },
    idToken,
  });

export const loadPresentationSessions = async ({ idToken, limit = 10, startAfter = "" } = {}) =>
  callAI({
    path: "/speaking/presentation-session/history",
    payload: {
      limit,
      startAfter,
    },
    idToken,
  });

export const requestCustomSpeakingChatReply = async ({ message, level, history, idToken, mode, lessonContext, sessionContext }) => {
  const mergedLessonContext = lessonContext || getCourseSpeakingContext();
  return callAI({
    path: "/speaking/custom-chat",
    payload: {
      message: buildTopicLockedMessage({
        message,
        mode: mode || "Speaking",
        lessonContext: mergedLessonContext,
        sessionContext,
      }),
      level,
      history,
      mode: mode || "Speaking",
      lessonContext: mergedLessonContext || null,
      sessionContext: sessionContext || null,
    },
    idToken,
  });
};

export const requestSpeakingTextAnalysis = async ({ text, teil, level, question, idToken }) =>
  callAI({
    path: "/speaking/analyze-text",
    payload: {
      text,
      teil,
      level,
      question,
    },
    idToken,
  });

export const deletePresentationSession = async ({ sessionId, idToken }) =>
  callAI({
    path: "/speaking/presentation-session/delete",
    payload: {
      sessionId,
    },
    idToken,
  });

export const deleteAllPresentationSessions = async ({ idToken } = {}) =>
  callAI({
    path: "/speaking/presentation-session/delete-all",
    payload: {},
    idToken,
  });
