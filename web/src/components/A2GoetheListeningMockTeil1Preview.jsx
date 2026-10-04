import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AppBackButton from "./navigation/AppBackButton";
import { fetchA2MockAudioPlaybackUrl } from "../services/a2AudioService";
import "./A1GoetheReadingMockTeil1Preview.css";
import "./A1GoetheListeningMockPreview.css";

export const A2_GOETHE_LISTENING_TEIL1 = Object.freeze({
  title: "Teil 1",
  instruction: "Sie hören fünf kurze Texte. Sie hören jeden Text zweimal.",
  responseInstruction: "Markieren Sie die richtige Lösung a, b oder c.",
  plays: 2,
  audioObjectKey: "a2/mock-hoeren/mock-01/teil-1.mp3",
  questions: [
    {
      number: 1,
      context: "Gespräch · Anna und Paul · Kino",
      question: "Wann beginnt der Film?",
      answer: "c",
      options: [
        { id: "a", label: "18.30 Uhr", short: "18:30" },
        { id: "b", label: "19.00 Uhr", short: "19:00" },
        { id: "c", label: "19.15 Uhr", short: "19:15" },
      ],
    },
    {
      number: 2,
      context: "Anrufbeantworter · Arztpraxis",
      question: "Was soll Frau Weber tun?",
      answer: "b",
      options: [
        { id: "a", label: "Am Dienstag um 10 Uhr kommen", short: "Di · 10:00" },
        { id: "b", label: "In der Praxis zurückrufen", short: "zurückrufen" },
        { id: "c", label: "Einen anderen Arzt suchen", short: "anderer Arzt" },
      ],
    },
    {
      number: 3,
      context: "Kleidungsgeschäft",
      question: "Welche Jacke nimmt die Kundin?",
      answer: "b",
      options: [
        { id: "a", label: "Die rote", short: "rot" },
        { id: "b", label: "Die blaue", short: "blau" },
        { id: "c", label: "Die schwarze", short: "schwarz" },
      ],
    },
    {
      number: 4,
      context: "Durchsage am Bahnhof",
      question: "Von welchem Gleis fährt der Zug nach München?",
      answer: "b",
      options: [
        { id: "a", label: "Gleis 3", short: "3" },
        { id: "b", label: "Gleis 5", short: "5" },
        { id: "c", label: "Gleis 14", short: "14" },
      ],
    },
    {
      number: 5,
      context: "Gespräch · Tom und Nadine · Wochenende",
      question: "Was machen sie am Samstag?",
      answer: "b",
      options: [
        { id: "a", label: "Sie fahren an den See.", short: "See" },
        { id: "b", label: "Sie gehen ins Schwimmbad.", short: "Schwimmbad" },
        { id: "c", label: "Sie bleiben zu Hause.", short: "zu Hause" },
      ],
    },
  ],
});

const MultipleChoice = ({ name, options, value, onChange }) => (
  <div className="a1-hoeren-mock-multiple-choice" role="radiogroup">
    {options.map((option) => (
      <label key={option.id} className="a1-hoeren-mock-option">
        <input type="radio" name={name} checked={value === option.id} onChange={() => onChange(option.id)} />
        <span className="a1-hoeren-mock-option-letter">{option.id}</span>
        <span className="a1-hoeren-mock-option-copy">
          <strong>{option.label}</strong>
          <small>{option.short}</small>
        </span>
      </label>
    ))}
  </div>
);

export default function A2GoetheListeningMockTeil1Preview() {
  const { idToken } = useAuth();
  const [answers, setAnswers] = useState({});
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAudio = async () => {
    if (audioUrl || loading) return;
    setLoading(true);
    setError("");
    try {
      const result = await fetchA2MockAudioPlaybackUrl({
        mockId: "mock-01",
        part: "teil-1",
        key: A2_GOETHE_LISTENING_TEIL1.audioObjectKey,
        idToken,
      });
      setAudioUrl(result.url);
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Could not load audio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="a1-goethe-mock-shell" data-a2-goethe-listening-mock-teil1-preview>
      <div className="a1-goethe-mock-topbar">
        <AppBackButton label="Back to A2 Mock Preview" fallbackPath="/campus/course/a2-mock-practice-preview" />
        <span className="a1-goethe-mock-preview-badge">A2 Hören Teil 1 · preview only</span>
      </div>

      <article className="a1-goethe-mock-exam a1-hoeren-mock-exam">
        <header className="a1-goethe-mock-header">
          <p className="a1-goethe-mock-kicker">A2 · Hören</p>
          <h1>Teil 1</h1>
          <p>{A2_GOETHE_LISTENING_TEIL1.instruction}</p>
          <p><strong>{A2_GOETHE_LISTENING_TEIL1.responseInstruction}</strong></p>
        </header>

        <div className="a1-hoeren-mock-part-audio">
          <div className="a1-hoeren-mock-part-audio-copy">
            <strong>Exam audio</strong>
            <p>The complete Teil 1 audio plays the five tasks twice, with the exam pauses already included.</p>
          </div>

          {audioUrl ? (
            <audio className="a1-hoeren-mock-native-audio" controls controlsList="nodownload" src={audioUrl} preload="metadata">
              Your browser does not support this audio.
            </audio>
          ) : (
            <button type="button" className="a1-hoeren-mock-load-audio" onClick={loadAudio} disabled={loading}>
              {loading ? "Loading audio …" : "Load audio"}
            </button>
          )}

          <span className="a1-hoeren-mock-play-count">2× in the exam audio</span>
          {error ? <p className="a1-hoeren-mock-audio-error">{error}</p> : null}
        </div>

        {A2_GOETHE_LISTENING_TEIL1.questions.map((question) => {
          const key = `teil1-${question.number}`;
          return (
            <section className="a1-hoeren-mock-question" key={key}>
              <p className="a1-hoeren-mock-number">Aufgabe {question.number}</p>
              <p className="a1-hoeren-mock-context">{question.context}</p>
              <h3>{question.question}</h3>
              <p className="a1-hoeren-mock-prompt">Wählen Sie: a, b oder c</p>
              <MultipleChoice
                name={key}
                options={question.options}
                value={answers[key] || ""}
                onChange={(value) => setAnswers((current) => ({ ...current, [key]: value }))}
              />
            </section>
          );
        })}
      </article>
    </main>
  );
}
