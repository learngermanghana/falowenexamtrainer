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
