import React, { useEffect, useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { B2_FINAL_MOCK_STORAGE_KEY, B2_READING } from "../data/b2FinalMockData";
import "./B2FinalMockExamPage.css";

const SECTION_DURATIONS = Object.freeze({
  teil1: 18 * 60,
  teil2: 12 * 60,
  teil3: 12 * 60,
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
  teil2Answers: {},
  teil3Answers: {},
  teil3Completed: false,
  completed: false,
});

const readState = () => {
  if (typeof window === "undefined") return initialState();

  try {
    const parsed = JSON.parse(window.localStorage.getItem(B2_FINAL_MOCK_STORAGE_KEY) || "null");
    if (!parsed || typeof parsed !== "object") return initialState();

    return {
      ...initialState(),
      ...parsed,
      stage: parsed.stage || "teil1",
      teil1Answers: parsed.teil1Answers || parsed.answers || {},
      teil2Answers: parsed.teil2Answers || {},
      teil3Answers: parsed.teil3Answers || {},
      teil3Completed: Boolean(parsed.teil3Completed),
      deadlineMs: Number(parsed.deadlineMs) || null,
      started: Boolean(parsed.started),
      completed: Boolean(parsed.completed && parsed.teil3Completed),
    };
  } catch (_error) {
    return initialState();
  }
};

const SectionHeader = ({ stage, secondsLeft }) => {
  const config = B2_READING[stage];
  return (
    <header className="b2-mock-header">
      <p className="b2-mock-kicker">GOETHE-ZERTIFIKAT B2 · LESEN</p>
      <div className="b2-mock-title-row">
        <div>
          <h1>{config.title}</h1>
          <p><strong>Vorgeschlagene Arbeitszeit:</strong> {config.time}</p>
        </div>
        <div className={secondsLeft <= 120 ? "b2-mock-timer danger" : "b2-mock-timer"}>
          <span>Zeit</span>
          <strong>{formatTime(secondsLeft)}</strong>
        </div>
      </div>
      <p className="b2-mock-instruction">{config.intro}</p>
    </header>
  );
};

const Teil1 = ({ answers, onChoose, secondsLeft, onContinue }) => {
  const answeredCount = B2_READING.teil1.questions.filter((question) => Boolean(answers[question.number])).length;

  return (
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
                    className={answers[question.number] === letter ? "selected" : ""}
                  >
                    <input
                      type="radio"
                      name={`b2-lesenteil1-${question.number}`}
                      checked={answers[question.number] === letter}
                      onChange={() => onChoose(question.number, letter)}
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
        <button type="button" className="b2-mock-next" onClick={onContinue}>
          Teil 1 abschließen · weiter zu Teil 2
        </button>
      </section>
    </>
  );
};

const GapSelect = ({ number, value, answers, onChange, disabled }) => {
  const usedLetters = new Set(
    Object.entries(answers)
      .filter(([questionNumber]) => Number(questionNumber) !== Number(number))
      .map(([, letter]) => letter)
      .filter(Boolean),
  );

  return (
    <span className="b2-mock-inline-gap">
      <strong>Aufgabe {number}: Satz</strong>
      <select
        aria-label={`Aufgabe ${number}: Satz auswählen`}
        value={value || ""}
        onChange={(event) => onChange(number, event.target.value)}
        disabled={disabled}
      >
        <option value="">–</option>
        {B2_READING.teil2.sentences.map((sentence) => (
          <option key={sentence.id} value={sentence.id} disabled={usedLetters.has(sentence.id)}>
            {sentence.id}
          </option>
        ))}
      </select>
    </span>
  );
};

const ArticleColumn = ({ paragraphs, answers, onChoose, secondsLeft }) => (
  <div className="b2-mock-article-column">
    {paragraphs.map((paragraph) => (
      <p key={paragraph.number}>
        {paragraph.before}{" "}
        <GapSelect
          number={paragraph.number}
          value={answers[paragraph.number]}
          answers={answers}
          onChange={onChoose}
          disabled={secondsLeft <= 0}
        />{" "}
        {paragraph.after}
      </p>
    ))}
  </div>
);

const Teil2 = ({ answers, onChoose, secondsLeft, onContinue }) => {
  const answeredCount = B2_READING.teil2.paragraphs.filter((paragraph) => Boolean(answers[paragraph.number])).length;
  const left = B2_READING.teil2.paragraphs.slice(0, 3);
  const right = B2_READING.teil2.paragraphs.slice(3);

  return (
    <>
      <section className="b2-mock-reconstruction">
        <p className="b2-mock-section-label">Text Zeitungsartikel mit Eingabefeldern · Teil 2</p>
        <h2>{B2_READING.teil2.articleTitle}</h2>
        <p className="b2-mock-article-lead">
          Lesen Sie den Text und setzen Sie für jede Lücke den passenden Satz A–H ein.
        </p>

        <div className="b2-mock-article-grid">
          <ArticleColumn paragraphs={left} answers={answers} onChoose={onChoose} secondsLeft={secondsLeft} />
          <ArticleColumn paragraphs={right} answers={answers} onChoose={onChoose} secondsLeft={secondsLeft} />
        </div>
      </section>

      <section className="b2-mock-sentence-bank">
        <div className="b2-mock-task-heading">
          <div>
            <p className="b2-mock-section-label">Sätze A bis H · Teil 2</p>
            <h2>Zwei Sätze passen nicht.</h2>
          </div>
          <strong>{answeredCount}/6 beantwortet</strong>
        </div>

        <div className="b2-mock-sentence-list">
          {B2_READING.teil2.sentences.map((sentence) => {
            const usedAt = Object.entries(answers).find(([, letter]) => letter === sentence.id)?.[0];
            return (
              <div key={sentence.id} className={usedAt ? "b2-mock-sentence used" : "b2-mock-sentence"}>
                <strong>Satz {sentence.id}</strong>
                <span>{sentence.text}</span>
                {usedAt ? <em>Aufgabe {usedAt}</em> : null}
              </div>
            );
          })}
        </div>

        <p className="b2-mock-autosave">Automatisch gespeichert</p>
        <button type="button" className="b2-mock-next" onClick={onContinue}>
          Teil 2 abschließen · weiter zu Teil 3
        </button>
      </section>
    </>
  );
};

const Teil3ChoiceList = ({ question, value, onChoose, disabled }) => (
  <div className="b2-mock-teil3-options" role="radiogroup" aria-label={`Aufgabe ${question.number}`}>
    {question.options.map((option) => (
      <label key={option.id} className={value === option.id ? "selected" : ""}>
        <input
          type="radio"
          name={`b2-lesenteil3-${question.number}`}
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

const Teil3 = ({ answers, onChoose, secondsLeft, onFinish }) => {
  const answeredCount = B2_READING.teil3.questions.filter((question) => Boolean(answers[question.number])).length;
  const midpoint = Math.ceil(B2_READING.teil3.paragraphs.length / 2);
  const left = B2_READING.teil3.paragraphs.slice(0, midpoint);
  const right = B2_READING.teil3.paragraphs.slice(midpoint);

  return (
    <>
      <section className="b2-mock-teil3-article">
        <p className="b2-mock-section-label">Text Zeitungsartikel · Teil 3</p>
        <h2>{B2_READING.teil3.articleTitle}</h2>
        <p className="b2-mock-teil3-deck">
          Vier Tage arbeiten, fünf Tage Leistung? Chancen und Grenzen eines Arbeitsmodells, das immer mehr Betriebe testen.
        </p>

        <div className="b2-mock-teil3-columns">
          <div>{left.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          <div>{right.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </div>
      </section>

      <section className="b2-mock-teil3-tasks">
        <div className="b2-mock-task-heading">
          <div>
            <p className="b2-mock-section-label">Aufgaben 16 bis 21 · Teil 3</p>
            <h2>Wählen Sie a, b oder c.</h2>
          </div>
          <strong>{answeredCount}/6 beantwortet</strong>
        </div>

        <div className="b2-mock-teil3-question-list">
          {B2_READING.teil3.questions.map((question) => (
            <article className="b2-mock-teil3-question" key={question.number}>
              <h3>{question.number}. {question.question}</h3>
              <Teil3ChoiceList
                question={question}
                value={answers[question.number]}
                onChoose={onChoose}
                disabled={secondsLeft <= 0}
              />
            </article>
          ))}
        </div>

        <p className="b2-mock-autosave">Automatisch gespeichert</p>
        <button type="button" className="b2-mock-next" onClick={onFinish}>
          Teil 3 abschließen
        </button>
      </section>
    </>
  );
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
    if (!state.started || !state.deadlineMs || state.completed) {
      return SECTION_DURATIONS[state.stage] || 0;
    }
    return Math.max(0, Math.ceil((state.deadlineMs - now) / 1000));
  }, [now, state.completed, state.deadlineMs, state.stage, state.started]);

  const start = () => {
    setState((current) => ({
      ...current,
      started: true,
      stage: current.stage || "teil1",
      deadlineMs:
        current.started && current.deadlineMs
          ? current.deadlineMs
          : Date.now() + SECTION_DURATIONS[current.stage || "teil1"] * 1000,
    }));
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

  const continueToTeil2 = () => {
    setState((current) => ({
      ...current,
      stage: "teil2",
      started: true,
      deadlineMs: Date.now() + SECTION_DURATIONS.teil2 * 1000,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const continueToTeil3 = () => {
    setState((current) => ({
      ...current,
      stage: "teil3",
      started: true,
      deadlineMs: Date.now() + SECTION_DURATIONS.teil3 * 1000,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const finishTeil3 = () => {
    setState((current) => ({
      ...current,
      teil3Completed: true,
      completed: true,
      deadlineMs: null,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (state.completed) {
    return (
      <main className="b2-mock-shell">
        <AppBackButton label="Back to course" fallbackPath="/campus/course" />
        <section className="b2-mock-start">
          <p className="b2-mock-kicker">GOETHE-ZERTIFIKAT B2 · LESEN</p>
          <h1>Teil 1 bis Teil 3 gespeichert</h1>
          <p>
            Ihre Antworten wurden gespeichert. Weitere Leseteile werden diesem B2-Mock Schritt für Schritt hinzugefügt.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="b2-mock-shell">
      <AppBackButton label="Back to course" fallbackPath="/campus/course" />
      <SectionHeader stage={state.stage} secondsLeft={secondsLeft} />

      {!state.started ? (
        <section className="b2-mock-start">
          <h2>B2 Lesen · Teil 1</h2>
          <p>
            Lesen Sie zuerst die vier Forumsbeiträge. Danach ordnen Sie die Aussagen 1–9 den Personen A–D zu.
            Die Personen können mehrmals gewählt werden.
          </p>
          <button type="button" onClick={start}>Teil 1 starten</button>
        </section>
      ) : state.stage === "teil3" ? (
        <Teil3
          answers={state.teil3Answers}
          onChoose={chooseTeil3}
          secondsLeft={secondsLeft}
          onFinish={finishTeil3}
        />
      ) : state.stage === "teil2" ? (
        <Teil2
          answers={state.teil2Answers}
          onChoose={chooseTeil2}
          secondsLeft={secondsLeft}
          onContinue={continueToTeil3}
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
        <div className="b2-mock-timeup">
          <strong>Zeit abgelaufen.</strong>
          <span>Ihre bisherigen Antworten bleiben gespeichert. Sie können zum nächsten Teil weitergehen.</span>
        </div>
      ) : null}
    </main>
  );
}
