import React, { useEffect, useRef, useState } from "react";

/**
 * Short pronunciation practice only: recording stays in the browser session.
 * Do not upload, save to a course submission, or send to AI services.
 */
export default function A1Day4PhoneNumberSpeakingPractice() {
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const audioUrlRef = useRef("");
  const [audioUrl, setAudioUrl] = useState("");
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");

  const releaseStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };
  const clearAudio = () => {
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    audioUrlRef.current = "";
    setAudioUrl("");
  };

  useEffect(() => () => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    releaseStream();
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
  }, []);

  const startRecording = async () => {
    setError("");
    if (!navigator?.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("Recording is unavailable in this browser. Practise the sentence aloud instead.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data?.size) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        releaseStream();
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        if (blob.size) {
          clearAudio();
          audioUrlRef.current = URL.createObjectURL(blob);
          setAudioUrl(audioUrlRef.current);
        }
        chunksRef.current = [];
        setRecording(false);
      };
      recorder.onerror = () => {
        setError("Audio recording stopped unexpectedly. Please try again.");
        setRecording(false);
        releaseStream();
      };
      clearAudio();
      recorder.start();
      setRecording(true);
    } catch {
      setError("Microphone permission was not granted. You can still practise aloud.");
      releaseStream();
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  };

  return (
    <div data-a1-day4-phone-speaking="true" style={{ display: "grid", gap: 12 }}>
      <p style={{ margin: 0 }}>Sagen Sie eine Telefonnummer auf Deutsch. Sie können eine <strong>erfundene Nummer</strong> benutzen.</p>
      <div style={{ padding: 12, background: "#eff6ff", borderRadius: 12, lineHeight: 1.7 }}>
        <strong>Beispiel:</strong> Meine Telefonnummer ist null eins sieben eins – drei drei – fünf fünf – neun null.
        <p style={{ margin: "6px 0 0" }}><strong>Nummer:</strong> 0171 33 55 90</p>
      </div>
      <p style={{ margin: 0 }}>Sprechen Sie langsam. Hören Sie Ihre Aufnahme an und versuchen Sie es noch einmal.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <button type="button" onClick={recording ? stopRecording : startRecording}
          aria-label={recording ? "Stop phone number recording" : "Record phone number in German"}
          style={{ padding: "10px 16px", borderRadius: 10, background: recording ? "#991b1b" : "#1d4ed8", color: "#fff", border: 0, cursor: "pointer", fontWeight: 700 }}>
          {recording ? "Aufnahme stoppen" : "Telefonnummer aufnehmen"}
        </button>
        {audioUrl && !recording ? <button type="button" onClick={clearAudio}
          style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid #94a3b8", borderRadius: 10, background: "#fff" }}>Aufnahme löschen</button> : null}
      </div>
      {audioUrl && !recording ? <audio controls src={audioUrl} aria-label="Play your phone number recording" /> : null}
      {error ? <p role="alert" style={{ margin: 0, color: "#991b1b" }}>{error}</p> : null}
      <small style={{ color: "#475569" }}>Practice only. Your recording is not uploaded, graded or included in the tutor submission; it disappears when you leave or reload this page.</small>
    </div>
  );
}
