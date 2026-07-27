import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appPath = path.join(repoRoot, "web/src/App.js");
const authContextPath = path.join(repoRoot, "web/src/context/AuthContext.js");
const signupPath = path.join(repoRoot, "web/src/components/SignUpPage.js");

const replaceOnce = (source, before, after, label) => {
  if (source.includes(after)) return source;
  if (!source.includes(before)) {
    throw new Error(`Could not find ${label}.`);
  }
  return source.replace(before, after);
};

let appSource = fs.readFileSync(appPath, "utf8");
let authSource = fs.readFileSync(authContextPath, "utf8");
let signupSource = fs.readFileSync(signupPath, "utf8");

appSource = replaceOnce(
  appSource,
  `  if (authLoading) {\n`,
  `  const isPublicAuthEntryRoute =\n    location.pathname.startsWith("/signup") || location.pathname.startsWith("/login");\n\n  // Signed-out applicants must be able to reach signup/login even when Firebase\n  // background auth restoration is slow or stalled. Once a user is known, keep\n  // the normal loading gate so protected student/profile state cannot flash.\n  if (authLoading && (user || !isPublicAuthEntryRoute)) {\n`,
  "global auth-loading guard in App.js",
);

authSource = replaceOnce(
  authSource,
  `      return { studentCode, paystackLink: payload.paystackLink };\n`,
  `      // Do not depend only on onIdTokenChanged to finish a new applicant's\n      // signup handoff. Some mobile/browser sessions can leave that listener\n      // pending, which previously stranded the student on the auth-loading screen.\n      setUser(credential.user);\n      previousUserId.current = credential.user.uid;\n      setLoading(false);\n      return { studentCode, paystackLink: payload.paystackLink };\n`,
  "signup authentication handoff in AuthContext.js",
);

signupSource = replaceOnce(
  signupSource,
  `    }${context.video ? \` I came from YouTube lesson ${context.video}.\` : ""} Please help me continue.\`\n`,
  `    }${context.video ? \` I came from YouTube lesson ${context.video}.\` : ""} I need help with the application form or admissions process.\`\n`,
  "signup WhatsApp support message",
);

signupSource = replaceOnce(
  signupSource,
  `        Your non-password details are saved on this device. Continue below or ask us to help you finish.\n`,
  `        Your non-password details are saved on this device. Complete the form below to continue your application.\n`,
  "signup resume explanation",
);

signupSource = replaceOnce(
  signupSource,
  `      <a\n        href={\`https://wa.me/233205706589?text=${message}\`}\n`,
  `      <p style={{ margin: 0, color: "#475569", lineHeight: 1.55, fontSize: 13 }}>\n        Need help with the form or admissions? WhatsApp is optional and only for administrative support.\n      </p>\n      <a\n        href={\`https://wa.me/233205706589?text=${message}\`}\n        aria-label="Contact Admissions Support on WhatsApp"\n`,
  "optional WhatsApp support explanation",
);

signupSource = replaceOnce(
  signupSource,
  `        Continue on WhatsApp\n`,
  `        Contact Admissions Support on WhatsApp\n`,
  "signup WhatsApp button label",
);

fs.writeFileSync(appPath, appSource, "utf8");
fs.writeFileSync(authContextPath, authSource, "utf8");
fs.writeFileSync(signupPath, signupSource, "utf8");

console.log("Public signup auth recovery and WhatsApp support copy are aligned.");
