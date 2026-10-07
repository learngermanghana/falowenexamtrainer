import React, { useEffect, useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { useAssessmentRestriction } from "../hooks/useAssessmentRestriction";
import { C1_FINAL_MOCK_STORAGE_KEY, C1_READING } from "../data/c1FinalMockData";
import "./C1FinalMockExamPage.css";

const DURATION_SECONDS = 10 * 60;

const formatTime = (seconds) => {
  const safe = Math.max(0, Number(seconds) || 0);
  const minutes = String(Math.floor(safe / 60)).padStart(2, "0");
  const secs = String(safe % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
};

const initialState = () => ({
  started: false,
  deadlineMs: null,
  answers: {},
  completed: false,
});

const readState = () => {
  if (typeof window === "undefined") return initialState();
  try {
    const parsed = JSON.parse(window.localStorage.getItem(C1_FINAL_MOCK_STORAGE_KEY) || "null");
    if (!parsed || typeof parsed !== "object") return initialState();
    return {
      ...initialState(),
      ...parsed,
      answers: parsed.answers || {},
      deadlineMs: Number(parsed.deadlineMs) || null,
      started: Boolean(parsed.started),
      completed: Boolean(parsed.completed),
    };
  } catch (_error) {
    return initialState();
  }
};

const GapSelect = ({ number, value, onChoose, disabled }) => {
  const question = C1_READING.teil1.questions.find((item) => item.number === number);
  return (
    <span className="c1-mock-inline-gap">
      <strong>({number})</strong>
      <select
        aria-label={`Lücke ${number}`}
        value={value || ""}
        onChange={(event) => onChoose(number, event.target.value)}
        disabled={disabled}
      >
        <option value="">–</option>
        {question.options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.id}
          </option>
        ))}
      </select>
    </span>
  );
};

export default function C1FinalMockExamPage() {
  useAssessmentRestriction();
  const [state, setState] = useState(readState);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      C1_FINAL_MOCK_STORAGE_KEY,
      JSON.stringify({ ...state, savedAt: Date.now() }),
    );
  }, [state]);

  const secondsLeft = useMemo(() => {
    if (!state.started || !state.deadlineMs || state.completed) return DURATION_SECONDS;
    return Math.max(0, Math.ceil((state.deadlineMs - now) / 1000));
  }, [now, state.completed, state.deadlineMs, state.started]);

  const answeredCount = C1_READING.teil1.questions.filter(
    (question) => Boolean(state.answers[question.number]),
  ).length;

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

  const finish = () => {
    setState((current) => ({
      ...current,
      completed: true,
      deadlineMs: null,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (state.completed) {
    return (
      <main className="c1-mock-shell">
        <AppBackButton label="Back to course" fallbackPath="/campus/course" />
        <section className="c1-mock-start">
          <p className="c1-mock-kicker">GOETHE-ZERTIFIKAT C1 · LESEN</p>
          <h1>Teil 1 gespeichert</h1>
          <p>Ihre Antworten wurden gespeichert. Die weiteren C1-Leseteile werden diesem Mock Schritt für Schritt hinzugefügt.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="c1-mock-shell">
      <AppBackButton label="Back to course" fallbackPath="/campus/course" />

      <header className="c1-mock-header">
        <p className="c1-mock-kicker">GOETHE-ZERTIFIKAT C1 · LESEN</p>
        <div className="c1-mock-title-row">
          <div>
            <h1>Teil 1</h1>
            <p><strong>Vorgeschlagene Arbeitszeit:</strong> {C1_READING.teil1.time}</p>
          </div>
          <div className={secondsLeft <= 120 ? "c1-mock-timer danger" : "c1-mock-timer"}>
            <span>Zeit</span>
            <strong>{formatTime(secondsLeft)}</strong>
          </div>
        </div>
        <p className="c1-mock-instruction">{C1_READING.teil1.intro}</p>
      </header>

      {!state.started ? (
        <section className="c1-mock-start">
          <h2>C1 Lesen · Teil 1</h2>
          <p>
            Lesen Sie den Artikel vollständig und wählen Sie für jede Lücke genau eine Lösung a, b, c oder d.
            Die Lösungen werden während des Mocks nicht angezeigt.
          </p>
          <button type="button" onClick={start}>Teil 1 starten</button>
        </section>
      ) : (
        <>
          <section className="c1-mock-article">
            <p className="c1-mock-section-label">Zeitschriftenartikel · Teil 1</p>
            <h2>{C1_READING.teil1.articleTitle}</h2>

            <div className="c1-mock-article-body">
              {C1_READING.teil1.segments.map((segment) => (
                <p key={segment.gap}>
                  {segment.before ? <>{segment.before} </> : null}
                  <GapSelect
                    number={segment.gap}
                    value={state.answers[segment.gap]}
                    onChoose={choose}
                    disabled={secondsLeft <= 0}
                  />
                  {segment.after ? <> {segment.after}</> : null}
                </p>
              ))}
            </div>
          </section>

          <section className="c1-mock-tasks">
            <div className="c1-mock-task-heading">
              <div>
                <p className="c1-mock-section-label">Aufgaben 1 bis 6</p>
                <h2>Wählen Sie a, b, c oder d.</h2>
              </div>
              <strong>{answeredCount}/6 beantwortet</strong>
            </div>

            <div className="c1-mock-question-list">
              {C1_READING.teil1.questions.map((question) => (
                <article className="c1-mock-question" key={question.number}>
                  <h3>{question.number}.</h3>
                  <div className="c1-mock-options" role="radiogroup" aria-label={`Aufgabe ${question.number}`}>
                    {question.options.map((option) => (
                      <label
                        key={option.id}
                        className={state.answers[question.number] === option.id ? "selected" : ""}
                      >
                        <input
                          type="radio"
                          name={`c1-lesenteil1-${question.number}`}
                          checked={state.answers[question.number] === option.id}
                          onChange={() => choose(question.number, option.id)}
                          disabled={secondsLeft <= 0}
                        />
                        <strong>{option.id})</strong>
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <p className="c1-mock-autosave">Automatisch gespeichert</p>
            <button type="button" className="c1-mock-next" onClick={finish}>
              Teil 1 abschließen
            </button>
          </section>
        </>
      )}

      {state.started && secondsLeft <= 0 ? (
        <div className="c1-mock-timeup">
          <strong>Zeit abgelaufen.</strong>
          <span>Ihre bisherigen Antworten bleiben gespeichert.</span>
        </div>
      ) : null}
    </main>
  );
}
