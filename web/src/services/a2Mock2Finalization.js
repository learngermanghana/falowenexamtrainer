import { saveA2MockAttempt, scoreA2MockWriting } from "./a2FinalMockService";
import { scoreA2MockSpeaking } from "./coachService";

export const A2_MOCK_2_ID = "a2-mock-02";
const OLD_SPEAKING_PARTS = [
  ["t1_questions", "1"], ["t1_answers", "1"], ["t2_main", "2"],
  ["t2_followups", "2"], ["t3_plan", "3"],
];
const read = (key) => {
  try { return JSON.parse(localStorage.getItem(key) || "null") || {}; }
  catch { return {}; }
};

// The server, not the browser's calculated score, owns the official marks.
export function savedA2Mock2State(keys, stage = "result") {
  const lesen = read(keys.lesen);
  const hoeren = read(keys.hoeren);
  const schreiben = read(keys.schreiben);
  const sprechen = read(keys.sprechen);
  return {
    stage,
    clientSavedAtMs: Date.now(),
    lesenAnswers: lesen.answers || {},
    hoerenAnswers: hoeren.answers || {},
    schreibenSubmittedAt: schreiben.submittedAt || null,
    sprechenSessionIds: ["1", "2", "3"].map(part => sprechen._examinerParts?.[part]?.sessionId || null),
  };
}

export async function finalizeA2Mock2({ keys, attemptId, idToken }) {
  if (!attemptId || !idToken) throw new Error("Sign in to connect this mock to your exam attempt.");
  const writing = read(keys.schreiben);
  const speaking = read(keys.sprechen);
  const state = savedA2Mock2State(keys);

  // First checkpoint the submitted answers; retries must not destroy them.
  await saveA2MockAttempt({
    idToken, attemptId, section: "result", status: "in_progress", state,
  });
  // Writing is one combined A2 /25 OpenAI assessment, NOT two practice
  // requests. The server reuses the verified mark if one is already saved.
  await scoreA2MockWriting({
    idToken, attemptId, mockId: A2_MOCK_2_ID,
    sms: writing.sms || "", email: writing.email || "",
  });

  if (state.sprechenSessionIds.every(Boolean)) {
    // New conversational examiner. Verify actual stored session receipts
    // against the student's correct mock attempt; no new LLM grading call.
    await scoreA2MockSpeaking({
      idToken, attemptId, mockId: A2_MOCK_2_ID,
      examinerSessionIds: state.sprechenSessionIds,
    });
  } else if (OLD_SPEAKING_PARTS.every(([key]) => speaking[key]?.transcript)) {
    // Preserve pre-redesign five-recording students. Score saved transcripts
    // against the canonical Mock 2 tasks without asking them to record again.
    await scoreA2MockSpeaking({
      idToken, attemptId, mockId: A2_MOCK_2_ID,
      attempts: OLD_SPEAKING_PARTS.map(([key, teil]) => ({
        id: key, teil, task: key, transcript: speaking[key].transcript,
      })),
    });
  } else {
    throw new Error("Speaking answers are incomplete or cannot be verified. Your saved work remains available.");
  }

  const response = await saveA2MockAttempt({
    idToken, attemptId, section: "result", status: "completed", state,
  });
  if (!response?.verifiedResult || response?.completionSync?.ok !== true) {
    throw new Error("The final exam score was not confirmed in Results. Retry submission without repeating the exam.");
  }
  return response.verifiedResult;
}
