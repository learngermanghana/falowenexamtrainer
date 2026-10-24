import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { analyzeAudio } from "../services/coachService";
import { buildRecordedAudioBlob, createSpeakingMediaRecorder, userFacingAudioError } from "../lib/speakingAudio";
import { styles } from "../styles";

export default function A1FamilyRecording({ value, onMarked }) {
  const { user } = useAuth();
  const recorder = useRef(null);
  const stream = useRef(null);
  const mounted = useRef(true);
  const [phase, setPhase] = useState("idle");
  const [blob, setBlob] = useState(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (recorder.current) recorder.current.onstop = null;
      if (recorder.current?.state === "recording") recorder.current.stop();
      stream.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);
  useEffect(() => {
    if (!blob) return undefined;
    const next = URL.createObjectURL(blob);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [blob]);

  const start = async () => {
    setError("");
    setPhase("starting");
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Voice recording is not supported on this browser.");
      const nextStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mounted.current) { nextStream.getTracks().forEach((track) => track.stop()); return; }
      stream.current = nextStream;
      const nextRecorder = createSpeakingMediaRecorder(nextStream);
      recorder.current = nextRecorder;
      const chunks = [];
      nextRecorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
      nextRecorder.onstop = () => {
        nextStream.getTracks().forEach((track) => track.stop());
        if (!mounted.current) return;
        try { setBlob(buildRecordedAudioBlob(chunks, nextRecorder)); }
        catch (err) { setError(userFacingAudioError(err)); }
        setPhase("idle");
      };
      nextRecorder.start();
      setBlob(null);
      setPhase("recording");
    } catch (err) {
      stream.current?.getTracks().forEach((track) => track.stop());
      if (mounted.current) { setError(userFacingAudioError(err)); setPhase("idle"); }
    }
  };
  const mark = async () => {
    if (!blob || !user || phase !== "idle") return;
    setPhase("marking");
    setError("");
    try {
      const result = await analyzeAudio({
        transcriptionOnly: true, audioBlob: blob, teil: "1", level: "A1", userId: user.uid,
        idToken: await user.getIdToken(), contextType: "A1 Day 7 family speaking workbook",
        question: "Sprich über deine Familie: Familienmitglieder, Namen und Alter, Berufe, Hobbys und Wohnort. Assess this beginner A1 family description. Give a score out of 10, explain correct language and mistakes, and give a short corrected example. Do not penalize invented personal details.",
      });
      if (!String(result.transcript || "").trim()) throw new Error("No clear answer was heard. Please try again.");
      if (!/^https:\/\//i.test(result.audioUrl || "")) throw new Error("Your recording could not be saved online. Please retry; your recording is still available here.");
      if (mounted.current) { onMarked({ transcript: result.transcript, audioUrl: result.audioUrl, savedAt: new Date().toISOString() }); setBlob(null); setUrl(""); }
    } catch (err) { if (mounted.current) setError(userFacingAudioError(err)); }
    finally { if (mounted.current) setPhase("idle"); }
  };
  return <div data-a1-family-recorder="true" style={{ display: "grid", gap: 12 }}>
    <button type="button" style={styles.secondaryButton} disabled={phase === "starting" || phase === "marking"}
      onClick={() => phase === "recording" ? recorder.current?.stop() : start()}>
      {phase === "recording" ? "Stop recording" : phase === "starting" ? "Opening microphone…" : "Record family answer"}
    </button>
    {url ? <audio controls src={url} aria-label="Your family recording" /> : null}
    {blob ? <button type="button" style={styles.primaryButton} disabled={!user || phase !== "idle"} onClick={mark}>
      {phase === "marking" ? "Saving recording…" : "Save recording"}
    </button> : null}
    {!user ? <p>Sign in to save your answer.</p> : null}
    {error ? <p role="alert">{error}</p> : null}
    {value ? <div style={{ whiteSpace: "pre-wrap" }}>
      {value.audioUrl ? <audio controls src={value.audioUrl} aria-label="Saved family recording" /> : null}
      <h3>Your spoken answer</h3><p>{value.transcript}</p>
      <p>Your recording is saved. AI marks the complete assignment after final submission.</p>
    </div> : null}
  </div>;
}
