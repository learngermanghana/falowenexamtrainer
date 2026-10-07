import axios from "axios";
import { getBackendUrl } from "./backendUrl";

export const fetchB1AudioPlaybackUrl = async ({ day, key, idToken }) => {
  if (!idToken) {
    throw new Error("Please sign in again to play this B1 audio.");
  }

  const response = await axios.get(`${getBackendUrl()}/course-media/b1/audio-url`, {
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

export default fetchB1AudioPlaybackUrl;


export const fetchB1MockAudioPlaybackUrl = async ({
  mockId = "mock-01",
  part,
  key,
  idToken,
}) => {
  if (!idToken) {
    throw new Error("Please sign in again to play this B1 mock audio.");
  }

  const response = await axios.get(`${getBackendUrl()}/course-media/b1/mock-audio-url`, {
    params: { mockId, part, key },
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  const url = String(response?.data?.url || "").trim();
  if (!url) {
    throw new Error("Falowen did not receive a B1 mock audio playback URL.");
  }

  return {
    url,
    expiresAt: response?.data?.expiresAt || "",
  };
};
