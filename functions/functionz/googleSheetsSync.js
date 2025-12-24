/* eslint-disable no-console */

const admin = require("firebase-admin");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

/**
 * Env vars (Windows: `set NAME=value`)
 *
 * Required:
 * - GOOGLE_SHEETS_ID=...
 * - GOOGLE_SHEETS_RANGE=tabName!A:Z      (e.g. students!A:Z  or  scores_backup!A:Z)
 *
 * Optional:
 * - FIRESTORE_COLLECTION=students|scores (default: students)
 * - SYNC_FIELD=syncedToSheets            (default: syncedToSheets)
 * - SYNC_ALL=1                           (default: 0)  // if 1, scan whole collection (up to SCAN_LIMIT)
 * - SCAN_LIMIT=5000                      (default: 5000)
 * - SHEETS_BATCH_SIZE=50                 (default: 50)  // append 50 rows per API call
 *
 * Dedupe (mainly for students):
 * - DEDUPE=1                             (default: 1 for students, 0 for scores)
 * - DEDUPE_COLUMN=B                      (default: B)  // studentCode column in sheet
 *
 * Auth:
 * - GOOGLE_SERVICE_ACCOUNT_FILE=C:\path\to\key.json
 *   OR GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\key.json
 *
 * Notes:
 * - In Cloud Functions, you should NOT point to a local file path; use default credentials/secrets.
 */

function envBool(name, defaultVal = false) {
  const v = (process.env[name] || "").trim().toLowerCase();
  if (!v) return defaultVal;
  return v === "1" || v === "true" || v === "yes" || v === "y";
}

function envInt(name, defaultVal) {
  const v = parseInt(process.env[name] || "", 10);
  return Number.isFinite(v) ? v : defaultVal;
}

function colLetterToIndex(letter) {
  // A->0, B->1 ... Z->25, AA->26...
  let col = 0;
  const s = letter.toUpperCase().replace(/[^A-Z]/g, "");
  for (let i = 0; i < s.length; i++) col = col * 26 + (s.charCodeAt(i) - 64);
  return col - 1;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function isQuotaError(err) {
  const msg = String(err && (err.message || err)).toLowerCase();
  return msg.includes("quota") || msg.includes("rate limit") || msg.includes("429");
}

async function withBackoff(fn, { tries = 7, baseMs = 800 } = {}) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (!isQuotaError(err) && i < tries - 1) throw err;
      const wait = baseMs * Math.pow(2, i) + Math.floor(Math.random() * 250);
      console.warn(`Retrying after error (${i + 1}/${tries}) in ${wait}ms:`, err.message || err);
      await sleep(wait);
    }
  }
  throw lastErr;
}

function initFirestore() {
  // Local runs: uses service account file if provided.
  // In Cloud Functions: admin.initializeApp() will use runtime credentials automatically.
  if (admin.apps.length) return admin.firestore();

  const svcPath =
    process.env.GOOGLE_SERVICE_ACCOUNT_FILE ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    "";

  const b64 =
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64 ||
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON_B64;

  const raw =
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  let serviceAccount = null;

  if (raw) {
    serviceAccount = JSON.parse(raw);
  } else if (b64) {
    serviceAccount = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
  } else if (svcPath && fs.existsSync(svcPath)) {
    serviceAccount = JSON.parse(fs.readFileSync(path.resolve(svcPath), "utf8"));
  }

  if (serviceAccount?.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCLOUD_PROJECT ||
    serviceAccount?.project_id;

  if (serviceAccount?.client_email && serviceAccount?.private_key) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId,
    });
  } else {
    admin.initializeApp({ projectId });
  }
  return admin.firestore();
}

function getSheetsAuth() {
  const svcPath =
    process.env.GOOGLE_SERVICE_ACCOUNT_FILE ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    "";

  if (!svcPath || !fs.existsSync(svcPath)) {
    const b64 =
      process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64 ||
      process.env.FIREBASE_SERVICE_ACCOUNT_JSON_B64;

    const raw =
      process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

    if (!raw && !b64) {
      // Cloud Functions case: uses ADC (make sure Sheets API enabled + SA has access to sheet)
      return new google.auth.GoogleAuth({
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
    }

    const serviceAccount = raw
      ? JSON.parse(raw)
      : JSON.parse(Buffer.from(b64, "base64").toString("utf8"));

    if (serviceAccount?.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
    }

    const jwt = new google.auth.JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    return jwt;
  }

  const key = JSON.parse(fs.readFileSync(svcPath, "utf8"));
  const jwt = new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return jwt;
}

async function getSheetHeaderKeys(sheets, spreadsheetId, tabName) {
  // Reads first row; if empty, returns [].
  const headerRange = `${tabName}!A1:Z1`;
  const res = await withBackoff(() =>
    sheets.spreadsheets.values.get({ spreadsheetId, range: headerRange })
  );
  const row = (res.data.values && res.data.values[0]) || [];
  return row.map((h) => String(h || "").trim());
}

function buildRowFromHeader(docData, headerKeys, { includeDocId, docId }) {
  const row = [];
  for (const key of headerKeys) {
    if (!key) {
      row.push("");
      continue;
    }
    const norm = key.trim();
    if (includeDocId && (norm === "docId" || norm === "doc_id")) {
      row.push(docId);
      continue;
    }
    const v = docData[norm];
    row.push(v === undefined || v === null ? "" : v);
  }
  return row;
}

async function getExistingKeysForDedupe(sheets, spreadsheetId, rangeAtoZ, dedupeColumnLetter) {
  // Read whole range (A:Z) once. For large sheets, prefer narrowing this later.
  const res = await withBackoff(() =>
    sheets.spreadsheets.values.get({ spreadsheetId, range: rangeAtoZ })
  );
  const values = res.data.values || [];
  if (values.length === 0) return new Set();

  const dedupeIdx = colLetterToIndex(dedupeColumnLetter || "B");

  // If first row is header, keep it but don’t count it as data.
  // We’ll treat row0 as header if it contains 'studentCode' or similar.
  const headerRow = values[0].map((x) => String(x || "").toLowerCase());
  const looksLikeHeader =
    headerRow.includes("studentcode") ||
    headerRow.includes("student_code") ||
    headerRow.includes("code");

  const start = looksLikeHeader ? 1 : 0;
  const set = new Set();
  for (let i = start; i < values.length; i++) {
    const row = values[i] || [];
    const key = String(row[dedupeIdx] || "").trim();
    if (key) set.add(key);
  }
  return set;
}

async function appendRows(sheets, spreadsheetId, rangeAtoZ, rows) {
  // values.append will append to the sheet tab contained in `rangeAtoZ`
  return withBackoff(() =>
    sheets.spreadsheets.values.append({
      spreadsheetId,
      range: rangeAtoZ,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: rows },
    })
  );
}

async function markDocsSynced(db, collectionName, docIds, syncField) {
  const batch = db.batch();
  docIds.forEach((id) => {
    const ref = db.collection(collectionName).doc(id);
    batch.set(ref, { [syncField]: true }, { merge: true });
  });
  await batch.commit();
}

async function fetchDocs(db, collectionName, syncField, syncAll, scanLimit) {
  const colRef = db.collection(collectionName);

  if (!syncAll) {
    // Only docs explicitly marked false
    const snap = await colRef.where(syncField, "==", false).limit(scanLimit).get();
    return snap.docs;
  }

  // Full scan (limited)
  const snap = await colRef.limit(scanLimit).get();
  return snap.docs;
}

async function main() {
  const spreadsheetId = (process.env.GOOGLE_SHEETS_ID || "").trim();
  const rangeAtoZ = (process.env.GOOGLE_SHEETS_RANGE || "").trim();

  if (!spreadsheetId) throw new Error("Missing GOOGLE_SHEETS_ID");
  if (!rangeAtoZ) throw new Error("Missing GOOGLE_SHEETS_RANGE (e.g. students!A:Z)");

  const collectionName = (process.env.FIRESTORE_COLLECTION || "students").trim();
  const syncField = (process.env.SYNC_FIELD || "syncedToSheets").trim();
  const syncAll = envBool("SYNC_ALL", false);
  const scanLimit = envInt("SCAN_LIMIT", 5000);
  const sheetsBatchSize = envInt("SHEETS_BATCH_SIZE", 50);

  // Default dedupe: students YES, scores NO
  const defaultDedupe = collectionName.toLowerCase() === "students";
  const dedupe = envBool("DEDUPE", defaultDedupe);
  const dedupeColumn = (process.env.DEDUPE_COLUMN || "B").trim();

  const tabName = rangeAtoZ.split("!")[0];

  const db = initFirestore();
  const auth = getSheetsAuth();
  const sheets = google.sheets({ version: "v4", auth });

  // Debug info
  const projectId =
    admin.apps[0]?.options?.projectId ||
    process.env.GCLOUD_PROJECT ||
    process.env.GCP_PROJECT ||
    "(unknown)";
  console.log("Firestore project:", projectId);
  console.log("Firestore collection:", collectionName);
  console.log("Sheet ID:", spreadsheetId);
  console.log("Sheet range:", rangeAtoZ);
  console.log("Sync field:", syncField);
  console.log("Sync all:", syncAll ? "YES" : "NO");
  console.log("Scan limit:", scanLimit);
  console.log("Sheets batch size:", sheetsBatchSize);
  console.log("Dedupe:", dedupe ? `YES (col ${dedupeColumn})` : "NO");

  let existingKeys = new Set();
  if (dedupe) {
    existingKeys = await getExistingKeysForDedupe(sheets, spreadsheetId, rangeAtoZ, dedupeColumn);
    console.log("Existing keys in sheet:", existingKeys.size);
  }

  const docs = await fetchDocs(db, collectionName, syncField, syncAll, scanLimit);
  console.log("Docs fetched from Firestore:", docs.length);

  // Get headers from sheet so we write correct columns (and avoid exporting fields like password)
  const headerKeys = await getSheetHeaderKeys(sheets, spreadsheetId, tabName);

  if (!headerKeys.length) {
    console.warn(
      `No header row found in ${tabName} (A1:Z1). Add headers first so columns map correctly.`
    );
    console.warn(
      `Example for scores_backup: date | studentcode | name | level | assignment | score | link | comments`
    );
  }

  // Build rows to append
  const rowsToAppend = [];
  const docIdsToMark = [];

  for (const d of docs) {
    const data = d.data() || {};
    const docId = d.id;

    // If dedupe is enabled, require a key in the dedupe column.
    // For students sheet: dedupe on studentCode usually equals docId (your docId is studentcode).
    if (dedupe) {
      const key = String(data.studentcode || data.studentCode || docId || "").trim();
      if (key && existingKeys.has(key)) continue;
      if (key) existingKeys.add(key);
    }

    const row =
      headerKeys.length > 0
        ? buildRowFromHeader(data, headerKeys, { includeDocId: true, docId })
        : Object.values(data);

    rowsToAppend.push(row);
    docIdsToMark.push(docId);
  }

  console.log(
    `Rows to append: ${rowsToAppend.length} (skipped: ${docs.length - rowsToAppend.length})`
  );

  if (!rowsToAppend.length) {
    console.log("No unsynced docs found.");
    return;
  }

  // Append in chunks to avoid quota
  let appended = 0;
  let marked = 0;

  for (let i = 0; i < rowsToAppend.length; i += sheetsBatchSize) {
    const chunk = rowsToAppend.slice(i, i + sheetsBatchSize);
    const chunkDocIds = docIdsToMark.slice(i, i + sheetsBatchSize);

    await appendRows(sheets, spreadsheetId, rangeAtoZ, chunk);
    appended += chunk.length;

    // Mark synced after each successful chunk (avoids re-append if next chunk fails)
    await markDocsSynced(db, collectionName, chunkDocIds, syncField);
    marked += chunkDocIds.length;

    console.log(`Appended ${appended}/${rowsToAppend.length}... Marked synced ${marked}...`);
    await sleep(450); // small pacing to reduce quota pressure
  }

  console.log(`Done. Appended: ${appended}, Marked synced: ${marked}`);
}

main().catch((err) => {
  console.error("Sync failed:", err.message || err);
  process.exitCode = 1;
});
