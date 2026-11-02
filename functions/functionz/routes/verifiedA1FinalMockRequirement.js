"use strict";

const REQUIRED_MOCK_ID = "A1-FINAL-MOCK";
const REQUIRED_MOCK_SOURCE = "a1_final_mock";
const REQUIRED_MOCK_MODULES = ["lesen", "hoeren", "schreiben", "sprechen"];
const clean = (value) => String(value ?? "").trim();
const upper = (value) => clean(value).toUpperCase();
const lower = (value) => clean(value).toLowerCase();

const isVerifiedA1FinalMockScore = (row = {}, { studentCode = "", uid = "" } = {}) => {
  if (upper(row.assignmentId || row.assignment_id) !== REQUIRED_MOCK_ID) return false;
  if (clean(row.source) !== REQUIRED_MOCK_SOURCE) return false;
  if (row.mockId !== "a1-mock-01") return false;
  if (row.firstAttempt !== true || Number(row.attempt) !== 1) return false;
  if (row.level && upper(row.level) !== "A1") return false;
  if (studentCode && lower(row.studentCode || row.studentcode) !== lower(studentCode)) return false;
  if (uid && row.uid && clean(row.uid) !== clean(uid)) return false;
  const modules = new Set(Array.isArray(row.scoredModules) ? row.scoredModules : []);
  if (!REQUIRED_MOCK_MODULES.every(module => modules.has(module))) return false;
  const score = Number(row.score);
  return Number.isFinite(score) && score >= 0 && score <= 100;
};

const loadVerifiedA1FinalMockScore = async ({ db, studentCode, uid } = {}) => {
  if (!db || !clean(studentCode)) return null;
  // The mock is written to Firestore scores, not necessarily mirrored to the
  // published Google score CSV. Only its server-verified first attempt counts.
  const snap = await db.collection("scores").where("studentCode", "==", clean(studentCode)).get();
  const verified = snap.docs.map(doc => doc.data() || {}).filter(
    row => isVerifiedA1FinalMockScore(row, { studentCode, uid }),
  );
  if (!verified.length) return null;
  verified.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  const row = verified[0];
  return {
    assignment: "A1 Final Mock Exam",
    identifier: REQUIRED_MOCK_ID,
    score: Number(row.score),
    dateRaw: clean(row.date),
    dateMs: Date.parse(row.date) || 0,
    level: "A1",
    comments: clean(row.comments),
    link: "/campus/course/a1-final-mock-exam",
  };
};

module.exports = { REQUIRED_MOCK_ID, isVerifiedA1FinalMockScore, loadVerifiedA1FinalMockScore };
