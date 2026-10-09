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
    studentName: nameFromStudent(data),
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
    studentName: nameFromStudent(row),
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

// Names come from the private student directory, not from exam answers.
const usableName = value => {
  const name = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
  return name && !name.includes("@") ? name.slice(0, 160) : "";
};
const nameFromStudent = data => {
  if (!data || typeof data !== "object") return "";
  const combined = [data.firstName, data.lastName].filter(Boolean).join(" ");
  return [data.name, data.fullName, data.studentName, data.displayName, combined]
    .map(usableName).find(Boolean) || "";
};
const normalizedEmail = email => String(email || "").trim().toLowerCase();
const inBatches = (values, size) =>
  Array.from({ length: Math.ceil(values.length / size) }, (_, index) =>
    values.slice(index * size, (index + 1) * size));

// Resolve only students represented in this page of attempts. Batch indexed
// uid/email lookups rather than downloading the entire student directory or
// exposing student records to the browser. Keep identity enrichment best-effort.
async function enrichStudentNames(db, rows) {
  const missing = rows.filter(row => !row.studentName);
  if (!missing.length || typeof db.collection !== "function") return rows;
  let students;
  try { students = db.collection("students"); } catch { return rows; }
  if (!students || typeof students.where !== "function") return rows;

  const uids = [...new Set(missing.map(row => String(row.uid || "").trim()).filter(Boolean))];
  const emails = [...new Set(missing.map(row => normalizedEmail(row.studentEmail)).filter(Boolean))];
  const wantedUids = new Set(uids);
  const wantedEmails = new Set(emails);
  const namesByUid = new Map();
  const namesByEmail = new Map();
  const collect = snapshot => {
    if (!snapshot || typeof snapshot.data !== "function") return;
    const data = snapshot.data() || {};
    const name = nameFromStudent(data);
    if (!name) return;
    for (const uid of [snapshot.id, data.uid, data.userId, data.authUid]) {
      const key = String(uid || "").trim();
      if (wantedUids.has(key)) namesByUid.set(key, name);
    }
    const email = normalizedEmail(data.email);
    if (wantedEmails.has(email)) namesByEmail.set(email, name);
  };
  const batchLookup = async (field, values) => {
    if (!values.length) return;
    await Promise.all(inBatches(values, 30).map(async batch => {
      try {
        const snapshot = await students.where(field, "in", batch).get();
        for (const doc of snapshot.docs || []) collect(doc);
      } catch {
        // A profile lookup must not prevent an authorized monitor from loading.
      }
    }));
  };
  await Promise.all([batchLookup("uid", uids), batchLookup("email", emails)]);

  // Some legacy profiles are keyed directly by Firebase UID but have no uid
  // field. Read just those document IDs as a bounded fallback.
  const unmatched = uids.filter(uid => !namesByUid.has(uid));
  if (unmatched.length && typeof db.getAll === "function" && typeof students.doc === "function") {
    await Promise.all(inBatches(unmatched, 100).map(async batch => {
      try {
        const snapshots = await db.getAll(...batch.map(uid => students.doc(uid)));
        for (const doc of snapshots) if (doc?.exists) collect(doc);
      } catch {
        // Keep email or attempt-name fallback when a legacy record is missing.
      }
    }));
  }

  return rows.map(row => ({
    ...row,
    studentName: row.studentName ||
      namesByUid.get(String(row.uid || "").trim()) ||
      namesByEmail.get(normalizedEmail(row.studentEmail)) || "",
  }));
}

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
  return { attempts: await enrichStudentNames(db, attempts), partial };
}

module.exports = { listMockAttempts, normalizeMockAttempt, normalizeBrowserProgress, isAuthorizedMockMonitor, nameFromStudent, enrichStudentNames };
