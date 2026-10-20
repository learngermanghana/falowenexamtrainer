import { getBackendUrl } from "./backendUrl";

// One small backup for each completed Lesen, Hören and Schreiben module.
// Never upload draft answers, speaking recordings, transcripts or AI feedback.
const SECTION_ORDER = ["lesen", "hoeren", "schreiben"];
const BACKUP_KEY = uid => `falowen:a2:mock-02:backup-sync:${uid}`;
const json = key => { try { return JSON.parse(localStorage.getItem(key) || "null") || {}; } catch { return {}; } };
const submissionTime = (name, data) => Number(name === "schreiben" ? data?.submittedAt : data?.completedAt) || 0;
const payloadFor = (name, data) => {
  if (name === "schreiben") return { submittedAt: data.submittedAt, startedAt: data.startedAt || null, sms: data.sms || "", email: data.email || "" };
  return { completedAt: data.completedAt, answers: data.answers || {} };
};
const request = async (path, token, options = {}) => {
  const response = await fetch(`${getBackendUrl()}${path}`, {
    ...options, cache: "no-store",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json",
      ...(options.body ? {"Content-Type":"application/json"} : {}) },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.ok !== true) throw new Error(result.error || "Mock backup unavailable");
  return result;
};
export async function readA2Mock2Backup(token) {
  return request("/internal/a2-mock2-backup", token);
}
export async function syncA2Mock2Backup(keys, attemptStartedAtMs, token, uid) {
  if (!token || !uid || !Number.isSafeInteger(Number(attemptStartedAtMs)) || Number(attemptStartedAtMs) <= 0) return { saved: 0, pending: 0 };
  const savedMarker = json(BACKUP_KEY(uid));
  const acknowledged = savedMarker.attemptStartedAtMs === attemptStartedAtMs ? {...savedMarker.sections} : {};
  let saved = 0;
  for (const section of SECTION_ORDER) {
    const data = json(keys[section]);
    const completedAt = submissionTime(section, data);
    if (!completedAt || Number(acknowledged[section]) === completedAt) continue;
    await request("/internal/a2-mock2-backup", token, {
      method: "POST",
      body: JSON.stringify({ mockId: "a2-mock-02", attemptStartedAtMs,
        section, data: payloadFor(section, data) }),
    });
    acknowledged[section] = completedAt;
    localStorage.setItem(BACKUP_KEY(uid), JSON.stringify({ attemptStartedAtMs, sections: acknowledged }));
    saved++;
  }
  return { saved, pending: SECTION_ORDER.filter(section =>
    submissionTime(section,json(keys[section])) && !acknowledged[section]).length };
}
export function restoreA2Mock2Backup(keys, cloud) {
  const remote = cloud?.backup;
  if (!remote?.attemptStartedAtMs || !remote?.sections) return false;
  const localFlow = json(keys.flow);
  const localStamp = Number(localFlow.startedAt) || 0;
  // Avoid overwriting an active different attempt on this device.
  if (localStamp && localStamp !== remote.attemptStartedAtMs &&
      (localFlow.stage !== "intro" || SECTION_ORDER.some(section =>
        submissionTime(section,json(keys[section]))))) return false;
  let restored = false;
  for (const section of SECTION_ORDER) {
    const item = remote.sections[section];
    if (!item || !submissionTime(section,item)) continue;
    const local = json(keys[section]);
    if (submissionTime(section,local)) continue; // local submitted responses always win
    // Do not erase an active unfinished answer on this device.
    if (section === "schreiben" && (local.sms || local.email)) continue;
    if (section !== "schreiben" && Object.values(local.answers || {}).some(Boolean)) continue;
    localStorage.setItem(keys[section], JSON.stringify(item));
    restored = true;
  }
  if (restored) {
    const completed = SECTION_ORDER.filter(section => submissionTime(section,json(keys[section])));
    const next = SECTION_ORDER.find(section => !completed.includes(section)) || "sprechen";
    localStorage.setItem(keys.flow, JSON.stringify({stage: next, startedAt: remote.attemptStartedAtMs}));
  }
  return restored;
}
