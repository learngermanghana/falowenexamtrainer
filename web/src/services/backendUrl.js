const DEFAULT_BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === "production"
    ? // In production, fall back to the current origin so we still reach the deployed API
      // even when REACT_APP_BACKEND_URL is not set.
      (typeof window !== "undefined" ? window.location.origin : "")
    : "http://localhost:5000");

const DEFAULT_SPEAKING_API_URL =
  process.env.REACT_APP_SPEAKING_API_URL || "https://api-awc2au65xa-ew.a.run.app";

const normalizeBaseUrl = (rawUrl) => {
  const raw = rawUrl || "";

  if (!raw) return "";

  // Remove trailing slashes for consistency
  let normalized = raw.replace(/\/+$/, "");

  // If someone sets the env var to the function root (".../api"),
  // avoid building URLs like "/api/grammar/ask" when routes live at "/grammar/ask".
  if (normalized.toLowerCase().endsWith("/api")) {
    normalized = normalized.slice(0, -4);
  }

  return normalized;
};

/**
 * Normalize the backend base URL so callers don't accidentally include
 * a trailing "/api" segment when routes are mounted at the root.
 */
export function getBackendUrl() {
  return normalizeBaseUrl(DEFAULT_BACKEND_URL);
}

export function getSpeakingApiUrl() {
  return normalizeBaseUrl(DEFAULT_SPEAKING_API_URL);
}
