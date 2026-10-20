"use strict";

// Cost-limited mock answer recovery. One Firestore document per student/mock,
// updated only when Lesen, Hören or Schreiben has been submitted.
// Never store speech recordings, speech transcripts, model feedback or drafts.
const COLLECTION = "mockSectionBackups";
const PARTS = ["lesen", "hoeren", "schreiben"];
const MOCKS = ["a2-mock-02", "b2-final-mock"];
const fail = (message, status = 400, code = "INVALID_MOCK_BACKUP") =>
  Object.assign(new Error(message), {status, code});
const positiveTime = (value, now = Date.now()) =>
  Number.isSafeInteger(Number(value)) && Number(value) >= Date.UTC(2025, 0, 1) && Number(value) <= now + 120000;
const answers = (value, max = 25) => {
  if (!value || typeof value !== "object" || Array.isArray(value) || Object.keys(value).length > max) throw fail("Invalid submitted answers");
  const result = {};
  for (const [key, choice] of Object.entries(value)) {
    if (!/^[a-zA-Z0-9_-]{1,32}$/.test(key) || typeof choice !== "string" || !/^[a-zA-Z0-9_-]{0,32}$/.test(choice)) throw fail("Invalid answer choice");
    result[key] = choice;
  }
  return result;
};
function validateBackup(mockId, section, input) {
  if (!MOCKS.includes(mockId) || !PARTS.includes(section)) throw fail("Unsupported mock backup");
  if (!input || typeof input !== "object" || Array.isArray(input)) throw fail("Invalid submitted section");
  const at = Number(input.submittedAt || (mockId === "a2-mock-02" && section !== "schreiben" ? input.completedAt : 0));
  if (!positiveTime(at)) throw fail("A completed section timestamp is required");
  if (section === "schreiben") {
    const fields = mockId === "a2-mock-02" ? ["sms", "email"] : ["teil1", "teil2"];
    const texts = mockId === "a2-mock-02" ? input : input.schreiben;
    if (!texts || typeof texts !== "object") throw fail("Writing answers required");
    const safe = {};
    for (const field of fields) {
      if (typeof texts[field] !== "string" || texts[field].length > 12000) throw fail("Writing answer too long");
      safe[field] = texts[field];
    }
    return {submittedAt: at, ...(mockId === "a2-mock-02" ? safe : {schreiben:safe})};
  }
  if (mockId === "a2-mock-02") return {submittedAt: at, answers: answers(input.answers,20)};
  const names = section === "lesen" ? ["teil1Answers","teil2Answers","teil3Answers","teil4Answers"]
    : ["hoeren1Answers","hoeren2Answers","hoeren3Answers","hoeren4Answers"];
  return { submittedAt: at, ...Object.fromEntries(names.map(name => [name, answers(input[name] || {}, 25)])) };
}
function publicBackup(data = {}) {
  return {
    mockId: data.mockId,
    attemptStartedAtMs: data.attemptStartedAtMs || null,
    sections: Object.fromEntries(PARTS.filter(key => data.sections?.[key]).map(key => [key, data.sections[key]])),
  };
}
async function saveBackup(db, admin, uid, email, {mockId, section, attemptStartedAtMs, data}) {
  const started = Number(attemptStartedAtMs);
  if (!positiveTime(started)) throw fail("Invalid attempt start time");
  const sanitized = validateBackup(mockId, section, data);
  const reference = db.collection(COLLECTION).doc(`${uid}:${mockId}`);
  let outcome;
  await db.runTransaction(async tx => {
    const snap = await tx.get(reference);
    const old = snap.exists ? snap.data() || {} : {};
    const oldStarted = Number(old.attemptStartedAtMs) || 0;
    if (oldStarted > started) throw fail("A newer attempt already has a backup", 409, "MOCK_BACKUP_NEWER_ATTEMPT");
    const same = oldStarted === started;
    const existing = same ? old.sections?.[section] : null;
    if (existing && existing.submittedAt >= sanitized.submittedAt) {
      outcome = {saved: true, unchanged: true};
      return;
    }
    const sections = same ? {...old.sections, [section]:sanitized} : {[section]:sanitized};
    tx.set(reference, {
      uid, email: String(email || "").toLowerCase().slice(0,254), mockId,
      attemptStartedAtMs:started, sections,
      updatedAt:admin.firestore.FieldValue.serverTimestamp(),
    });
    outcome = {saved:true, unchanged:false};
  });
  return outcome;
}
module.exports = { COLLECTION, MOCKS, PARTS, validateBackup, publicBackup, saveBackup };
