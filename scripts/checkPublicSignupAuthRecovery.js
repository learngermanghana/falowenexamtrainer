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
expectSource(
  signupSource.includes("Complete the form below to continue your application."),
  "Signup resume copy must tell applicants to continue in the form.",
);
expectSource(
  signupSource.includes("WhatsApp is optional and only for administrative support."),
  "Signup resume copy must explain that WhatsApp is optional administrative support.",
);
expectSource(
  signupSource.includes("Contact Admissions Support on WhatsApp"),
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
