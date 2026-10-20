"use strict";

// Cost-limited A2 Mock 2 recovery: one document per student and a maximum of
// three completed text/choice sections. No drafts, speech, audio or AI payloads.
const PARTS = Object.freeze(["lesen", "hoeren", "schreiben"]);
const COLLECTION = "a2Mock2SectionBackups";
function validateBackup(section, input, now = Date.now()) {
  if (!PARTS.includes(section)) throw Object.assign(new Error("Unsupported backup section"), { status: 400 });
  if (!input || typeof input !== "object" || Array.isArray(input)) throw Object.assign(new Error("Invalid submitted section"), { status: 400 });
  const stampKey = section === "schreiben" ? "submittedAt" : "completedAt";
  const stamp = Number(input[stampKey]);
  if (!Number.isSafeInteger(stamp) || stamp < Date.UTC(2025,0,1) || stamp > now + 120000) {
    throw Object.assign(new Error("A completed section timestamp is required"), { status: 400 });
  }
  if (section === "schreiben") {
    if (typeof input.sms !== "string" || typeof input.email !== "string" ||
        input.sms.length > 3500 || input.email.length > 4500) {
      throw Object.assign(new Error("Writing responses exceed backup limits"), { status: 400 });
    }
    return { submittedAt: stamp, startedAt: Number(input.startedAt) || null, sms: input.sms, email: input.email };
  }
  const answers = input.answers;
  if (!answers || typeof answers !== "object" || Array.isArray(answers) || Object.keys(answers).length > 20) {
    throw Object.assign(new Error("Invalid answer sheet"), { status: 400 });
  }
  const safe = {};
  for (const [key, answer] of Object.entries(answers)) {
    if (!/^(?:[1-9]|1\\d|20)$/.test(key) || typeof answer !== "string" ||
        !/^[a-zA-Z0-9_-]{0,18}$/.test(answer)) {
      throw Object.assign(new Error("Invalid answer sheet entry"), { status: 400 });
    }
    safe[key] = answer;
  }
  return { completedAt: stamp, answers: safe };
}
function attemptTime(value, now = Date.now()) {
  const time = Number(value);
  if (!Number.isSafeInteger(time) || time < Date.UTC(2025,0,1) || time > now + 120000) {
    throw Object.assign(new Error("Invalid mock attempt start"), { status: 400 });
  }
  return time;
}
function publicBackup(data = {}) {
  return { mockId: "a2-mock-02", attemptStartedAtMs: data.attemptStartedAtMs || null,
    sections: Object.fromEntries(PARTS.filter(key => data.sections?.[key]).map(key => [key, data.sections[key]])) };
}
async function saveBackup(db, admin, uid, email, { section, attemptStartedAtMs, data }) {
  const stamp = attemptTime(attemptStartedAtMs);
  const payload = validateBackup(section, data);
  const document = db.collection(COLLECTION).doc(uid);
  let result;
  await db.runTransaction(async transaction => {
    const snap = await transaction.get(document);
    const old = snap.exists ? snap.data() || {} : {};
    const previous = Number(old.attemptStartedAtMs) || 0;
    if (previous > stamp) {
      throw Object.assign(new Error("A newer mock attempt has already been backed up."), {status: 409, code: "MOCK_BACKUP_NEWER_ATTEMPT"});
    }
    const same = previous === stamp;
    const existing = same ? old.sections?.[section] : null;
    const stampKey = section === "schreiben" ? "submittedAt" : "completedAt";
    if (existing && Number(existing[stampKey]) >= Number(payload[stampKey])) {
      result = {saved: true, unchanged: true};
      return;
    }
    const sections = same ? {...old.sections, [section]: payload} : {[section]: payload};
    transaction.set(document, {
      uid, email: String(email || "").toLowerCase().slice(0,254),
      mockId: "a2-mock-02", attemptStartedAtMs: stamp, sections,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    result = { saved: true, unchanged: false };
  });
  return result;
}
module.exports = { COLLECTION, PARTS, validateBackup, attemptTime, publicBackup, saveBackup };
