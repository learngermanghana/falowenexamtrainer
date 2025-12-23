import axios from "axios";
import { getBackendUrl } from "./backendUrl";

const backendUrl = getBackendUrl();

const authHeaders = (idToken) =>
  idToken
    ? {
        Authorization: `Bearer ${idToken}`,
      }
    : {};

export const sendSpeechTrainerAttempt = async ({ audioBlob, note, level, idToken }) => {
  const formData = new FormData();

  if (audioBlob) {
    formData.append("audio", audioBlob, "speech-trainer.webm");
  }

  if (note) {
    formData.append("note", note);
  }

  if (level) {
    formData.append("level", level);
  }

  const response = await axios.post(`${backendUrl}/speech-trainer/feedback`, formData, {
    headers: {
      ...authHeaders(idToken),
    },
  });

  return response.data;
};
