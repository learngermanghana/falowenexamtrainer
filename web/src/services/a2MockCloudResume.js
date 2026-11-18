import { startA2MockAttempt } from "./a2FinalMockService";

export async function resumeA2MockSections({ keys, idToken, mockId }) {
  const response = await startA2MockAttempt({ idToken, mockId, resumeOnly: true });
  if (!response?.resumed || !response.attemptId) return null;

  const state = response.state || {};
  const stages = ["lesen", "hoeren", "schreiben", "sprechen", "result"];
  const rank = stages.indexOf(state.stage);
  const recovered = {};
  for (const section of ["lesen", "hoeren"]) {
    const completedAt = state[`${section}CompletedAt`];
    // Older checkpoints predate explicit completion timestamps.
    if (completedAt || rank > stages.indexOf(section)) {
      recovered[section] = { completedAt: completedAt || state.clientSavedAtMs || Date.now(),
        answers: state[`${section}Answers`] || {} };
    }
  }
  if (state.schreibenSubmission?.submittedAt) recovered.schreiben = state.schreibenSubmission;
  if (Object.keys(response.examinerParts || {}).length) recovered.sprechen = { _examinerParts: response.examinerParts };
  const next = ["lesen", "hoeren", "schreiben"].find(section => !recovered[section]);
  if (next === state.stage && state.sectionStartedAtMs && !recovered[next]) {
    recovered[next] = { startedAt: state.sectionStartedAtMs };
  }
  for (const section of Object.keys(recovered)) {
    const current = JSON.parse(localStorage.getItem(keys[section]) || "{}");
    if (Object.keys(current || {}).length) throw new Error("This device already has answers. Open the local attempt to keep that work.");
  }
  for (const [section, data] of Object.entries(recovered)) localStorage.setItem(keys[section], JSON.stringify(data));
  return {
    stage: next || "sprechen",
    startedAt: state.attemptStartedAtMs || Date.now(),
    attemptInfo: { attemptId: response.attemptId, attemptNumber: response.attemptNumber, firstAttempt: response.firstAttempt },
  };
}
