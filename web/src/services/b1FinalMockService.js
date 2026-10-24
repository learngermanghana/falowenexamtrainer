import { postMockAssessment } from "./mockAssessmentRequest";
import axios from "axios";
import { getBackendUrl } from "./backendUrl";

const backendUrl = getBackendUrl();

const authHeaders = (idToken) =>
  idToken ? { Authorization: `Bearer ${idToken}` } : {};

export const scoreB1MockWriting = async ({ teil1, teil2, teil3, attemptId, idToken }) => {
  const response = await postMockAssessment(
    `${backendUrl}/writing/b1-mock-score`,
    { teil1, teil2, teil3, attemptId },
    { headers: authHeaders(idToken) },
  );
  return response.data?.result || response.data;
};

export const startB1MockAttempt = async ({ idToken, mockId = "b1-mock-01" }) => {
  const response = await axios.post(
    `${backendUrl}/b1-mock/attempt/start`,
    { mockId },
    { headers: authHeaders(idToken) },
  );
  return response.data;
};

export const saveB1MockAttempt = async ({
  idToken,
  attemptId,
  section,
  state,
  sectionScores,
  status = "in_progress",
  overall = null,
}) => {
  const response = await axios.post(
    `${backendUrl}/b1-mock/attempt/save`,
    { attemptId, section, state, sectionScores, status, overall },
    { headers: authHeaders(idToken) },
  );
  return response.data;
};

export const B1_FINAL_MOCK_ID = "b1-mock-01";
export const B1_FINAL_MOCK_STORAGE_KEY = "falowen:b1-final-mock:b1-mock-01";
