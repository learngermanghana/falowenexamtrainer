#!/usr/bin/env node

/*
 * Upload a versioned answer dictionary to Cloud Storage and register
 * only lightweight metadata in Firestore.
 *
 * Usage:
 * node scripts/upsertAnswerKeyRegistryEntry.js \
 *   --assignmentKey A1-DAY-1 \
 *   --file ./answer-keys/a1-day-1.json \
 *   --version 1 \
 *   --format json
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


const resolveBucketName = () => {
  const explicit = args.bucket || process.env.ANSWER_KEY_BUCKET || process.env.FIREBASE_STORAGE_BUCKET;
  if (explicit) return String(explicit).trim();

  try {
    const configRaw = process.env.FIREBASE_CONFIG;
    if (!configRaw) return "";
    const config = JSON.parse(configRaw);
    if (config?.storageBucket) return String(config.storageBucket).trim();
    if (config?.projectId) return `${String(config.projectId).trim()}.appspot.com`;
  } catch (error) {
    // ignore malformed FIREBASE_CONFIG and fall back to empty
  }

  return process.env.GCLOUD_PROJECT ? `${String(process.env.GCLOUD_PROJECT).trim()}.appspot.com` : "";
};

const required = ["assignmentKey", "file", "version"];
const missing = required.filter((k) => !args[k]);
if (missing.length) {
  console.error(`Missing required args: ${missing.join(", ")}`);
  process.exit(1);
}

const assignmentKey = String(args.assignmentKey).trim().toUpperCase();
const filePath = path.resolve(process.cwd(), String(args.file));
const version = Number(args.version);
const format = String(args.format || "json").trim().toLowerCase();

if (!Number.isInteger(version) || version <= 0) {
  console.error("--version must be a positive integer");
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

const fileBuffer = fs.readFileSync(filePath);
const checksum = crypto.createHash("sha256").update(fileBuffer).digest("hex");

const bucketName = resolveBucketName();
if (!bucketName) {
  console.error("Missing storage bucket. Provide --bucket <bucket-name> or set ANSWER_KEY_BUCKET/FIREBASE_STORAGE_BUCKET.");
  process.exit(1);
}

if (!admin.apps.length) admin.initializeApp({ storageBucket: bucketName });

const db = admin.firestore();
const bucket = admin.storage().bucket(bucketName);
const ext = path.extname(filePath) || (format === "json" ? ".json" : "");
const objectPath = `answer-keys/${assignmentKey}/v${version}${ext}`;

async function run() {
  await bucket.file(objectPath).save(fileBuffer, {
    resumable: false,
    metadata: {
      contentType: format === "json" ? "application/json" : "application/octet-stream",
      metadata: {
        assignmentKey,
        version: String(version),
        checksum,
      },
    },
  });

  const gsUrl = `gs://${bucket.name}/${objectPath}`;
  const now = admin.firestore.FieldValue.serverTimestamp();

  const registryDoc = {
    assignmentKey,
    answerUrl: gsUrl,
    format,
    version,
    checksum,
    isActive: true,
    updatedAt: now,
  };

  const versionDoc = {
    assignmentKey,
    answerUrl: gsUrl,
    format,
    version,
    checksum,
    createdAt: now,
  };

  await db.collection(REGISTRY_COLLECTION).doc(assignmentKey).set(registryDoc, { merge: true });
  await db.collection(VERSION_COLLECTION).doc(`${assignmentKey}__v${version}`).set(versionDoc, { merge: true });

  console.log(`✅ Uploaded dictionary to ${gsUrl}`);
  console.log(`✅ Upserted ${REGISTRY_COLLECTION}/${assignmentKey}`);
  console.log(`✅ Upserted ${VERSION_COLLECTION}/${assignmentKey}__v${version}`);
}

run().catch((error) => {
  console.error("Failed to upsert answer-key registry entry:", error);
  process.exit(1);
});
