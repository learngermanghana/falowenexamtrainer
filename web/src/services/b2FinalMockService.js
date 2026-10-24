import { postMockAssessment } from "./mockAssessmentRequest";
import { getBackendUrl } from "./backendUrl";

const backendUrl = getBackendUrl();
const authHeaders = (idToken) =>
  idToken ? { Authorization: `Bearer ${idToken}` } : {};

export const scoreB2MockWriting = async ({ teil1, teil2, idToken }) => {
  const response = await postMockAssessment(
    `${backendUrl}/writing/b2-mock-score`,
    { teil1, teil2 },
    { headers: authHeaders(idToken) },
  );
  return response.data?.result || response.data;
};
