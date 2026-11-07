// Classify the login page's visible error text without logging account details.
const ERROR_CATEGORIES = [
  ["invalid-credentials", /password mismatch|password entered does not match|invalid credentials|invalid password/i],
  ["account-not-found", /could not find an account|could not find a matching account|no account found|couldn't find a sign-in email/i],
  ["rate-limited", /too many login attempts|too many requests/i],
  ["account-blocked", /login blocked because|student account cannot log in|contract ended on|account is currently disabled|no student profile was found|account status requires an admin review/i],
  ["network-error", /could not connect to the internet|network request failed/i],
  ["firebase-unconfigured", /Firebase-Konfiguration fehlt/i],
];

export const classifyPdfLoginFailure = (text) => {
  const value = String(text || "");
  for (const [reason, pattern] of ERROR_CATEGORIES) {
    if (pattern.test(value)) return reason;
  }
  return null;
};
