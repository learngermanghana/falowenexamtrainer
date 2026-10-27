import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AppBackButton from "./navigation/AppBackButton";
import { getA2Mock3StorageKeys } from "../utils/mockReviewAccess";
import { fetchA2MockAudioPlaybackUrl } from "../services/a2AudioService";
import teil1 from "../data/mockDrafts/a2-mock-03-hoeren-teil-1.json";
import teil2 from "../data/mockDrafts/a2-mock-03-hoeren-teil-2.json";
import teil3 from "../data/mockDrafts/a2-mock-03-hoeren-teil-3.json";
import teil4 from "../data/mockDrafts/a2-mock-03-hoeren-teil-4.json";
import "./A2Mock2Hoeren.css";

const PARTS = [
  { id: "teil-1", number: 1, label: "Unterwegs in der Stadt", data: teil1 },
  { id: "teil-2", number: 2, label: "Freizeit in der Woche", data: teil2 },
  { id: "teil-3", number: 3, label: "Fünf kurze Gespräche", data: teil3 },
  { id: "teil-4", number: 4, label: "Karriere im Alltag", data: { ...teil4, questions: teil4.questions.map((q, i) => ({ ...q, number: 16 + i })) } },
];
const answersKey = uid => `falowen:a2:mock-03:hoeren-teile-3-4:${uid || "guest"}:v1`;
const restore = uid => {
  if (!uid) return {};
  try { return JSON.parse(localStorage.getItem(answersKey(uid)) || "{}") || {}; }
  catch { return {}; }
};

export default function A2Mock3Hoeren({ embedded = false, onComplete, reviewReleased = false }) {
  const { idToken, user } = useAuth();
  const [active, setActive] = useState(0);
  const [answers, setAnswers] = useState(() => restore(user?.uid));
  const [submitted, setSubmitted] = useState(() => Boolean(embedded && JSON.parse(localStorage.getItem(getA2Mock3StorageKeys(user?.uid).hoeren) || "null")?.completedAt));
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioError, setAudioError] = useState("");
  const [started, setStarted] = useState({});
  const player = useRef(null);
  const part = PARTS[active];
  const allQuestions = PARTS.flatMap(item => item.data.questions);
  const answered = allQuestions.filter(q => answers[q.number]).length;
  const score = allQuestions.filter(q => answers[q.number] === (
    String(q.answer).toLowerCase() === "richtig" ? "richtig" :
    String(q.answer).toLowerCase() === "falsch" ? "falsch" : q.answer
  )).length;

  useEffect(() => {
    setAnswers(restore(user?.uid));
    setSubmitted(Boolean(embedded && JSON.parse(localStorage.getItem(getA2Mock3StorageKeys(user?.uid).hoeren) || "null")?.completedAt));
  }, [user?.uid, embedded]);
  useEffect(() => {
    if (!user?.uid) return;
    localStorage.setItem(answersKey(user.uid), JSON.stringify(answers));
  }, [user?.uid, answers]);
  useEffect(() => {
    if (player.current) { player.current.pause(); player.current.currentTime = 0; }
    setAudioUrl(""); setAudioError("");
  }, [active]);

  async function loadAudio() {
    if (!idToken) { setAudioError("Bitte melden Sie sich erneut an."); return; }
    if (loading) return;
    setLoading(true); setAudioError("");
    try {
      const response = await fetchA2MockAudioPlaybackUrl({
        mockId: "mock-03", part: part.id, key: part.data.audioObjectKey, idToken,
      });
      setAudioUrl(response.url);
    } catch (error) {
      setAudioError(error?.response?.data?.error || error?.message ||
        "Die Aufnahme konnte noch nicht geladen werden. Bitte prüfen Sie die Cloudflare-Datei.");
    } finally { setLoading(false); }
  }

  // Full Mock 03 gets a separate completed Hören checkpoint. Preserve the
  // historical listening-only answers and URL unchanged.
  useEffect(() => {
    if (!embedded || !submitted) return;
    const key = getA2Mock3StorageKeys(user?.uid).hoeren;
    const old = (() => { try { return JSON.parse(localStorage.getItem(key) || "{}") || {}; } catch { return {}; } })();
    localStorage.setItem(key, JSON.stringify({ ...old, answers, completedAt:old.completedAt || Date.now() }));
    if (!reviewReleased) onComplete?.();
  }, [embedded, submitted, answers, user?.uid, onComplete, reviewReleased]);

  const update = (question, value) => {
    if (!submitted) setAnswers(old => ({ ...old, [question.number]: value }));
  };

  return (
    <main className="a2-mock2-shell" lang="de" data-a2-mock3-hoeren>
      {!embedded ? <div className="a2-mock2-top">
        <AppBackButton label="Zurück zum Prüfungsraum" fallbackPath="/exams/mocks" />
        <span>A2 · Mock 3 · Hören</span>
      </div> : null}
      <header className="a2-mock2-progress">
        <div>
          <strong>Hören Mock 3 — Teile 1 bis 4</strong>
          <span>{answered}/20 Aufgaben beantwortet</span>
        </div>
        <strong>Teil {part.number}</strong>
      </header>
      <p role="note">
        Dies ist die vollständige Hören-Übung zu Mock 3 (Teile 1 bis 4, 20 Aufgaben).
        {embedded ? "Nach Hören folgen Schreiben und Sprechen in dieser Mock-Prüfung." : "Lesen, Schreiben und Sprechen gehören zur separaten vollständigen A2-Prüfung."}
        Ihre Antworten bleiben auf diesem Gerät; hier wird kein offizielles
        vierteiliges Prüfungsergebnis gespeichert.
      </p>
      <nav className="a2-mock2-nav" aria-label="Hören Teile">
        {PARTS.map((item, index) => (
          <button type="button" key={item.id} className={active === index ? "selected" : ""}
            onClick={() => setActive(index)}>
            Teil {item.number} <small>{item.data.questions.filter(q => answers[q.number]).length}/5</small>
          </button>
        ))}
      </nav>
      <section className="a2-mock2-paper">
        <h1>Hören Teil {part.number}</h1>
        <p>{part.number === 4
          ? "Sie hören ein Interview zweimal. Markieren Sie Richtig oder Falsch."
          : part.number === 3
            ? "Sie hören fünf kurze Gespräche einmal. Markieren Sie a, b oder c."
            : part.number === 2
              ? "Sie hören ein Gespräch über Freizeitaktivitäten. Markieren Sie a, b oder c."
              : "Sie hören fünf kurze Ansagen oder Gespräche. Markieren Sie a, b oder c."}</p>
        <div className="a2-mock2-audio">
          <strong>Prüfungsaudio · Teil {part.number}</strong>
          <p>{part.number === 4
            ? "Das Interview ist in der MP3 bereits zweimal enthalten. Die Datei wird einmal abgespielt."
            : "Die Datei wird einmal abgespielt, ohne eine zusätzliche automatische Wiederholung."}</p>
          {audioUrl ? (
            <>
              <audio ref={player} src={audioUrl} preload="metadata" controls={false}
                onError={() => setAudioError("Die R2-Datei konnte nicht abgespielt werden. Laden Sie die Aufnahme erneut.")} />
              <button type="button" disabled={Boolean(started[part.id])}
                onClick={() => player.current?.play().then(() =>
                  setStarted(old => ({ ...old, [part.id]: true }))
                ).catch(error => setAudioError(error.message))}>
                Audio einmal starten
              </button>
            </>
          ) : <button type="button" onClick={loadAudio} disabled={loading}>
            {loading ? "Audio wird geprüft und geladen …" : "Audio laden"}
          </button>}
          {audioError ? <p role="alert">{audioError}</p> : null}
        </div>

        {part.data.questions.map((question, index) => (
          <fieldset className="a2-mock2-question" key={question.number} disabled={submitted}>
            <legend><strong>{question.number || index + 16}.</strong> {question.question}</legend>
            {(part.number !== 4
              ? question.options
              : [{ id: "richtig", label: "Richtig" }, { id: "falsch", label: "Falsch" }]
            ).map(choice => (
              <label key={choice.id} className={answers[question.number || index + 16] === choice.id ? "selected" : ""}>
                <input type="radio" name={`a2mock3-${question.number || index + 16}`}
                  checked={answers[question.number || index + 16] === choice.id}
                  onChange={() => update({ number: question.number || index + 16 }, choice.id)} />
                <span><strong>{part.number !== 4 ? `${choice.id})` : ""}</strong> {choice.label}</span>
                {choice.imagePath ? <img src={choice.imagePath} alt={choice.label}
                  width="160" height="109" loading="lazy" style={{ display: "block", maxWidth: "100%", marginTop: 8 }} /> : null}
              </label>
            ))}
          </fieldset>
        ))}

        {!submitted ? (
          <button type="button" disabled={answered !== 20} onClick={() => setSubmitted(true)}>
            Antworten zu allen vier Teilen prüfen
          </button>
        ) : (
          <section aria-live="polite">
            <h2>{embedded ? "Hören abgegeben" : `Hören-Übungsergebnis: ${score}/20`}</h2>
            <p>{embedded ? "Der Hören-Score wird mit den anderen drei Modulen durch den Server geprüft." : "Dies ist ausschließlich die lokale Hören-Übungsauswertung für vier Teile, keine verifizierte viermodulige Mock-Prüfungsnote."}</p>
            {!embedded ? <button type="button" onClick={() => {
              setAnswers({}); setSubmitted(false); setStarted({}); setAudioUrl("");
            }}>Neu üben</button> : null}
          </section>
        )}
      </section>
    </main>
  );
}
