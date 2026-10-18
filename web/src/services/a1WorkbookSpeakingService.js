import axios from "axios";
import { getBackendUrl, getSpeakingApiUrl } from "./backendUrl";

// Send audio straight to the API as multipart data. Never upload it to Firebase Storage.
export async function assessA1WorkbookSpeaking({ audioBlob, assignmentKey, idToken }) {
  if (!audioBlob || !idToken) throw new Error("Sign in and record your answer before assessment.");
  if (audioBlob.size > 5 * 1024 * 1024) throw new Error("Recording is too large. Please use a shorter answer.");
  const form = new FormData();
  form.append("audio", audioBlob, "a1-workbook-answer.webm");
  form.append("assignmentKey", assignmentKey);
  const api = getSpeakingApiUrl() || getBackendUrl();
  const response = await axios.post(api + "/speaking/a1-workbook-score", form, {
    headers: { Authorization: "Bearer " + idToken },
    timeout: 60000,
  });
  const value = response.data || {};
  if (!Number.isInteger(value.score) || value.score < 0 || value.score > 10 ||
      !String(value.strength || "").trim() || !String(value.improvement || "").trim()) {
    throw new Error("Falowen could not verify the speaking score. Please retry.");
  }
  return value;
}
