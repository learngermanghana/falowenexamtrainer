import React, { useEffect, useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { useAssessmentRestriction } from "../hooks/useAssessmentRestriction";
import { C1_FINAL_MOCK_STORAGE_KEY, C1_READING } from "../data/c1FinalMockData";
import { C1_READING_TEIL2 } from "../data/c1FinalMockTeil2Data";
import "./C1FinalMockExamPage.css";

const SECTION_DURATIONS = Object.freeze({
  teil1: 10 * 60,
  teil2: 20 * 60,
});

const formatTime = (seconds) => {
  const safe = Math.max(0, Number(seconds) || 0);
  const minutes = String(Math.floor(safe / 60)).padStart(2, "0");
  const secs = String(safe % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
};

const initialState = () => ({
  stage: "teil1",
  started: false,
  deadlineMs: null,
  teil1Answers: {},
  teil1Completed: false,
  teil2Answers: {},
  teil2Completed: false,
  completed: false,
});

const readState = () => {
  if (typeof window === "undefined") return initialState();
  try {
    const parsed = JSON.parse(window.localStorage.getItem(C1_FINAL_MOCK_STORAGE_KEY) || "null");
    if (!parsed || typeof parsed !== "object") return initialState();

    const legacyTeil1Answers = parsed.teil1Answers || parsed.answers || {};
    const migratedFromTeil1Completion =
      Boolean(parsed.completed && !parsed.teil2Completed && parsed.stage !== "teil2");

    return {
      ...initialState(),
      ...parsed,
      stage: migratedFromTeil1Completion ? "teil2" : (parsed.stage || "teil1"),
      started: migratedFromTeil1Completion ? false : Boolean(parsed.started),
      deadlineMs: migratedFromTeil1Completion ? null : (Number(parsed.deadlineMs) || null),
      teil1Answers: legacyTeil1Answers,
      teil1Completed: Boolean(parsed.teil1Completed || migratedFromTeil1Completion),
      teil2Answers: parsed.teil2Answers || {},
      teil2Completed: Boolean(parsed.teil2Completed),
      completed: Boolean(parsed.completed && parsed.teil2Completed),
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
          <option key={option.id} value={option.id}>{option.id}</option>
        ))}
      </select>
    </span>
  );
};

const ChoiceList = ({ question, value, onChoose, disabled, namePrefix }) => (
  <div className="c1-mock-options" role="radiogroup" aria-label={`Aufgabe ${question.number}`}>
    {question.options.map((option) => (
      <label key={option.id} className={value === option.id ? "selected" : ""}>
        <input
          type="radio"
          name={`${namePrefix}-${question.number}`}
          checked={value === option.id}
          onChange={() => onChoose(question.number, option.id)}
          disabled={disabled}
        />
        <strong>{option.id})</strong>
        <span>{option.label}</span>
      </label>
    ))}
  </div>
);

const Teil1 = ({ answers, onChoose, secondsLeft, onContinue }) => {
  const answeredCount = C1_READING.teil1.questions.filter(
    (question) => Boolean(answers[question.number]),
  ).length;

  return (
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
                value={answers[segment.gap]}
                onChoose={onChoose}
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
              <ChoiceList
                question={question}
                value={answers[question.number]}
                onChoose={onChoose}
                disabled={secondsLeft <= 0}
                namePrefix="c1-lesenteil1"
              />
            </article>
          ))}
        </div>

        <p className="c1-mock-autosave">Automatisch gespeichert</p>
        <button type="button" className="c1-mock-next" onClick={onContinue}>
          Teil 1 abschließen · weiter zu Teil 2
        </button>
      </section>
    </>
  );
};

const Teil2 = ({ answers, onChoose, secondsLeft, onFinish }) => {
  const answeredCount = C1_READING_TEIL2.questions.filter(
    (question) => Boolean(answers[question.number]),
  ).length;

  return (
    <>
      <section className="c1-mock-article c1-mock-reading-article">
        <p className="c1-mock-section-label">Internetartikel · Teil 2</p>
        <h2>{C1_READING_TEIL2.articleTitle}</h2>
        <div className="c1-mock-article-body">
          {C1_READING_TEIL2.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="c1-mock-tasks">
        <div className="c1-mock-task-heading">
          <div>
            <p className="c1-mock-section-label">Aufgaben 7 bis 12</p>
            <h2>Wählen Sie a, b, c oder d.</h2>
          </div>
          <strong>{answeredCount}/6 beantwortet</strong>
        </div>

        <div className="c1-mock-question-list">
          {C1_READING_TEIL2.questions.map((question) => (
            <article className="c1-mock-question c1-mock-question-long" key={question.number}>
              <h3>{question.number}.</h3>
              <div>
                <p className="c1-mock-question-text">{question.question}</p>
                <ChoiceList
                  question={question}
                  value={answers[question.number]}
                  onChoose={onChoose}
                  disabled={secondsLeft <= 0}
                  namePrefix="c1-lesenteil2"
                />
              </div>
            </article>
          ))}
        </div>

        <p className="c1-mock-autosave">Automatisch gespeichert</p>
        <button type="button" className="c1-mock-next" onClick={onFinish}>
          Teil 2 abschließen
        </button>
      </section>
    </>
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

  const config = state.stage === "teil2" ? C1_READING_TEIL2 : C1_READING.teil1;
  const secondsLeft = useMemo(() => {
    const duration = SECTION_DURATIONS[state.stage] || SECTION_DURATIONS.teil1;
    if (!state.started || !state.deadlineMs || state.completed) return duration;
    return Math.max(0, Math.ceil((state.deadlineMs - now) / 1000));
  }, [now, state.completed, state.deadlineMs, state.stage, state.started]);

  const start = () => {
    setState((current) => {
      const duration = SECTION_DURATIONS[current.stage] || SECTION_DURATIONS.teil1;
      return {
        ...current,
        started: true,
        deadlineMs:
          current.started && current.deadlineMs
            ? current.deadlineMs
            : Date.now() + duration * 1000,
      };
    });
  };

  const chooseTeil1 = (number, answer) => {
    if (!state.started || secondsLeft <= 0) return;
    setState((current) => ({
      ...current,
      teil1Answers: { ...current.teil1Answers, [number]: answer },
    }));
  };

  const chooseTeil2 = (number, answer) => {
    if (!state.started || secondsLeft <= 0) return;
    setState((current) => ({
      ...current,
      teil2Answers: { ...current.teil2Answers, [number]: answer },
    }));
  };

  const continueToTeil2 = () => {
    setState((current) => ({
      ...current,
      teil1Completed: true,
      stage: "teil2",
      started: true,
      completed: false,
      deadlineMs: Date.now() + SECTION_DURATIONS.teil2 * 1000,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const finishTeil2 = () => {
    setState((current) => ({
      ...current,
      teil2Completed: true,
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
          <h1>Teil 1 und Teil 2 gespeichert</h1>
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
            <h1>{config.title}</h1>
            <p><strong>Vorgeschlagene Arbeitszeit:</strong> {config.time}</p>
          </div>
          <div className={secondsLeft <= 120 ? "c1-mock-timer danger" : "c1-mock-timer"}>
            <span>Zeit</span>
            <strong>{formatTime(secondsLeft)}</strong>
          </div>
        </div>
        <p className="c1-mock-instruction">{config.intro}</p>
      </header>

      {!state.started ? (
        <section className="c1-mock-start">
          <h2>C1 Lesen · {config.title}</h2>
          <p>{config.intro} Die Lösungen werden während des Mocks nicht angezeigt.</p>
          <button type="button" onClick={start}>{config.title} starten</button>
        </section>
      ) : state.stage === "teil2" ? (
        <Teil2
          answers={state.teil2Answers}
          onChoose={chooseTeil2}
          secondsLeft={secondsLeft}
          onFinish={finishTeil2}
        />
      ) : (
        <Teil1
          answers={state.teil1Answers}
          onChoose={chooseTeil1}
          secondsLeft={secondsLeft}
          onContinue={continueToTeil2}
        />
      )}

      {state.started && secondsLeft <= 0 ? (
        <div className="c1-mock-timeup">
          <strong>Zeit abgelaufen.</strong>
          <span>Ihre bisherigen Antworten bleiben gespeichert. Sie können zum nächsten Teil weitergehen.</span>
        </div>
      ) : null}
    </main>
  );
}
