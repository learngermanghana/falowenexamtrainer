const resolveBackendBaseUrl = () => {
  const explicit = process.env.REACT_APP_BACKEND_URL;
  if (explicit) return explicit.trim().replace(/\/$/, "");

  const inferredOrigin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "";

  const fallback = process.env.NODE_ENV === "production" ? inferredOrigin : "http://localhost:5000";
  return (fallback || "").trim().replace(/\/$/, "");
};

export const getBackendBaseUrl = () => resolveBackendBaseUrl();
