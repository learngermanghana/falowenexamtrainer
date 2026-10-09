import { useMockExamIntegrity, MockExamIntegrityNotice } from "../hooks/useMockExamIntegrity";
import React, { useEffect, useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { useAuth } from "../context/AuthContext";
import { useAssessmentRestriction } from "../hooks/useAssessmentRestriction";
import {
  C1_FINAL_MOCK_STORAGE_KEY,
  C1_READING,
  C1_READING_PRACTICE_STORAGE_KEY,
} from "../data/c1FinalMockData";
import { C1_READING_TEIL2 } from "../data/c1FinalMockTeil2Data";
import { C1_READING_TEIL3 } from "../data/c1FinalMockTeil3Data";
import { C1_READING_TEIL4 } from "../data/c1FinalMockTeil4Data";
import "./C1FinalMockExamPage.css";

const SECTION_DURATIONS = Object.freeze({
  teil1: 10 * 60,
  teil2: 20 * 60,
  teil3: 20 * 60,
  teil4: 15 * 60,
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
  teil3Answers: {},
  teil3Completed: false,
  teil4Answers: {},
  teil4Completed: false,
  completed: false,
});

const readState = () => {
  if (typeof window === "undefined") return initialState();
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(C1_READING_PRACTICE_STORAGE_KEY) ||
      window.localStorage.getItem(C1_FINAL_MOCK_STORAGE_KEY) ||
      "null",
    );
    if (!parsed || typeof parsed !== "object") return initialState();

    const legacyTeil1Answers = parsed.teil1Answers || parsed.answers || {};
    const migratedFromTeil1Completion =
      Boolean(parsed.completed && !parsed.teil2Completed && parsed.stage !== "teil2");

    const hasTeil3Progress =
      Boolean(parsed.teil3Completed) ||
      Boolean(Object.keys(parsed.teil3Answers || {}).length) ||
      parsed.stage === "teil3";
    const migratedFromTeil2Completion =
      Boolean(parsed.completed && parsed.teil2Completed && !hasTeil3Progress);

    const hasTeil4Progress =
      Boolean(parsed.teil4Completed) ||
      Boolean(Object.keys(parsed.teil4Answers || {}).length) ||
      parsed.stage === "teil4";
    const migratedFromTeil3Completion =
      Boolean(parsed.completed && parsed.teil3Completed && !hasTeil4Progress);

    const migratedForward =
      migratedFromTeil1Completion ||
      migratedFromTeil2Completion ||
      migratedFromTeil3Completion;

    const stage = migratedFromTeil1Completion
      ? "teil2"
      : migratedFromTeil2Completion
        ? "teil3"
        : migratedFromTeil3Completion
          ? "teil4"
          : (parsed.stage || "teil1");

    return {
      ...initialState(),
      ...parsed,
      stage,
      started: migratedForward ? false : Boolean(parsed.started),
      deadlineMs: migratedForward ? null : (Number(parsed.deadlineMs) || null),
      teil1Answers: legacyTeil1Answers,
      teil1Completed: Boolean(parsed.teil1Completed || migratedFromTeil1Completion),
      teil2Answers: parsed.teil2Answers || {},
      teil2Completed: Boolean(parsed.teil2Completed),
      teil3Answers: parsed.teil3Answers || {},
      teil3Completed: Boolean(parsed.teil3Completed),
      teil4Answers: parsed.teil4Answers || {},
      teil4Completed: Boolean(parsed.teil4Completed),
      completed: Boolean(parsed.completed && parsed.teil4Completed),
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
          Teil 2 abschließen · weiter zu Teil 3
        </button>
      </section>
    </>
  );
};

const Teil3GapSelect = ({ number, value, answers, onChoose, disabled }) => {
  const usedLetters = new Set(
    Object.entries(answers)
      .filter(([gapNumber]) => Number(gapNumber) !== Number(number))
      .map(([, letter]) => letter)
      .filter(Boolean),
  );

  return (
    <span className="c1-mock-reconstruction-gap">
      <strong>{number}</strong>
      <select
        aria-label={`Lücke ${number}: Satz auswählen`}
        value={value || ""}
        onChange={(event) => onChoose(number, event.target.value)}
        disabled={disabled}
      >
        <option value="">–</option>
        {C1_READING_TEIL3.sentences.map((sentence) => (
          <option
            key={sentence.id}
            value={sentence.id}
            disabled={usedLetters.has(sentence.id)}
          >
            {sentence.id}
          </option>
        ))}
      </select>
    </span>
  );
};

const Teil3 = ({ answers, onChoose, secondsLeft, onFinish }) => {
  const answeredCount = Object.keys(C1_READING_TEIL3.answers).filter(
    (number) => Boolean(answers[number]),
  ).length;

  return (
    <>
      <section className="c1-mock-article c1-mock-reconstruction">
        <p className="c1-mock-section-label">Kommentar · Teil 3</p>
        <h2>{C1_READING_TEIL3.articleTitle}</h2>

        <div className="c1-mock-reconstruction-body">
          {C1_READING_TEIL3.paragraphs.map((paragraph) => (
            <p key={paragraph.gap}>
              {paragraph.before}{" "}
              <Teil3GapSelect
                number={paragraph.gap}
                value={answers[paragraph.gap]}
                answers={answers}
                onChoose={onChoose}
                disabled={secondsLeft <= 0}
              />{" "}
              {paragraph.after}
            </p>
          ))}
        </div>
      </section>

      <section className="c1-mock-tasks c1-mock-sentence-bank">
        <div className="c1-mock-task-heading">
          <div>
            <p className="c1-mock-section-label">Sätze A bis H · Teil 3</p>
            <h2>Welche Sätze passen in die Lücken 13 bis 18?</h2>
            <p>Zwei Sätze passen nicht.</p>
          </div>
          <strong>{answeredCount}/6 beantwortet</strong>
        </div>

        <div className="c1-mock-sentence-list">
          {C1_READING_TEIL3.sentences.map((sentence) => {
            const usedAt = Object.entries(answers).find(([, value]) => value === sentence.id)?.[0];
            return (
              <article className={usedAt ? "used" : ""} key={sentence.id}>
                <strong>{sentence.id}</strong>
                <p>{sentence.text}</p>
                {usedAt ? <span>Lücke {usedAt}</span> : null}
              </article>
            );
          })}
        </div>

        <p className="c1-mock-autosave">Automatisch gespeichert</p>
        <button type="button" className="c1-mock-next" onClick={onFinish}>
          Teil 3 abschließen · weiter zu Teil 4
        </button>
      </section>
    </>
  );
};

const Teil4Choices = ({ question, value, onChoose, disabled }) => (
  <div className="c1-mock-teil4-options" role="radiogroup" aria-label={`Aufgabe ${question.number}`}>
    {C1_READING_TEIL4.options.map((option) => (
      <label key={option} className={value === option ? "selected" : ""}>
        <input
          type="radio"
          name={`c1-lesenteil4-${question.number}`}
          checked={value === option}
          onChange={() => onChoose(question.number, option)}
          disabled={disabled}
        />
        <strong>{option}</strong>
      </label>
    ))}
  </div>
);

const Teil4 = ({ answers, onChoose, secondsLeft, onFinish }) => {
  const answeredCount = C1_READING_TEIL4.questions.filter(
    (question) => Boolean(answers[question.number]),
  ).length;

  return (
    <>
      <section className="c1-mock-article c1-mock-teil4-article">
        <p className="c1-mock-section-label">Fachzeitschrift · Teil 4</p>
        <h2>{C1_READING_TEIL4.articleTitle}</h2>
        <p className="c1-mock-teil4-topic">Zukunft der Metropolen und urbane Transformation</p>

        <div className="c1-mock-teil4-people">
          {C1_READING_TEIL4.people.map((person) => (
            <article key={person.id} className="c1-mock-teil4-person">
              <div className="c1-mock-teil4-badge">{person.id}</div>
              <div>
                <h3>{person.person} <span>({person.role})</span></h3>
                <p>{person.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="c1-mock-tasks">
        <div className="c1-mock-task-heading">
          <div>
            <p className="c1-mock-section-label">Aufgaben 23 bis 30</p>
            <h2>Wer äußert das?</h2>
            <p>Wählen Sie A, B oder C. Wenn keine Person passt, wählen Sie x.</p>
          </div>
          <strong>{answeredCount}/8 beantwortet</strong>
        </div>

        <div className="c1-mock-teil4-question-list">
          {C1_READING_TEIL4.questions.map((question) => (
            <article key={question.number} className="c1-mock-teil4-question">
              <p><strong>{question.number}.</strong> {question.statement}</p>
              <Teil4Choices
                question={question}
                value={answers[question.number]}
                onChoose={onChoose}
                disabled={secondsLeft <= 0}
              />
            </article>
          ))}
        </div>

        <p className="c1-mock-autosave">Automatisch gespeichert</p>
        <button type="button" className="c1-mock-next" onClick={onFinish}>
          Teil 4 abschließen
        </button>
      </section>
    </>
  );
};

export default function C1FinalMockExamPage() {
  useAssessmentRestriction();
  const { idToken } = useAuth();
  const [state, setState] = useState(readState);
  const integrity = useMockExamIntegrity({ level: "C1", mockId: "c1-lesen-sample-01", idToken, attemptId: "", section: state.stage, active: Boolean(state.started && !state.completed) });
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      C1_READING_PRACTICE_STORAGE_KEY,
      JSON.stringify({ ...state, savedAt: Date.now() }),
    );
  }, [state]);

  const config =
    state.stage === "teil4"
      ? C1_READING_TEIL4
      : state.stage === "teil3"
        ? C1_READING_TEIL3
        : state.stage === "teil2"
          ? C1_READING_TEIL2
          : C1_READING.teil1;
  const secondsLeft = useMemo(() => {
    const duration = SECTION_DURATIONS[state.stage] || SECTION_DURATIONS.teil1;
    if (!state.started || !state.deadlineMs || state.completed) return duration;
    return Math.max(0, Math.ceil((state.deadlineMs - now) / 1000));
  }, [now, state.completed, state.deadlineMs, state.stage, state.started]);

  const start = () => {
    integrity.requestFullscreen();
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

  const chooseTeil3 = (number, answer) => {
    if (!state.started || secondsLeft <= 0) return;
    setState((current) => ({
      ...current,
      teil3Answers: { ...current.teil3Answers, [number]: answer },
    }));
  };

  const chooseTeil4 = (number, answer) => {
    if (!state.started || secondsLeft <= 0) return;
    setState((current) => ({
      ...current,
      teil4Answers: { ...current.teil4Answers, [number]: answer },
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

  const continueToTeil3 = () => {
    setState((current) => ({
      ...current,
      teil2Completed: true,
      stage: "teil3",
      started: true,
      completed: false,
      deadlineMs: Date.now() + SECTION_DURATIONS.teil3 * 1000,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const continueToTeil4 = () => {
    setState((current) => ({
      ...current,
      teil3Completed: true,
      stage: "teil4",
      started: true,
      completed: false,
      deadlineMs: Date.now() + SECTION_DURATIONS.teil4 * 1000,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const finishTeil4 = () => {
    setState((current) => ({
      ...current,
      teil4Completed: true,
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
          <h1>C1 Lesen Sample 1 abgeschlossen</h1>
          <p>Ihre Antworten für Teil 1 bis Teil 4 wurden gespeichert. Dieses Training gehört zum Lesen-Bereich im Exams Room und ist kein vollständiger C1-Mock.</p>
          <p><strong>Lesen-Teil 4 von 4 abgeschlossen.</strong> Es gibt hier keine Gesamtprüfung und keine Bestehen/Nichtbestehen-Bewertung für C1.</p>
          <button type="button" onClick={() => {
            if (window.confirm("C1 Lesen Sample 1 neu starten? Die bisherigen Antworten auf diesem Gerät werden ersetzt.")) {
              setState(initialState());
            }
          }}>Lesen Sample 1 erneut üben</button>
        </section>
      </main>
    );
  }

  return (
    <main className="c1-mock-shell" onCopyCapture={integrity.onCopyCapture} onPasteCapture={integrity.onPasteCapture}>
      <MockExamIntegrityNotice guard={integrity} />
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
        <p className="c1-mock-instruction"><strong>C1 Lesen: Teil {Math.max(1, ["teil1", "teil2", "teil3", "teil4"].indexOf(state.stage) + 1)} von 4.</strong> Nur Leseübungen – dies ist kein vollständiger vierteiliger C1-Mock mit Hören, Schreiben und Sprechen. Ihre Antworten werden auf diesem Gerät gespeichert; der Timer läuft während einer Unterbrechung weiter.</p>
      </header>

      {!state.started ? (
        <section className="c1-mock-start">
          <h2>C1 Lesen · {config.title}</h2>
          <p>{config.intro} Die Lösungen werden während des Mocks nicht angezeigt.</p>
          <button type="button" onClick={start}>{config.title} starten</button>
        </section>
      ) : state.stage === "teil4" ? (
        <Teil4
          answers={state.teil4Answers}
          onChoose={chooseTeil4}
          secondsLeft={secondsLeft}
          onFinish={finishTeil4}
        />
      ) : state.stage === "teil3" ? (
        <Teil3
          answers={state.teil3Answers}
          onChoose={chooseTeil3}
          secondsLeft={secondsLeft}
          onFinish={continueToTeil4}
        />
      ) : state.stage === "teil2" ? (
        <Teil2
          answers={state.teil2Answers}
          onChoose={chooseTeil2}
          secondsLeft={secondsLeft}
          onFinish={continueToTeil3}
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
