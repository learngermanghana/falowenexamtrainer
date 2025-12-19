const fs = require("fs");
const { google } = require("googleapis");

function loadServiceAccount() {
  // Option A: file path (works locally on Windows)
  const file = process.env.GOOGLE_SERVICE_ACCOUNT_FILE;
  if (file && fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  }

  // Option B: env contains raw JSON
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (raw && raw.trim().startsWith("{")) {
    return JSON.parse(raw);
  }

  // Option C: env contains base64 JSON
  const b64 =
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64 ||
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY_B64;
  if (b64) {
    const json = Buffer.from(b64, "base64").toString("utf8");
    return JSON.parse(json);
  }

  throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_FILE or GOOGLE_SERVICE_ACCOUNT_KEY/_B64");
}

async function getSheetsClient() {
  const sa = loadServiceAccount();

  const auth = new google.auth.JWT({
    email: sa.client_email,
    key: sa.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  await auth.authorize();

  return google.sheets({ version: "v4", auth });
}

module.exports = { getSheetsClient };
