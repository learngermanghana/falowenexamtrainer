/**
 * Sync Firestore scores -> Google Sheets
 *
 * Firestore collection: /scores
 * Sheet range: e.g. "scores!A:Z"
 *
 * Dedupe key is written into column A ("syncKey").
 * Recommended columns (A..):
 *  A syncKey
 *  B firestoreDocId
 *  C studentcode
 *  D name
 *  E level
 *  F assignmentLabel
 *  G assignmentId
 *  H score
 *  I date
 *  J comments
 *  K link
 *  L createdAtIso
 *  M syncedAtIso
 */

const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");
const { google } = require("googleapis");

// ---------- Helpers ----------
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function env(name, fallback = undefined) {
  const v = process.env[name];
  return v === undefined || v === "" ? fallback : v;
}

function readJsonFromFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

/**
 * Attempts to parse an "assignmentId" from different formats:
 *  - "A1 Assignment 4" => "4"
 *  - "A1 Assignment 0.2" => "0.2"
 *  - "A2 8.21 Ein Wochenende planen" => "8.21"
 *  - "B1 2.4 Wohnung suche" => "2.4"
 */
function parseAssignmentId(assignmentLabel) {
  if (!assignmentLabel || typeof assignmentLabel !== "string") return "";

  const s = assignmentLabel.trim();

  // "A1 Assignment 4" / "A1 Assignment 0.2_1.1" etc
  const m1 = s.match(/Assignment\s+([0-9]+(?:\.[0-9]+)?(?:_[0-9]+(?:\.[0-9]+)?)*)/i);
  if (m1 && m1[1]) return m1[1];

  // "A2 8.21 Ein Wochenende planen" / "B1 2.4 Wohnung suchen"
  const m2 = s.match(/\b([0-9]+(?:\.[0-9]+)?(?:_[0-9]+(?:\.[0-9]+)?)*)\b/);
  if (m2 && m2[1]) return m2[1];

  return "";
}

function firestoreTimestampToIso(v) {
  // Firestore Timestamp has toDate()
  if (v && typeof v.toDate === "function") return v.toDate().toISOString();
  // already string
  if (typeof v === "string") return v;
  return "";
}

async function sheetsAppendWithRetry(sheets, spreadsheetId, range, rows, maxRetries = 8) {
  let attempt = 0;
  while (true) {
    try {
      return await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        requestBody: { values: rows },
      });
    } catch (e) {
      const status = e?.code || e?.response?.status;
      const msg = e?.message || String(e);

      // Handle rate limits / quota (429) with backoff
      if ((status === 429 || /Quota exceeded/i.test(msg)) && attempt < maxRetries) {
        const backoff = Math.min(60000, 1000 * Math.pow(2, attempt)); // 1s,2s,4s... up to 60s
        console.warn(`Sheets quota/rate limit hit. Retrying in ${backoff}ms... (${attempt + 1}/${maxRetries})`);
        await sleep(backoff);
        attempt++;
        continue;
      }

      throw e;
    }
  }
}

// ---------- Main ----------
async function main() {
  const GOOGLE_SERVICE_ACCOUNT_FILE = env("GOOGLE_SERVICE_ACCOUNT_FILE");
  const GOOGLE_SHEETS_ID = env("GOOGLE_SHEETS_ID");
  const GOOGLE_SHEETS_RANGE = env("GOOGLE_SHEETS_RANGE", "scores!A:Z");

  const FIRESTORE_COLLECTION = env("FIRESTORE_COLLECTION", "scores");
  const SYNC_FIELD = env("SYNC_FIELD", "syncedToSheets");
  const SYNC_ALL = env("SCORE_SYNC_ALL", "0") === "1";
  const SCAN_LIMIT = parseInt(env("SCAN_LIMIT", "5000"), 10);

  const SHEETS_DEDUPE = env("SHEETS_DEDUPE", "1") === "1";
  const SHEETS_BATCH_SIZE = parseInt(env("SHEETS_BATCH_SIZE", "50"), 10);

  if (!GOOGLE_SERVICE_ACCOUNT_FILE) {
    throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_FILE (path to service-account json).");
  }
  if (!GOOGLE_SHEETS_ID) {
    throw new Error("Missing GOOGLE_SHEETS_ID (the long ID in the Google Sheets URL).");
  }

  const credsPath = path.resolve(GOOGLE_SERVICE_ACCOUNT_FILE);
  const creds = readJsonFromFile(credsPath);

  // Firestore Admin init (only initialize once)
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(creds),
    });
  }
  const db = admin.firestore();

  // Sheets API auth
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  console.log(`Firestore project: ${creds.project_id}`);
  console.log(`Firestore collection: ${FIRESTORE_COLLECTION}`);
  console.log(`Sheet ID: ${GOOGLE_SHEETS_ID}`);
  console.log(`Sheet range: ${GOOGLE_SHEETS_RANGE}`);
  console.log(`Sync field: ${SYNC_FIELD}`);
  console.log(`Sync all: ${SYNC_ALL ? "YES" : "NO"}`);
  console.log(`Scan limit: ${SCAN_LIMIT}`);
  console.log(`Dedupe: ${SHEETS_DEDUPE ? "YES" : "NO"} (uses syncKey in column A)`);
  console.log(`Sheets batch size: ${SHEETS_BATCH_SIZE}`);

  // 1) Load existing keys from sheet col A (for dedupe)
  const existingKeys = new Set();
  if (SHEETS_DEDUPE) {
    try {
      const readRes = await sheets.spreadsheets.values.get({
        spreadsheetId: GOOGLE_SHEETS_ID,
        range: GOOGLE_SHEETS_RANGE.replace(/!A:Z$/i, "!A:A"),
      });
      const values = readRes.data.values || [];
      for (const row of values) {
        const key = row?.[0];
        if (key && key !== "syncKey") existingKeys.add(String(key));
      }
      console.log(`Existing keys in sheet: ${existingKeys.size}`);
    } catch (e) {
      console.warn("Could not read existing keys from sheet (check tab name/range). Continuing without pre-read.");
    }
  }

  // 2) Fetch scores from Firestore
  const col = db.collection(FIRESTORE_COLLECTION);

  let snapshots = [];
  if (!SYNC_ALL) {
    try {
      const q = col.where(SYNC_FIELD, "==", false).limit(SCAN_LIMIT);
      const snap = await q.get();
      snapshots = snap.docs;
    } catch (e) {
      console.warn(`No usable query on ${SYNC_FIELD}==false. Falling back to scanning latest ${SCAN_LIMIT}...`);
    }
  }

  if (SYNC_ALL || snapshots.length === 0) {
    // Scan latest N
    const snap = await col.orderBy("date", "desc").limit(SCAN_LIMIT).get().catch(async () => {
      // If "date" isn't consistently sortable, fallback to __name__
      return await col.orderBy(admin.firestore.FieldPath.documentId()).limit(SCAN_LIMIT).get();
    });
    snapshots = snap.docs;
  }

  console.log(`Scores fetched from Firestore: ${snapshots.length}`);

  // 3) Build rows to append
  const rowsToAppend = [];
  const docsToMarkSynced = [];

  for (const doc of snapshots) {
    const d = doc.data() || {};

    // Expected fields based on your structure:
    // assignment, comments, date, level, link, name, score, studentcode
    const assignmentLabel = String(d.assignment || "").trim();
    const studentcode = String(d.studentcode || "").trim();
    const level = String(d.level || "").trim();
    const date = String(d.date || "").trim();
    const score = d.score ?? "";

    const assignmentId = parseAssignmentId(assignmentLabel);

    // Create a stable dedupe key
    // (studentcode + level + assignmentId + date) works well for your dashboard logic
    const syncKey = `${studentcode}__${level}__${assignmentId || assignmentLabel}__${date}`.toLowerCase();

    if (SHEETS_DEDUPE && existingKeys.has(syncKey)) {
      continue;
    }

    const createdAtIso = firestoreTimestampToIso(d.createdAt || d.created_at);
    const syncedAtIso = new Date().toISOString();

    rowsToAppend.push([
      syncKey, // A
      doc.id, // B
      studentcode, // C
      d.name || "", // D
      level, // E
      assignmentLabel, // F
      assignmentId, // G
      score, // H
      date, // I
      d.comments || "", // J
      d.link || "", // K
      createdAtIso, // L
      syncedAtIso, // M
    ]);

    docsToMarkSynced.push(doc.ref);
    if (SHEETS_DEDUPE) existingKeys.add(syncKey);
  }

  console.log(`Rows to append: ${rowsToAppend.length}`);

  if (rowsToAppend.length === 0) {
    console.log("No new scores to append (already synced or nothing found).");
    return;
  }

  // 4) Append in batches
  let appended = 0;
  for (let i = 0; i < rowsToAppend.length; i += SHEETS_BATCH_SIZE) {
    const batch = rowsToAppend.slice(i, i + SHEETS_BATCH_SIZE);
    await sheetsAppendWithRetry(sheets, GOOGLE_SHEETS_ID, GOOGLE_SHEETS_RANGE, batch);
    appended += batch.length;
    console.log(`Appended ${appended}/${rowsToAppend.length}...`);
  }

  // 5) Mark Firestore docs as synced (batch write)
  console.log(`Marking ${docsToMarkSynced.length} Firestore docs as synced...`);
  const batch = db.batch();
  for (const ref of docsToMarkSynced) {
    batch.update(ref, {
      [SYNC_FIELD]: true,
      syncedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  await batch.commit();

  console.log(`Done. Appended: ${rowsToAppend.length}, Marked synced: ${docsToMarkSynced.length}`);
}

main().catch((e) => {
  console.error("Sync failed:", e?.message || e);
  process.exit(1);
});
