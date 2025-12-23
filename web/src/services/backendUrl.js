const DEFAULT_BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === "production"
    ? // In production, fall back to the current origin so we still reach the deployed API
      // even when REACT_APP_BACKEND_URL is not set.
      (typeof window !== "undefined" ? window.location.origin : "")
    : "http://localhost:5000");

/**
 * Normalize the backend base URL so callers don't accidentally include
 * a trailing "/api" segment when routes are mounted at the root.
 */
export function getBackendUrl() {
  const raw = DEFAULT_BACKEND_URL || "";

  if (!raw) return "";

  // Remove trailing slashes for consistency
  let normalized = raw.replace(/\/+$/, "");

  // If someone sets the env var to the function root (".../api"),
  // avoid building URLs like "/api/grammar/ask" when routes live at "/grammar/ask".
  if (normalized.toLowerCase().endsWith("/api")) {
    normalized = normalized.slice(0, -4);
  }

  return normalized;
}
