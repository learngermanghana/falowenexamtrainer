import React from "react";
const Microphone=()=> <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/></svg>;
const Play=()=> <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 4 12 8-12 8Z"/></svg>;
const Speaker=()=> <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h4l5-5v16l-5-5H3ZM16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14"/></svg>;
export default function SpeakingRecorder({recording,disabled,listenDisabled,replayDisabled,onRecord,onStop,onListen,onReplay}) {
  return <div className="speaking-recorder-controls" role="group" aria-label="Recording controls">
    <button type="button" className="speaking-recorder-secondary" aria-label="Replay examiner audio" onClick={onListen} disabled={listenDisabled}>
      <span><Speaker/></span><small>Listen</small>
    </button>
    <button type="button" className={recording ? "speaking-recorder-main is-recording" : "speaking-recorder-main"}
      aria-label={recording ? "Stop and send recording" : "Record German answer"}
      onClick={recording ? onStop : onRecord} disabled={disabled}>
      <span>{recording ? <svg viewBox="0 0 24 24" aria-hidden="true"><rect className="speaking-stop-symbol" x="5" y="5" width="14" height="14" rx="3"/></svg> : <Microphone/>}</span>
      <strong>{recording ? "Stop recording" : "Record answer"}</strong>
    </button>
    <button type="button" className="speaking-recorder-secondary" aria-label="Play my last recording" onClick={onReplay} disabled={replayDisabled}>
      <span><Play/></span><small>My recording</small>
    </button>
  </div>;
}
