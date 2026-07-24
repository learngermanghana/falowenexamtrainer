const DEFAULT_BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === "production"
    ? // In production, fall back to the current origin so we still reach the deployed API
      // even when REACT_APP_BACKEND_URL is not set.
      (typeof window !== "undefined" ? window.location.origin : "")
    : "http://localhost:5000");

const DEFAULT_SPEAKING_API_URL =
  process.env.REACT_APP_SPEAKING_API_URL || DEFAULT_BACKEND_URL;

const normalizeBaseUrl = (rawUrl) => {
  const raw = rawUrl || "";

  if (!raw) return "";

  // Remove trailing slashes for consistency
  let normalized = raw.replace(/\/+$/, "");

  return normalized;
};

/**
 * Normalize the backend base URL without removing intentional path prefixes
 * such as /api, because some deployments mount the AI routes there.
 */
export function getBackendUrl() {
  return normalizeBaseUrl(DEFAULT_BACKEND_URL);
}

export function getSpeakingApiUrl() {
  return normalizeBaseUrl(DEFAULT_SPEAKING_API_URL);
}
