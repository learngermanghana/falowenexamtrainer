import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AppBackButton from "./navigation/AppBackButton";
import { fetchA2MockAudioPlaybackUrl } from "../services/a2AudioService";
import "./A1GoetheReadingMockTeil1Preview.css";
import "./A1GoetheListeningMockPreview.css";
import "./A2GoetheListeningMockTeil3Preview.css";

export const A2_GOETHE_LISTENING_TEIL3 = Object.freeze({
  title: "Teil 3",
  instruction: "Sie hören fünf kurze Gespräche. Sie hören jeden Text einmal.",
  responseInstruction: "Markieren Sie für die Aufgaben 11 bis 15 die richtige Lösung A, B oder C.",
  plays: 1,
  audioObjectKey: "a2/mock-hoeren/mock-01/teil-3.mp3",
  questions: [
    {
      number: 11,
      context: "Party",
      question: "Was bringt Nadine zur Party mit?",
      answer: "A",
      options: [
        { id: "A", label: "Orangensaft", icon: "juice" },
        { id: "B", label: "Kuchen", icon: "cake" },
        { id: "C", label: "Blumen", icon: "flowers" },
      ],
    },
    {
      number: 12,
      context: "Schlüssel",
      question: "Wo findet die Frau ihren Schlüssel?",
      answer: "C",
      options: [
        { id: "A", label: "Auf dem Tisch", icon: "table-key" },
        { id: "B", label: "In der Jacke", icon: "jacket-key" },
        { id: "C", label: "In der Tasche", icon: "bag-key" },
      ],
    },
    {
      number: 13,
      context: "Hamburg",
      question: "Was soll der Mann nach Hamburg mitnehmen?",
      answer: "B",
      options: [
        { id: "A", label: "Sonnencreme", icon: "suncream" },
        { id: "B", label: "Regenschirm", icon: "umbrella" },
        { id: "C", label: "Sonnenbrille", icon: "sunglasses" },
      ],
    },
    {
      number: 14,
      context: "Treffpunkt",
      question: "Wo treffen sich die beiden?",
      answer: "A",
      options: [
        { id: "A", label: "Im Café", icon: "cafe" },
        { id: "B", label: "In der Bibliothek", icon: "library" },
        { id: "C", label: "Im Park", icon: "park" },
      ],
    },
    {
      number: 15,
      context: "Wohnhaus",
      question: "Wo sind die Briefkästen?",
      answer: "C",
      options: [
        { id: "A", label: "Beim Aufzug", icon: "elevator" },
        { id: "B", label: "Bei der Heizung", icon: "radiator" },
        { id: "C", label: "Links neben der Treppe", icon: "mailboxes" },
      ],
    },
  ],
});

const Picture = ({ icon }) => {
  const render = {
    juice: <><div className="a2-t3-bottle">O</div><div className="a2-t3-glass" /></>,
    cake: <><div className="a2-t3-cake">🎂</div></>,
    flowers: <div className="a2-t3-large-symbol">💐</div>,
    "table-key": <><div className="a2-t3-table" /><div className="a2-t3-key">🔑</div></>,
    "jacket-key": <><div className="a2-t3-jacket">🧥</div><div className="a2-t3-small-key">🔑</div></>,
    "bag-key": <><div className="a2-t3-bag">👜</div><div className="a2-t3-small-key">🔑</div></>,
    suncream: <><div className="a2-t3-sun">☀</div><div className="a2-t3-spf">SPF</div></>,
    umbrella: <div className="a2-t3-large-symbol">☂</div>,
    sunglasses: <div className="a2-t3-large-symbol">🕶</div>,
    cafe: <><div className="a2-t3-sign">CAFÉ</div><div className="a2-t3-large-symbol low">☕</div></>,
    library: <><div className="a2-t3-sign">BIBLIOTHEK</div><div className="a2-t3-books">▥ ▥ ▥</div></>,
    park: <><div className="a2-t3-tree">♣</div><div className="a2-t3-bench" /></>,
    elevator: <div className="a2-t3-elevator"><span>↑</span><span>↓</span></div>,
    radiator: <div className="a2-t3-radiator">{Array.from({ length: 7 }).map((_, i) => <i key={i} />)}</div>,
    mailboxes: <><div className="a2-t3-stairs">{Array.from({ length: 4 }).map((_, i) => <i key={i} />)}</div><div className="a2-t3-mailboxes">{Array.from({ length: 6 }).map((_, i) => <i key={i} />)}</div></>,
  };

  return <div className={`a2-t3-picture-scene ${icon}`}>{render[icon]}</div>;
};

export default function A2GoetheListeningMockTeil3Preview() {
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
        part: "teil-3",
        key: A2_GOETHE_LISTENING_TEIL3.audioObjectKey,
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
    <main className="a1-goethe-mock-shell" data-a2-goethe-listening-mock-teil3-preview>
      <div className="a1-goethe-mock-topbar">
        <AppBackButton label="Back to A2 Final Mock" fallbackPath="/campus/course/a2-final-mock-exam" />
        <span className="a1-goethe-mock-preview-badge">A2 Hören Teil 3 · Final Mock</span>
      </div>

      <article className="a1-goethe-mock-exam a2-t3-exam">
        <header className="a1-goethe-mock-header">
          <p className="a1-goethe-mock-kicker">A2 · Hören</p>
          <h1>Teil 3</h1>
          <p>{A2_GOETHE_LISTENING_TEIL3.instruction}</p>
          <p><strong>{A2_GOETHE_LISTENING_TEIL3.responseInstruction}</strong></p>
        </header>

        <div className="a1-hoeren-mock-part-audio">
          <div className="a1-hoeren-mock-part-audio-copy">
            <strong>Exam audio</strong>
            <p>Five short conversations. Each conversation is heard once.</p>
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
          <span className="a1-hoeren-mock-play-count">1× in the exam audio</span>
          {error ? <p className="a1-hoeren-mock-audio-error">{error}</p> : null}
        </div>

        <section className="a2-t3-list">
          {A2_GOETHE_LISTENING_TEIL3.questions.map((question) => (
            <article className="a2-t3-question" key={question.number}>
              <header>
                <div>
                  <strong>Aufgabe {question.number}</strong>
                  <span>{question.context}</span>
                </div>
                <h2>{question.question}</h2>
              </header>

              <div className="a2-t3-options">
                {question.options.map((option) => (
                  <label
                    className={answers[question.number] === option.id ? "a2-t3-option selected" : "a2-t3-option"}
                    key={option.id}
                  >
                    <input
                      type="radio"
                      name={`a2-hoeren-t3-${question.number}`}
                      checked={answers[question.number] === option.id}
                      onChange={() => setAnswers((current) => ({ ...current, [question.number]: option.id }))}
                    />
                    <span className="a2-t3-letter">{option.id}</span>
                    <Picture icon={option.icon} />
                    <span className="a2-t3-hidden-label">{option.label}</span>
                  </label>
                ))}
              </div>
            </article>
          ))}
        </section>
      </article>
    </main>
  );
}
