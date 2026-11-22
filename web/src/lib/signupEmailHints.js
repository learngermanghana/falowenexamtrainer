// Local-only email typo hints; never alter a student's address without consent.
// Avoid fuzzy matching of unfamiliar institutional domains, which can be valid.
const TYPO_DOMAINS = {
  "gmail.con": "gmail.com", "gmial.com": "gmail.com",
  "gamil.com": "gmail.com", "gmal.com": "gmail.com",
  "gmai.com": "gmail.com", "gmail.co": "gmail.com",
  "gmaill.com": "gmail.com", "gmail.cmo": "gmail.com",
  "yahoo.con": "yahoo.com", "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com", "yahoo.co": "yahoo.com",
  "outlook.con": "outlook.com", "outlok.com": "outlook.com",
  "outlook.co": "outlook.com", "hotmial.com": "hotmail.com",
  "hotmail.con": "hotmail.com", "icloud.con": "icloud.com",
};
export const suggestEmailCorrection = (value) => {
  const raw = String(value || "").trim();
  const match = raw.match(/^([^\s@]+)@([^\s@]+)$/);
  if (!match) return "";
  const replacement = TYPO_DOMAINS[match[2].toLowerCase()];
  return replacement ? `${match[1]}@${replacement}` : "";
};
