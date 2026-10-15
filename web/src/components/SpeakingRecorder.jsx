import React from "react";
const Microphone=()=> <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/></svg>;
export default function SpeakingRecorder({recording,disabled,onRecord,onStop}) {
  return <div className="speaking-recorder-controls" role="group" aria-label="Recording controls">
    <button type="button" className={recording ? "speaking-recorder-main is-recording" : "speaking-recorder-main"}
      aria-label={recording ? "Stop and send recording" : "Record German answer"}
      onClick={recording ? onStop : onRecord} disabled={disabled}>
      <span>{recording ? <svg viewBox="0 0 24 24" aria-hidden="true"><rect className="speaking-stop-symbol" x="5" y="5" width="14" height="14" rx="3"/></svg> : <Microphone/>}</span>
      <strong>{recording ? "Stop recording" : "Record answer"}</strong>
    </button>
  </div>;
}
