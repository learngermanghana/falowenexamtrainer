// Utility script to push Firebase signups into a Google Sheet.
//
// Usage:
//   GOOGLE_SERVICE_ACCOUNT_KEY="$(cat key.json | base64 -w0)" \
//   GOOGLE_SHEETS_ID="<sheet id>" \
//   node functionz/googleSheetsSync.js
//
// Required fields in each signup document:
//   firstName, lastName, email, level, createdAt (timestamp)

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");
const { google } = require("googleapis");

const {
  GOOGLE_SERVICE_ACCOUNT_KEY,
  GOOGLE_SERVICE_ACCOUNT_FILE,
  GOOGLE_SHEETS_ID,
  GOOGLE_SHEETS_RANGE = "Signups!A:E",
  FIREBASE_SIGNUPS_COLLECTION = "signups",
} = process.env;

const loadServiceAccount = () => {
  if (GOOGLE_SERVICE_ACCOUNT_KEY) {
    const decoded = Buffer.from(GOOGLE_SERVICE_ACCOUNT_KEY, "base64").toString(
      "utf8",
    );
    return JSON.parse(decoded);
  }

  if (GOOGLE_SERVICE_ACCOUNT_FILE) {
    const resolved = path.resolve(GOOGLE_SERVICE_ACCOUNT_FILE);
    const raw = fs.readFileSync(resolved, "utf8");
    return JSON.parse(raw);
  }

  throw new Error(
    "Provide GOOGLE_SERVICE_ACCOUNT_KEY (base64) or GOOGLE_SERVICE_ACCOUNT_FILE",
  );
};

const serviceAccount = loadServiceAccount();

if (admin.apps.length === 0) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const firestore = admin.firestore();

const sheetsClient = new google.sheets({
  version: "v4",
  auth: new google.auth.JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key,
    ["https://www.googleapis.com/auth/spreadsheets"],
  ),
});

const appendSignupToSheet = async (signup) => {
  if (!GOOGLE_SHEETS_ID) {
    throw new Error("GOOGLE_SHEETS_ID is required");
  }

  const values = [
    [
      signup.firstName || "",
      signup.lastName || "",
      signup.email || "",
      (signup.level || "").toUpperCase(),
      signup.createdAt
        ? new Date(signup.createdAt).toISOString()
        : new Date().toISOString(),
    ],
  ];

  await sheetsClient.spreadsheets.values.append({
    spreadsheetId: GOOGLE_SHEETS_ID,
    range: GOOGLE_SHEETS_RANGE,
    valueInputOption: "USER_ENTERED",
    requestBody: { values },
  });
};

const markSignupSynced = async (docRef) => {
  await docRef.update({ syncedToSheets: true, syncedAt: new Date() });
};

const fetchPendingSignups = async () => {
  const snapshot = await firestore
    .collection(FIREBASE_SIGNUPS_COLLECTION)
    .where("syncedToSheets", "==", false)
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data(), ref: doc.ref }));
};

const syncUnsyncedSignups = async () => {
  const pending = await fetchPendingSignups();
  if (!pending.length) {
    console.log("No pending signups found.");
    return;
  }

  for (const signup of pending) {
    await appendSignupToSheet(signup.data);
    await markSignupSynced(signup.ref);
    console.log(`Synced signup ${signup.id}`);
  }
};

if (require.main === module) {
  syncUnsyncedSignups()
    .then(() => {
      console.log("Signup sync complete.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to sync signups", error);
      process.exit(1);
    });
}

module.exports = {
  appendSignupToSheet,
  fetchPendingSignups,
  markSignupSynced,
  syncUnsyncedSignups,
};
