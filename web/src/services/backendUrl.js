const getProductionBackendUrl = () => {
  if (typeof window === "undefined") return "/api";
  return `${window.location.origin}/api`;
};

const DEFAULT_BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === "production"
    ? // Vercel exposes the Express backend through /api/*.
      getProductionBackendUrl()
    : "http://localhost:5000");

const DEFAULT_SPEAKING_API_URL =
  process.env.REACT_APP_SPEAKING_API_URL || DEFAULT_BACKEND_URL;

const normalizeBaseUrl = (rawUrl) => {
  const raw = rawUrl || "";

  if (!raw) return "";

  // Remove trailing slashes for consistency
  return raw.replace(/\/+$/, "");
};

const ensureProductionApiPrefix = (rawUrl) => {
  const normalized = normalizeBaseUrl(rawUrl);
  if (
    process.env.NODE_ENV !== "production" ||
    typeof window === "undefined" ||
    !normalized
  ) {
    return normalized;
  }

  // Older deployments sometimes supplied the Falowen origin itself as the
  // backend URL. Same-origin API calls must go through Vercel's /api route.
  try {
    const configured = new URL(normalized, window.location.origin);
    if (
      configured.origin === window.location.origin &&
      (configured.pathname === "" || configured.pathname === "/")
    ) {
      return `${window.location.origin}/api`;
    }
  } catch (_error) {
    // Keep the configured value if it is not URL-parsable here.
  }

  return normalized;
};

/**
 * Normalize the backend base URL without removing intentional path prefixes
 * such as /api, because some deployments mount the AI routes there.
 */
export function getBackendUrl() {
  return ensureProductionApiPrefix(DEFAULT_BACKEND_URL);
}

export function getSpeakingApiUrl() {
  return ensureProductionApiPrefix(DEFAULT_SPEAKING_API_URL);
}
