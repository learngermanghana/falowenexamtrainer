import axios from "axios";
import { getBackendUrl } from "./backendUrl";

// These routes never return the answer key until the learner submits a practice attempt.
export async function getPublishedHoerenLesson(assignmentKey, idToken) {
  const response = await axios.get(`${getBackendUrl()}/course-media/studio/lesson`, {
    params: { assignmentKey }, headers: { Authorization: `Bearer ${idToken}` },
  });
  return response.data.lesson;
}
export async function gradePublishedHoerenLesson({ assignmentKey, revision, answers, idToken }) {
  const response = await axios.post(`${getBackendUrl()}/course-media/studio/score`,
    { assignmentKey, revision, answers }, { headers: { Authorization: `Bearer ${idToken}` } });
  return response.data;
}
