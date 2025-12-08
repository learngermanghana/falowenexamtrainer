import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export const analyzeAudio = async (audioBlob, teil, level) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  formData.append("teil", teil);
  formData.append("level", level);

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
  });

  return response.data;
};
