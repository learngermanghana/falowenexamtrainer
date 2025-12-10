import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export const analyzeAudio = async (audioBlob, teil, level) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  formData.append("teil", teil);
  formData.append("level", level);
  formData.append("userId", "demo-user");

  const response = await axios.post(`${backendUrl}/api/speaking/analyze`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const analyzeText = async (text, teil, level) => {
  const response = await axios.post(`${backendUrl}/api/speaking/analyze-text`, {
    text,
    teil,
    level,
    userId: "demo-user",
  });

  return response.data;
};

export const fetchSpeakingQuestions = async (level, teil) => {
  const params = new URLSearchParams({ level });
  if (teil) {
    params.append("teil", teil);
  }

  const response = await axios.get(
    `${backendUrl}/api/speaking/questions?${params.toString()}`
  );

  return response.data?.questions || [];
};

export const startPlacement = async (answers = []) => {
  const response = await axios.post(`${backendUrl}/api/tutor/placement`, {
    userId: "demo-user",
    answers,
  });

  return response.data;
};

export const fetchNextTask = async () => {
  const response = await axios.get(
    `${backendUrl}/api/tutor/next-task?userId=demo-user`
  );

  return response.data?.nextTask;
};

export const fetchWeeklySummary = async () => {
  const response = await axios.get(
    `${backendUrl}/api/tutor/weekly-summary?userId=demo-user`
  );

  return response.data;
};
