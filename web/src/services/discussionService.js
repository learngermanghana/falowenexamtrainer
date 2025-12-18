export async function correctDiscussionText({ text, level, idToken }) {
  const res = await fetch(`/api/discussion/correct`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
    },
    body: JSON.stringify({ text, level }),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
