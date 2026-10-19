import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useA1TutorWorkbookDraft } from "./A1TutorWorkbookDraftContext";
import { assessA1TutorSpeaking } from "../services/coachService";
import { buildRecordedAudioBlob, createSpeakingMediaRecorder, userFacingAudioError } from "../lib/speakingAudio";

const TASKS = {
  "A1-2": {
    examPart: 1,
    heading: "Telefonnummer sprechen",
    instructions: "Sagen Sie: Meine Telefonnummer ist … Sprechen Sie die Ziffern langsam und deutlich. Sie können eine erfundene Nummer sagen, zum Beispiel 0171 33 55 90. Bewertet werden Klarheit und Aussprache der Zahlen, nicht eine bestimmte private Nummer.",
    cards: ["Meine Telefonnummer ist …", "0 · null", "1 · eins", "7 · sieben", "9 · neun"],
    assessmentMarker: "A1_NUMBERS_PHONE_SPEAKING_V1",
    taskLine: "Speaking task: phone number",
    label: "A1 · Zahlen sprechen",
  },
  "A1-4": {
    examPart: 1,
    heading: "Sich vorstellen",
    instructions: "Stellen Sie sich vor. Sagen Sie Ihren Namen, Ihr Alter, Ihr Land, Ihren Wohnort, Ihre Sprachen, Ihren Beruf und Ihr Hobby. Buchstabieren Sie Ihren Nachnamen.",
    cards: ["Name", "Alter", "Land", "Wohnort", "Sprachen", "Beruf", "Hobby", "Nachname"],
  },
  "A1-8": {
    examPart: 2,
    heading: "Fragen und Antworten",
    instructions: "Thema: Termine. Stichwort: Uhrzeit. Stellen Sie eine Frage. Thema: Freizeit. Stichwort: Wochenende. Stellen Sie eine zweite Frage. Beantworten Sie auch: Wann beginnt Ihr Deutschkurs?",
    cards: ["Termine · Uhrzeit", "Freizeit · Wochenende"],
  },
  "A1-11": {
    examPart: 3,
    heading: "Bitten und Reagieren",
    instructions: "Bitten Sie höflich um einen Stift. Bitten Sie eine Person, das Fenster zu öffnen. Reagieren Sie auf die Bitte: Können Sie mir bitte den Stadtplan geben?",
    cards: ["Stift", "Fenster", "Stadtplan"],
  },
};

export default function A1TutorSpeakingCheckpoint({ assignmentKey, sectionKey }) {
  const task = TASKS[assignmentKey];
  const { user } = useAuth();
  const { draft, updateSectionText } = useA1TutorWorkbookDraft() || {};
  const saved = draft?.sections?.[sectionKey]?.text || "";
  const marker = task?.assessmentMarker || "GOETHE_A1_TUTOR_SPEAKING_V1";
  const alreadyAssessed = saved.startsWith(marker);
  const recorder = useRef(null);
  const stream = useRef(null);
  const mountedRef = useRef(false);
  const requestingMicrophoneRef = useRef(false);
  const [recording, setRecording] = useState(false);
  const [blob, setBlob] = useState(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!blob) { setPreview(""); return undefined; }
    const url = URL.createObjectURL(blob);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [blob]);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      // getUserMedia may still be waiting for permission at this point.
      // Its continuation must stop any stream that resolves after unmount.
      if (recorder.current?.state === "recording") recorder.current.stop();
      stream.current?.getTracks().forEach((track) => track.stop());
      stream.current = null;
    };
  }, []);
  if (!task) return null;

  const record = async () => {
    setError("");
    if (alreadyAssessed || requestingMicrophoneRef.current) return;
    if (recording) {
      recorder.current?.stop();
      return;
    }
    requestingMicrophoneRef.current = true;
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mountedRef.current) {
        // A learner navigated away while the browser permission prompt was open.
        media.getTracks().forEach((track) => track.stop());
        return;
      }
      stream.current = media;
      const next = createSpeakingMediaRecorder(media);
      const chunks = [];
      next.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
      next.onstop = () => {
        media.getTracks().forEach((track) => track.stop());
        if (stream.current === media) stream.current = null;
        if (!mountedRef.current) return;
        setBlob(buildRecordedAudioBlob(chunks, next));
        setRecording(false);
      };
      recorder.current = next;
      setBlob(null);
      next.start();
      setRecording(true);
    } catch (cause) {
      stream.current?.getTracks().forEach((track) => track.stop());
      stream.current = null;
      if (mountedRef.current) {
        setError(userFacingAudioError(cause));
        setRecording(false);
      }
    } finally {
      requestingMicrophoneRef.current = false;
    }
  };

  const assess = async () => {
    if (!blob || !user || busy || recording || alreadyAssessed) return;
    setBusy(true);
    setError("");
    try {
      const result = await assessA1TutorSpeaking({
        audioBlob: blob,
        assignmentKey,
        examPart: task.examPart,
        question: task.instructions,
        idToken: await user.getIdToken(),
      });
      const rawScore = result.score ?? result.assessment?.score ?? result.result?.score ?? result.scores?.overall ?? result.rubric?.overall;
      const numeric = Number(rawScore);
      if (!Number.isFinite(numeric) || numeric < 0) {
        throw new Error("The speaking service did not return a score. Your recording remains here; retry.");
      }
      // Legacy speaking analysers may return percentages without maxScore.
      const explicitMax = Number(result.maxScore ?? result.assessment?.maxScore);
      const max = Number.isFinite(explicitMax) && explicitMax > 0 ? explicitMax : numeric > 10 ? 100 : 10;
      const score = Math.round(Math.max(0, Math.min(10, (numeric / max) * 10)) * 10) / 10;
      const feedbackValue = result.feedback ?? result.assessment?.feedback ?? result.summary ?? "";
      const feedback = (typeof feedbackValue === "string" ? feedbackValue : JSON.stringify(feedbackValue)).slice(0, 900);
      const storedText = [
        marker,
        task.taskLine || ("Speaking exam part: " + task.examPart),
        "Score: " + score + "/10",
        "Feedback: " + (feedback || "Speaking assessed; tutor may review the score."),
      ].join("\n");
      updateSectionText(sectionKey, storedText);
      setBlob(null);
    } catch (cause) {
      setError(cause?.response?.data?.error || cause?.message || "Could not assess the recording.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div data-a1-tutor-speaking-checkpoint={assignmentKey} style={{ border: "1px solid #cbd5e1", borderRadius: 16, padding: 16, display: "grid", gap: 14 }}>
      <div>
        <strong>{task.label || `Goethe A1 · Sprechen Teil ${task.examPart}`} · {task.heading}</strong>
        <p>{task.instructions}</p>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {task.cards.map(card => <span key={card} style={{ border: "1px solid #cbd5e1", borderRadius: 9, padding: "10px 13px", fontWeight: 700 }}>{card}</span>)}
      </div>
      <p style={{ margin: 0, color: "#475569" }}>Read the task, speak naturally, and record your answer. There is no paid AI voice. You can replay and re-record before choosing Assess final recording.</p>
      <button type="button" disabled={busy || alreadyAssessed} onClick={record} style={{ padding: 12, borderRadius: 10, cursor: "pointer" }}>{recording ? "Stop recording" : blob ? "Record again" : "Start recording"}</button>
      {preview ? <audio controls src={preview} aria-label="Preview your answer before assessment" /> : null}
      {blob && !recording && !alreadyAssessed ? <button type="button" disabled={busy} onClick={assess} style={{ padding: 12, borderRadius: 10, background: "#1d4ed8", color: "white" }}>{busy ? "Assessing…" : "Assess final recording"}</button> : null}
      {error ? <p role="alert" style={{ color: "#b91c1c" }}>{error}</p> : null}
      {saved.startsWith(marker) ? <div style={{ background: "#f0fdf4", borderRadius: 10, padding: 12, whiteSpace: "pre-wrap" }}><strong>Assessment saved in your assignment draft</strong><p>{saved.replace(marker, "").trim()}</p><small>Only score and feedback are stored; the audio is not permanently uploaded. Open Review & Submit to send this assignment.</small></div> : null}
    </div>
  );
}
