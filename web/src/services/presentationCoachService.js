import { callAI } from "./aiClient";

export const requestPresentationCoachReply = async ({ message, level, conversationId, history, idToken }) =>
  callAI({
    path: "/speaking/presentation-chat",
    payload: {
      message,
      level,
      conversationId,
      history,
    },
    idToken,
  });
