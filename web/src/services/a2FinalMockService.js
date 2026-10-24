import { postMockAssessment } from "./mockAssessmentRequest";
import axios from "axios";
import { getBackendUrl } from "./backendUrl";

const backendUrl = getBackendUrl();

const authHeaders = (idToken) =>
  idToken
    ? {
        Authorization: `Bearer ${idToken}`,
      }
    : {};

export const scoreA2MockWriting = async ({ sms, email, attemptId, idToken, mockId = "a2-mock-01", taskContext }) => {
  const response = await postMockAssessment(
    `${backendUrl}/writing/a2-mock-score`,
    { sms, email, attemptId, mockId, taskContext },
    { headers: authHeaders(idToken) },
  );
  return response.data?.result || response.data;
};

export const startA2MockAttempt = async ({ idToken, mockId = "a2-mock-01" }) => {
  const response = await axios.post(
    `${backendUrl}/a2-mock/attempt/start`,
    { mockId },
    { headers: authHeaders(idToken) },
  );
  return response.data;
};

export const saveA2MockAttempt = async ({
  idToken,
  attemptId,
  section,
  state,
  sectionScores,
  status = "in_progress",
  overall = null,
}) => {
  const response = await axios.post(
    `${backendUrl}/a2-mock/attempt/save`,
    {
      attemptId,
      section,
      state,
      sectionScores,
      status,
      overall,
    },
    { headers: authHeaders(idToken) },
  );
  return response.data;
};

export const A2_FINAL_MOCK_ID = "a2-mock-01";
export const A2_FINAL_MOCK_STORAGE_KEY = "falowen:a2-final-mock:a2-mock-01";
