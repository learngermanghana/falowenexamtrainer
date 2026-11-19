import React, { useEffect, useState } from "react";

function MicrophoneLevel({stream}) {
  const [level, setLevel] = useState(null);
  const label = stream.getAudioTracks?.()[0]?.label || "Microphone";
  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    let context;
    let timer;
    try {
      context = new AudioContext();
      const analyser = context.createAnalyser();
      analyser.fftSize = 1024;
      const source = context.createMediaStreamSource(stream);
      source.connect(analyser);
      const samples = new Uint8Array(analyser.fftSize);
      context.resume().catch(() => {});
      timer = window.setInterval(() => {
        if (context.state !== "running") return;
        analyser.getByteTimeDomainData(samples);
        let energy = 0;
        for (const sample of samples) energy += ((sample - 128) / 128) ** 2;
        const rms = Math.sqrt(energy / samples.length);
        const decibels = 20 * Math.log10(Math.max(rms, 0.001));
        setLevel(Math.max(0, Math.min(60, decibels + 60)));
      }, 150);
    } catch {
      // Monitoring is optional on browsers with limited Web Audio support.
    }
    return () => {
      window.clearInterval(timer);
      context?.close().catch(() => {});
    };
  }, [stream]);
  return <label>{label} {level !== null && <>
    <meter aria-label="Microphone input level" min={0} max={60} value={level} />
    <small> If the meter stays low while you speak, move closer or check your microphone input.</small>
  </>}</label>;
}

const Microphone=()=> <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/></svg>;
export default function SpeakingRecorder({recording,disabled,onRecord,onStop,stream}) {
  return <div className="speaking-recorder-controls" role="group" aria-label="Recording controls">
    <button type="button" className={recording ? "speaking-recorder-main is-recording" : "speaking-recorder-main"}
      aria-label={recording ? "Stop and send recording" : "Record German answer"}
      onClick={recording ? onStop : onRecord} disabled={disabled}>
      <span>{recording ? <svg viewBox="0 0 24 24" aria-hidden="true"><rect className="speaking-stop-symbol" x="5" y="5" width="14" height="14" rx="3"/></svg> : <Microphone/>}</span>
      <strong>{recording ? "Stop recording" : "Record answer"}</strong>
    </button>
    {recording && stream ? <MicrophoneLevel stream={stream}/> : null}
  </div>;
}
