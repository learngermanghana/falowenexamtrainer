const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const appSource = fs.readFileSync(path.join(repoRoot, "web/src/App.js"), "utf8");
const authSource = fs.readFileSync(path.join(repoRoot, "web/src/context/AuthContext.js"), "utf8");
const signupSource = fs.readFileSync(path.join(repoRoot, "web/src/components/SignUpPage.js"), "utf8");

const failures = [];
const expectSource = (condition, message) => {
  if (!condition) failures.push(message);
};

expectSource(
  appSource.includes('location.pathname.startsWith("/signup") || location.pathname.startsWith("/login")'),
  "App.js must recognize signup/login as public auth entry routes.",
);
expectSource(
  appSource.includes("if (authLoading && (user || !isPublicAuthEntryRoute))"),
  "App.js must not block a signed-out signup/login visitor on background auth loading.",
);
expectSource(
  authSource.includes("setUser(credential.user);") &&
    authSource.includes("previousUserId.current = credential.user.uid;") &&
    authSource.includes("setLoading(false);\n      return { studentCode, paystackLink: payload.paystackLink }"),
  "AuthContext signup must explicitly finish the authenticated-user handoff.",
);
// Student-facing copy is now localized: ensure the component uses those keys
// and the English fallback retains the original admission safeguards.
const english = require("../web/src/i18n/locales/en/translation.json");
const localizedResume = signupSource.includes('t("uiLanguageFlow.resume.description")');
const localizedOptional = signupSource.includes('t("uiLanguageFlow.resume.whatsappOptional")');
const localizedWhatsApp = signupSource.includes('t("uiLanguageFlow.resume.whatsapp")');
expectSource(
  localizedResume
    ? english.uiLanguageFlow?.resume?.description?.includes("Complete the form below to continue your application.")
    : signupSource.includes("Complete the form below to continue your application."),
  "Signup resume copy must tell applicants to continue in the form.",
);
expectSource(
  localizedOptional
    ? english.uiLanguageFlow?.resume?.whatsappOptional?.includes("WhatsApp is optional and only for administrative support.")
    : signupSource.includes("WhatsApp is optional and only for administrative support."),
  "Signup resume copy must explain that WhatsApp is optional administrative support.",
);
expectSource(
  localizedWhatsApp
    ? english.uiLanguageFlow?.resume?.whatsapp === "Contact Admissions Support on WhatsApp" &&
      signupSource.includes('aria-label={t("uiLanguageFlow.resume.whatsapp")}')
    : signupSource.includes("Contact Admissions Support on WhatsApp"),
  "Signup WhatsApp CTA must be labelled as admissions support.",
);
expectSource(
  !signupSource.includes("Continue on WhatsApp"),
  "Signup must not present WhatsApp as the normal continuation path.",
);

if (failures.length) {
  console.error("Public signup auth recovery regression failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Public signup auth recovery regression passed.");
