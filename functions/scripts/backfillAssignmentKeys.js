#!/usr/bin/env node
/* eslint-disable no-console */
const admin = require("firebase-admin");

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

const normalizeLevel = (level) => {
  const token = String(level || "").trim().toUpperCase();
  return /^(A1|A2|B1|B2|C1|C2)$/.test(token) ? token : "";
};

const normalizeAssignmentToken = (value) =>
  String(value || "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/_/g, "-")
    .replace(/[^a-z0-9.-]/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toUpperCase();

const normalizeTitleToken = (value) =>
  String(value || "")
    .trim()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toUpperCase();

const toCanonicalAssignmentKey = ({ level, assignmentId, assignmentTitle }) => {
  const normalizedLevel = normalizeLevel(level);
  const idToken = normalizeAssignmentToken(assignmentId);
  if (idToken) {
    if (/^(A1|A2|B1|B2|C1|C2)-/i.test(idToken)) return idToken.toUpperCase();
    if (normalizedLevel) return `${normalizedLevel}-${idToken}`;
    return idToken;
  }

  const title = String(assignmentTitle || "").trim();
  if (!title || !normalizedLevel) return "";
  const dayTaskMatch = title.match(/\bday\s*(\d+)\b[^\n\r]*?\btask\s*(\d+)\b/i);
  if (dayTaskMatch?.[1] && dayTaskMatch?.[2]) return `${normalizedLevel}-DAY-${dayTaskMatch[1]}-TASK-${dayTaskMatch[2]}`;
  const dayMatch = title.match(/\bday\s*(\d+)\b/i);
  if (dayMatch?.[1]) return `${normalizedLevel}-DAY-${dayMatch[1]}`;
  return `${normalizedLevel}-TITLE-${normalizeTitleToken(title)}`;
};

const backfillCollection = async (collectionName) => {
  const snapshot = await db.collection(collectionName).get();
  let updated = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data() || {};
    if (data.assignmentKey) continue;

    const assignmentKey = toCanonicalAssignmentKey({
      level: data.level,
      assignmentId: data.assignmentId || data.assignment_id || data.canonicalAssignmentKey,
      assignmentTitle: data.assignmentTitle || data.assignment || data.title,
    });

    if (!assignmentKey) continue;

    await doc.ref.set(
      {
        assignmentKey,
        canonicalAssignmentKey: assignmentKey,
        migration: {
          assignmentKeyBackfilledAt: admin.firestore.FieldValue.serverTimestamp(),
        },
      },
      { merge: true }
    );
    updated += 1;
  }

  return updated;
};

(async () => {
  const targets = ["submissions", "submissionDrafts", "scores"];
  for (const name of targets) {
    const count = await backfillCollection(name);
    console.log(`${name}: updated ${count} documents`);
  }
  process.exit(0);
})().catch((error) => {
  console.error("Assignment key backfill failed", error);
  process.exit(1);
});
