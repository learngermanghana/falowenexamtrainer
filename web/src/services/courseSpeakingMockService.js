import axios from "axios";
import { getBackendUrl } from "./backendUrl";

function options(idToken) {
  if (!idToken) throw new Error("Please sign in to complete your speaking assignment.");
  return { headers: { Authorization: `Bearer ${idToken}` } };
}

export async function fetchCourseSpeakingMockStatus({ idToken, assignmentKey }) {
  const response = await axios.get(`${getBackendUrl()}/live-speak/course-mock/status`, {
    ...options(idToken), params: { assignmentKey },
  });
  return response.data;
}

export async function submitCourseSpeakingMock({ idToken, assignmentKey, sessionIds }) {
  const response = await axios.post(`${getBackendUrl()}/live-speak/course-mock/submit`,
    { assignmentKey, ...(sessionIds ? { sessionIds } : {}) }, options(idToken));
  return response.data;
}
