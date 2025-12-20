const backendUrl =
  process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:5000");

export async function askGrammarQuestion({ question, level, idToken, timeoutMs = 20000 }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${backendUrl}/api/grammar/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
      },
      body: JSON.stringify({ question, level }),
      signal: controller.signal,
    });

    if (!response.ok) {
      try {
        const errorPayload = await response.json();
        throw new Error(errorPayload?.error || "Failed to reach grammar coach");
      } catch (parseErr) {
        const fallbackMessage = await response.text();
        throw new Error(
          fallbackMessage ||
            (parseErr instanceof Error ? parseErr.message : "Failed to reach grammar coach"),
        );
      }
    }

    return response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("The grammar coach took too long to respond. Please try again.");
    }

    throw error;
  } finally {
    clearTimeout(timer);
  }
}
