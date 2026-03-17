#!/usr/bin/env node
/* eslint-disable no-console */
const admin = require("firebase-admin");

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

const PASS_MARK_DEFAULT = 60;
const LEVEL_PATTERN = /(A1|A2|B1|B2|C1|C2)/i;
const CANONICAL_PATTERN = /^(A1|A2|B1|B2|C1|C2)-\d+(?:\.\d+)?$/i;

const normalizeLevel = (value = "") => {
  const match = String(value || "").trim().toUpperCase().match(LEVEL_PATTERN);
  return match?.[1] || "";
};

const normalizeScore = (value) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.+-]+/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const parseNumericToken = (value = "") => {
  const text = String(value || "").trim();
  if (!text) return "";

  const explicit = text.match(/\b(A1|A2|B1|B2|C1|C2)[\s-]*(\d+(?:\.\d+)?)\b/i);
  if (explicit?.[2]) return explicit[2];

  const numeric = text.match(/\b(\d+(?:\.\d+)?)\b/);
  return numeric?.[1] || "";
};

const toCanonicalAssignmentId = ({ level, assignmentId, assignmentText }) => {
  const normalizedLevel = normalizeLevel(level || assignmentId || assignmentText);
  const rawId = String(assignmentId || "").trim().toUpperCase();

  if (CANONICAL_PATTERN.test(rawId)) return rawId;

  const numericToken = parseNumericToken(assignmentId) || parseNumericToken(assignmentText);
  if (!normalizedLevel || !numericToken) return "";

  return `${normalizedLevel}-${numericToken}`;
};

const migrateScores = async () => {
  const snapshot = await db.collection("scores").get();
  let updatedCount = 0;
  let skippedCount = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data() || {};
    const assignmentText = String(data.assignment || data.assignmentTitle || data.title || "").trim();
    const oldId = String(data.assignmentId || data.assignment_id || data.assignmentKey || "").trim();
    const canonicalId = toCanonicalAssignmentId({
      level: data.level,
      assignmentId: oldId,
      assignmentText,
    });

    const score = normalizeScore(data.score);
    const passMark = Number.isFinite(Number(data.passMark)) ? Number(data.passMark) : PASS_MARK_DEFAULT;

    console.log({
      docId: doc.id,
      assignmentText,
      oldId,
      parsedId: oldId,
      canonicalId,
      score,
    });

    if (!canonicalId) {
      skippedCount += 1;
      console.warn("[migrateScoreAssignmentIds] Skipping row without canonical assignmentId", {
        docId: doc.id,
        assignmentText,
        oldId,
        score,
      });
      continue;
    }

    const passed = Number.isFinite(score) ? score >= passMark : Boolean(data.passed);
    const nextPatch = {
      assignmentId: canonicalId,
      assignment_id: canonicalId,
      assignmentKey: canonicalId,
      canonicalAssignmentKey: canonicalId,
      passMark,
      passed,
      migration: {
        assignmentIdNormalizedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
    };

    const isAlreadyNormalized =
      oldId.toUpperCase() === canonicalId &&
      String(data.assignment_id || "").trim().toUpperCase() === canonicalId &&
      String(data.assignmentKey || "").trim().toUpperCase() === canonicalId &&
      Number(data.passMark) === passMark &&
      data.passed === passed;

    if (isAlreadyNormalized) continue;

    await doc.ref.set(nextPatch, { merge: true });
    updatedCount += 1;
  }

  console.log("[migrateScoreAssignmentIds] Completed", {
    updatedCount,
    skippedCount,
    total: snapshot.size,
  });
};

migrateScores()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[migrateScoreAssignmentIds] Failed", error);
    process.exit(1);
  });
