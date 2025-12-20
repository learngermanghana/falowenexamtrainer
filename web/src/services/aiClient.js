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

    // Read body exactly once
    const raw = await response.text();

    // Try to parse JSON if present
    let data = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = null;
    }

    if (!response.ok) {
      const msg =
        data?.error ||
        data?.message ||
        raw ||
        `Failed to reach the AI coach (HTTP ${response.status})`;
      throw new Error(msg);
    }

    return data ?? {};
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("The AI service took too long to respond. Please try again.");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export { backendUrl };
