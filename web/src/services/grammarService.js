import { callAI } from "./aiClient";

export async function askGrammarQuestion({ question, level, studentId, idToken, timeoutMs = 20000 }) {
  try {
    return await callAI({ path: "/grammar/ask", payload: { question, level, studentId }, idToken, timeoutMs });
  } catch (error) {
    if (error.message === "The AI service took too long to respond. Please try again.") {
      throw new Error("The grammar coach took too long to respond. Please try again.");
    }

    throw error;
  }
}
