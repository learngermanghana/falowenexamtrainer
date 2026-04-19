const DEFAULT_BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === "production"
    ? // In production, default to the Vercel API route namespace.
      // This avoids frontend requests accidentally hitting static routes
      // (which can surface in the browser as generic network/fetch errors).
      (typeof window !== "undefined" ? `${window.location.origin}/api` : "")
    : "http://localhost:5000");

const DEFAULT_SPEAKING_API_URL =
  process.env.REACT_APP_SPEAKING_API_URL || DEFAULT_BACKEND_URL;

const normalizeBaseUrl = (rawUrl) => {
  const raw = rawUrl || "";

  if (!raw) return "";

  // Remove trailing slashes for consistency
  return raw.replace(/\/+$/, "");
};

/**
 * Normalize configured backend URLs by trimming trailing slashes only.
 * Callers may intentionally include route prefixes (for example, "/api").
 */
export function getBackendUrl() {
  return normalizeBaseUrl(DEFAULT_BACKEND_URL);
}

export function getSpeakingApiUrl() {
  return normalizeBaseUrl(DEFAULT_SPEAKING_API_URL);
}
