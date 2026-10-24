#!/usr/bin/env node
/* eslint-disable no-console */
const admin = require("firebase-admin");
const { CURRICULUM_BY_LEVEL, normalizeLevel } = require("../data/curriculumManifest");

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

const CANONICAL_PATTERN = /^(A1|A2|B1|B2|C1|C2)-(\d+(?:\.\d+)?)$/i;

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

const repairScores = async () => {
  const snapshot = await db.collection("scores").get();
  const changes = [];
  let unresolved = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data() || {};
    const hadMigrationMarker = Boolean(data?.migration?.assignmentIdNormalizedAt || data?.migration?.assignmentIdResolver || data?.canonicalAssignmentKey);
    if (!hadMigrationMarker) continue;

    const assignmentText = String(data.assignment || data.assignmentTitle || data.title || "").trim();
    const currentId = String(data.assignmentId || data.assignment_id || data.assignmentKey || "").trim();

    const strictCanonicalId = resolveCanonicalId({
      level: data.level,
      assignmentId: currentId,
      assignmentText,
    }) || resolveCanonicalId({ level: data.level, assignmentId: "", assignmentText });

    if (!strictCanonicalId) {
      unresolved += 1;
      await doc.ref.set(
        {
          migration: {
            assignmentIdRepairAttemptedAt: admin.firestore.FieldValue.serverTimestamp(),
            assignmentIdRepairStatus: "unresolved",
            assignmentIdRepairResolver: "manifest-strict-v2",
          },
        },
        { merge: true }
      );
      continue;
    }

    if (currentId.toUpperCase() === strictCanonicalId) continue;

    await doc.ref.set(
      {
        assignmentId: strictCanonicalId,
        assignment_id: strictCanonicalId,
        assignmentKey: strictCanonicalId,
        canonicalAssignmentKey: strictCanonicalId,
        migration: {
          assignmentIdRepairAttemptedAt: admin.firestore.FieldValue.serverTimestamp(),
          assignmentIdRepairStatus: "corrected",
          assignmentIdRepairResolver: "manifest-strict-v2",
          assignmentIdRepairedFrom: currentId || "",
        },
      },
      { merge: true }
    );

    changes.push({ docId: doc.id, from: currentId || "(empty)", to: strictCanonicalId });
  }

  console.log("[repairScoreAssignmentIds] Completed", {
    correctedCount: changes.length,
    unresolved,
    changedDocs: changes,
  });
};

repairScores()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[repairScoreAssignmentIds] Failed", error);
    process.exit(1);
  });
