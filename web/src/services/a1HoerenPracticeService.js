import axios from "axios";
import { getBackendUrl } from "./backendUrl";

// Standalone Hören practice is marked and saved server-side, separately from
// the full mock attempt. Never send grading keys to the client before submit.
export async function scoreA1HoerenPractice({ mockId, answers, idToken }) {
  if (!idToken) throw new Error("Please sign in to check your Hören answers.");
  const response = await axios.post(
    `${getBackendUrl()}/a1-mock/hoeren/practice/score`,
    { mockId, answers },
    { headers: { Authorization: `Bearer ${idToken}` } },
  );
  return response.data;
}
