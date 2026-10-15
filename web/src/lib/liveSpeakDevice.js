// Small, provider-independent helpers for the Goethe Speaking Exam UI.
export function microphoneFailureMessage(error) {
  const name = String(error?.name || "");
  if (name === "NotAllowedError" || name === "PermissionDeniedError" || name === "SecurityError") {
    return "Microphone access is blocked. Allow microphone permission for Falowen in your browser settings, then tap Record again.";
  }
  if (name === "NotFoundError" || name === "DevicesNotFoundError") {
    return "No microphone was found. Connect a microphone or use your phone's built-in microphone and try again.";
  }
  if (name === "NotReadableError" || name === "TrackStartError" || name === "AbortError") {
    return "Your microphone is in use or was interrupted. Close other voice apps, return to Falowen and retry.";
  }
  if (name === "OverconstrainedError") {
    return "The selected microphone cannot record with the requested settings. Try your phone microphone.";
  }
  return "Could not start your microphone. Check browser permissions and your connection, then try again.";
}

export function speakingTurnLabel({recording=false,pending=false,busy=false,feedbackBusy=false,voiceState="idle",session=null,taskReady=false,expired=false}) {
  if (recording) return "Listening to your answer";
  if (feedbackBusy) return "Preparing your feedback";
  if (busy) return "Processing your answer";
  if (pending) return "Check your recorded answer";
  if (voiceState === "playing") return "Examiner speaking";
  if (voiceState === "blocked") return "Examiner audio needs a replay";
  if (!session) return "Ready to start the exam";
  if (taskReady) return "Task complete — review feedback";
  if (expired) return "Exam time has ended";
  return "Your turn to speak";
}


// Keep 90s answers within the 350,000-byte server limit, including the
// recorder's 32KiB headroom. Higher quality applies to shorter replies only.
// A 90s recording at 32kbps exceeds 350kB before container overhead.
export function speakingRecordingBitrate({localOnly=false,maxRecordingSeconds=20}={}) {
  const seconds=Number(maxRecordingSeconds)||20;
  return localOnly || seconds>75 ? 24000 : 32000;
}
