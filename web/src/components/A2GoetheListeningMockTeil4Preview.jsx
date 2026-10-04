import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AppBackButton from "./navigation/AppBackButton";
import { fetchA2MockAudioPlaybackUrl } from "../services/a2AudioService";
import "./A1GoetheReadingMockTeil1Preview.css";
import "./A1GoetheListeningMockPreview.css";
import "./A2GoetheListeningMockTeil4Preview.css";

export const A2_GOETHE_LISTENING_TEIL4 = Object.freeze({
  title: "Teil 4",
  instruction: "Sie hören ein Interview. Sie hören den Text zweimal.",
  responseInstruction:
    "Markieren Sie für die Aufgaben 16 bis 20: Ja oder Nein.",
  plays: 2,
  audioObjectKey: "a2/mock-hoeren/mock-01/teil-4.mp3",
  questions: [
    {
      number: 16,
      statement: "Herr Berger arbeitet seit zwei Jahren als Fahrradkurier.",
      answer: "ja",
    },
    {
      number: 17,
      statement: "Sein Arbeitstag beginnt um neun Uhr.",
      answer: "nein",
    },
    {
      number: 18,
      statement: "Er fährt ungefähr fünfzig Kilometer pro Tag.",
      answer: "ja",
    },
    {
      number: 19,
      statement: "Im Winter findet er seine Arbeit zu schwer und möchte aufhören.",
      answer: "nein",
    },
    {
      number: 20,
      statement: "Am Wochenende hat er frei.",
      answer: "ja",
    },
  ],
});

const BinaryChoice = ({ name, value, onChange }) => (
  <div className="a2-t4-binary" role="radiogroup">
    {[
      ["ja", "Ja"],
      ["nein", "Nein"],
    ].map(([id, label]) => (
      <label className={value === id ? "a2-t4-choice selected" : "a2-t4-choice"} key={id}>
        <input
          type="radio"
          name={name}
          checked={value === id}
          onChange={() => onChange(id)}
        />
        <span>{label}</span>
      </label>
    ))}
  </div>
);

export default function A2GoetheListeningMockTeil4Preview() {
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
        part: "teil-4",
        key: A2_GOETHE_LISTENING_TEIL4.audioObjectKey,
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
    <main className="a1-goethe-mock-shell" data-a2-goethe-listening-mock-teil4-preview>
      <div className="a1-goethe-mock-topbar">
        <AppBackButton label="Back to A2 Mock Preview" fallbackPath="/campus/course/a2-mock-practice-preview" />
        <span className="a1-goethe-mock-preview-badge">A2 Hören Teil 4 · preview only</span>
      </div>

      <article className="a1-goethe-mock-exam a2-t4-exam">
        <header className="a1-goethe-mock-header">
          <p className="a1-goethe-mock-kicker">A2 · Hören</p>
          <h1>Teil 4</h1>
          <p>{A2_GOETHE_LISTENING_TEIL4.instruction}</p>
          <p><strong>{A2_GOETHE_LISTENING_TEIL4.responseInstruction}</strong></p>
        </header>

        <div className="a1-hoeren-mock-part-audio">
          <div className="a1-hoeren-mock-part-audio-copy">
            <strong>Exam audio</strong>
            <p>The complete interview is already repeated twice in the audio.</p>
          </div>

          {audioUrl ? (
            <audio
              className="a1-hoeren-mock-native-audio"
              controls
              controlsList="nodownload"
              src={audioUrl}
              preload="metadata"
            >
              Your browser does not support this audio.
            </audio>
          ) : (
            <button
              type="button"
              className="a1-hoeren-mock-load-audio"
              onClick={loadAudio}
              disabled={loading}
            >
              {loading ? "Loading audio …" : "Load audio"}
            </button>
          )}

          <span className="a1-hoeren-mock-play-count">2× in the exam audio</span>
          {error ? <p className="a1-hoeren-mock-audio-error">{error}</p> : null}
        </div>

        <section className="a2-t4-interview-card">
          <div>
            <span className="a2-t4-interview-label">Interview</span>
            <h2>Fahrradkurier in Hamburg</h2>
            <p>
              Eine Moderatorin spricht mit Herrn Berger über seinen Arbeitstag,
              seine Arbeitsbedingungen und seine Freizeit.
            </p>
          </div>
          <div className="a2-t4-bike-illustration" aria-hidden="true">
            <div className="a2-t4-wheel left" />
            <div className="a2-t4-wheel right" />
            <div className="a2-t4-frame" />
            <div className="a2-t4-box">KURIER</div>
          </div>
        </section>

        <section className="a2-t4-question-list">
          {A2_GOETHE_LISTENING_TEIL4.questions.map((question) => (
            <article className="a2-t4-question" key={question.number}>
              <div>
                <strong>Aufgabe {question.number}</strong>
                <p>{question.statement}</p>
              </div>
              <BinaryChoice
                name={`a2-hoeren-t4-${question.number}`}
                value={answers[question.number] || ""}
                onChange={(value) =>
                  setAnswers((current) => ({
                    ...current,
                    [question.number]: value,
                  }))
                }
              />
            </article>
          ))}
        </section>

        <div className="a2-t4-end-note">
          End of A2 Hören preview · In the final mock, feedback stays hidden until the full exam is complete.
        </div>
      </article>
    </main>
  );
}
