export async function askGrammarQuestion({ question, level, idToken }) {
  const response = await fetch(`/api/grammar/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
    },
    body: JSON.stringify({ question, level }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to reach grammar coach");
  }

  return response.json();
}
