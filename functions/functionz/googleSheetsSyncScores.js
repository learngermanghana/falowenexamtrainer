/**
 * googleSheetsSyncScores.js
 *
 * Reads score attempts from a Google Sheet and writes them into Firestore.
 * - Sheet is READ ONLY (no updates to the sheet)
 * - One Firestore doc per attempt (supports retries)
 * - Maps by header names (robust to column reorder)
 *
 * Expected headers (case-insensitive) in row 1:
 * studentcode | name | assignment | score | comments | date | level | link
 *
 * Env vars (Windows cmd: set VAR=value):
 *   GOOGLE_SERVICE_ACCOUNT_FILE=C:\path\to\key.json
 *   GOOGLE_SHEETS_ID=...
 *   GOOGLE_SHEETS_RANGE=scores_backup!A:H
 *   FIRESTORE_COLLECTION=scores
 * Optional:
 *   SCAN_LIMIT=5000
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const admin = require("firebase-admin");
const { google } = require("googleapis");

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function normalizeHeader(h) {
  return String(h || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ""); // "student code" -> "studentcode"
}

function safeStr(v) {
  return v === undefined || v === null ? "" : String(v).trim();
}

function safeNum(v) {
  const n = Number(String(v).trim());
  return Number.isFinite(n) ? n : null;
}

/**
 * Extract an assignment identifier from strings like:
 * - "A1 Assignment 0.2" -> "0.2"
 * - "A1 Assignment 9_10" -> "9_10"
 * - "B1 2.4 Wohnung suchen" -> "2.4"
 * - "A2 8.21 Ein Wochenende planen" -> "8.21"
 */
function parseAssignmentId(assignmentText) {
  const t = safeStr(assignmentText);

  // Prefer patterns containing underscores too (e.g. "0.2_1.1", "9_10")
  const m = t.match(/(\d+(?:\.\d+)?(?:_\d+(?:\.\d+)?)*)/);
  return m ? m[1] : "";
}

function parseIsoDate(dateText) {
  const t = safeStr(dateText);
  // Accept already-ISO or "YYYY-MM-DD"
  const d = new Date(t);
  if (!isNaN(d.getTime())) return d.toISOString();
  return "";
}

function hashAttemptKey(obj) {
  // Stable key so reruns won't duplicate the same attempt row
  const base = [
    obj.studentCode,
    obj.level,
    obj.assignmentId,
    obj.date || "",
    obj.score ?? "",
    obj.comments || "",
    obj.link || "",
    obj.name || "",
  ].join("|");

  return crypto.createHash("sha1").update(base).digest("hex").slice(0, 12);
}

async function initFirestore(serviceAccountPath) {
  const raw = fs.readFileSync(serviceAccountPath, "utf8");
  const serviceAccount = JSON.parse(raw);

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  const db = admin.firestore();
  return { db, projectId: serviceAccount.project_id, clientEmail: serviceAccount.client_email };
}

async function initSheetsJwt(serviceAccountPath) {
  const raw = fs.readFileSync(serviceAccountPath, "utf8");
  const creds = JSON.parse(raw);

  const jwt = new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  await jwt.authorize();
  return google.sheets({ version: "v4", auth: jwt });
}

async function main() {
  const serviceAccountFile =
    process.env.GOOGLE_SERVICE_ACCOUNT_FILE ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!serviceAccountFile) {
    throw new Error(
      "Set GOOGLE_SERVICE_ACCOUNT_FILE (or GOOGLE_APPLICATION_CREDENTIALS) to your Firebase service account JSON path."
    );
  }

  const sheetId = requireEnv("GOOGLE_SHEETS_ID");
  const range = requireEnv("GOOGLE_SHEETS_RANGE");
  const collectionName = process.env.FIRESTORE_COLLECTION || "scores";
  const scanLimit = Number(process.env.SCAN_LIMIT || "5000");

  const absKey = path.isAbsolute(serviceAccountFile)
    ? serviceAccountFile
    : path.resolve(process.cwd(), serviceAccountFile);

  const { db, projectId, clientEmail } = await initFirestore(absKey);
  const sheets = await initSheetsJwt(absKey);

  console.log("Firestore project:", projectId);
  console.log("Service account:", clientEmail);
  console.log("Firestore collection:", collectionName);
  console.log("Sheet ID:", sheetId);
  console.log("Sheet range:", range);
  console.log("Scan limit:", scanLimit);

  // Read sheet values
  const resp = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
    majorDimension: "ROWS",
    valueRenderOption: "UNFORMATTED_VALUE",
  });

  const rows = resp.data.values || [];
  if (rows.length < 2) {
    console.log("No data rows found (need header + at least 1 row).");
    return;
  }

  const headerRow = rows[0];
  const headerMap = new Map();
  headerRow.forEach((h, idx) => headerMap.set(normalizeHeader(h), idx));

  const required = ["studentcode", "name", "assignment", "score", "comments", "date", "level", "link"];
  const missing = required.filter((k) => !headerMap.has(k));
  if (missing.length) {
    throw new Error(
      `Sheet headers missing: ${missing.join(", ")}. Found headers: ${headerRow.join(" | ")}`
    );
  }

  // Process rows (limit)
  const dataRows = rows.slice(1, 1 + scanLimit);

  let processed = 0;
  let written = 0;
  let skipped = 0;

  // Batch writes (Firestore batch max 500 ops)
  let batch = db.batch();
  let ops = 0;

  async function commitBatchIfNeeded(force = false) {
    if (ops === 0) return;
    if (ops >= 450 || force) {
      await batch.commit();
      batch = db.batch();
      ops = 0;
    }
  }

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];

    const studentCode = safeStr(row[headerMap.get("studentcode")]);
    const name = safeStr(row[headerMap.get("name")]);
    const assignment = safeStr(row[headerMap.get("assignment")]);
    const score = safeNum(row[headerMap.get("score")]);
    const comments = safeStr(row[headerMap.get("comments")]);
    const date = safeStr(row[headerMap.get("date")]);
    const level = safeStr(row[headerMap.get("level")]);
    const link = safeStr(row[headerMap.get("link")]);

    // Skip empty rows
    if (!studentCode || !assignment || !level) {
      skipped++;
      continue;
    }

    const assignmentId = parseAssignmentId(assignment);
    const isoDate = parseIsoDate(date);

    const attempt = {
      studentCode,
      name,
      assignmentText: assignment,
      assignmentId,          // the number you’ll use for next-assignment logic
      score,                 // numeric
      comments,
      date,                  // keep original
      dateIso: isoDate,      // helpful for sorting
      level,
      link,
      passMark: 60,          // your global rule
      passed: typeof score === "number" ? score >= 60 : null,
      source: {
        sheetId,
        range,
        rowNumber: i + 2,    // +2 because header is row 1
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const keyHash = hashAttemptKey(attempt);
    const docId = `${studentCode}__${level}__${assignmentId || "na"}__${keyHash}`;

    const ref = db.collection(collectionName).doc(docId);

    // Idempotent: only create if doc doesn't already exist
    const snap = await ref.get();
    if (snap.exists) {
      skipped++;
      continue;
    }

    batch.set(ref, attempt, { merge: false });
    ops++;
    written++;
    processed++;

    await commitBatchIfNeeded(false);
  }

  await commitBatchIfNeeded(true);

  console.log(`Done. Written: ${written}, Skipped: ${skipped}, Processed rows: ${processed}`);
  console.log(`Note: Sheet was READ ONLY. No updates were made to the sheet.`);
}

main().catch((err) => {
  console.error("Sync failed:", err.message || err);
  process.exit(1);
});
