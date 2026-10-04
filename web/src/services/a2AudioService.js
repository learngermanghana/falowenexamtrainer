import axios from "axios";
import { getBackendUrl } from "./backendUrl";

export const fetchA2AudioPlaybackUrl = async ({ day, key, idToken }) => {
  if (!idToken) {
    throw new Error("Please sign in again to play this A2 audio.");
  }

  const response = await axios.get(`${getBackendUrl()}/course-media/a2/audio-url`, {
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

export default fetchA2AudioPlaybackUrl;


export const fetchA2MockAudioPlaybackUrl = async ({ mockId, part, key, idToken }) => {
  if (!idToken) {
    throw new Error("Please sign in again to play this A2 mock audio.");
  }

  const response = await axios.get(`${getBackendUrl()}/course-media/a2/mock-audio-url`, {
    params: { mockId, part, key },
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  const url = String(response?.data?.url || "").trim();
  if (!url) {
    throw new Error("Falowen did not receive an A2 mock audio playback URL.");
  }

  return {
    url,
    expiresAt: response?.data?.expiresAt || "",
    mockId: response?.data?.mockId || mockId,
    part: response?.data?.part || part,
  };
};
