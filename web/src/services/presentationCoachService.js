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

export const loadPresentationSessions = async ({ idToken }) =>
  callAI({
    path: "/speaking/presentation-session/history",
    payload: {},
    idToken,
  });
