"use strict";

// Staff-only projection of existing learner mock attempts. Never return
// question answers, transcripts, writing responses, or other raw state.
const MOCK_PARENTS = Object.freeze({
  a1MockExamUsers: "A1",
  a2MockExamUsers: "A2",
  b1MockExamUsers: "B1",
});
const SECTIONS = ["lesen", "hoeren", "schreiben", "sprechen"];
// Mock attempts contain private student metadata. Only server-verified admin/tutor
// claims and the owner account may access the monitoring projection.
const isAuthorizedMockMonitor = (identity = {}) => {
  if (!identity?.uid) return false;
  const email = String(identity.email || "").trim().toLowerCase();
  const role = String(identity.role || "").trim().toLowerCase();
  return identity.admin === true || role === "admin" || role === "tutor" ||
    email === "moxflex@gmail.com";
};
const toMillis = value => {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value.toDate === "function") return value.toDate().getTime();
  if (Number.isFinite(value.seconds)) return value.seconds * 1000;
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
};
const iso = value => {
  const ms = toMillis(value);
  return ms ? new Date(ms).toISOString() : null;
};
const normalizeMockAttempt = doc => {
  const path = String(doc.ref?.path || "");
  const parts = path.split("/");
  if (parts.length !== 4 || parts[2] !== "attempts") return null;
  const level = MOCK_PARENTS[parts[0]];
  if (!level) return null;
  const data = doc.data() || {};
  const scores = data.sectionScores || {};
  const completedSections = SECTIONS.filter(section =>
    scores[section] !== undefined && scores[section] !== null && Number.isFinite(Number(scores[section]))
  );
  const state = data.state && typeof data.state === "object" ? data.state : {};
  const deadline = Number(state.sectionDeadlineMs);
  const mockId = String(data.mockId || (level.toLowerCase() + "-mock-01")).slice(0, 80);
  return {
    id: level + ":" + parts[1] + ":" + doc.id,
    uid: String(data.uid || parts[1]),
    studentEmail: String(data.email || "").slice(0, 200),
    level,
    mockId,
    attemptNumber: Number(data.attemptNumber || 1),
    status: data.status === "completed" ? "completed" : "in_progress",
    section: String(data.section || state.stage || "intro").toLowerCase(),
    completedSections,
    progressCount: completedSections.length,
    totalSections: 4,
    sectionDeadlineMs: Number.isFinite(deadline) && deadline > 0 ? deadline : null,
    startedAt: iso(data.startedAt),
    updatedAt: iso(data.updatedAt),
    completedAt: iso(data.completedAt),
    overallScore: data.status === "completed" && Number.isFinite(Number(data.verifiedOverall?.score))
      ? Number(data.verifiedOverall.score) : null,
  };
};

async function fallbackByParent(db) {
  const rows = [];
  // No collection-group index required: legacy attempts are nested by student.
  for (const parent of Object.keys(MOCK_PARENTS)) {
    const users = await db.collection(parent).limit(120).get();
    const snapshots = await Promise.all(users.docs.map(user =>
      user.ref.collection("attempts").orderBy("updatedAt", "desc").limit(3).get()
    ));
    for (const snapshot of snapshots) rows.push(...snapshot.docs);
  }
  return rows;
}

const normalizeBrowserProgress = doc => {
  const row = doc.data() || {};
  if (row.mockId !== "a2-mock-02" || !row.uid) return null;
  const completedSections = SECTIONS.filter(section => Array.isArray(row.completedSections) && row.completedSections.includes(section));
  const deadline = Number(row.sectionDeadlineMs);
  return {
    id: "A2:" + row.uid + ":mock-02", uid: String(row.uid),
    studentEmail: String(row.email || "").slice(0, 200),
    level: "A2", mockId: "a2-mock-02", attemptNumber: 1,
    status: row.status === "completed" ? "completed" : "in_progress",
    section: String(row.section || "intro"), completedSections,
    progressCount: completedSections.length, totalSections: 4,
    sectionDeadlineMs: Number.isFinite(deadline) && deadline > 0 ? deadline : null,
    startedAt: iso(row.startedAt), updatedAt: iso(row.updatedAt),
    completedAt: iso(row.completedAt), overallScore: null,
    progressSource: "browser_reported",
  };
};

async function listMockAttempts(db, { limit = 200 } = {}) {
  let documents;
  let partial = false;
  try {
    // The server uses its existing Admin SDK permissions; only this sanitized
    // result is exposed to authenticated staff, never the source documents.
    const snap = await db.collectionGroup("attempts").orderBy("updatedAt", "desc").limit(700).get();
    documents = snap.docs;
    partial = snap.size === 700;
  } catch (error) {
    // Some older Firebase projects have not enabled a collection-group index.
    documents = await fallbackByParent(db);
    partial = true;
  }
  let browserAttempts = [];
  if (typeof db.collection === "function") {
    try {
      const browserSnap = await db.collection("mockProgressMonitor").limit(250).get();
      browserAttempts = browserSnap.docs.map(normalizeBrowserProgress).filter(Boolean);
      if (browserSnap.size === 250) partial = true;
    } catch (error) {
      partial = true;
    }
  }
  const attempts = [...documents.map(normalizeMockAttempt), ...browserAttempts]
    .filter(Boolean)
    .sort((a, b) => toMillis(b.updatedAt || b.startedAt) - toMillis(a.updatedAt || a.startedAt))
    .slice(0, Math.min(500, Math.max(1, Number(limit) || 200)));
  return { attempts, partial };
}

module.exports = { listMockAttempts, normalizeMockAttempt, normalizeBrowserProgress, isAuthorizedMockMonitor };
