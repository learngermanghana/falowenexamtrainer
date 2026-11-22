// Keep these conventions aligned with functions/functionz/signupDuplicateReview.js.
export const canonicalPhone = (value) => {
  const raw = String(value || "").trim();
  if (!raw || !/^[+\d\s().-]+$/.test(raw)) return "";
  let number = raw.replace(/\D/g, "");
  if (number.startsWith("00") && number.length > 10) number = number.slice(2);
  if (number.length === 10 && number.startsWith("0")) number = "233" + number.slice(1);
  else if (number.length === 9 && /^[235]/.test(number)) number = "233" + number;
  return number.length >= 7 && number.length <= 15 ? number : "";
};

export const canonicalEmail = (value) => {
  const email = String(value || "").trim().toLowerCase();
  const match = email.match(/^([^\s@]+)@([^\s@]+\.[^\s@]+)$/);
  if (!match) return "";
  const [, local, domain] = match;
  return ["gmail.com", "googlemail.com"].includes(domain)
    ? local.split("+")[0].replace(/\./g, "") + "@gmail.com"
    : email;
};

export const canonicalName = (value) => {
  const words = String(value || "").toLowerCase().normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "").replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim().split(/\s+/).filter(Boolean);
  return words.length >= 2 ? words.sort().join(" ") : "";
};
