const LEAD_STORAGE_KEY = "falowen_lead_captures";
const DEFAULT_WHATSAPP_NUMBER = "233205706589";

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

const formatLeadMessage = (entry) => {
  const lines = [
    "New lead capture",
    "",
    `Name: ${entry?.name || "-"}`,
    `Phone: ${entry?.phone || "-"}`,
    `Email: ${entry?.email || "-"}`,
    `Level interest: ${entry?.levelInterest || "-"}`,
    `Preferred mode: ${entry?.preferredMode || "-"}`,
    `Preferred start: ${entry?.startTimeline || "-"}`,
    entry?.cta ? `CTA: ${entry.cta}` : null,
    entry?.source ? `Source: ${entry.source}` : null,
  ].filter(Boolean);

  return lines.join("\n");
};

export const shareLeadOnWhatsApp = (entry, whatsappNumber = DEFAULT_WHATSAPP_NUMBER) => {
  if (typeof window === "undefined") return;
  const message = formatLeadMessage(entry);
  const encodedMessage = encodeURIComponent(message);
  const sanitizedNumber = String(whatsappNumber || DEFAULT_WHATSAPP_NUMBER).replace(/\D/g, "");
  const url = `https://wa.me/${sanitizedNumber}?text=${encodedMessage}`;
  window.open(url, "_blank", "noopener,noreferrer");
};
