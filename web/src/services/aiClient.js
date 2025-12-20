const backendUrl =
  process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:5000");

const buildApiUrl = (path) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${backendUrl}/api${normalized}`;
};

export async function callAI({ path, payload, idToken, timeoutMs = 20000 }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(buildApiUrl(path), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
      },
      body: JSON.stringify(payload || {}),
      signal: controller.signal,
    });

    if (!response.ok) {
      try {
        const errorPayload = await response.json();
        throw new Error(errorPayload?.error || "Failed to reach the AI coach");
      } catch (parseErr) {
        const fallbackMessage = await response.text();
        const parseMessage = parseErr instanceof Error ? parseErr.message : null;
        throw new Error(fallbackMessage || parseMessage || "Failed to reach the AI coach");
      }
    }

    return response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("The AI service took too long to respond. Please try again.");
    }

    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export { backendUrl };
