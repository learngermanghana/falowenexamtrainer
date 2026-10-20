import { getBackendUrl } from "./backendUrl";

// One backup write per submitted module (not per keypress), and no speaking media.
const PARTS = ["lesen", "hoeren", "schreiben"];
const MOCKS = ["a2-mock-02", "b2-final-mock"];
const markerKey = (uid, mockId) => `falowen:mock-backup-sync:${mockId}:${uid}`;
const readJson = key => { try { return JSON.parse(localStorage.getItem(key) || "null") || {}; } catch { return {}; } };
const completedStamp = data => Number(data?.submittedAt || data?.completedAt) || 0;
async function callBackup(mockId, token, options = {}) {
  const response = await fetch(`${getBackendUrl()}/internal/mock-answer-backup${options.method ? "" : "?mockId=" + encodeURIComponent(mockId)}`, {
    cache: "no-store", ...options,
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json",
      ...(options.body ? {"Content-Type": "application/json"} : {}) },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.ok) throw new Error(result.error || "Mock backup unavailable");
  return result;
}
export const getMockAnswerBackup = (mockId, token) => callBackup(mockId, token);

export async function uploadMockAnswerBackup(mockId, section, attemptStartedAtMs, data, token, uid) {
  if (!MOCKS.includes(mockId) || !PARTS.includes(section) || !token || !uid || !completedStamp(data)) return false;
  const ackKey = markerKey(uid, mockId);
  const record = readJson(ackKey);
  const ack = record.attemptStartedAtMs === attemptStartedAtMs ? record.sections || {} : {};
  if (ack[section] === completedStamp(data)) return false;
  await callBackup(mockId, token, {method:"POST", body:JSON.stringify({
    mockId, section, attemptStartedAtMs, data,
  })});
  localStorage.setItem(ackKey, JSON.stringify({attemptStartedAtMs, sections: {...ack, [section]: completedStamp(data)}}));
  return true;
}

export async function syncA2Mock2Backup(keys, attemptStartedAtMs, token, uid) {
  if (!token || !uid || !attemptStartedAtMs) return;
  for (const section of PARTS) {
    const saved = readJson(keys[section]);
    if (!completedStamp(saved)) continue;
    const data = section === "schreiben" ? {
      submittedAt: saved.submittedAt, startedAt:saved.startedAt || saved.submittedAt, sms: saved.sms || "", email: saved.email || "",
    } : {submittedAt: saved.completedAt, answers: saved.answers || {}};
    await uploadMockAnswerBackup("a2-mock-02", section, attemptStartedAtMs, data, token, uid);
  }
}
export function restoreA2Mock2Backup(keys, response) {
  const cloud = response?.backup;
  if (!cloud?.attemptStartedAtMs || !cloud?.sections) return false;
  const localFlow = readJson(keys.flow);
  // Refuse to replace an active, different attempt.
  if (localFlow.startedAt && localFlow.startedAt !== cloud.attemptStartedAtMs &&
      localFlow.stage !== "intro") return false;
  let changed = false;
  for (const part of PARTS) {
    const remote = cloud.sections[part];
    const local = readJson(keys[part]);
    if (!remote || completedStamp(local)) continue;
    if (part === "schreiben" && (local.sms || local.email)) continue;
    if (part !== "schreiben" && Object.values(local.answers || {}).some(Boolean)) continue;
    const restored = part === "schreiben" ? {...remote, startedAt:remote.startedAt || remote.submittedAt} :
      {completedAt:remote.submittedAt, answers:remote.answers};
    localStorage.setItem(keys[part], JSON.stringify(restored));
    changed = true;
  }
  if (changed) {
    const next = PARTS.find(part => !completedStamp(readJson(keys[part]))) || "sprechen";
    localStorage.setItem(keys.flow, JSON.stringify({stage:next, startedAt:cloud.attemptStartedAtMs}));
  }
  return changed;
}

// B2 writes its already completed Lesen/Hören/Schreiben sections.
// Only text and choice IDs, never the speakingProgress/recordings.
export function submittedB2Sections(state = {}) {
  const started = state.attemptStartedAtMs;
  if (!started) return [];
  const data = [];
  if (state.teil4Completed) data.push(["lesen", {
    submittedAt: Number(state.lesenSubmittedAt) || started,
    teil1Answers: state.teil1Answers || {}, teil2Answers: state.teil2Answers || {},
    teil3Answers: state.teil3Answers || {}, teil4Answers: state.teil4Answers || {},
  }]);
  if (state.hoeren4Completed) data.push(["hoeren", {
    submittedAt: Number(state.hoerenSubmittedAt) || started,
    hoeren1Answers: state.hoeren1Answers || {}, hoeren2Answers: state.hoeren2Answers || {},
    hoeren3Answers: state.hoeren3Answers || {}, hoeren4Answers: state.hoeren4Answers || {},
  }]);
  if (state.schreibenCompleted) data.push(["schreiben", {
    submittedAt: Number(state.schreibenSubmittedAt) || started,
    schreiben: {teil1: state.schreiben?.teil1 || "", teil2: state.schreiben?.teil2 || ""},
    ...(Number.isFinite(Number(state.schreibenResult?.score)) && state.schreibenResult ? {score:Number(state.schreibenResult.score)} : {}),
  }]);
  return data;
}
export async function syncB2Backup(state, token, uid) {
  if (!token || !uid) return;
  for (const [section, data] of submittedB2Sections(state)) {
    await uploadMockAnswerBackup("b2-final-mock", section, state.attemptStartedAtMs, data, token, uid);
  }
}
export function restoreB2Backup(local, response) {
  const cloud = response?.backup;
  if (!cloud?.attemptStartedAtMs || !cloud.sections) return null;
  if (local.attemptStartedAtMs && local.attemptStartedAtMs !== cloud.attemptStartedAtMs) return null;
  if (local.teil4Completed || local.hoeren4Completed || local.schreibenCompleted ||
      local.started || Object.keys(local.teil1Answers || {}).length) return null;
  const copy = {...local, attemptStartedAtMs:cloud.attemptStartedAtMs};
  for (const name of PARTS) {
    const section = cloud.sections[name];
    if (!section?.submittedAt) continue;
    if (name === "lesen") {
      ["teil1Answers","teil2Answers","teil3Answers","teil4Answers"].forEach(key => {copy[key] = section[key] || {}});
      copy.teil4Completed = true;
      copy.lesenSubmittedAt = section.submittedAt;
      copy.stage = "hoeren-teil1";
    }
    if (name === "hoeren" && copy.teil4Completed) {
      ["hoeren1Answers","hoeren2Answers","hoeren3Answers","hoeren4Answers"].forEach(key => {copy[key] = section[key] || {}});
      copy.hoeren4Completed = true;
      copy.hoerenSubmittedAt = section.submittedAt;
      copy.stage = "schreiben";
    }
    if (name === "schreiben" && copy.hoeren4Completed) {
      copy.schreiben = section.schreiben;
      if (Number.isFinite(Number(section.score))) copy.schreibenResult = {score:Number(section.score), maxScore:25};
      copy.schreibenCompleted = true;
      copy.schreibenSubmittedAt = section.submittedAt;
      copy.stage = "sprechen";
    }
  }
  return copy.stage === local.stage ? null : {...copy, started:false, deadlineMs:null};
}
