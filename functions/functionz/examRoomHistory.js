"use strict";

const FINAL_MOCK_SOURCE = /^(a1|a2|b1|b2|c1|c2)_final_mock$/;
const DEFAULT_PAGE_SIZE = 200;
const MAX_RESULTS = 100;

const safeDateMillis = (value) => {
  const parsed = Date.parse(value || "");
  return Number.isFinite(parsed) ? parsed : 0;
};
const asFinite = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};
const validSection = (value) =>
  ["lesen", "hoeren", "schreiben", "sprechen", "mixed"].includes(value);

const normalizeExamRoomHistoryRow = (id, row = {}, requestedLevel = "") => {
  const source = String(row.source || "").toLowerCase();
  const isMock = FINAL_MOCK_SOURCE.test(source);
  if (source !== "exam_room_practice" && !isMock) return null;
  const level = String(row.level || "").toUpperCase();
  if (requestedLevel && level !== requestedLevel) return null;

  // Dedicated final-mock writers store mockAttemptId, score, scoreBreakdown and
  // sectionScores but do not store examSection, total or percent.
  const section = isMock ? "mixed" : String(row.examSection || "").toLowerCase();
  if (!validSection(section)) return null;
  const score = isMock
    ? asFinite(row.finalScore ?? row.score)
    : asFinite(row.rawScore ?? row.score);
  const total = isMock ? 100 : asFinite(row.total);
  const explicitPercent = asFinite(row.percent);
  if (score === null && explicitPercent === null) return null;
  if (!isMock && (total === null || total <= 0)) return null;
  const percent = explicitPercent !== null
    ? explicitPercent
    : (score / total) * 100;
  if (!Number.isFinite(percent)) return null;

  return {
    id,
    level,
    section,
    title: String(row.assignment || (isMock ? `${level} Final Mock Exam` : "Exam practice")),
    setId: String(row.setId || (isMock ? `${level.toLowerCase()}-final-mock` : "")),
    attemptId: String(row.examRoomAttemptId || row.mockAttemptId || id),
    attemptNumber: row.attemptNumber || row.attempt || 1,
    score,
    total,
    percent: Math.max(0, Math.min(100, percent)),
    completedAt: row.date || "",
    route: String(row.route || row.link || (isMock ? "/exams/mocks" : "/exams/overview")),
    sectionScores: row.sectionScores || {},
    scoreBreakdown: Array.isArray(row.scoreBreakdown) ? row.scoreBreakdown : [],
    resultType: isMock ? "final_mock" : "practice",
  };
};

const newestFirst = (a, b) =>
  safeDateMillis(b.completedAt) - safeDateMillis(a.completedAt) ||
  String(b.id).localeCompare(String(a.id));

const getStudentExamRoomHistory = async ({
  db, uid, level = "", pageSize = DEFAULT_PAGE_SIZE, maxResults = MAX_RESULTS,
} = {}) => {
  if (!db || !uid) throw new Error("Authenticated student identity is required.");
  const size = Math.min(Math.max(1, Math.floor(pageSize)), 500);
  const cap = Math.min(Math.max(1, Math.floor(maxResults)), 200);
  const scope = db.collection("scores").where("uid", "==", uid);
  let cursor = null;
  let newest = [];
  let fetched = 0;

  // Query all pages within this uid, then filter and cap. An unordered first
  // page cannot determine which of the student's exam records are newest.
  do {
    let query = scope.limit(size);
    if (cursor) query = query.startAfter(cursor);
    const snapshot = await query.get();
    const docs = snapshot.docs || [];
    fetched += docs.length;
    const page = docs.map((entry) =>
      normalizeExamRoomHistoryRow(entry.id, entry.data(), level)).filter(Boolean);
    newest = [...newest, ...page].sort(newestFirst).slice(0, cap + 1);
    if (docs.length < size) break;
    cursor = docs[docs.length - 1];
  } while (cursor);

  return {
    results: newest.slice(0, cap),
    limited: newest.length > cap,
    fetched,
  };
};

module.exports = {
  getStudentExamRoomHistory,
  normalizeExamRoomHistoryRow,
};
