import React, { useEffect, useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { B2_FINAL_MOCK_STORAGE_KEY, B2_READING } from "../data/b2FinalMockData";
import "./B2FinalMockExamPage.css";

const DURATION_SECONDS = 18 * 60;

const formatTime = (seconds) => {
  const safe = Math.max(0, Number(seconds) || 0);
  const minutes = String(Math.floor(safe / 60)).padStart(2, "0");
  const secs = String(safe % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
};

const readState = () => {
  if (typeof window === "undefined") {
    return { answers: {}, deadlineMs: null, started: false };
  }
  try {
    const parsed = JSON.parse(window.localStorage.getItem(B2_FINAL_MOCK_STORAGE_KEY) || "null");
    if (!parsed || typeof parsed !== "object") {
      return { answers: {}, deadlineMs: null, started: false };
    }
    return {
      answers: parsed.answers || {},
      deadlineMs: Number(parsed.deadlineMs) || null,
      started: Boolean(parsed.started),
    };
  } catch (_error) {
    return { answers: {}, deadlineMs: null, started: false };
  }
};

export default function B2FinalMockExamPage() {
  const [state, setState] = useState(readState);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      B2_FINAL_MOCK_STORAGE_KEY,
      JSON.stringify({ ...state, savedAt: Date.now() }),
    );
  }, [state]);

  const secondsLeft = useMemo(() => {
    if (!state.started || !state.deadlineMs) return DURATION_SECONDS;
    return Math.max(0, Math.ceil((state.deadlineMs - now) / 1000));
  }, [now, state.deadlineMs, state.started]);

  const answeredCount = useMemo(
    () => B2_READING.teil1.questions.filter((question) => Boolean(state.answers[question.number])).length,
    [state.answers],
  );

  const start = () => {
    setState((current) => ({
      ...current,
      started: true,
      deadlineMs:
        current.started && current.deadlineMs
          ? current.deadlineMs
          : Date.now() + DURATION_SECONDS * 1000,
    }));
  };

  const choose = (number, answer) => {
    if (!state.started || secondsLeft <= 0) return;
    setState((current) => ({
      ...current,
      answers: { ...current.answers, [number]: answer },
    }));
  };

  return (
    <main className="b2-mock-shell">
      <AppBackButton label="Back to course" fallbackPath="/campus/course" />

      <header className="b2-mock-header">
        <p className="b2-mock-kicker">GOETHE-ZERTIFIKAT B2 · LESEN</p>
        <div className="b2-mock-title-row">
          <div>
            <h1>Teil 1</h1>
            <p><strong>Vorgeschlagene Arbeitszeit:</strong> 18 Minuten</p>
          </div>
          <div className={secondsLeft <= 120 ? "b2-mock-timer danger" : "b2-mock-timer"}>
            <span>Zeit</span>
            <strong>{formatTime(secondsLeft)}</strong>
          </div>
        </div>
        <p className="b2-mock-instruction">{B2_READING.teil1.intro}</p>
      </header>

      {!state.started ? (
        <section className="b2-mock-start">
          <h2>B2 Lesen · Teil 1</h2>
          <p>
            Lesen Sie zuerst die vier Forumsbeiträge. Danach ordnen Sie die Aussagen 1–9 den Personen A–D zu.
            Die Personen können mehrmals gewählt werden.
          </p>
          <button type="button" onClick={start}>Teil 1 starten</button>
        </section>
      ) : (
        <>
          <section className="b2-mock-forum">
            <p className="b2-mock-section-label">Die Personen A, B, C und D · Teil 1</p>
            <h2>{B2_READING.teil1.forumTitle}</h2>

            <div className="b2-mock-people">
              {B2_READING.teil1.people.map((person) => (
                <article key={person.id} className="b2-mock-person">
                  <div className="b2-mock-person-badge" aria-hidden="true">{person.id}</div>
                  <div>
                    <h3>{person.id} · {person.name} <span>({person.meta})</span></h3>
                    <p>{person.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="b2-mock-tasks">
            <div className="b2-mock-task-heading">
              <div>
                <p className="b2-mock-section-label">Aufgaben 1 bis 9</p>
                <h2>Welche Person passt?</h2>
              </div>
              <strong>{answeredCount}/9 beantwortet</strong>
            </div>

            <div className="b2-mock-example">
              <span>Beispiel</span>
              <p><strong>0.</strong> {B2_READING.teil1.example.statement}</p>
              <strong className="b2-mock-example-answer">A</strong>
            </div>

            <div className="b2-mock-question-table">
              {B2_READING.teil1.questions.map((question) => (
                <div className="b2-mock-question-row" key={question.number}>
                  <p><strong>{question.number}.</strong> {question.statement}</p>
                  <div className="b2-mock-person-options" role="radiogroup" aria-label={`Aufgabe ${question.number}`}>
                    {["A", "B", "C", "D"].map((letter) => (
                      <label
                        key={letter}
                        className={state.answers[question.number] === letter ? "selected" : ""}
                      >
                        <input
                          type="radio"
                          name={`b2-lesenteil1-${question.number}`}
                          checked={state.answers[question.number] === letter}
                          onChange={() => choose(question.number, letter)}
                          disabled={secondsLeft <= 0}
                        />
                        <span>{letter}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="b2-mock-autosave">Automatisch gespeichert</p>
            {secondsLeft <= 0 ? (
              <div className="b2-mock-timeup">
                <strong>Zeit abgelaufen.</strong>
                <span>Ihre bisherigen Antworten bleiben gespeichert.</span>
              </div>
            ) : null}
          </section>
        </>
      )}
    </main>
  );
}
