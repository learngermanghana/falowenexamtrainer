import { saveA2MockAttempt, scoreA2MockWriting } from "./a2FinalMockService";
import { scoreA2MockSpeaking } from "./coachService";

export const A2_MOCK_3_ID = "a2-mock-03";
const read = key => {
  try { return JSON.parse(localStorage.getItem(key) || "{}") || {}; }
  catch { return {}; }
};

export function savedA2Mock3State(keys, stage = "result") {
  const lesen = read(keys.lesen), hoeren = read(keys.hoeren);
  const schreiben = read(keys.schreiben), sprechen = read(keys.sprechen);
  return {
    stage,
    clientSavedAtMs: Date.now(),
    lesenAnswers: lesen.answers || {},
    hoerenAnswers: hoeren.answers || {},
    schreibenSubmittedAt: schreiben.submittedAt || null,
    sprechenSessionIds: ["1","2","3"].map(part => sprechen._examinerParts?.[part]?.sessionId || null),
  };
}

export async function finalizeA2Mock3({ keys, attemptId, idToken }) {
  if (!attemptId || !idToken) throw new Error("Sign in to connect Mock 03 to a verified attempt.");
  const writing = read(keys.schreiben);
  const state = savedA2Mock3State(keys);

  // Checkpoint every answer before making any AI scoring request.
  await saveA2MockAttempt({idToken,attemptId,section:"result",status:"in_progress",state});
  await scoreA2MockWriting({
    idToken,attemptId,mockId:A2_MOCK_3_ID,
    sms:writing.sms || "",email:writing.email || "",
  });
  if (state.sprechenSessionIds.some(id => !id)) {
    throw new Error("Complete all three speaking parts before final scoring. Your work remains saved.");
  }
  // Evaluate existing immutable examiner receipts. Do not make another AI call.
  await scoreA2MockSpeaking({
    idToken,attemptId,mockId:A2_MOCK_3_ID,
    examinerSessionIds:state.sprechenSessionIds,
  });
  const response=await saveA2MockAttempt({
    idToken,attemptId,section:"result",status:"completed",state,
  });
  if (!response?.verifiedResult || response?.completionSync?.ok !== true) {
    throw new Error("Mock 03 final score has not been saved to Results. Retry verification.");
  }
  return response.verifiedResult;
}
