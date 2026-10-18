import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { buildRecordedAudioBlob, createSpeakingMediaRecorder, userFacingAudioError } from "../lib/speakingAudio";
import { assessA1WorkbookSpeaking } from "../services/a1WorkbookSpeakingService";
import { useA1TutorWorkbookDraft } from "./A1TutorWorkbookDraftContext";

export const A1_WORKBOOK_SPEAKING = Object.freeze({
  "A1-4": Object.freeze({
    sectionKey: "teil-2",
    part: 1,
    title: "Sich vorstellen",
    instruction: "Stellen Sie sich kurz vor: Name, Alter, Land, Wohnort, Sprachen, Beruf und Hobby. Buchstabieren Sie auch Ihren Nachnamen.",
    cards: ["Name · Alter · Land · Wohnort", "Sprachen · Beruf · Hobby", "Nachnamen buchstabieren"],
    guidance: "Speak about yourself, not a fictional model answer. Use complete, short German sentences.",
  }),
  "A1-8": Object.freeze({
    sectionKey: "teil-2",
    part: 2,
    title: "Fragen stellen und antworten",
    instruction: "Stellen Sie zu jeder Karte eine passende Frage. Geben Sie danach eine mögliche kurze Antwort auf Ihre Frage.",
    cards: ["THEMA: Termine · STICHWORT: Uhrzeit", "THEMA: Freizeit · STICHWORT: Wochenende"],
    guidance: "Two questions and two answers, all spoken in German. Do not read a complete example.",
  }),
  "A1-11": Object.freeze({
    sectionKey: "teil-1",
    part: 3,
    title: "Bitten und reagieren",
    instruction: "Bitten Sie höflich um Hilfe: Karte 1 – Fenster öffnen. Karte 2 – Stift geben. Reagieren Sie dann auf: „Können Sie mir bitte den Stadtplan geben?“",
    cards: ["KARTE 1: Fenster", "KARTE 2: Stift", "PARTNERBITTE: Stadtplan"],
    guidance: "Make two polite requests and say an appropriate response to the partner's request.",
  }),
});

const sectionStyle = {
  border: "1px solid #cbd5e1",
  borderRadius: 16,
  background: "#fff",
  padding: 18,
  display: "grid",
  gap: 14,
};

export default function A1WorkbookSpeakingCheckpoint({ assignmentKey }) {
  const config = A1_WORKBOOK_SPEAKING[assignmentKey];
  const { user } = useAuth();
  const draft = useA1TutorWorkbookDraft();
  const [phase, setPhase] = useState("idle");
  const [blob, setBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const mountedRef = useRef(true);
  const busyRef = useRef(false);
  const savedText = String(draft?.draft?.sections?.[config?.sectionKey]?.text || "");
  const completed = /^SPEAKING_SCORE:\s*(10|[0-9])\/10(?:\n|$)/.test(savedText);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (recorderRef.current) recorderRef.current.onstop = null;
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (!blob) { setPreviewUrl(""); return undefined; }
    const nextUrl = URL.createObjectURL(blob);
    setPreviewUrl(nextUrl);
    return () => URL.revokeObjectURL(nextUrl);
  }, [blob]);

  if (!config || draft?.assignmentKey !== assignmentKey) return null;

  const stop = () => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  };

  const start = async () => {
    if (completed || busyRef.current || phase === "recording" || phase === "assessing") return;
    setError("");
    setBlob(null);
    setPhase("starting");
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Your browser does not support microphone recording.");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mountedRef.current) { stream.getTracks().forEach((track) => track.stop()); return; }
      streamRef.current = stream;
      const recorder = createSpeakingMediaRecorder(stream);
      recorderRef.current = recorder;
      const chunks = [];
      recorder.ondataavailable = (event) => { if (event.data?.size) chunks.push(event.data); };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        if (!mountedRef.current) return;
        try { setBlob(buildRecordedAudioBlob(chunks, recorder)); }
        catch (err) { setError(userFacingAudioError(err)); }
        setPhase("idle");
      };
      recorder.start();
      setPhase("recording");
    } catch (err) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (mountedRef.current) { setError(userFacingAudioError(err)); setPhase("idle"); }
    }
  };

  const assess = async () => {
    if (!blob || completed || busyRef.current || !user) return;
    busyRef.current = true;
    setPhase("assessing");
    setError("");
    try {
      const result = await assessA1WorkbookSpeaking({
        audioBlob: blob,
        assignmentKey,
        idToken: await user.getIdToken(),
      });
      if (!mountedRef.current) return;
      const clean = (value) => String(value || "").replace(/[\r\n]+/g, " ").trim().slice(0, 300);
      const saved = "SPEAKING_SCORE: " + result.score + "/10\nSTRENGTH: " +
        clean(result.strength) + "\nIMPROVE: " + clean(result.improvement);
      draft.updateSectionText(config.sectionKey, saved);
      setBlob(null);
      setPhase("saved");
    } catch (err) {
      if (mountedRef.current) {
        setError(err.response?.data?.error || err.message || "Could not assess the recording. Your recording is still available to retry.");
        setPhase("idle");
      }
    } finally {
      busyRef.current = false;
    }
  };

  return (
    <section data-a1-workbook-speaking={assignmentKey} style={sectionStyle}>
      <div>
        <span style={{ color: "#4338ca", fontSize: 12, fontWeight: 800 }}>GOETHE A1 SPRECHEN · PRÜFUNGSTEIL {config.part}</span>
        <h2 style={{ margin: "6px 0" }}>Sprechen · {config.title}</h2>
        <p style={{ lineHeight: 1.6, margin: 0 }}>{config.instruction}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
        {config.cards.map((card) => (
          <div key={card} style={{ padding: 14, background: "#f0f4ff", border: "1px solid #c7d2fe", borderRadius: 12, fontWeight: 700 }}>{card}</div>
        ))}
      </div>
      <p style={{ color: "#475569", margin: 0 }}>{config.guidance}</p>
      {completed ? (
        <div role="status" style={{ color: "#166534", background: "#f0fdf4", borderRadius: 12, padding: 14 }}>
          <strong>Speaking checkpoint assessed and saved.</strong>
          <p style={{ margin: "8px 0", fontSize: 20, fontWeight: 800 }}>{savedText.match(/^SPEAKING_SCORE:\s*(\d+)\/10/)?.[1]}/10</p>
          <p style={{ margin: 0, whiteSpace: "pre-line" }}>{savedText.split("\n").slice(1).join("\n")}</p>
          <p style={{ marginBottom: 0 }}>Go to Review & Submit to send this result with your assignment. No audio was stored.</p>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <button type="button" onClick={phase === "recording" ? stop : start}
              disabled={phase === "assessing" || phase === "starting"}
              style={{ background: "#1d4ed8", color: "#fff", border: 0, borderRadius: 9, padding: "12px 16px", fontWeight: 800 }}>
              {phase === "recording" ? "Stop recording" : phase === "starting" ? "Opening microphone…" : "Record answer"}
            </button>
          </div>
          {previewUrl ? <audio controls src={previewUrl} aria-label="Review your speaking recording" /> : null}
          {blob ? (
            <div style={{ display: "grid", gap: 8 }}>
              <p style={{ margin: 0 }}>Listen to your answer. You can re-record without using AI before you submit it for assessment.</p>
              <button type="button" onClick={assess} disabled={phase === "assessing"}
                style={{ background: "#166534", color: "#fff", border: 0, borderRadius: 9, padding: "12px 16px", fontWeight: 800 }}>
                {phase === "assessing" ? "Assessing speaking…" : "Assess & save final recording"}
              </button>
            </div>
          ) : null}
          <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>
            Recording stays in this browser until you assess it. Only the score and short feedback enter your assignment draft.
            Assessment uses one paid AI request; replaying and re-recording locally are free.
          </p>
        </>
      )}
      {error ? <p role="alert" style={{ color: "#b91c1c", margin: 0 }}>{error}</p> : null}
    </section>
  );
}
