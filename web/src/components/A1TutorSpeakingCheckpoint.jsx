import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useA1TutorWorkbookDraft } from "./A1TutorWorkbookDraftContext";
import { assessA1TutorSpeaking } from "../services/coachService";
import { buildRecordedAudioBlob, createSpeakingMediaRecorder, userFacingAudioError } from "../lib/speakingAudio";
import A1_TEIL3_REQUEST_CARDS from "../../../shared/a1GoetheTeil3PictureCards.json";

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
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceBlob, setPracticeBlob] = useState(null);
  const [blob, setBlob] = useState(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const activeBlob = practiceMode ? practiceBlob : blob;
  const setActiveBlob = practiceMode ? setPracticeBlob : setBlob;
  const canRecord = !busy && (!alreadyAssessed || practiceMode) &&
    (!isPictureCardTask || practiceMode || Boolean(drawnCard));
  const switchMode = (isPractice) => {
    if (recording || busy || requestingMicrophoneRef.current) return;
    setPracticeMode(isPractice);
    setError("");
  };
  useEffect(() => {
    if (!activeBlob) { setPreview(""); return undefined; }
    const url = URL.createObjectURL(activeBlob);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [activeBlob]);
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
    if (isPictureCardTask && !practiceMode && !drawnCard) {
      setError("Ziehen Sie zuerst eine Bildkarte.");
      return;
    }
    if ((alreadyAssessed && !practiceMode) || requestingMicrophoneRef.current) return;
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
        setActiveBlob(buildRecordedAudioBlob(chunks, next));
        setRecording(false);
      };
      recorder.current = next;
      setActiveBlob(null);
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
    if (!blob || !user || busy || recording || alreadyAssessed || (isPictureCardTask && (!drawnCard || practiceMode))) return;
    setBusy(true);
    setError("");
    try {
      const result = await assessA1TutorSpeaking({
        audioBlob: blob,
        assignmentKey,
        examPart: task.examPart,
        question: isPictureCardTask ? `Bildkarte: ${drawnCard?.label}. ${drawnCard?.context}` : task.instructions,
        cardId: isPictureCardTask ? drawnCard?.id : undefined,
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
      if (isPictureCardTask && result.cardId && result.cardId !== drawnCard.id) {
        throw new Error("The speaking score was returned for a different card. Please retry.");
      }
      const feedbackValue = result.feedback ?? result.assessment?.feedback ?? result.summary ?? "";
      const feedback = (typeof feedbackValue === "string" ? feedbackValue : JSON.stringify(feedbackValue)).slice(0, 900);
      const storedText = [
        marker,
        task.taskLine || ("Speaking exam part: " + task.examPart),
        ...(isPictureCardTask && drawnCard ? ["Drawn picture card: " + drawnCard.label] : []),
        "Score: " + score + "/10",
        ...(isPictureCardTask ? ["Scoring criteria: Request 4, Politeness 2, Transcript intelligibility 2, Complete expression 2"] : []),
        ...(isPictureCardTask && result.rubric ? [
          "Rubric: " + Object.entries(result.rubric).map(([key, points]) => {
            const titles = { request: "Request", politeness: "Politeness", intelligibility: "Transcript intelligibility", completeness: "Complete expression" };
            return (titles[key] || key) + " " + points + "/" + ({request: 4, politeness: 2, intelligibility: 2, completeness: 2}[key] || 2);
          }).join(" · "),
        ] : []),
        "Feedback: " + (feedback || "Speaking assessed; tutor may review the score."),
        ...(isPictureCardTask ? ["Corrected example: " + (result.correction || drawnCard.modelAnswer)] : []),
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
        <p style={{lineHeight: 1.6}}>{task.instructions}</p>
        {isPictureCardTask && !alreadyAssessed && <div aria-label="How to complete the Goethe A1 request task" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(145px, 1fr))",gap:8,marginTop:14}}>
          {[
            ["1", "Karte ziehen", "Draw ONE picture card"],
            ["2", "Bitte sprechen", "Make ONE polite request"],
            ["3", "Aufnahme prüfen", "Replay, then assess"],
          ].map(([step, title, english]) => <div key={step} style={{background:"#f0fdfa",border:"1px solid #ccfbf1",borderRadius:12,padding:10,display:"grid",gap:3}}>
            <strong style={{color:"#115e59"}}>{step}. {title}</strong><small style={{color:"#475569"}}>{english}</small>
          </div>)}
        </div>}
      </div>
      {isPictureCardTask ? (
        <section data-testid="a1-teil3-picture-draw" aria-label="Goethe A1 picture-card draw" style={{
          display: "grid", gap: 14, padding: 16, borderRadius: 16,
          border: "1px solid #bfd8d6", background: "linear-gradient(135deg, #f2fcfa, #f8fafc)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ color: "#086b60", fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>THEMA · ALLTAG</span>
            <span style={{ color: "#475569", fontSize: 12, fontWeight: 700 }}>1 Bildkarte · 1 höfliche Bitte · 18 Karten im Pool</span>
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
                <span role="img" aria-label={drawnCard.label} style={{ fontSize: 78, lineHeight: 1.25, filter:"drop-shadow(0 8px 10px rgba(9,58,61,.12))" }}>{drawnCard.pictogram}</span>
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
              <span style={{ color: "#64748b", fontSize: 13 }}>Satzanfang: „Können Sie bitte …?“ (say your own complete sentence)</span>
            </div>
          ) : null}
          {alreadyAssessed ? <span style={{ color: "#166534", textAlign: "center" }}>Diese Sprechaufgabe wurde bereits bewertet.</span> : null}
        </section>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {task.cards.map(card => <span key={card} style={{ border: "1px solid #cbd5e1", borderRadius: 9, padding: "10px 13px", fontWeight: 700 }}>{card}</span>)}
        </div>
      )}
      {isPictureCardTask && <section aria-label="Optional Goethe response practice" style={{display:"grid",gap:9,border:"1px solid #e2e8f0",padding:12,borderRadius:13,background:"#fff"}}>
        <button type="button" disabled={busy || recording} onClick={() => switchMode(!practiceMode)} aria-expanded={practiceMode}
          style={{background:"transparent",border:0,padding:"5px 0",cursor:"pointer",textAlign:"left",fontWeight:800,color:"#0f766e"}}>
          {practiceMode ? "← Zurück zur Bildkarte" : "Zusatzübung: Auf eine Bitte reagieren (freiwillig) →"}
        </button>
        {practiceMode && <div style={{display:"grid",gap:8}}>
          <span style={{fontSize:13,color:"#475569"}}>Optional practice only · not graded · no AI requests</span>
          <strong>Ihr Partner bittet: „Können Sie mir bitte den Stadtplan geben?“</strong>
          <span style={{fontSize:14,color:"#475569"}}>Answer your partner politely in German and record your response. You can replay it. This does not affect your assignment score.</span>
          {practiceBlob && !recording && <span style={{fontSize:13,color:"#166534"}}>Ein Beispiel: „Ja, gern. Hier bitte.“</span>}
        </div>}
      </section>}
      <p style={{ margin: 0, color: "#475569", fontSize:14 }}>
        {isPictureCardTask
          ? practiceMode
            ? "Free response practice: record, listen back or try again. Return to the picture card to complete your graded assignment."
            : "Only the drawn picture card is graded. Record, listen back, and re-record if needed before final assessment. No paid examiner voice is used."
          : "Read the task, speak naturally, and record your answer. There is no paid AI voice. You can replay and re-record before choosing Assess final recording."}
      </p>
      <div aria-label="Speaking recording controls" style={{display:"grid",gap:10}}>
        <button type="button" disabled={!canRecord} onClick={record} style={{
          padding:14,borderRadius:12,border:recording?"1px solid #fecaca":"1px solid #ccfbf1",
          background:recording?"#fef2f2":"#0f766e",color:recording?"#991b1b":"#fff",
          fontWeight:800,cursor:canRecord?"pointer":"not-allowed",
        }}>{recording ? "■ Stop recording" : activeBlob ? "↻ Record again" : "🎙 Start recording"}</button>
        {recording && <span role="status" style={{color:"#b91c1c",fontSize:13}}>● Aufnahme läuft · Recording in progress</span>}
        {preview && <div style={{display:"grid",gap:6,background:"#f8fafc",borderRadius:10,padding:11}}>
          <strong style={{fontSize:13,color:"#334155"}}>▶ Ihre Aufnahme · Replay your answer</strong>
          <audio controls src={preview} aria-label="Preview your answer before assessment" />
        </div>}
        {!practiceMode && blob && !recording && !alreadyAssessed &&
          <button type="button" disabled={busy} onClick={assess} style={{
            padding:14,borderRadius:12,background:"#1d4ed8",border:0,
            color:"white",fontWeight:800,cursor:busy?"wait":"pointer",
          }}>{busy ? "Assessing…" : "✓ Assess final recording"}</button>}
        {practiceMode && practiceBlob && !recording && <span style={{color:"#166534",fontSize:13}}>Practice saved only on this device while you stay on this page. It is not submitted or AI-assessed.</span>}
      </div>
      {error ? <p role="alert" style={{ color: "#b91c1c" }}>{error}</p> : null}
      {saved.startsWith(marker) ? <div style={{ background: "#f0fdf4", borderRadius: 10, padding: 12, whiteSpace: "pre-wrap" }}><strong>Assessment saved in your assignment draft</strong><p>{saved.replace(marker, "").trim()}</p><small>Only score and feedback are stored; the audio is not permanently uploaded. Open Review & Submit to send this assignment.</small></div> : null}
    </div>
  );
}
