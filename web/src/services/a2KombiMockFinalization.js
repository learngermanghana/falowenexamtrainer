import { saveA2MockAttempt, scoreA2MockWriting } from "./a2FinalMockService";
import { scoreA2MockSpeaking } from "./coachService";
const read = key => {
  try { return JSON.parse(localStorage.getItem(key) || "{}") || {}; }
  catch { return {}; }
};

export const A2_KOMBI_VERSION = "three-module-v1";
export const a2KombiKeys = (mockId, uid) => {
  const prefix = `falowen:a2:kombi:${mockId}:${uid || "guest"}:v1`;
  return {flow:`${prefix}:flow`,lesen:`${prefix}:lesen`,schreiben:`${prefix}:schreiben`,sprechen:`${prefix}:sprechen`};
};

export function getA2KombiState(keys, mockId, stage = "result") {
  const lesen=read(keys.lesen), schreiben=read(keys.schreiben), sprechen=read(keys.sprechen);
  return {mockId,assessmentVersion:A2_KOMBI_VERSION,stage,clientSavedAtMs:Date.now(),
    lesenAnswers:lesen.answers || {},schreibenSubmittedAt:schreiben.submittedAt || null,
    sprechenSessionIds:["1","2","3"].map(teil=>sprechen.parts?.[teil]?.sessionId || null)};
}

export function a2KombiProgress(keys) {
  const lesen=read(keys.lesen),schreiben=read(keys.schreiben),sprechen=read(keys.sprechen);
  return {
    lesen:{done:Boolean(lesen.completedAt),count:Object.keys(lesen.answers||{}).length},
    schreiben:{done:Boolean(schreiben.submittedAt),count:[schreiben.sms,schreiben.email].filter(t=>String(t||"").trim()).length},
    sprechen:{done:["1","2","3"].every(teil=>sprechen.parts?.[teil]?.sessionId && sprechen.parts?.[teil]?.assessment),
      count:["1","2","3"].filter(teil=>sprechen.parts?.[teil]?.sessionId&&sprechen.parts?.[teil]?.assessment).length},
  };
}
export async function finalizeA2Kombi({keys,mockId,attemptId,idToken}) {
  if(!/^a2-mock-0[4-8]$/.test(mockId)||!attemptId||!idToken) throw new Error("Verified A2 mock attempt required.");
  const state=getA2KombiState(keys,mockId);
  const p=a2KombiProgress(keys);
  if(!p.lesen.done||!p.schreiben.done||!p.sprechen.done) throw new Error("Submit Lesen, Schreiben and all three speaking parts before scoring.");
  // One read-only checkpoint followed by reuse-safe server receipts.
  await saveA2MockAttempt({idToken,attemptId,section:"result",status:"in_progress",state});
  const writing=read(keys.schreiben);
  await scoreA2MockWriting({idToken,attemptId,mockId,sms:writing.sms||"",email:writing.email||""});
  await scoreA2MockSpeaking({idToken,attemptId,mockId,examinerSessionIds:state.sprechenSessionIds});
  const response=await saveA2MockAttempt({idToken,attemptId,section:"result",status:"completed",state});
  if(!response?.verifiedResult||response?.completionSync?.ok!==true)throw new Error("Your /75 score is awaiting verified Results sync. Retry; do not repeat the exam.");
  return response.verifiedResult;
}
