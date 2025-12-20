const DEFAULT_BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:5000");

/**
 * Normalize the backend base URL so callers don't accidentally double-prefix
 * "/api" (e.g., when REACT_APP_BACKEND_URL already ends with /api).
 */
export function getBackendUrl() {
  const raw = DEFAULT_BACKEND_URL || "";

  if (!raw) return "";

  // Remove trailing slashes for consistency
  let normalized = raw.replace(/\/+$/, "");

  // If someone sets the env var to the function root (".../api"),
  // avoid building URLs like "/api/api/grammar/ask".
  if (normalized.toLowerCase().endsWith("/api")) {
    normalized = normalized.slice(0, -4);
  }

  return normalized;
}
