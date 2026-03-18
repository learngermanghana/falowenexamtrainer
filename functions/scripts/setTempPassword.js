#!/usr/bin/env node

const admin = require("firebase-admin");

const args = process.argv.slice(2).reduce((acc, arg, index, arr) => {
  if (!arg.startsWith("--")) return acc;
  const key = arg.replace(/^--/, "");
  const next = arr[index + 1];
  if (!next || next.startsWith("--")) acc[key] = true;
  else acc[key] = next;
  return acc;
}, {});

const usage = `
Usage:
  node scripts/setTempPassword.js --email student@example.com --temp-password "TempPass123!"

Optional:
  --uid <firebase_uid>              Use UID instead of looking up by email
  --new-email <new@example.com>     Move the account to an accessible email
  --email-verified true|false       Set emailVerified when updating the user

Environment:
  Provide Firebase Admin credentials through one of:
  - GOOGLE_SERVICE_ACCOUNT_JSON_B64
  - FIREBASE_SERVICE_ACCOUNT_JSON_B64
  - GOOGLE_SERVICE_ACCOUNT_JSON
  - FIREBASE_SERVICE_ACCOUNT_JSON
`;

function parseOptionalBoolean(value) {
  if (value === undefined || value === true) return undefined;
  const normalized = String(value).trim().toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  console.error(`Invalid boolean value: ${value}. Use true or false.`);
  process.exit(1);
}

function initFirebaseAdmin() {
  if (admin.apps.length) return;

  const b64 =
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64 ||
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON_B64;

  const raw =
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  let serviceAccount = null;

  if (raw) {
    serviceAccount = JSON.parse(raw);
  } else if (b64) {
    serviceAccount = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
  }

  if (serviceAccount?.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCLOUD_PROJECT ||
    process.env.GCP_PROJECT ||
    process.env.PROJECT_ID ||
    serviceAccount?.project_id;

  if (serviceAccount?.client_email && serviceAccount?.private_key) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId,
    });
    return;
  }

  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId,
  });
}

async function resolveUser(auth) {
  const uid = String(args.uid || "").trim();
  const email = String(args.email || "").trim().toLowerCase();

  if (uid) {
    return auth.getUser(uid);
  }

  if (email) {
    return auth.getUserByEmail(email);
  }

  console.error("Missing required identifier. Pass --uid or --email.\n");
  console.error(usage.trim());
  process.exit(1);
}

async function run() {
  const tempPassword = String(args["temp-password"] || "").trim();
  const newEmail = String(args["new-email"] || "").trim().toLowerCase();
  const emailVerified = parseOptionalBoolean(args["email-verified"]);

  if (!tempPassword) {
    console.error("Missing required --temp-password value.\n");
    console.error(usage.trim());
    process.exit(1);
  }

  if (tempPassword.length < 6) {
    console.error("Temporary password must be at least 6 characters.");
    process.exit(1);
  }

  initFirebaseAdmin();

  const auth = admin.auth();
  const user = await resolveUser(auth);
  const updatePayload = { password: tempPassword };

  if (newEmail) {
    updatePayload.email = newEmail;
  }

  if (typeof emailVerified === "boolean") {
    updatePayload.emailVerified = emailVerified;
  }

  const updated = await auth.updateUser(user.uid, updatePayload);

  console.log("✅ Temporary password updated successfully.");
  console.log(`UID: ${updated.uid}`);
  console.log(`Email: ${updated.email || "(no email)"}`);
  if (newEmail) {
    console.log(`New email applied: ${newEmail}`);
  }
  console.log("Next step: share the temporary password securely with the student.");
}

run().catch((error) => {
  console.error("Failed to update temporary password.");
  console.error(error);
  process.exit(1);
});
