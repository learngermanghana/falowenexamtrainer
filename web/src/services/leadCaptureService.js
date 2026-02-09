const LEAD_STORAGE_KEY = "falowen_lead_captures";

const readStoredLeads = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LEAD_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const writeStoredLeads = (leads) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(leads));
  } catch (error) {
    // no-op
  }
};

export const captureLead = (payload) => {
  if (!payload) return null;
  const capturedAt = Date.now();
  const entry = { ...payload, capturedAt };
  const leads = readStoredLeads();
  writeStoredLeads([entry, ...leads].slice(0, 200));

  if (typeof window !== "undefined" && Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: "lead_capture", ...entry });
  }

  return entry;
};
