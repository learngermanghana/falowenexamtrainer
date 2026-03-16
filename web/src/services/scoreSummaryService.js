const API_BASE =
  process.env.REACT_APP_API_BASE_URL ||
  process.env.REACT_APP_FUNCTIONS_BASE_URL ||
  "/api";

export const fetchScoreSummary = async ({ idToken, studentCode }) => {
  if (!studentCode) throw new Error("Missing studentCode.");

  const shouldUseDebugNoAuth = !idToken;
  const url = `${API_BASE.replace(/\/$/, "")}/scores/summary?studentCode=${encodeURIComponent(studentCode)}${
    shouldUseDebugNoAuth ? "&debug=1" : ""
  }`;

  const headers = idToken ? { Authorization: `Bearer ${idToken}` } : {};

  const res = await fetch(url, { headers });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json?.error || `Failed to fetch score summary (${res.status})`);
  }

  return json;
};
