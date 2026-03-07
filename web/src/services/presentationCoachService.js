import { callAI } from "./aiClient";

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
