import { getBackendUrl } from "./backendUrl";

export function reportA2MockSubmission({ idToken, mockId, module, phase, outcome }) {
  if (!idToken || typeof fetch !== "function") return;
  // Diagnostics must never delay submission. Only fixed categories leave the device.
  void fetch(`${getBackendUrl()}/a2-mock/submission-diagnostic`, {
    method: "POST",
    headers: { Authorization: `Bearer ${idToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ mockId, module, phase, outcome }),
    keepalive: true,
  }).catch(() => {});
}

export async function runA2MockSubmissionStep(context, module, phase, action) {
  try {
    const result = await action();
    if (context.retry) reportA2MockSubmission({ ...context, module, phase, outcome: "retry_succeeded" });
    return result;
  } catch (error) {
    reportA2MockSubmission({ ...context, module, phase, outcome: context.retry ? "retry_failed" : "failed" });
    throw Object.assign(error, { submissionModule: module, submissionPhase: phase });
  }
}
