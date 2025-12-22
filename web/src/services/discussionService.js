import { callAI } from "./aiClient";

export async function correctDiscussionText({ text, level, idToken, timeoutMs = 15000 }) {
  return callAI({ path: "/discussion/correct", payload: { text, level }, idToken, timeoutMs });
}
