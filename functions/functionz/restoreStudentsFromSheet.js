/* eslint-disable no-console */

const admin = require("firebase-admin");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const DEFAULT_HEADERS = [
  "name",
  "phone",
  "location",
  "level",
  "paid",
  "balance",
  "contractStart",
  "contractEnd",
  "studentCode",
  "email",
  "emergency",
  "status",
  "enrollDate",
  "className",
  "dailyLimit",
  "uid",
  "mode",
  "address",
  "enrollSent",
  "lastPaidRec",
  "balanceGrace",
  "remindLast",
  "remindCount",
];

const IMPORTANT_FIELDS = new Set([
  "name",
  "phone",
  "location",
  "level",
  "paid",
  "balance",
  "contractStart",
  "contractEnd",
  "studentCode",
  "email",
  "emergency",
  "status",
  "enrollDate",
  "className",
  "dailyLimit",
  "uid",
  "mode",
  "address",
]);

const HEADER_ALIASES = {
  name: ["name", "fullname", "studentname"],
  phone: ["phone", "phonenumber", "mobile"],
  location: ["location", "city", "town"],
  level: ["level", "cefr", "classlevel"],
  paid: ["paid", "amountpaid", "paidsofar"],
  balance: ["balance", "balancedue", "balanceowed"],
  contractStart: ["contractstart", "contractstartdate"],
  contractEnd: ["contractend", "contractenddate"],
  studentCode: ["studentcode", "student_code", "code"],
  email: ["email", "emailaddress"],
  emergency: ["emergency", "emergencycontact", "emergencyphone"],
  status: ["status"],
  enrollDate: ["enrolldate", "enroldate", "joinedat", "joindate"],
  className: ["classname", "class"],
  dailyLimit: ["dailylimit", "daily_limit"],
  uid: ["uid", "userid", "user_id"],
  mode: ["mode", "learningmode"],
  address: ["address", "homeaddress"],
};

function normalizeHeader(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[_-]/g, "");
}

function parseNumber(value) {
  if (value === null || value === undefined) return 0;
  const raw = String(value).replace(/[^0-9.-]/g, "");
  const num = parseFloat(raw);
  return Number.isFinite(num) ? num : 0;
}

function getServiceAccount() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (raw && raw.trim().startsWith("{")) {
    return JSON.parse(raw);
  }

  const b64 =
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64 ||
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON_B64;
  if (b64) {
    return JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
  }

  const svcPath =
    process.env.GOOGLE_SERVICE_ACCOUNT_FILE ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    "";
  if (svcPath && fs.existsSync(svcPath)) {
    return JSON.parse(fs.readFileSync(path.resolve(svcPath), "utf8"));
  }

  throw new Error(
    "Missing GOOGLE_SERVICE_ACCOUNT_JSON (or GOOGLE_SERVICE_ACCOUNT_JSON_B64/GOOGLE_SERVICE_ACCOUNT_FILE)."
  );
}

function initFirestore() {
  if (admin.apps.length) return admin.firestore();

  const serviceAccount = getServiceAccount();
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCLOUD_PROJECT ||
    serviceAccount.project_id;

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId,
  });

  return admin.firestore();
}

async function getSheetsClient() {
  const serviceAccount = getServiceAccount();
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
  }

  const auth = new google.auth.JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    projectId: serviceAccount.project_id,
  });

  return google.sheets({ version: "v4", auth });
}

function buildHeaderMap(headers) {
  const map = new Map();
  headers.forEach((header, idx) => {
    const key = normalizeHeader(header);
    if (key) map.set(key, idx);
  });
  return map;
}

function findHeaderIndex(headerMap, aliases) {
  for (const alias of aliases) {
    const key = normalizeHeader(alias);
    const idx = headerMap.get(key);
    if (idx !== undefined) return idx;
  }
  return null;
}

function detectHeaders(row) {
  const normalized = row.map((cell) => normalizeHeader(cell));
  const hasKey = (key) => normalized.includes(normalizeHeader(key));
  if (hasKey("studentCode") || hasKey("email") || hasKey("name")) {
    return row;
  }
  return null;
}

function buildRowObject(row, headerMap, headersFallback) {
  const data = {};

  if (headerMap) {
    for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
      const idx = findHeaderIndex(headerMap, aliases);
      if (idx !== null && idx < row.length) {
        data[field] = String(row[idx] ?? "").trim();
      }
    }
    return data;
  }

  headersFallback.forEach((header, idx) => {
    if (idx < row.length) {
      data[header] = String(row[idx] ?? "").trim();
    }
  });

  return data;
}

function mapStudentFields(raw) {
  const student = {};
  for (const field of IMPORTANT_FIELDS) {
    if (!(field in raw)) continue;
    const value = raw[field];

    if (["paid", "balance", "dailyLimit"].includes(field)) {
      student[field] = parseNumber(value);
    } else {
      student[field] = value;
    }
  }
  return student;
}

async function restoreStudents() {
  const sheetId = process.env.STUDENTS_SHEET_ID;
  const tabName = process.env.STUDENTS_SHEET_TAB || "students";
  const collectionName = process.env.FIRESTORE_COLLECTION || "students";
  const batchSize = parseInt(process.env.BATCH_SIZE || "400", 10);

  if (!sheetId) throw new Error("Missing STUDENTS_SHEET_ID env var.");

  const sheets = await getSheetsClient();
  const range = `${tabName}!A:W`;
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });

  const rows = res.data.values || [];
  if (!rows.length) {
    console.log("No rows found in sheet.");
    return;
  }

  const headerRow = detectHeaders(rows[0]);
  const headerMap = headerRow ? buildHeaderMap(headerRow) : null;
  const startIndex = headerRow ? 1 : 0;

  const db = initFirestore();
  let batch = db.batch();
  let batchCount = 0;
  let restored = 0;
  let skipped = 0;

  for (let i = startIndex; i < rows.length; i += 1) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const raw = buildRowObject(row, headerMap, DEFAULT_HEADERS);
    const mapped = mapStudentFields(raw);
    const studentCode = String(mapped.studentCode || "").trim();

    if (!studentCode) {
      skipped += 1;
      continue;
    }

    const docRef = db.collection(collectionName).doc(studentCode);
    batch.set(
      docRef,
      {
        ...mapped,
        restoredAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    batchCount += 1;
    restored += 1;

    if (batchCount >= batchSize) {
      await batch.commit();
      batch = db.batch();
      batchCount = 0;
    }
  }

  if (batchCount > 0) {
    await batch.commit();
  }

  console.log(`Restore complete. Restored: ${restored}, skipped: ${skipped}`);
}

restoreStudents().catch((err) => {
  console.error("Restore failed:", err);
  process.exitCode = 1;
});
