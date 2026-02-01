import { callAI } from "./aiClient";

export const requestStudyBuddyReply = async ({ message, level, idToken }) =>
  callAI({
    path: "/chatbuddy/respond",
    payload: {
      message,
      level,
    },
    idToken,
  });
