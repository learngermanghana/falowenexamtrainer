import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import "./A1GoetheReadingMockTeil1Preview.css";
import "./A2GoetheWritingMockPreview.css";

export const A2_GOETHE_WRITING_MOCK = Object.freeze({
  teil1: {
    title: "Teil 1",
    situation:
      "Sie sind unterwegs in der Stadt und schreiben eine SMS an Ihre Freundin Mila.",
    points: [
      "Entschuldigen Sie sich, dass Sie zu spät kommen.",
      "Schreiben Sie, warum Sie sich verspäten.",
      "Nennen Sie einen neuen Treffpunkt und eine neue Uhrzeit.",
    ],
    instruction: "Schreiben Sie 20–30 Wörter.",
    reminder: "Schreiben Sie zu allen drei Punkten.",
  },
  teil2: {
    title: "Teil 2",
    situation:
      "Ihre Kursleiterin, Frau Becker, hat Sie zu einem Sommerfest der Sprachschule eingeladen. Schreiben Sie Frau Becker eine E-Mail.",
    points: [
      "Bedanken Sie sich für die Einladung und sagen Sie, dass Sie kommen.",
      "Informieren Sie, dass Sie eine Person mitbringen.",
      "Fragen Sie, wie Sie zum Fest kommen.",
    ],
    instruction: "Schreiben Sie 30–40 Wörter.",
    reminder: "Schreiben Sie zu allen drei Punkten.",
  },
});

const WordCount = ({ text, min, max }) => {
  const count = useMemo(
    () => (text.trim() ? text.trim().split(/\s+/).length : 0),
    [text],
  );
  const inRange = count >= min && count <= max;

  return (
    <div className={inRange ? "a2-schreiben-count in-range" : "a2-schreiben-count"}>
      Words: <strong>{count}</strong> · Target: {min}–{max}
    </div>
  );
};

const Points = ({ points }) => (
  <ul className="a2-schreiben-points">
    {points.map((point) => (
      <li key={point}>{point}</li>
    ))}
  </ul>
);

export default function A2GoetheWritingMockPreview() {
  const [sms, setSms] = useState("");
  const [email, setEmail] = useState("");

  return (
    <main className="a1-goethe-mock-shell" data-a2-goethe-writing-mock-preview>
      <div className="a1-goethe-mock-topbar">
        <AppBackButton label="Back to A2 mock" fallbackPath="/campus/course/a2-mock-practice-preview" />
        <span className="a1-goethe-mock-preview-badge">A2 Schreiben · preview only</span>
      </div>

      <article className="a1-goethe-mock-exam a2-schreiben-exam">
        <header className="a1-goethe-mock-header">
          <p className="a1-goethe-mock-kicker">A2 · Schreiben</p>
          <h1>Mockprüfung</h1>
          <p>Bearbeiten Sie beide Teile.</p>
        </header>

        <section className="a2-schreiben-part">
          <header className="a2-schreiben-part-header">
            <h2>{A2_GOETHE_WRITING_MOCK.teil1.title}</h2>
            <p>{A2_GOETHE_WRITING_MOCK.teil1.situation}</p>
          </header>

          <div className="a2-schreiben-task-paper sms">
            <Points points={A2_GOETHE_WRITING_MOCK.teil1.points} />
            <p className="a2-schreiben-instruction">
              <strong>{A2_GOETHE_WRITING_MOCK.teil1.instruction}</strong><br />
              {A2_GOETHE_WRITING_MOCK.teil1.reminder}
            </p>

            <div className="a2-schreiben-sms-frame">
              <div className="a2-schreiben-sms-header">
                <span>SMS</span>
                <strong>Mila</strong>
              </div>
              <textarea
                value={sms}
                onChange={(event) => setSms(event.target.value)}
                rows={7}
                placeholder="Hallo Mila, ..."
                aria-label="A2 Schreiben Teil 1 SMS"
              />
            </div>
            <WordCount text={sms} min={20} max={30} />
          </div>
        </section>

        <section className="a2-schreiben-part">
          <header className="a2-schreiben-part-header">
            <h2>{A2_GOETHE_WRITING_MOCK.teil2.title}</h2>
            <p>{A2_GOETHE_WRITING_MOCK.teil2.situation}</p>
          </header>

          <div className="a2-schreiben-task-paper email">
            <Points points={A2_GOETHE_WRITING_MOCK.teil2.points} />
            <p className="a2-schreiben-instruction">
              <strong>{A2_GOETHE_WRITING_MOCK.teil2.instruction}</strong><br />
              {A2_GOETHE_WRITING_MOCK.teil2.reminder}
            </p>

            <div className="a2-schreiben-email-frame">
              <div className="a2-schreiben-email-toolbar">
                <button type="button" tabIndex="-1">Senden</button>
                <span>Antworten</span>
              </div>
              <div className="a2-schreiben-email-field">
                <strong>An:</strong>
                <span>Frau Becker</span>
              </div>
              <div className="a2-schreiben-email-field">
                <strong>Betreff:</strong>
                <span>Sommerfest</span>
              </div>
              <textarea
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                rows={10}
                placeholder="Sehr geehrte Frau Becker, ..."
                aria-label="A2 Schreiben Teil 2 E-Mail"
              />
            </div>
            <WordCount text={email} min={30} max={40} />
          </div>
        </section>
      </article>
    </main>
  );
}
