import { saveA2MockAttempt, scoreA2MockWriting } from "./a2FinalMockService";
import { scoreA2MockSpeaking } from "./coachService";

const read = key => {
  try { return JSON.parse(localStorage.getItem(key) || "null") || {}; }
  catch { return {}; }
};

// Shared final-result contract. Register an A2 mock on the server before making
// a new exam: all four scores are computed or validated by that server.
export async function finalizeA2RegisteredMock({
  mockId, attemptId, idToken, storageKeys, legacySpeakingTasks=[], speakingRubric=null,
}) {
  if (!mockId || !attemptId || !idToken) throw new Error("Sign in and restore your saved mock attempt before final marking.");
  const lesen=read(storageKeys.lesen),hoeren=read(storageKeys.hoeren),
    schreiben=read(storageKeys.schreiben),sprechen=read(storageKeys.sprechen);
  if (!lesen.completedAt || !hoeren.completedAt || !schreiben.submittedAt) {
    throw new Error("All reading, listening and writing answers must be submitted first.");
  }
  // Server caches a previously verified writing score; retrying after a
  // failed final save does not require another OpenAI writing request.
  await scoreA2MockWriting({
    idToken,attemptId,mockId,
    sms:schreiben.sms || "",email:schreiben.email || "",
  });
  const sessions=["1","2","3"].map(part=>sprechen._examinerParts?.[part]?.sessionId || null);
  if (sessions.every(Boolean)) {
    await scoreA2MockSpeaking({idToken,attemptId,mockId,examinerSessionIds:sessions});
  } else if (legacySpeakingTasks.length === 5 && legacySpeakingTasks.every(task=>Boolean(sprechen[task.id]?.transcript))) {
    // Recover old five-transcript exams. These transcripts were saved before
    // the live examiner replaced the recorder, so the assessment happens once.
    await scoreA2MockSpeaking({idToken,attemptId,mockId,rubric:speakingRubric,
      attempts:legacySpeakingTasks.map(task=>({
        ...task,transcript:sprechen[task.id].transcript,analysisFeedback:"",
      }))});
  } else {
    throw new Error("A saved speaking assessment is missing. Resume the speaking module; completed work will be retained.");
  }
  // Browser marks are intentionally not submitted as verified marks.
  const state={
    stage:"result",clientSavedAtMs:Date.now(),
    lesenAnswers:lesen.answers || {},hoerenAnswers:hoeren.answers || {},
  };
  const result=await saveA2MockAttempt({
    idToken,attemptId,section:"result",state,
    status:"completed",sectionScores:{},overall:null,
  });
  if (result?.status!=="completed" || result?.completionSync?.ok!==true ||
    !result?.verifiedResult?.overall ||
    !["lesen","hoeren","schreiben","sprechen"].every(section=>
      Number.isFinite(Number(result?.verifiedResult?.sectionScores?.[section])))) {
    throw new Error("Your final result is not yet verified and published. Retry without repeating the exam.");
  }
  return result.verifiedResult;
}
