import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AppBackButton from "./navigation/AppBackButton";
import { fetchA2MockAudioPlaybackUrl } from "../services/a2AudioService";
import "./A1GoetheReadingMockTeil1Preview.css";
import "./A1GoetheListeningMockPreview.css";
import "./A2GoetheListeningMockTeil2Preview.css";

export const A2_GOETHE_LISTENING_TEIL2 = Object.freeze({
  title: "Teil 2",
  instruction: "Sie hören ein Gespräch. Sie hören den Text einmal.",
  responseInstruction:
    "Was machen der Mann und die Frau in der Woche? Wählen Sie für die Aufgaben 6 bis 10 ein passendes Bild aus A bis I. Wählen Sie jeden Buchstaben nur einmal.",
  plays: 1,
  audioObjectKey: "a2/mock-hoeren/mock-01/teil-2.mp3",
  tasks: [
    { number: 6, day: "Montag", answer: "A" },
    { number: 7, day: "Dienstag", answer: "B" },
    { number: 8, day: "Mittwoch", answer: "C" },
    { number: 9, day: "Donnerstag", answer: "D" },
    { number: 10, day: "Freitag", answer: "E" },
  ],
  pictures: [
    { id: "A", label: "Deutschkurs", type: "classroom" },
    { id: "B", label: "Schwimmbad", type: "pool" },
    { id: "C", label: "Beim Arzt", type: "doctor" },
    { id: "D", label: "Kochen", type: "cooking" },
    { id: "E", label: "Kino", type: "cinema" },
    { id: "F", label: "Einkaufen", type: "shopping" },
    { id: "G", label: "Joggen", type: "jogging" },
    { id: "H", label: "Fußballspiel", type: "football" },
    { id: "I", label: "Zug fahren", type: "train" },
  ],
});

const PictureScene = ({ type }) => {
  const scenes = {
    classroom: (
      <>
        <div className="a2-hoeren-pictogram-board">Deutsch</div>
        <div className="a2-hoeren-pictogram-person seated left" />
        <div className="a2-hoeren-pictogram-person seated right" />
        <div className="a2-hoeren-pictogram-table" />
      </>
    ),
    pool: (
      <>
        <div className="a2-hoeren-pictogram-water"><i /><i /><i /></div>
        <div className="a2-hoeren-pictogram-swimmer"><span /><b /></div>
      </>
    ),
    doctor: (
      <>
        <div className="a2-hoeren-pictogram-cross">+</div>
        <div className="a2-hoeren-pictogram-doctor" />
        <div className="a2-hoeren-pictogram-patient" />
      </>
    ),
    cooking: (
      <>
        <div className="a2-hoeren-pictogram-pan"><span /></div>
        <div className="a2-hoeren-pictogram-pot"><span /></div>
        <div className="a2-hoeren-pictogram-steam">≈ ≈</div>
      </>
    ),
    cinema: (
      <>
        <div className="a2-hoeren-pictogram-screen">FILM</div>
        <div className="a2-hoeren-pictogram-seats"><i /><i /><i /></div>
      </>
    ),
    shopping: (
      <>
        <div className="a2-hoeren-pictogram-cart">🛒</div>
        <div className="a2-hoeren-pictogram-bag">▱</div>
      </>
    ),
    jogging: (
      <>
        <div className="a2-hoeren-pictogram-runner">🏃</div>
        <div className="a2-hoeren-pictogram-tree">♣</div>
      </>
    ),
    football: (
      <>
        <div className="a2-hoeren-pictogram-ball">⚽</div>
        <div className="a2-hoeren-pictogram-goal" />
      </>
    ),
    train: (
      <>
        <div className="a2-hoeren-pictogram-train">🚆</div>
        <div className="a2-hoeren-pictogram-track" />
      </>
    ),
  };
  return <div className={`a2-hoeren-pictogram-scene ${type}`}>{scenes[type]}</div>;
};

export default function A2GoetheListeningMockTeil2Preview() {
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
        part: "teil-2",
        key: A2_GOETHE_LISTENING_TEIL2.audioObjectKey,
        idToken,
      });
      setAudioUrl(result.url);
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Could not load audio.");
    } finally {
      setLoading(false);
    }
  };

  const selectedLetters = new Set(Object.values(answers));

  return (
    <main className="a1-goethe-mock-shell" data-a2-goethe-listening-mock-teil2-preview>
      <div className="a1-goethe-mock-topbar">
        <AppBackButton label="Back to A2 Mock Preview" fallbackPath="/campus/course/a2-mock-practice-preview" />
        <span className="a1-goethe-mock-preview-badge">A2 Hören Teil 2 · preview only</span>
      </div>

      <article className="a1-goethe-mock-exam a2-hoeren-teil2-exam">
        <header className="a1-goethe-mock-header">
          <p className="a1-goethe-mock-kicker">A2 · Hören</p>
          <h1>Teil 2</h1>
          <p>{A2_GOETHE_LISTENING_TEIL2.instruction}</p>
          <p><strong>{A2_GOETHE_LISTENING_TEIL2.responseInstruction}</strong></p>
        </header>

        <div className="a1-hoeren-mock-part-audio">
          <div className="a1-hoeren-mock-part-audio-copy">
            <strong>Exam audio</strong>
            <p>The complete conversation is heard once.</p>
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

        <section className="a2-hoeren-answer-sheet">
          {A2_GOETHE_LISTENING_TEIL2.tasks.map((task) => (
            <label className="a2-hoeren-day-answer" key={task.number}>
              <span>Aufgabe {task.number}</span>
              <strong>{task.day}</strong>
              <select
                value={answers[task.number] || ""}
                onChange={(event) =>
                  setAnswers((current) => ({
                    ...current,
                    [task.number]: event.target.value,
                  }))
                }
              >
                <option value="">—</option>
                {A2_GOETHE_LISTENING_TEIL2.pictures.map((picture) => (
                  <option
                    key={picture.id}
                    value={picture.id}
                    disabled={selectedLetters.has(picture.id) && answers[task.number] !== picture.id}
                  >
                    {picture.id}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </section>

        <section className="a2-hoeren-picture-section">
          <h2>Bilder A–I</h2>
          <p className="a2-hoeren-picture-note">Choose by picture letter. Each letter can be used only once.</p>
          <div className="a2-hoeren-picture-grid">
            {A2_GOETHE_LISTENING_TEIL2.pictures.map((picture) => (
              <article
                className={selectedLetters.has(picture.id) ? "a2-hoeren-picture-card selected" : "a2-hoeren-picture-card"}
                key={picture.id}
              >
                <div className="a2-hoeren-picture-letter">{picture.id}</div>
                <PictureScene type={picture.type} />
                <span className="a2-hoeren-picture-admin-label">{picture.label}</span>
              </article>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
