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
// The completed attempt already holds authoritative /25 scores from the
// server-side A1/A2/B1 completion verifier. Never expose browser-submitted
// in-progress scores as staff-verified results.
const verifiedScore = value => {
  if (value === null || value === undefined || value === "" || typeof value === "boolean") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 25 ? parsed : null;
};
const hasVerifiedOverall = data => {
  const value = data?.verifiedOverall?.score;
  return data?.status === "completed" && value !== null && value !== undefined
    && value !== "" && typeof value !== "boolean" && Number.isFinite(Number(value))
    && Number(value) >= 0 && Number(value) <= 100;
};
const verifiedMockBreakdown = data => {
  if (!hasVerifiedOverall(data)) return null;
  const source = data.verifiedSectionScores && typeof data.verifiedSectionScores === "object"
    ? data.verifiedSectionScores
    : data.sectionScores && typeof data.sectionScores === "object"
      ? data.sectionScores // Historical completed attempts with a verified total.
      : {};
  return Object.fromEntries(SECTIONS.map(section => [section, verifiedScore(source[section])]));
};

// Historic mock results are saved separately in /scores when completion sync
// succeeds. Recover skills only from those server-published final-mock records,
// never from unverified browser progress or an arbitrary overall score.
const MOCK_SCORE_SOURCES = Object.freeze({A1:"a1_final_mock",A2:"a2_final_mock",B1:"b1_final_mock"});
const SCORE_LOOKUP_LIMIT = 60;
const scoreLookupCache = new Map(); // bounded in-memory, avoids new cloud reads on every staff poll
const cacheDuration = result => result ? 10 * 60 * 1000 : 60 * 1000;
const readScoreCache = key => {
  const item=scoreLookupCache.get(key);
  if (!item) return undefined;
  if (item.until < Date.now()) {scoreLookupCache.delete(key);return undefined;}
  return item.value;
};
const cacheScore = (key,result) => {
  if (scoreLookupCache.size >= 250) scoreLookupCache.delete(scoreLookupCache.keys().next().value);
  scoreLookupCache.set(key,{value:result,until:Date.now()+cacheDuration(result)});
};
const verifiedFinalMockScore = (attempt, scoreDoc = {}) => {
  if (attempt?.status !== "completed" || attempt.progressSource === "browser_reported") return null;
  const [,uid,attemptId]=String(attempt.id||"").split(":");
  if (!uid || !attemptId || scoreDoc.uid !== uid ||
      scoreDoc.mockAttemptId !== attemptId || scoreDoc.level !== attempt.level ||
      scoreDoc.source !== MOCK_SCORE_SOURCES[attempt.level] ||
      (scoreDoc.mockId && scoreDoc.mockId !== attempt.mockId)) return null;
  const breakdown = Array.isArray(scoreDoc.scoreBreakdown) ? Object.fromEntries(
    scoreDoc.scoreBreakdown.map(part=>[part?.key,part?.score])) : {};
  const recorded=scoreDoc.sectionScores && typeof scoreDoc.sectionScores === "object"
    ? scoreDoc.sectionScores : breakdown;
  const sections=Object.fromEntries(SECTIONS.map(section=>[section,verifiedScore(recorded[section])]));
  if (SECTIONS.some(section=>sections[section] === null)) return null;
  const total=Number(scoreDoc.score ?? scoreDoc.finalScore);
  const sum=Number(SECTIONS.reduce((n,section)=>n+sections[section],0).toFixed(1));
  if (!Number.isFinite(total) || total < 0 || total > 100 || Math.abs(total-sum) > 0.11) return null;
  // A missing section in a historical attempt may be restored, but a saved
  // verified overall must agree with the separately published result.
  if (attempt.overallScore !== null && Math.abs(attempt.overallScore-total)>0.11) return null;
  return {total,sections};
};
const needsPublishedScore = attempt => attempt.status === "completed" &&
  attempt.progressSource !== "browser_reported" &&
  (attempt.overallScore === null || !attempt.sectionScores ||
    SECTIONS.some(section=>attempt.sectionScores[section] === null || attempt.sectionScores[section] === undefined));
const applyPublishedScore = (attempt,score) => score ? {
  ...attempt,overallScore:attempt.overallScore === null ? score.total : attempt.overallScore,
  sectionScores:score.sections,scoreSource:"published_final_result"
} : attempt;
const scoreIdentityKey = row=>row.id;
const inBatchesOf = (array,size) => Array.from({length:Math.ceil(array.length/size)},(_,index)=>array.slice(index*size,(index+1)*size));
async function enrichPublishedMockScores(db, attempts=[],sourceDocs=[]) {
  const missing=attempts.filter(needsPublishedScore).slice(0,SCORE_LOOKUP_LIMIT);
  if (!missing.length || typeof db.collection !== "function") return attempts;
  const originals=new Map(sourceDocs.map(doc=>{
    const row=normalizeMockAttempt(doc);return row ? [row.id,doc.data()||{}] : [null,null];
  }).filter(([id])=>id));
  const resolved=new Map();
  for(const attempt of missing) {
    const value=readScoreCache(scoreIdentityKey(attempt));
    if(value !== undefined) resolved.set(attempt.id,value);
  }
  let pending=missing.filter(row=>!resolved.has(row.id));
  // Prefer the exact score document pointer published at completion.
  if(pending.length && typeof db.getAll==="function") {
    const pointable=pending.map(row=>({row,docId:originals.get(row.id)?.completionSync?.scoreDocId}))
      .filter(item=>typeof item.docId==="string" && item.docId.length<=220 && /^[a-zA-Z0-9_-]+$/.test(item.docId));
    for(const batch of inBatchesOf(pointable,50)) {
      try {
        const refs=batch.map(item=>db.collection("scores").doc(item.docId));
        const snapshots=await db.getAll(...refs);
        snapshots.forEach((doc,i)=>{
          const result=doc?.exists ? verifiedFinalMockScore(batch[i].row,doc.data()||{}) : null;
          if(result) resolved.set(batch[i].row.id,result);
        });
      } catch (_error) { /* Older Firestore deployments may lack getAll; try indexed lookup. */ }
    }
  }
  pending=pending.filter(row=>!resolved.has(row.id));
  // One bounded indexed lookup for older attempts without a scoreDocId.
  // Match UID + level + mockAttemptId + trusted source before using any marks.
  if(pending.length) {
    const byAttemptId=new Map();
    for (const row of pending) {
      const attemptId=row.id.split(":").slice(2).join(":");
      if(!byAttemptId.has(attemptId))byAttemptId.set(attemptId,[]);
      byAttemptId.get(attemptId).push(row);
    }
    for(const batch of inBatchesOf([...byAttemptId.keys()],30)) {
      try {
        const snap=await db.collection("scores").where("mockAttemptId","in",batch).get();
        for(const doc of snap.docs||[]) {
          const candidates=byAttemptId.get(doc.data()?.mockAttemptId)||[];
          for(const row of candidates) {
            const score=verifiedFinalMockScore(row,doc.data()||{});
            if(score) resolved.set(row.id,score);
          }
        }
      }catch (_error) { /* No verified fallback; never invent section marks. */ }
    }
  }
  for (const row of missing) if(!scoreLookupCache.has(row.id) || !resolved.has(row.id)) {
    cacheScore(row.id,resolved.get(row.id)||null);
  }
  return attempts.map(row=>applyPublishedScore(row,resolved.get(row.id) ?? readScoreCache(row.id)));
}

const normalizeMockAttempt = doc => {
  const path = String(doc.ref?.path || "");
  const parts = path.split("/");
  if (parts.length !== 4 || parts[2] !== "attempts") return null;
  const level = MOCK_PARENTS[parts[0]];
  if (!level) return null;
  const data = doc.data() || {};
  // Completed mocks must display the server-verified four-skill breakdown,
  // never stale browser-supplied scores. This is also the authoritative source
  // for completed-section progress (historical attempts may have only
  // verifiedSectionScores and no sectionScores field).
  const savedVerifiedScores = verifiedMockBreakdown(data);
  const scores = savedVerifiedScores || data.sectionScores || {};
  const completedSections = SECTIONS.filter(section =>
    scores[section] !== undefined && scores[section] !== null &&
    Number.isFinite(Number(scores[section])) &&
    (data.status !== "completed" || verifiedScore(scores[section]) !== null)
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
    overallScore: hasVerifiedOverall(data) ? Number(data.verifiedOverall.score) : null,
    sectionScores: savedVerifiedScores,
    scoreSource: savedVerifiedScores ? "verified_attempt" : null,
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
  // A recovered Mock 2 must appear once as a verified completed attempt,
  // not alongside its older browser-only "in progress" monitoring signal.
  const serverRows=documents.map(normalizeMockAttempt).filter(Boolean);
  const published=new Set(serverRows.filter(row=>row.status==="completed")
    .map(row=>row.uid+"::"+row.mockId));
  const attempts = [...serverRows, ...browserAttempts.filter(row=>
    !published.has(row.uid+"::"+row.mockId))]
    .filter(Boolean)
    .sort((a, b) => toMillis(b.updatedAt || b.startedAt) - toMillis(a.updatedAt || a.startedAt))
    .slice(0, Math.min(500, Math.max(1, Number(limit) || 200)));
  const scored=await enrichPublishedMockScores(db,attempts,documents);
  return { attempts: await enrichStudentNames(db, scored), partial };
}

module.exports = { listMockAttempts, normalizeMockAttempt, normalizeBrowserProgress, isAuthorizedMockMonitor, nameFromStudent, enrichStudentNames, verifiedFinalMockScore, enrichPublishedMockScores };
