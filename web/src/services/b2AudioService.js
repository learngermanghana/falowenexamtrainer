import axios from "axios";
import { getBackendUrl } from "./backendUrl";

export const fetchB2AudioPlaybackUrl = async ({ day, key, idToken }) => {
  if (!idToken) {
    throw new Error("Please sign in again to play this B2 audio.");
  }

  const response = await axios.get(`${getBackendUrl()}/course-media/b2/audio-url`, {
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

export default fetchB2AudioPlaybackUrl;
