import { callAI } from "./aiClient";

export async function correctBiography({ text, level, idToken, timeoutMs = 15000 }) {
  return callAI({ path: "/profile/biography/correct", payload: { text, level }, idToken, timeoutMs });
}
