const API_BASE =
  process.env.REACT_APP_API_BASE_URL ||
  process.env.REACT_APP_FUNCTIONS_BASE_URL ||
  "";

export const fetchStudentResultsHistory = async ({ idToken, studentCode }) => {
  if (!API_BASE) throw new Error("Missing REACT_APP_API_BASE_URL (or REACT_APP_FUNCTIONS_BASE_URL).");
  if (!idToken) throw new Error("Not authenticated.");
  if (!studentCode) throw new Error("Missing student code.");

  const url = `${API_BASE.replace(/\\/$/, "")}/results/history?studentCode=${encodeURIComponent(studentCode)}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.error || `Failed to fetch results (${res.status})`);
  }

  return json?.rows || [];
};
