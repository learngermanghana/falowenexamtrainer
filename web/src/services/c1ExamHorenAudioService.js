import axios from "axios";
import { getBackendUrl } from "./backendUrl";

export const fetchC1ExamHorenAudioPlaybackUrl = async ({
  sampleId = "sample-1",
  part,
  key,
  idToken,
}) => {
  if (!idToken) {
    throw new Error("Please sign in again to play this C1 Hören audio.");
  }

  const response = await axios.get(`${getBackendUrl()}/course-media/c1/exam-hoeren-audio-url`, {
    params: { sampleId, part, key },
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  const url = String(response?.data?.url || "").trim();
  if (!url) {
    throw new Error("Falowen did not receive a C1 Hören playback URL.");
  }

  return {
    url,
    expiresAt: response?.data?.expiresAt || "",
    sampleId: response?.data?.sampleId || sampleId,
    part: response?.data?.part || part,
  };
};

export default fetchC1ExamHorenAudioPlaybackUrl;
