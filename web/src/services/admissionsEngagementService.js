const ENDPOINT = "/api/public/admissions-engagement";

const safeToken = (value) => String(value || "").trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80);

export function createAdmissionsRef(prefix = "guide") {
  const cryptoToken = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID().replace(/-/g, "").slice(0, 18)
    : Math.random().toString(36).slice(2, 14);
  return safeToken(`${prefix}_${Date.now().toString(36)}_${cryptoToken}`);
}

export function resolveAdmissionsRef(search = "") {
  const params = new URLSearchParams(search || "");
  const fromUrl = safeToken(params.get("ref"));
  if (fromUrl.length >= 8) return fromUrl;

  try {
    const stored = safeToken(sessionStorage.getItem("falowen:admissions-ref"));
    if (stored.length >= 8) return stored;
    const created = createAdmissionsRef("public");
    sessionStorage.setItem("falowen:admissions-ref", created);
    return created;
  } catch (_error) {
    return createAdmissionsRef("public");
  }
}

export async function trackAdmissionsEngagement({ ref, event, classSlug = "", source = "", path = "" } = {}) {
  if (!ref || !event) return { ok: false };
  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({ ref, event, classSlug, source, path }),
    });
    return response.ok ? response.json() : { ok: false };
  } catch (_error) {
    return { ok: false };
  }
}

export async function loadAdmissionsEngagementStatus(ref, baseUrl = "") {
  const token = safeToken(ref);
  if (token.length < 8) return null;
  const response = await fetch(`${baseUrl}${ENDPOINT}?ref=${encodeURIComponent(token)}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Could not load admissions engagement status");
  return response.json();
}
