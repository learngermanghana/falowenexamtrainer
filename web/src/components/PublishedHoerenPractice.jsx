import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getPublishedHoerenLesson, gradePublishedHoerenLesson } from "../services/publishedHoerenService";
import { needsFreshSignedAudio } from "../utils/hoerenSignedAudio";

const wrap = { border: "1px solid #bfdbfe", borderRadius: 14, padding: 16, background: "#f8fbff", display: "grid", gap: 12 };
const questionStyle = { display: "grid", gap: 8, background: "#fff", padding: 12, border: "1px solid #dce7f5", borderRadius: 10 };

export default function PublishedHoerenPractice({ assignmentKey }) {
  const { idToken } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [audioError, setAudioError] = useState("");
  const [refreshingAudio, setRefreshingAudio] = useState(false);
  const audioRef = useRef(null);
  const latestLessonRef = useRef(null);
  const refreshInFlightRef = useRef(null);
  const lastRefreshRef = useRef(0);
  const resumeRef = useRef(null);


  useEffect(() => {
    let active = true;
    setLesson(null);
    setResult(null);
    setAnswers({});
    setError(""); setAudioError(""); latestLessonRef.current = null;
    if (!idToken || !assignmentKey) return () => { active = false; };
    getPublishedHoerenLesson(assignmentKey, idToken).then(value => {
      if (active) { setLesson(value); latestLessonRef.current = value; }
    }).catch(reason => {
      if (active && reason?.response?.status !== 404) setError("Zusätzliches Hören konnte nicht geladen werden.");
    });
    return () => { active = false; };
  }, [assignmentKey, idToken]);

  const refreshAudio = useCallback(async ({ force = false, resume = false } = {}) => {
    const current = latestLessonRef.current;
    if (!current || !idToken || !assignmentKey) return false;
    if (refreshInFlightRef.current) return refreshInFlightRef.current;
    // Avoid an endless refresh/retry loop when a signed URL fails for other reasons.
    if (!force && Date.now() - lastRefreshRef.current < 10_000) {
      setAudioError("Audio kann gerade nicht geladen werden. Bitte erneut versuchen.");
      return false;
    }
    const audio = audioRef.current;
    resumeRef.current = {
      time: Number.isFinite(audio?.currentTime) ? audio.currentTime : 0,
      play: resume || Boolean(audio && !audio.paused),
    };
    if (audio && !audio.paused) audio.pause();
    lastRefreshRef.current = Date.now();
    setRefreshingAudio(true);
    setAudioError("");
    const request = getPublishedHoerenLesson(assignmentKey, idToken)
      .then(updated => {
        if (updated.revision !== current.revision) {
          setAudioError("Die Übung wurde aktualisiert. Bitte die Seite neu laden.");
          return false;
        }
        latestLessonRef.current = { ...current, audioUrl: updated.audioUrl };
        setLesson(previous => previous?.revision === updated.revision
          ? { ...previous, audioUrl: updated.audioUrl } : previous);
        return true;
      })
      .catch(() => {
        setAudioError("Neuer Audio-Link konnte nicht geladen werden. Bitte erneut versuchen.");
        return false;
      })
      .finally(() => {
        refreshInFlightRef.current = null;
        setRefreshingAudio(false);
      });
    refreshInFlightRef.current = request;
    return request;
  }, [assignmentKey, idToken]);

  const handleAudioPlay = useCallback(event => {
    if (needsFreshSignedAudio(latestLessonRef.current?.audioUrl)) {
      event.currentTarget.pause();
      refreshAudio({ resume: true });
    }
  }, [refreshAudio]);

  const handleAudioError = useCallback(() => {
    refreshAudio();
  }, [refreshAudio]);

  const handleAudioLoadedMetadata = useCallback(async event => {
    if (!resumeRef.current) return;
    const { time, play } = resumeRef.current;
    resumeRef.current = null;
    const audio = event.currentTarget;
    if (time > 0 && Number.isFinite(audio.duration)) {
      try { audio.currentTime = Math.min(time, Math.max(0, audio.duration - 0.1)); } catch { /* unsupported seek */ }
    }
    if (play) {
      try { await audio.play(); } catch { /* browser may require another click */ }
    }
  }, []);

  if (!lesson && !error) return null;
  const complete = lesson?.questions.every((_, index) => Object.hasOwn(answers, index));
  const submit = async () => {
    if (!complete || busy || !lesson) return;
    setBusy(true); setError("");
    try {
      const ordered = lesson.questions.map((_, index) => answers[index]);
      const graded = await gradePublishedHoerenLesson({
        assignmentKey, revision: lesson.revision, answers: ordered, idToken,
      });
      setResult(graded);
    } catch (e) { setError(e?.response?.data?.error || "Die Bewertung ist derzeit nicht verfügbar."); }
    finally { setBusy(false); }
  };

  return <section style={wrap} data-published-hoeren={assignmentKey}>
    <div>
      <strong style={{ color: "#1e40af" }}>Zusätzliche Hören-Übung · Falowen Studio</strong>
      <h3 style={{ margin: "6px 0" }}>{lesson?.title || "Hören"}</h3>
      <p style={{ margin: 0, color: "#475569", fontSize: 13 }}>
        Hören Sie die Aufnahme und beantworten Sie alle fünf Fragen. Diese Übung wird automatisch bewertet.
        Sie ersetzt nicht die reguläre Tutor-Abgabe.
      </p>
    </div>
    {lesson ? <>
      <audio ref={audioRef} controls preload="metadata" src={lesson.audioUrl}
        onPlay={handleAudioPlay} onError={handleAudioError} onLoadedMetadata={handleAudioLoadedMetadata}
        style={{ width: "100%" }} aria-label={lesson.title} />
      {refreshingAudio ? <small role="status">Geschützten Audio-Link erneuern…</small> : null}
      {audioError ? <div role="alert" style={{ color: "#b91c1c" }}>
        {audioError}{" "}
        <button type="button" onClick={() => refreshAudio({ force: true })} disabled={refreshingAudio}>
          Audio erneut laden
        </button>
      </div> : null}
      {lesson.questions.map((entry, index) => <fieldset key={entry.id} style={questionStyle}>
        <legend style={{ fontWeight: 700 }}>{index + 1}. {entry.question}</legend>
        {(lesson.kind === "richtig-falsch" ? ["Richtig", "Falsch"] : (entry.options || []))
          .map((option, choice) => {
            const value = lesson.kind === "richtig-falsch" ? option : choice;
            return <label key={choice} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="radio" name={`studio-${assignmentKey}-${index}`} value={String(value)}
                checked={answers[index] === value} disabled={!!result || busy}
                onChange={() => setAnswers(previous => ({ ...previous, [index]: value }))} />
              {option}
            </label>;
          })}
        {result ? <small style={{ color: "#166534" }}>
          Lösung: {lesson.kind === "richtig-falsch" ? result.correctAnswers[index] : entry.options[result.correctAnswers[index]]}
          {result.evidence?.[index] ? ` · Textstelle: „${result.evidence[index]}“` : ""}
        </small> : null}
      </fieldset>)}
      {result ? <div role="status" style={{ fontWeight: 700 }}>Ergebnis: {result.correct}/5 · {result.score}%</div>
        : <button type="button" onClick={submit} disabled={!complete || busy}
            style={{ padding: 12, color: "#fff", border: 0, background: "#1d4ed8", borderRadius: 9, fontWeight: 700 }}>
            {busy ? "Antworten werden bewertet…" : "5 Antworten kontrollieren"}
          </button>}
    </> : null}
    {error ? <p role="alert" style={{ color: "#b91c1c" }}>{error}</p> : null}
  </section>;
}
