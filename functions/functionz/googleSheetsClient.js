const fs = require("fs");
const { google } = require("googleapis");

let cachedSheets = null;
let cachedServiceAccountEmail = null;

function parseServiceAccount(raw) {
  const obj = JSON.parse(raw);

  // common issue: private_key newlines get escaped when stored in env/secrets
  if (obj.private_key && typeof obj.private_key === "string") {
    obj.private_key = obj.private_key.replace(/\\n/g, "\n");
  }

  return obj;
}

function loadServiceAccount() {
  // Option A: file path (local dev)
  const file =
    process.env.GOOGLE_SERVICE_ACCOUNT_FILE ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (file && fs.existsSync(file)) {
    return parseServiceAccount(fs.readFileSync(file, "utf8"));
  }

  // Option B: raw JSON in env (accept multiple names)
  const raw =
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON ||
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (raw && raw.trim().startsWith("{")) {
    return parseServiceAccount(raw);
  }

  // Option C: base64 JSON in env (accept multiple names)
  const b64 =
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64 ||
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY_B64;

  if (b64) {
    const decoded = Buffer.from(b64, "base64").toString("utf8");
    return parseServiceAccount(decoded);
  }

  throw new Error(
    "Missing Google service account. Set GOOGLE_SERVICE_ACCOUNT_JSON_B64 (recommended) or GOOGLE_SERVICE_ACCOUNT_JSON / GOOGLE_SERVICE_ACCOUNT_KEY."
  );
}

async function getSheetsClient() {
  if (cachedSheets) return cachedSheets;

  const sa = loadServiceAccount();
  cachedServiceAccountEmail = sa.client_email;

  const auth = new google.auth.JWT({
    email: sa.client_email,
    key: sa.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  await auth.authorize();

  cachedSheets = google.sheets({ version: "v4", auth });
  return cachedSheets;
}

function getServiceAccountEmail() {
  return cachedServiceAccountEmail;
}

module.exports = { getSheetsClient, getServiceAccountEmail };
