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

export const scoreA1MockWriting = async ({ formValues, text, attemptId, mockId = "a1-mock-01", idToken }) => {
  const response = await postMockAssessment(
    `${backendUrl}/writing/a1-mock-score`,
    { formValues, text, attemptId, mockId },
    { headers: authHeaders(idToken) },
  );
  return response.data?.result || response.data;
};

export const startA1MockAttempt = async ({ idToken, mockId = "a1-mock-01" }) => {
  const response = await axios.post(
    `${backendUrl}/a1-mock/attempt/start`,
    { mockId },
    { headers: authHeaders(idToken) },
  );
  return response.data;
};

export const saveA1MockAttempt = async ({
  idToken,
  attemptId,
  section,
  state,
  sectionScores,
  status = "in_progress",
  overall = null,
}) => {
  const response = await axios.post(
    `${backendUrl}/a1-mock/attempt/save`,
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


export const reportA1MockIntegrityEvent = ({ idToken, attemptId, type, section }) => {
  if (!idToken || !attemptId) return Promise.resolve();
  // Keepalive is best-effort for a tab becoming hidden; browsers can still stop
  // network calls when closed. No answer text or clipboard data is transmitted.
  return fetch(backendUrl + "/a1-mock/attempt/integrity-event", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(idToken) },
    body: JSON.stringify({ attemptId, type, section }),
    keepalive: true,
  }).catch(() => {});
};

export const A1_FINAL_MOCK_ID = "a1-mock-01";
export const A1_FINAL_MOCK_STORAGE_KEY = "falowen:a1-final-mock:a1-mock-01";
