"use strict";

// A graded course assignment is built exclusively from three completed,
// server-stored Live Speak examiner results. The browser never supplies scores.
const { getSheetsClient } = require("./googleSheetsClient");
const crypto = require("crypto");

const COURSE_MOCKS = Object.freeze({
  "A2-8.22": { level: "A2", day: 22, title: "Goethe A2 Speaking Mock" },
  "B1-7.23": { level: "B1", day: 23, title: "Goethe B1 Speaking Mock" },
});

const clean = value => String(value ?? "").trim();
const assignmentConfig = value => COURSE_MOCKS[clean(value).toUpperCase()] || null;
const validationError = (message, status = 400) =>
  Object.assign(new Error(message), { status, code: "invalid_course_speaking_mock" });
const docIdFor = (uid, assignmentId) => `course-speaking-mock-${uid}-${assignmentId}`;
const attemptRefFor = (db, uid, assignmentId) =>
  db.collection("courseSpeakingMockAttempts").doc(docIdFor(uid, assignmentId));
const validAttemptId = value =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(clean(value));

async function startCourseSpeakingAttempt({ db, admin, uid, assignmentId }) {
  if (!assignmentConfig(assignmentId)) throw validationError("Unknown course speaking assignment.");
  const ref = attemptRefFor(db, uid, assignmentId);
  const scoreRef = db.collection("scores").doc(docIdFor(uid, assignmentId));
  return db.runTransaction(async tx => {
    const [attemptSnap, scoreSnap] = await Promise.all([tx.get(ref), tx.get(scoreRef)]);
    const score = scoreSnap.data() || {};
    if (score.uid === uid && score.source === "course_speaking_mock") {
      throw validationError("This speaking assignment is already completed.", 409);
    }
    const prior = attemptSnap.data() || {};
    if (prior.uid === uid && prior.assignmentId === assignmentId && validAttemptId(prior.attemptId)) {
      return { ok: true, attemptId: prior.attemptId, resumed: true };
    }
    const attemptId = crypto.randomUUID();
    tx.set(ref, { uid, assignmentId, attemptId, status: "in_progress",
      createdAt: admin.firestore.FieldValue.serverTimestamp() });
    return { ok: true, attemptId, resumed: false };
  });
}

async function requireCourseSpeakingAttempt({ db, uid, assignmentId, attemptId }) {
  if (!assignmentConfig(assignmentId) || !validAttemptId(attemptId)) {
    throw validationError("Start the speaking mock from its lesson before recording.", 409);
  }
  const snap = await attemptRefFor(db, uid, assignmentId).get();
  const row = snap.data() || {};
  if (row.uid !== uid || row.assignmentId !== assignmentId ||
      row.attemptId !== attemptId || row.status !== "in_progress") {
    throw validationError("This recording belongs to another or expired speaking exam attempt.", 409);
  }
  return row;
}
const normalizedPart = value => {
  const part = clean(value).match(/(?:teil\s*)?([1-3])\b/i);
  return part ? `teil${part[1]}` : "";
};

function evaluateResults({ assignmentId, uid, snapshots, attemptId }) {
  if (!validAttemptId(attemptId)) {
    throw validationError("A verified speaking mock attempt ID is required.", 409);
  }
  const config = assignmentConfig(assignmentId);
  if (!config) throw validationError("This lesson is not a graded speaking mock.");
  if (!Array.isArray(snapshots) || snapshots.length !== 3) {
    throw validationError("All three completed examiner parts are required.");
  }
  const results = new Map();
  for (const snap of snapshots) {
    if (!snap?.exists) throw validationError("One speaking assessment could not be found.", 409);
    const item = snap.data() || {};
    const part = normalizedPart(item.teil || item.task?.teil);
    const assessment = item.assessment || {};
    const score = Number(assessment.score);
    const maximum = Number(assessment.maxScore);
    if (item.uid !== uid || item.level !== config.level ||
        item.source !== "exam-speaking-practice" ||
        item.examFlowKey !== `${config.level}-${part.slice(-1)}` ||
        item.task?.courseAssignmentKey !== assignmentId ||
        item.mockAttemptId !== attemptId ||
        item.task?.mockAttemptId !== attemptId ||
        item.completed !== true || !part || results.has(part) ||
        assessment.practiceOnly !== true || !Array.isArray(assessment.tasks) ||
        assessment.tasks.length === 0 || !Number.isFinite(score) ||
        !Number.isFinite(maximum) || maximum <= 0 || score < 0 || score > maximum) {
      throw validationError("The speaking exam must contain three complete, verified parts from this student's assigned lesson.", 409);
    }
    results.set(part, {
      sessionId: clean(item.sessionId || snap.id),
      percent: Math.round(score / maximum * 100),
      score,
      maxScore: maximum,
      feedback: clean(item.feedback).slice(0, 2100),
      summary: clean(assessment.summary).slice(0, 700),
      strength: clean(assessment.strength).slice(0, 500),
      priority: clean(assessment.priority).slice(0, 500),
      transcript: (Array.isArray(item.answers) ? item.answers : []).map(answer => clean(answer).slice(0, 1800)),
      topic: clean(item.task?.prompt).slice(0, 1200),
    });
  }
  if (!["teil1", "teil2", "teil3"].every(part => results.has(part))) {
    throw validationError("Complete Teil 1, Teil 2 and Teil 3 before submitting.", 409);
  }
  const parts = Object.fromEntries(["teil1", "teil2", "teil3"].map(key => [key, results.get(key)]));
  const score = Math.round((parts.teil1.percent + parts.teil2.percent + parts.teil3.percent) / 3);
  return { config, parts, score };
}


// Query the assignment-specific top-level key so Firestore filters before
// reading results. There is deliberately no arbitrary 250-document cutoff.
// Legacy examiner snapshots lack an attempt identifier and cannot be reliably
// joined across restarted runs; never turn such a mixed set into a grade.
async function findSavedSpeakingParts({ db, uid, assignmentId, attemptId }) {
  const config = assignmentConfig(assignmentId);
  if (!config) throw validationError("Unknown course speaking assignment.");
  if (!validAttemptId(attemptId)) return { parts: [], snapshots: [] };
  const query = await db.collection("liveSpeakExamResults")
    .where("ownerAssignment", "==", `${uid}:${assignmentId}`).get();
  const candidates = (query.docs || []).filter(snap => {
    const item = snap.data() || {};
    const part = normalizedPart(item.teil || item.task?.teil);
    const assessment = item.assessment || {};
    return item.uid === uid && item.level === config.level
      && item.mockAttemptId === attemptId
      && item.task?.mockAttemptId === attemptId
      && item.task?.courseAssignmentKey === assignmentId
      && item.source === "exam-speaking-practice"
      && part && item.examFlowKey === `${config.level}-${part.slice(-1)}`
      && item.completed === true && assessment.practiceOnly === true
      && Number.isFinite(Number(assessment.score))
      && Number.isFinite(Number(assessment.maxScore))
      && Number(assessment.maxScore) > 0
      && Array.isArray(assessment.tasks) && assessment.tasks.length > 0;
  });
  candidates.sort((a, b) => {
    const time = snap => snap.data()?.createdAt?.toMillis?.() || 0;
    return time(b) - time(a);
  });
  const byPart = new Map();
  for (const snap of candidates) {
    const part = normalizedPart(snap.data().teil || snap.data().task?.teil);
    if (!byPart.has(part)) byPart.set(part, snap);
  }
  const keys = ["teil1", "teil2", "teil3"];
  const parts = keys.filter(key => byPart.has(key)).map(key => {
    const snap = byPart.get(key);
    const item = snap.data() || {};
    return { sessionId: item.sessionId || snap.id, taskId: item.task?.id || "",
      teil: item.teil || item.task?.teil || `Teil ${key.slice(-1)}`,
      assessment: item.assessment };
  });
  return { parts, snapshots: keys.filter(key => byPart.has(key)).map(key => byPart.get(key)) };
}

function buildScoreDocument({ assignmentId, uid, profile = {}, auth = {}, outcome, date = new Date().toISOString() }) {
  const studentCode = clean(profile.studentCode || profile.studentcode || profile.student_code || profile.code || uid);
  const email = clean(profile.email || auth.email).toLowerCase();
  const name = clean(profile.name || profile.fullName || profile.studentName || profile.displayName || auth.name || email.split("@")[0] || "Student");
  const { config, score, parts } = outcome;
  const passed = score >= 60;
  const summary = ["teil1", "teil2", "teil3"].map(key => `Teil ${key.slice(-1)}: ${parts[key].percent}%`).join(" · ");
  const feedback = `${summary}. ${["teil1", "teil2", "teil3"].map(key => parts[key].priority).filter(Boolean).join(" | ")}`.slice(0, 1200);
  return {
    uid, studentId: uid, studentCode, studentcode: studentCode, email, studentEmail: email,
    name, studentName: name, level: config.level,
    assignment: config.title, assignmentText: config.title,
    assignmentId, assignment_id: assignmentId, canonicalAssignmentKey: assignmentId,
    score, finalScore: score, percent: score, rawScore: score, total: 100,
    passed, failed: !passed, submitted: true, status: passed ? "passed" : "failed",
    result: passed ? "passed" : "failed", comments: feedback, feedback,
    date, link: `/campus/course/lesson/${config.level}/${config.day}?view=workbook`,
    route: `/campus/course/lesson/${config.level}/${config.day}?view=workbook`,
    source: "course_speaking_mock", resultType: "course_speaking_mock",
    sectionScores: { sprechen: score, teil1: parts.teil1.percent, teil2: parts.teil2.percent, teil3: parts.teil3.percent },
    speakingParts: parts, sourceSessionIds: [parts.teil1.sessionId, parts.teil2.sessionId, parts.teil3.sessionId],
    attempt: 1, attemptNumber: 1, progressionEligible: true,
    practiceEstimate: true, pronunciationScored: false,
    sheetSyncStatus: "pending",
  };
}

const headerKey = value => clean(value).toLowerCase().replace(/[\s_-]+/g, "");
const sheetRange = (tab, suffix) => `'${tab.replace(/'/g, "''")}'!${suffix}`;

// Keep historical workbook results: archive only the *sheet assignment id* on
// a pre-mock row, preserving its original grade, comments and timestamp.
async function upsertMockScoreSheet(row) {
  const spreadsheetId = clean(process.env.SHEETS_SCORES_ID);
  if (!spreadsheetId) return { ok: false, message: "SHEETS_SCORES_ID is not configured." };
  const tab = clean(process.env.SHEETS_SCORES_TAB) || "scores_backup";
  const sheets = await getSheetsClient();
  const range = sheetRange(tab, "A:AZ");
  const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  const table = response.data.values || [];
  if (!table.length) throw new Error("Score sheet has no header row.");
  const header = table[0].map(headerKey);
  const columns = {};
  for (const field of ["studentcode", "name", "assignment", "assignmentid", "score", "comments", "date", "level", "link"]) {
    const index = header.indexOf(field);
    if (index < 0) throw new Error(`Scores sheet is missing the ${field} column.`);
    columns[field] = index;
  }
  const values = [...table.slice(1)];
  const isMatch = cells => clean(cells[columns.studentcode]).toLowerCase() === row.studentCode.toLowerCase()
    && clean(cells[columns.assignmentid]).toUpperCase() === row.assignmentId;
  const same = [];
  const legacy = [];
  values.forEach((cells, index) => {
    if (!isMatch(cells)) return;
    if (clean(cells[columns.assignment]).toLowerCase() === row.assignment.toLowerCase()) same.push(index + 2);
    else legacy.push(index + 2);
  });
  // The original score stays in place under a historical assignment identity.
  for (const rowNumber of legacy) {
    const old = [...values[rowNumber - 2]];
    old[columns.assignmentid] = `${row.assignmentId}-LEGACY`;
    await sheets.spreadsheets.values.update({
      spreadsheetId, range: sheetRange(tab, `A${rowNumber}:AZ${rowNumber}`),
      valueInputOption: "RAW", requestBody: { values: [old] },
    });
  }
  // Preserve extra Admin columns (manual overrides, marking breakdowns,
  // source audit fields) when the same result is synchronized again.
  const cells = same.length
    ? [...values[same[0] - 2]]
    : new Array(Math.max(header.length, 9)).fill("");
  const data = { studentcode: row.studentCode, name: row.name, assignment: row.assignment,
    assignmentid: row.assignmentId, score: row.score, comments: row.comments,
    date: row.date, level: row.level, link: row.link };
  for (const [key, value] of Object.entries(data)) cells[columns[key]] = value;
  if (same.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId, range: sheetRange(tab, `A${same[0]}:AZ${same[0]}`),
      valueInputOption: "RAW", requestBody: { values: [cells] },
    });
  } else {
    await sheets.spreadsheets.values.append({
      spreadsheetId, range, valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS", requestBody: { values: [cells] },
    });
  }
  return { ok: true, action: same.length ? "updated" : "inserted", legacyPreserved: legacy.length };
}

async function synchronizeSheet({ db, admin, scoreRef, row }) {
  if (row.sheetSyncStatus === "complete") return { ok: true, cached: true };
  const now = Date.now();
  const lease = await db.runTransaction(async tx => {
    const snap = await tx.get(scoreRef);
    const existing = snap.data() || {};
    if (existing.sheetSyncStatus === "complete") return false;
    if (Number(existing.sheetSyncLeaseUntil) > now) return false;
    tx.update(scoreRef, { sheetSyncStatus: "syncing", sheetSyncLeaseUntil: now + 120000 });
    return true;
  });
  if (!lease) return { ok: false, pending: true, message: "Score-sheet synchronization is already in progress." };
  let receipt;
  try { receipt = await upsertMockScoreSheet(row); }
  catch (error) { receipt = { ok: false, message: error?.message || "Score-sheet sync failed." }; }
  await scoreRef.set({
    sheetSyncStatus: receipt.ok ? "complete" : "pending",
    sheetSyncError: receipt.ok ? "" : receipt.message,
    sheetSyncLeaseUntil: 0, sheetSyncedAt: receipt.ok ? admin.firestore.FieldValue.serverTimestamp() : null,
  }, { merge: true });
  return receipt;
}

async function submitCourseSpeakingMock({ db, admin, uid, profile, auth, assignmentId, sessionIds, attemptId }) {
  const config = assignmentConfig(assignmentId);
  if (!config || !Object.prototype.hasOwnProperty.call(COURSE_MOCKS, assignmentId)) {
    throw validationError("Unknown course speaking assignment.");
  }
  const scoreRef = db.collection("scores").doc(docIdFor(uid, assignmentId));
  let existing = await scoreRef.get();
  if (!existing.exists) {
    await requireCourseSpeakingAttempt({ db, uid, assignmentId, attemptId });
    let snapshots;
    if (Array.isArray(sessionIds) && sessionIds.length === 3 &&
        sessionIds.every(id => /^[0-9a-f-]{36}$/i.test(clean(id))) &&
        new Set(sessionIds).size === 3) {
      snapshots = await Promise.all(sessionIds.map(id => db.collection("liveSpeakExamResults").doc(id).get()));
    } else if (sessionIds === undefined || sessionIds === null) {
      // A student may have closed the tab after all three parts were saved.
      // Only fully graded server-owned parts are eligible for final submission.
      snapshots = (await findSavedSpeakingParts({ db, uid, assignmentId, attemptId })).snapshots;
    } else {
      throw validationError("Three different completed exam session IDs are required.");
    }
    const outcome = evaluateResults({ assignmentId, uid, snapshots, attemptId });
    const doc = { ...buildScoreDocument({ assignmentId, uid, profile, auth, outcome }), mockAttemptId: attemptId };
    try { await scoreRef.create({ ...doc, createdAt: admin.firestore.FieldValue.serverTimestamp(), updatedAt: admin.firestore.FieldValue.serverTimestamp() }); }
    catch (error) {
      if (error?.code !== 6 && error?.code !== "already-exists") throw error;
    }
    existing = await scoreRef.get();
  }
  const row = existing.data();
  if (!row || row.uid !== uid || row.assignmentId !== assignmentId || row.source !== "course_speaking_mock") {
    throw validationError("This assignment result belongs to another student.", 403);
  }
  const sheet = await synchronizeSheet({ db, admin, scoreRef, row });
  return { ok: true, assignmentId, score: row.score, passed: row.passed,
    sectionScores: row.sectionScores, speakingParts: row.speakingParts,
    feedback: row.feedback, sheet, completed: true };
}

async function courseSpeakingMockStatus({ db, uid, assignmentId }) {
  if (!assignmentConfig(assignmentId)) throw validationError("Unknown course speaking assignment.");
  const snap = await db.collection("scores").doc(docIdFor(uid, assignmentId)).get();
  const row = snap.data();
  if (!row || row.uid !== uid || row.source !== "course_speaking_mock") {
    const attemptSnap = await attemptRefFor(db, uid, assignmentId).get();
    const attempt = attemptSnap.data() || {};
    const attemptId = attempt.uid === uid && attempt.assignmentId === assignmentId &&
      validAttemptId(attempt.attemptId) ? attempt.attemptId : "";
    const recovered = await findSavedSpeakingParts({ db, uid, assignmentId, attemptId });
    return { ok: true, completed: false, attemptId, recovery: { parts: recovered.parts,
      allPartsGraded: recovered.parts.length === 3, legacyAttemptsNotCombined: true } };
  }
  return { ok: true, completed: true, assignmentId, score: row.score, passed: row.passed,
    sectionScores: row.sectionScores, speakingParts: row.speakingParts,
    feedback: row.feedback, sheet: { ok: row.sheetSyncStatus === "complete",
      pending: row.sheetSyncStatus !== "complete", message: row.sheetSyncError || "" } };
}

module.exports = { COURSE_MOCKS, assignmentConfig, evaluateResults, buildScoreDocument,
  startCourseSpeakingAttempt, requireCourseSpeakingAttempt, submitCourseSpeakingMock,
  courseSpeakingMockStatus, findSavedSpeakingParts, validAttemptId, upsertMockScoreSheet };
