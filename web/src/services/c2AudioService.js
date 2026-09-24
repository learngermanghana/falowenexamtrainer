import axios from "axios";
import { getBackendUrl } from "./backendUrl";

export const fetchC2AudioPlaybackUrl = async ({ day, key, idToken }) => {
  if (!idToken) {
    throw new Error("Please sign in again to play this C2 audio.");
  }

  const response = await axios.get(`${getBackendUrl()}/course-media/c2/audio-url`, {
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

export default fetchC2AudioPlaybackUrl;
