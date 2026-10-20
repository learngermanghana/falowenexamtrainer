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
    instructions: "Ziehen Sie eine Bildkarte. Bitten Sie eine andere Person höflich um den Gegenstand oder um Hilfe. Sprechen Sie nur zu Ihrer gezogenen Karte.",
  },
};

// Each learner draws ONE Goethe-style picture card, not three instructions at once.
// The selected card also travels to the existing speaking assessment as its rubric context.
const A1_TEIL3_REQUEST_CARDS = Object.freeze([
  {
    id: "stift",
    label: "der Stift",
    pictogram: "✏️",
    context: "Sie brauchen einen Stift.",
    examinerPrompt: "Bildkarte: der Stift. Die Person braucht einen Stift. Bewerte genau eine höfliche Bitte auf Deutsch, z. B. eine Bitte um einen Stift. Die Bitte soll zur Karte passen und Sie/bitte verwenden.",
  },
  {
    id: "fenster",
    label: "das Fenster",
    pictogram: "🪟",
    context: "Es ist warm im Zimmer.",
    examinerPrompt: "Bildkarte: das Fenster. Es ist warm im Zimmer. Bewerte genau eine höfliche Bitte auf Deutsch, das Fenster zu öffnen. Die Bitte soll zur Karte passen und Sie/bitte verwenden.",
  },
  {
    id: "stadtplan",
    label: "der Stadtplan",
    pictogram: "🗺️",
    context: "Sie sind neu in der Stadt.",
    examinerPrompt: "Bildkarte: der Stadtplan. Die Person braucht einen Stadtplan. Bewerte genau eine höfliche Bitte auf Deutsch, einen Stadtplan zu geben. Die Bitte soll zur Karte passen und Sie/bitte verwenden.",
  },
]);

export default function A1TutorSpeakingCheckpoint({ assignmentKey, sectionKey }) {
  const task = TASKS[assignmentKey];
  const isPictureCardTask = assignmentKey === "A1-11";
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
  const [drawnCard, setDrawnCard] = useState(null);
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
    if (isPictureCardTask && !drawnCard) {
      setError("Ziehen Sie zuerst eine Bildkarte.");
      return;
    }
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
        question: isPictureCardTask ? drawnCard?.examinerPrompt : task.instructions,
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
        ...(isPictureCardTask && drawnCard ? ["Drawn picture card: " + drawnCard.label] : []),
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
      {isPictureCardTask ? (
        <section data-testid="a1-teil3-picture-draw" aria-label="Goethe A1 picture-card draw" style={{
          display: "grid", gap: 14, padding: 16, borderRadius: 16,
          border: "1px solid #bfd8d6", background: "linear-gradient(135deg, #f2fcfa, #f8fafc)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ color: "#086b60", fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>THEMA · ALLTAG</span>
            <span style={{ color: "#475569", fontSize: 12, fontWeight: 700 }}>1 Bildkarte · 1 höfliche Bitte</span>
          </div>
          <div aria-live="polite" style={{
            margin: "0 auto", width: "100%", maxWidth: 320, minHeight: 208,
            background: "#fff", border: "2px solid #9abbb9", borderRadius: 18,
            boxShadow: "0 12px 28px rgba(10, 60, 64, .10)",
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: 12, padding: 20, textAlign: "center",
          }}>
            {drawnCard ? (
              <>
                <span role="img" aria-label={drawnCard.label} style={{ fontSize: 72, lineHeight: 1.25 }}>{drawnCard.pictogram}</span>
                <strong style={{ fontSize: 24, color: "#123b45" }}>{drawnCard.label}</strong>
                <span style={{ fontSize: 14, color: "#59677a" }}>{drawnCard.context}</span>
              </>
            ) : (
              <>
                <span aria-hidden="true" style={{ fontSize: 66, color: "#0f766e", fontWeight: 800 }}>?</span>
                <strong style={{ fontSize: 20, color: "#123b45" }}>Verdeckte Bildkarte</strong>
                <span style={{ fontSize: 13, color: "#64748b" }}>Draw a card to see your speaking prompt.</span>
              </>
            )}
          </div>
          {!drawnCard && !alreadyAssessed ? (
            <button type="button" disabled={busy} onClick={() => {
              const index = Math.floor(Math.random() * A1_TEIL3_REQUEST_CARDS.length);
              setDrawnCard(A1_TEIL3_REQUEST_CARDS[index]);
              setError("");
            }} style={{
              padding: "13px 18px", borderRadius: 12, border: 0, background: "#0f766e",
              color: "#fff", fontWeight: 800, cursor: "pointer", maxWidth: 320,
              width: "100%", justifySelf: "center",
            }}>Karte ziehen</button>
          ) : null}
          {drawnCard && !alreadyAssessed ? (
            <div style={{ textAlign: "center", display: "grid", gap: 5 }}>
              <strong style={{ color: "#123b45" }}>Stellen Sie jetzt eine höfliche Bitte.</strong>
              <span style={{ color: "#526477", fontSize: 14 }}>Look at the picture. Say ONE polite request using “Sie” and “bitte”.</span>
              <span style={{ color: "#64748b", fontSize: 13 }}>Satzanfang: „Können Sie bitte …?“</span>
            </div>
          ) : null}
          {alreadyAssessed ? <span style={{ color: "#166534", textAlign: "center" }}>Diese Sprechaufgabe wurde bereits bewertet.</span> : null}
        </section>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {task.cards.map(card => <span key={card} style={{ border: "1px solid #cbd5e1", borderRadius: 9, padding: "10px 13px", fontWeight: 700 }}>{card}</span>)}
        </div>
      )}
      <p style={{ margin: 0, color: "#475569" }}>
        {isPictureCardTask
          ? "Only the drawn card is assessed. Record your request, replay it, or record again. Then choose Assess final recording to save the score."
          : "Read the task, speak naturally, and record your answer. There is no paid AI voice. You can replay and re-record before choosing Assess final recording."}
      </p>
      <button type="button" disabled={busy || alreadyAssessed || (isPictureCardTask && !drawnCard)} onClick={record} style={{ padding: 12, borderRadius: 10, cursor: busy || alreadyAssessed || (isPictureCardTask && !drawnCard) ? "not-allowed" : "pointer" }}>{recording ? "Stop recording" : blob ? "Record again" : "Start recording"}</button>
      {preview ? <audio controls src={preview} aria-label="Preview your answer before assessment" /> : null}
      {blob && !recording && !alreadyAssessed ? <button type="button" disabled={busy} onClick={assess} style={{ padding: 12, borderRadius: 10, background: "#1d4ed8", color: "white" }}>{busy ? "Assessing…" : "Assess final recording"}</button> : null}
      {error ? <p role="alert" style={{ color: "#b91c1c" }}>{error}</p> : null}
      {saved.startsWith(marker) ? <div style={{ background: "#f0fdf4", borderRadius: 10, padding: 12, whiteSpace: "pre-wrap" }}><strong>Assessment saved in your assignment draft</strong><p>{saved.replace(marker, "").trim()}</p><small>Only score and feedback are stored; the audio is not permanently uploaded. Open Review & Submit to send this assignment.</small></div> : null}
    </div>
  );
}
