"use strict";

const COLLECTIONS = Object.freeze({ A1: "a1MockExamUsers", A2: "a2MockExamUsers", B1: "b1MockExamUsers" });
const safeText = (value, max = 8000) => String(value ?? "").slice(0, max);

const writingAuditRecord = ({ level, attemptId, answers = {}, result = {}, source }) => ({
  version: 1,
  level,
  attemptId,
  source,
  savedAt: new Date().toISOString(),
  answers: Object.fromEntries(Object.entries(answers).map(([key, value]) => [key, typeof value === "string" ? safeText(value) : JSON.parse(JSON.stringify(value ?? null))])),
  score: Number(result.score) || 0,
  maxScore: Number(result.maxScore) || 25,
  // Store the actual assessment breakdown for staff verification rather than
  // trying to reconstruct a grade from the total later.
  marking: JSON.parse(JSON.stringify(result)),
});

async function saveMockWritingReview({ db, level, uid, attemptId, answers, result, source }) {
  const parent = COLLECTIONS[level];
  if (!parent || !uid || !attemptId || !db) throw new Error("Invalid mock writing review");
  const ref = db.collection(parent).doc(uid).collection("attempts").doc(attemptId);
  // update() never creates a phantom attempt: verification must already have succeeded.
  await ref.update({ writingReview: writingAuditRecord({ level, attemptId, answers, result, source }) });
}

const parseReviewId = (value) => {
  const parts = safeText(value, 400).split(":");
  if (parts.length !== 3 || !COLLECTIONS[parts[0]] ||
      parts.slice(1).some(part => !part || part.includes("/") || part.includes(".."))) return null;
  return { level: parts[0], uid: parts[1], attemptId: parts[2], collection: COLLECTIONS[parts[0]] };
};

async function getMockWritingReview(db, identifier) {
  const parsed = parseReviewId(identifier);
  if (!parsed) return null;
  const snap = await db.collection(parsed.collection).doc(parsed.uid).collection("attempts").doc(parsed.attemptId).get();
  if (!snap.exists) return null;
  const data = snap.data() || {};
  if (!data.writingReview) return { status: "not_recorded", attemptId: parsed.attemptId, level: parsed.level };
  return {
    status: "saved",
    level: parsed.level,
    mockId: safeText(data.mockId, 80),
    attemptId: parsed.attemptId,
    submittedAt: data.writingReview.savedAt,
    answers: data.writingReview.answers,
    score: data.writingReview.score,
    maxScore: data.writingReview.maxScore,
    marking: data.writingReview.marking,
    source: data.writingReview.source,
  };
}
module.exports = { writingAuditRecord, saveMockWritingReview, parseReviewId, getMockWritingReview };
