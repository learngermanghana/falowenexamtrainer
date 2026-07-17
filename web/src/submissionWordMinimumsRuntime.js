import { installSubmissionWordMinimums } from "./utils/submissionWordMinimums";

if (typeof window !== "undefined" && !window.__falowenSubmissionWordMinimumsInstalled) {
  window.__falowenSubmissionWordMinimumsInstalled = true;
  installSubmissionWordMinimums();
}
