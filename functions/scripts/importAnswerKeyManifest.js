#!/usr/bin/env node

/**
 * One-shot import of a full answer manifest file (like the JSON you pasted)
 * into Firestore answerKeyRegistry (+ optional version history and storage blobs).
 *
 * Usage:
 * node scripts/importAnswerKeyManifest.js \
 *   --file ./data/answerKeyManifest.json \
 *   --version 1 \
 *   --includeAnswers true
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const admin = require("firebase-admin");

const REGISTRY_COLLECTION = "answerKeyRegistry";
const VERSION_COLLECTION = "answerKeyRegistryVersions";

const args = process.argv.slice(2).reduce((acc, arg, index, arr) => {
  if (!arg.startsWith("--")) return acc;
  const key = arg.replace(/^--/, "");
  const next = arr[index + 1];
  if (!next || next.startsWith("--")) acc[key] = true;
  else acc[key] = next;
  return acc;
}, {});

const filePath = path.resolve(process.cwd(), String(args.file || "./data/answerKeyManifest.json"));
const version = Number(args.version || 1);
const includeAnswers = String(args.includeAnswers || "true").toLowerCase() !== "false";

if (!Number.isInteger(version) || version <= 0) {
  console.error("--version must be a positive integer");
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error(`Manifest file not found: ${filePath}`);
  process.exit(1);
}

const raw = fs.readFileSync(filePath, "utf8");
let parsed;
try {
  parsed = JSON.parse(raw);
} catch (error) {
  console.error(`Invalid JSON in ${filePath}:`, error.message);
  process.exit(1);
}

if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
  console.error("Manifest must be a JSON object keyed by assignment title.");
  process.exit(1);
}

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();
const bucket = admin.storage().bucket();
const now = admin.firestore.FieldValue.serverTimestamp();

const toCanonicalAssignmentKey = (value) =>
  String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[\s_]+/g, "-");

const getPreferredUrl = (entry) => entry.answer_url || entry.answerUrl || entry.sheet_url || entry.sheetUrl || null;

async function upsertOne(sourceTitle, entry) {
  if (!entry || typeof entry !== "object") return { skipped: true, reason: "invalid entry" };

  const assignmentId = entry.assignment_id || entry.assignmentId || "";
  const assignmentKey = toCanonicalAssignmentKey(assignmentId || sourceTitle);
  if (!assignmentKey) return { skipped: true, reason: "missing assignment key" };

  const payload = entry.answers || null;
  let answerUrl = getPreferredUrl(entry);
  let checksum = null;

  if (includeAnswers && payload && typeof payload === "object") {
    const buffer = Buffer.from(JSON.stringify(payload, null, 2), "utf8");
    checksum = crypto.createHash("sha256").update(buffer).digest("hex");
    const objectPath = `answer-keys/${assignmentKey}/v${version}.json`;

    await bucket.file(objectPath).save(buffer, {
      resumable: false,
      metadata: {
        contentType: "application/json",
        metadata: {
          assignmentKey,
          version: String(version),
          checksum,
        },
      },
    });

    answerUrl = `gs://${bucket.name}/${objectPath}`;
  }

  const registryDoc = {
    assignmentKey,
    assignmentId: assignmentId || assignmentKey,
    sourceTitle,
    answerUrl: answerUrl || null,
    format: entry.format || "objective",
    version,
    checksum,
    isActive: true,
    updatedAt: now,
  };

  const versionDoc = {
    assignmentKey,
    assignmentId: assignmentId || assignmentKey,
    sourceTitle,
    answerUrl: answerUrl || null,
    format: entry.format || "objective",
    version,
    checksum,
    createdAt: now,
  };

  await db.collection(REGISTRY_COLLECTION).doc(assignmentKey).set(registryDoc, { merge: true });
  await db.collection(VERSION_COLLECTION).doc(`${assignmentKey}__v${version}`).set(versionDoc, { merge: true });

  return { skipped: false, assignmentKey, answerUrl, uploadedAnswers: Boolean(includeAnswers && payload) };
}

async function run() {
  const entries = Object.entries(parsed);
  const results = [];

  for (const [sourceTitle, entry] of entries) {
    // eslint-disable-next-line no-await-in-loop
    const result = await upsertOne(sourceTitle, entry);
    results.push(result);
  }

  const skipped = results.filter((r) => r.skipped).length;
  const imported = results.length - skipped;
  const uploaded = results.filter((r) => r.uploadedAnswers).length;

  console.log(`✅ Imported ${imported}/${results.length} entries into ${REGISTRY_COLLECTION}`);
  console.log(`✅ Uploaded ${uploaded} answer payload files to Cloud Storage`);
  if (skipped) console.log(`⚠️ Skipped ${skipped} invalid entries`);
}

run().catch((error) => {
  console.error("Failed to import answer key manifest:", error);
  process.exit(1);
});
