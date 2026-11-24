import { getBackendUrl } from "./backendUrl";

// Refresh only when a student writes course work. Reuse the short-lived
// grant during autosaves. Firestore independently checks the live profile.
const grants = new Map();
const pending = new Map();
export async function ensureCourseSubmissionAccess(user, { force = false } = {}) {
  if (!user?.uid || typeof user.getIdToken !== "function") throw new Error("Sign in again to submit your work.");
  const uid = user.uid;
  const cached = grants.get(uid);
  if (!force && cached && cached.expiresAtMs > Date.now() + 10000) return cached;
  if (pending.has(uid)) return pending.get(uid);
  const work = (async () => {
    grants.delete(uid);
    const token = await user.getIdToken();
    const response = await fetch(getBackendUrl() + "/course/submission-access", {
      method: "POST", headers: { Authorization: "Bearer " + token }, cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok !== true || !(Number(data.expiresAtMs) > Date.now())) {
      throw new Error(data.error || "Could not verify your course access. Please retry.");
    }
    grants.clear();
    grants.set(uid, data);
    return data;
  })();
  pending.set(uid, work);
  try { return await work; }
  finally { pending.delete(uid); }
}
