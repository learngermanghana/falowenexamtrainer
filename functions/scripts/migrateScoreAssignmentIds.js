#!/usr/bin/env node
/* eslint-disable no-console */
const admin = require("firebase-admin");
const { CURRICULUM_BY_LEVEL, normalizeLevel } = require("../data/curriculumManifest");

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

const PASS_MARK_DEFAULT = 60;
const CANONICAL_PATTERN = /^(A1|A2|B1|B2|C1|C2)-(\d+(?:\.\d+)?)$/i;

const normalizeScore = (value) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.+-]+/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const getValidCanonicalIdsForLevel = (level) =>
  new Set((CURRICULUM_BY_LEVEL[level] || []).map((entry) => entry.canonicalAssignmentId));

const collectCandidateChapterTokens = (value = "") => {
  const text = String(value || "").trim();
  if (!text) return [];

  const out = [];
  const add = (token) => {
    const normalized = String(token || "").trim();
    if (normalized && !out.includes(normalized)) out.push(normalized);
  };

  const canonicalMatch = text.match(CANONICAL_PATTERN);
  if (canonicalMatch?.[2]) add(canonicalMatch[2]);

  const levelExplicit = text.match(/\b(?:A1|A2|B1|B2|C1|C2)[\s-]*(\d+(?:\.\d+)?)\b/gi) || [];
  levelExplicit.forEach((match) => add(match.match(/(\d+(?:\.\d+)?)/)?.[1] || ""));

  const chapterExplicit = text.match(/\b(?:chapter|lektion|lesson|aufgabe|assignment|kapitel|id)\s*#?\s*(\d+(?:\.\d+)?)\b/gi) || [];
  chapterExplicit.forEach((match) => add(match.match(/(\d+(?:\.\d+)?)/)?.[1] || ""));

  const decimals = text.match(/\b\d+\.\d+\b/g) || [];
  decimals.forEach(add);

  const numerics = text.match(/\b\d+(?:\.\d+)?\b/g) || [];
  numerics.forEach(add);

  return out;
};

const resolveCanonicalId = ({ level, assignmentId, assignmentText }) => {
  const normalizedLevel = normalizeLevel(level || assignmentId || assignmentText);
  if (!normalizedLevel) return "";

  const validCanonicalIds = getValidCanonicalIdsForLevel(normalizedLevel);
  if (!validCanonicalIds.size) return "";

  const assignmentIdRaw = String(assignmentId || "").trim();
  if (assignmentIdRaw) {
    const idCandidates = collectCandidateChapterTokens(assignmentIdRaw);
    for (const token of idCandidates) {
      const canonical = `${normalizedLevel}-${token}`;
      if (validCanonicalIds.has(canonical)) return canonical;
    }
    return "";
  }

  const titleCandidates = collectCandidateChapterTokens(assignmentText);
  for (const token of titleCandidates) {
    const canonical = `${normalizedLevel}-${token}`;
    if (validCanonicalIds.has(canonical)) return canonical;
  }

  return "";
};

const migrateScores = async () => {
  const snapshot = await db.collection("scores").get();
  let updatedCount = 0;
  let skippedCount = 0;
  const changedDocs = [];

  for (const doc of snapshot.docs) {
    const data = doc.data() || {};
    const assignmentText = String(data.assignment || data.assignmentTitle || data.title || "").trim();
    const oldId = String(data.assignmentId || data.assignment_id || data.assignmentKey || "").trim();
    const canonicalId = resolveCanonicalId({
      level: data.level,
      assignmentId: oldId,
      assignmentText,
    });

    const score = normalizeScore(data.score);
    const passMark = Number.isFinite(Number(data.passMark)) ? Number(data.passMark) : PASS_MARK_DEFAULT;

    if (!canonicalId) {
      skippedCount += 1;
      console.warn("[migrateScoreAssignmentIds] unresolved row skipped", {
        docId: doc.id,
        level: data.level || "",
        assignmentText,
        oldId,
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
        assignmentIdResolver: "manifest-strict-v2",
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
    changedDocs.push({ docId: doc.id, from: oldId || "(empty)", to: canonicalId });
  }

  console.log("[migrateScoreAssignmentIds] Completed", {
    updatedCount,
    skippedCount,
    total: snapshot.size,
    changedDocs,
  });
};

migrateScores()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[migrateScoreAssignmentIds] Failed", error);
    process.exit(1);
  });
