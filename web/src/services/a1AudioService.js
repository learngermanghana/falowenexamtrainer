import axios from "axios";
import { getBackendUrl } from "./backendUrl";

export const fetchA1AudioPlaybackUrl = async ({ day, key, idToken }) => {
  if (!idToken) {
    throw new Error("Please sign in again to play this A1 audio.");
  }

  const response = await axios.get(`${getBackendUrl()}/course-media/a1/audio-url`, {
    params: { day, key },
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  const url = String(response?.data?.url || "").trim();
  if (!url) {
    throw new Error("Falowen did not receive an audio playback URL.");
  }

  return {
    url,
    expiresAt: response?.data?.expiresAt || "",
  };
};

export const fetchA1MockAudioPlaybackUrl = async ({ mockId, part, key, idToken }) => {
  if (!idToken) {
    throw new Error("Please sign in again to play this A1 mock audio.");
  }

  const response = await axios.get(`${getBackendUrl()}/course-media/a1/mock-audio-url`, {
    params: { mockId, part, key },
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  const url = String(response?.data?.url || "").trim();
  if (!url) {
    throw new Error("Falowen did not receive a mock audio playback URL.");
  }

  return {
    url,
    expiresAt: response?.data?.expiresAt || "",
    mockId: response?.data?.mockId || mockId,
    part: response?.data?.part || part,
  };
};

// Dedicated public marketing audio: A1 Hören Sample 1 only.
// No account token or caller-provided R2 object path is accepted by the backend.
export const fetchFreeHoerenTrialAudio = async ({ part }) => {
  const response = await axios.get(`${getBackendUrl()}/mock/free-hoeren/audio`, {
    params: { part },
    timeout: 12000,
  });
  const url = String(response?.data?.url || "");
  if (!url.startsWith("https://")) throw new Error("Could not prepare free listening audio.");
  return { url, expiresAt: response?.data?.expiresAt || "" };
};

export default fetchA1AudioPlaybackUrl;
