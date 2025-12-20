import axios from "axios";

const backendUrl =
  process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:5000");

const authHeaders = (idToken) =>
  idToken
    ? {
        Authorization: `Bearer ${idToken}`,
      }
    : {};

export const sendChatBuddyMessage = async ({ text, level, audioBlob, idToken }) => {
  const formData = new FormData();

  if (text) {
    formData.append("message", text);
  }

  if (level) {
    formData.append("level", level);
  }

  if (audioBlob) {
    formData.append("audio", audioBlob, "chat-buddy.webm");
  }

  const response = await axios.post(`${backendUrl}/api/chatbuddy/respond`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...authHeaders(idToken),
    },
  });

  return response.data;
};
