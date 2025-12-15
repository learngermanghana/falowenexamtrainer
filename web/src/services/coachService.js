import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const authHeaders = (idToken) =>
  idToken
    ? {
        Authorization: `Bearer ${idToken}`,
      }
    : {};

export const analyzeAudio = async ({
  audioBlob,
  teil,
  level,
  contextType,
  question,
  interactionMode,
  userId,
  idToken,
}) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  formData.append("teil", teil);
  formData.append("level", level);
  formData.append("userId", userId || "guest");

  if (contextType) formData.append("contextType", contextType);
  if (question) formData.append("question", question);
  if (typeof interactionMode !== "undefined") {
    formData.append("interactionMode", interactionMode);
  }

  const response = await axios.post(`${backendUrl}/api/speaking/analyze`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...authHeaders(idToken),
    },
  });

  return response.data;
};

export const scoreInteractionAudio = async ({
  audioBlob,
  initialTranscript,
  followUpQuestion,
  teil,
  level,
  userId,
  targetLevel,
  idToken,
}) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "interaction-followup.webm");
  formData.append("initialTranscript", initialTranscript);
  formData.append("followUpQuestion", followUpQuestion);
  formData.append("teil", teil);
  formData.append("level", level);
  if (userId) formData.append("userId", userId);
  if (targetLevel) formData.append("targetLevel", targetLevel);

  const response = await axios.post(
    `${backendUrl}/api/speaking/interaction-score`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        ...authHeaders(idToken),
      },
    }
  );

  return response.data;
};

export const analyzeText = async ({ text, teil, level, targetLevel, userId, idToken }) => {
  const response = await axios.post(
    `${backendUrl}/api/speaking/analyze-text`,
    {
      text,
      teil,
      level,
      targetLevel,
      userId: userId || "guest",
    },
    {
      headers: authHeaders(idToken),
    }
  );

  return response.data;
};

export const fetchSpeakingQuestions = async (level, teil, idToken) => {
  const params = new URLSearchParams({ level });
  if (teil) {
    params.append("teil", teil);
  }

  const response = await axios.get(
    `${backendUrl}/api/speaking/questions?${params.toString()}`,
    {
      headers: authHeaders(idToken),
    }
  );

  return response.data?.questions || [];
};

export const startPlacement = async ({ answers = [], userId, targetLevel, idToken }) => {
  const response = await axios.post(
    `${backendUrl}/api/tutor/placement`,
    {
      userId: userId || "guest",
      targetLevel,
      answers,
    },
    { headers: authHeaders(idToken) }
  );

  return response.data;
};

export const fetchNextTask = async ({ userId, idToken }) => {
  const response = await axios.get(
    `${backendUrl}/api/tutor/next-task?userId=${userId || "guest"}`,
    { headers: authHeaders(idToken) }
  );

  return response.data?.nextTask;
};

export const fetchWeeklySummary = async ({ userId, idToken }) => {
  const response = await axios.get(
    `${backendUrl}/api/tutor/weekly-summary?userId=${userId || "guest"}`,
    { headers: authHeaders(idToken) }
  );

  return response.data;
};
