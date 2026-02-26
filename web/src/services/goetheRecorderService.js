import axios from "axios";
import { getBackendUrl } from "./backendUrl";

const backendUrl = getBackendUrl();

const authHeaders = (idToken) =>
  idToken
    ? {
        Authorization: `Bearer ${idToken}`,
      }
    : {};

export const getGoetheLevels = async () => {
  const response = await axios.get(`${backendUrl}/goethe/levels`);
  return response.data;
};

export const getGoetheQuestions = async ({ level }) => {
  const response = await axios.get(`${backendUrl}/goethe/questions`, {
    params: { level },
  });
  return response.data;
};

export const getGoethePartnerScript = async ({ level, questionId, idToken }) => {
  const response = await axios.post(
    `${backendUrl}/goethe/partner-script`,
    { level, questionId },
    {
      headers: {
        ...authHeaders(idToken),
      },
    }
  );
  return response.data;
};

export const evaluateGoetheAudio = async ({ audioBlob, level, questionId, idToken }) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "goethe-attempt.webm");
  formData.append("level", level);
  formData.append("questionId", questionId);

  const response = await axios.post(`${backendUrl}/goethe/evaluate-audio`, formData, {
    headers: {
      ...authHeaders(idToken),
    },
  });

  return response.data;
};
