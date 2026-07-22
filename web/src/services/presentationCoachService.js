import { backendUrl, callAI } from "./aiClient";
import {
  DEFAULT_CUSTOM_SPEAKING_CHAT_DURATION_MINUTES,
  normalizeSpeakingChatDurationMinutes,
  speakingChatSessionSeconds,
} from "../lib/speakingSessionDuration";

export const CUSTOM_SPEAKING_CHAT_SESSION_SECONDS = speakingChatSessionSeconds(
  DEFAULT_CUSTOM_SPEAKING_CHAT_DURATION_MINUTES,
);

export const MAX_COACH_SPEECH_CHARACTERS = 1100;

export const normalizeCoachSpeechText = (value = "", maxLength = MAX_COACH_SPEECH_CHARACTERS) => {
  const normalized = String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const safeMaxLength = Math.max(80, Number(maxLength) || MAX_COACH_SPEECH_CHARACTERS);
  if (normalized.length <= safeMaxLength) return normalized;

  const candidate = normalized.slice(0, safeMaxLength - 1).trimEnd();
  const sentenceBoundary = Math.max(
    candidate.lastIndexOf(". "),
    candidate.lastIndexOf("! "),
    candidate.lastIndexOf("? "),
    candidate.lastIndexOf("\n"),
  );
  const minimumUsefulBoundary = Math.floor(safeMaxLength * 0.6);
  const clipped = sentenceBoundary >= minimumUsefulBoundary
    ? candidate.slice(0, sentenceBoundary + 1).trimEnd()
    : candidate;

  return `${clipped}…`;
};

const makeSpeechRequestError = (message, { status = 0, code = "speech_request_failed", retryable = true } = {}) => {
  const error = new Error(message);
  error.status = Number(status) || 0;
  error.code = code;
  error.retryable = Boolean(retryable);
  return error;
};

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

export const requestCoachSpeech = async ({ text, level, idToken, signal } = {}) => {
  const speechText = normalizeCoachSpeechText(text);
  if (!speechText) {
    throw makeSpeechRequestError("There is no coach reply to read aloud.", {
      status: 400,
      code: "missing_text",
      retryable: false,
    });
  }

  let response;
  try {
    response = await fetch(`${backendUrl}/speech/synthesize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
      },
      body: JSON.stringify({ text: speechText, level }),
      signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    throw makeSpeechRequestError("Could not connect to the German audio service.", {
      code: "network_error",
      retryable: true,
    });
  }

  if (!response.ok) {
    let data = null;
    let raw = "";
    try {
      raw = await response.text();
      data = raw ? JSON.parse(raw) : null;
    } catch (_error) {
      data = null;
    }

    const errorMessage = data?.error || data?.message || raw || `Failed to generate speech (HTTP ${response.status})`;
    const errorCode = data?.code || `http_${response.status}`;
    const retryable = response.status >= 500 || response.status === 408 || response.status === 425;
    throw makeSpeechRequestError(errorMessage, {
      status: response.status,
      code: errorCode,
      retryable,
    });
  }

  const blob = await response.blob();
  const responseContentType = response.headers?.get?.("content-type") || "";
  const audioContentType = responseContentType || blob?.type || "";
  if (!/^audio\//i.test(audioContentType)) {
    throw makeSpeechRequestError("The audio service returned an invalid response.", {
      status: 502,
      code: "invalid_audio_response",
      retryable: true,
    });
  }

  return URL.createObjectURL(blob);
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
