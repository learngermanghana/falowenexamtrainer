import { buildApiCandidates } from "./aiClient";

const parseJson = async (response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch (_error) {
    return {};
  }
};

export const fetchLearnerSupportState = async ({ idToken, route = "" } = {}) => {
  if (!idToken) throw new Error("Missing Firebase ID token.");

  const params = new URLSearchParams();
  if (route) params.set("route", route);
  const suffix = params.toString() ? `?${params.toString()}` : "";
  const candidates = buildApiCandidates(`/support/student-state${suffix}`);
  let lastError = null;

  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate, {
        method: "GET",
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const json = await parseJson(response);
      if (response.ok) return json;
      if (response.status === 404 || response.status >= 500) {
        lastError = new Error(json?.error || `Could not load learner state (${response.status})`);
        continue;
      }
      throw new Error(json?.error || `Could not load learner state (${response.status})`);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Could not load learner state.");
};

export default fetchLearnerSupportState;
