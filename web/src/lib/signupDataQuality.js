export const normalizeWhitespace = (value) => String(value || "").replace(/\s+/g, " ").trim();

export const normalizeEmail = (value) => normalizeWhitespace(value).toLowerCase();

export const normalizePersonName = (value) =>
  normalizeWhitespace(value)
    .split(" ")
    .filter(Boolean)
    .map((part) => part.replace(/^[^\p{L}]*/u, "").replace(/[^\p{L}'’-]*$/u, ""))
    .filter(Boolean)
    .join(" ");

export const normalizePhone = (value) => String(value || "").replace(/[^\d+]/g, "").trim();

export const isFullName = (value) => {
  const cleaned = normalizePersonName(value);
  if (!cleaned) return false;
  const parts = cleaned.split(/\s+/).filter(Boolean);
  return parts.length >= 2 && parts.every((part) => part.length >= 2);
};

export const isLikelyPhoneNumber = (value) => {
  const cleaned = normalizePhone(value);
  const digitsOnly = cleaned.replace(/\D/g, "");
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
};
