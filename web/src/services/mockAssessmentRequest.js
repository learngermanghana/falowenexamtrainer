import axios from "axios";

// Retry a gateway failure once, using the same answers and attempt identity.
// Application failures already retried by the backend are left for the learner.
export async function postMockAssessment(url, payload, config = {}) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await axios.post(url, payload, { ...config, timeout: 55000 });
    } catch (error) {
      const status = error?.response?.status;
      const code = error?.response?.data?.code;
      if (attempt === 0 && [502, 503, 504].includes(status) && code !== "MOCK_MARKING_UNAVAILABLE") continue;
      const serviceMessage = error?.response?.data?.error;
      error.message = serviceMessage || ([502, 503, 504].includes(status) || error?.code === "ECONNABORTED"
        ? "AI marking is temporarily unavailable. Keep this page open and retry marking."
        : error.message || "Could not mark this response. Please try again.");
      throw error;
    }
  }
}
