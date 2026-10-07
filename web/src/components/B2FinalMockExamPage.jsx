import { useAssessmentRestriction } from "../hooks/useAssessmentRestriction";
import React, { useEffect, useMemo, useRef, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { useAuth } from "../context/AuthContext";
import { fetchB2MockAudioPlaybackUrl } from "../services/b2AudioService";
import { B2_FINAL_MOCK_STORAGE_KEY, B2_LISTENING, B2_READING } from "../data/b2FinalMockData";
import "./B2FinalMockExamPage.css";

const SECTION_DURATIONS = Object.freeze({
  teil1: 18 * 60,
  teil2: 12 * 60,
  teil3: 12 * 60,
  teil4: 12 * 60,
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
  teil4Answers: {},
  teil4Completed: false,
  hoeren1Answers: {},
  hoeren1AudioStatus: "not_started",
  hoeren1Completed: false,
  hoeren2Answers: {},
  hoeren2AudioStatus: "not_started",
  hoeren2Completed: false,
  completed: false,
});

const readState = () => {
  if (typeof window === "undefined") return initialState();

  try {
    const parsed = JSON.parse(window.localStorage.getItem(B2_FINAL_MOCK_STORAGE_KEY) || "null");
    if (!parsed || typeof parsed !== "object") return initialState();

    const hasTeil4Progress =
      Boolean(parsed.teil4Completed) ||
      Boolean(Object.keys(parsed.teil4Answers || {}).length) ||
      parsed.stage === "teil4";
    const migratedFromTeil3Completion =
      Boolean(parsed.completed && parsed.teil3Completed && !hasTeil4Progress);

    const hasHoeren1Progress =
      Boolean(parsed.hoeren1Completed) ||
      Boolean(Object.keys(parsed.hoeren1Answers || {}).length) ||
      ["started", "ended"].includes(String(parsed.hoeren1AudioStatus || "")) ||
      parsed.stage === "hoeren-teil1";
    const migratedFromLesenCompletion =
      Boolean(parsed.completed && parsed.teil4Completed && !hasHoeren1Progress);

    const hasHoeren2Progress =
      Boolean(parsed.hoeren2Completed) ||
      Boolean(Object.keys(parsed.hoeren2Answers || {}).length) ||
      ["started", "ended"].includes(String(parsed.hoeren2AudioStatus || "")) ||
      parsed.stage === "hoeren-teil2";
    const migratedFromHoeren1Completion =
      Boolean(parsed.completed && parsed.hoeren1Completed && !hasHoeren2Progress);

    const stage = migratedFromTeil3Completion
      ? "teil4"
      : migratedFromLesenCompletion
        ? "hoeren-teil1"
        : migratedFromHoeren1Completion
          ? "hoeren-teil2"
          : (parsed.stage || "teil1");

    const migratedForward =
      migratedFromTeil3Completion ||
      migratedFromLesenCompletion ||
      migratedFromHoeren1Completion;

    return {
      ...initialState(),
      ...parsed,
      stage,
      teil1Answers: parsed.teil1Answers || parsed.answers || {},
      teil2Answers: parsed.teil2Answers || {},
      teil3Answers: parsed.teil3Answers || {},
      teil3Completed: Boolean(parsed.teil3Completed),
      teil4Answers: parsed.teil4Answers || {},
      teil4Completed: Boolean(parsed.teil4Completed),
      hoeren1Answers: parsed.hoeren1Answers || {},
      hoeren1AudioStatus: parsed.hoeren1AudioStatus || "not_started",
      hoeren1Completed: Boolean(parsed.hoeren1Completed),
      hoeren2Answers: parsed.hoeren2Answers || {},
      hoeren2AudioStatus: parsed.hoeren2AudioStatus || "not_started",
      hoeren2Completed: Boolean(parsed.hoeren2Completed),
      deadlineMs: migratedForward ? null : (Number(parsed.deadlineMs) || null),
      started: migratedForward ? false : Boolean(parsed.started),
      completed: Boolean(parsed.completed && parsed.hoeren2Completed),
    };
  } catch (_error) {
    return initialState();
  }
};

const getStageConfig = (stage) => {
  if (stage === "hoeren-teil1" || stage === "hoeren-teil2") {
    const listeningPart = stage === "hoeren-teil2" ? B2_LISTENING.teil2 : B2_LISTENING.teil1;
    return {
      module: "HÖREN",
      title: stage === "hoeren-teil2" ? "Teil 2" : "Teil 1",
      time: "",
      intro: listeningPart.intro,
    };
  }
  return {
    module: "LESEN",
    ...(B2_READING[stage] || B2_READING.teil1),
  };
};

const SectionHeader = ({ stage, secondsLeft }) => {
  const config = getStageConfig(stage);
  const hasTimer = Number.isFinite(secondsLeft);
  return (
    <header className="b2-mock-header">
      <p className="b2-mock-kicker">GOETHE-ZERTIFIKAT B2 · {config.module}</p>
      <div className="b2-mock-title-row">
        <div>
          <h1>{config.title}</h1>
          {config.time ? <p><strong>Vorgeschlagene Arbeitszeit:</strong> {config.time}</p> : null}
        </div>
        {hasTimer ? (
          <div className={secondsLeft <= 120 ? "b2-mock-timer danger" : "b2-mock-timer"}>
            <span>Zeit</span>
            <strong>{formatTime(secondsLeft)}</strong>
          </div>
        ) : null}
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

const Teil3 = ({ answers, onChoose, secondsLeft, onContinue }) => {
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
        <button type="button" className="b2-mock-next" onClick={onContinue}>
          Teil 3 abschließen · weiter zu Teil 4
        </button>
      </section>
    </>
  );
};

const Teil4Select = ({ number, value, answers, onChange, disabled }) => {
  const usedLetters = new Set(
    Object.entries(answers)
      .filter(([questionNumber]) => Number(questionNumber) !== Number(number))
      .map(([, letter]) => letter)
      .filter(Boolean),
  );

  return (
    <select
      className="b2-mock-teil4-select"
      aria-label={`Aufgabe ${number}: Stellungnahme auswählen`}
      value={value || ""}
      onChange={(event) => onChange(number, event.target.value)}
      disabled={disabled}
    >
      <option value="">–</option>
      {B2_READING.teil4.statements.map((statement) => (
        <option key={statement.id} value={statement.id} disabled={usedLetters.has(statement.id)}>
          {statement.id}
        </option>
      ))}
    </select>
  );
};

const Teil4 = ({ answers, onChoose, secondsLeft, onFinish }) => {
  const answeredCount = B2_READING.teil4.questions.filter((question) => Boolean(answers[question.number])).length;

  return (
    <>
      <section className="b2-mock-teil4-statements">
        <p className="b2-mock-section-label">Stellungnahmen A bis H · Teil 4</p>
        <h2>{B2_READING.teil4.topic}</h2>

        <div className="b2-mock-teil4-list">
          {B2_READING.teil4.statements.map((statement) => (
            <article className="b2-mock-teil4-statement" key={statement.id}>
              <div className="b2-mock-teil4-letter">{statement.id}</div>
              <div>
                <h3>{statement.person} <span>({statement.role})</span></h3>
                <p>{statement.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="b2-mock-teil4-tasks">
        <div className="b2-mock-task-heading">
          <div>
            <p className="b2-mock-section-label">Aufgaben 22 bis 27 · Teil 4</p>
            <h2>Welche Stellungnahme passt?</h2>
          </div>
          <strong>{answeredCount}/6 beantwortet</strong>
        </div>

        <div className="b2-mock-teil4-question-list">
          {B2_READING.teil4.questions.map((question) => (
            <div className="b2-mock-teil4-question" key={question.number}>
              <p><strong>{question.number}.</strong> {question.statement}</p>
              <Teil4Select
                number={question.number}
                value={answers[question.number]}
                answers={answers}
                onChange={onChoose}
                disabled={secondsLeft <= 0}
              />
            </div>
          ))}
        </div>

        <p className="b2-mock-autosave">Automatisch gespeichert</p>
        <button type="button" className="b2-mock-next" onClick={onFinish}>
          Teil 4 abschließen · weiter zu Hören
        </button>
      </section>
    </>
  );
};

const HorenChoiceList = ({ partId = "teil-1", question, value, onChoose, disabled = false, example = false }) => (
  <div className="b2-mock-hoeren-options" role="radiogroup" aria-label={`Aufgabe ${question.number}`}>
    {question.options.map((option) => {
      const selected = example ? question.answer === option.id : value === option.id;
      return (
        <label key={option.id} className={selected ? "selected" : ""}>
          <input
            type="radio"
            name={`b2-hoeren-${partId}-${question.number}`}
            checked={selected}
            onChange={() => !example && onChoose(question.number, option.id)}
            disabled={disabled || example}
          />
          <strong>{option.id})</strong>
          <span>{option.label}</span>
        </label>
      );
    })}
  </div>
);

const B2MockAudioPlayer = ({ idToken, part, status, onStatusChange }) => {
  const audioRef = useRef(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const started = status === "started" || status === "ended";

  useEffect(() => {
    let active = true;
    fetchB2MockAudioPlaybackUrl({
      mockId: "mock-01",
      part: part.id,
      key: part.audioObjectKey,
      idToken,
    })
      .then((result) => {
        if (active) setUrl(result.url);
      })
      .catch((loadError) => {
        if (active) setError(loadError?.message || "Audio could not be prepared.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      audioRef.current?.pause();
    };
  }, [idToken, part.audioObjectKey, part.id]);

  const startAudio = () => {
    if (!audioRef.current || !url || loading || started) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play()
      .then(() => onStatusChange("started"))
      .catch((playError) => setError(playError?.message || "Audio could not start."));
  };

  return (
    <div className="b2-mock-hoeren-player">
      <audio
        ref={audioRef}
        src={url}
        preload="metadata"
        onTimeUpdate={(event) => {
          const current = Number(event.currentTarget.currentTime || 0);
          const duration = Number(event.currentTarget.duration || 0);
          setProgress(duration ? Math.min(100, Math.round((current / duration) * 100)) : 0);
        }}
        onEnded={() => {
          setProgress(100);
          onStatusChange("ended");
        }}
      />
      <div>
        <strong>{part.title} · vollständige Audiodatei</strong>
        <p>{part.audioNote || "Die komplette Hördatei für diesen Teil wird hier abgespielt."}</p>
      </div>
      <div className="b2-mock-hoeren-progress"><span style={{ width: `${progress}%` }} /></div>
      {status === "ended" ? (
        <strong className="b2-mock-hoeren-finished">Audio beendet</strong>
      ) : (
        <button type="button" onClick={startAudio} disabled={loading || !url || started}>
          {loading ? "Audio wird vorbereitet …" : started ? "Audio läuft …" : "Audio starten"}
        </button>
      )}
      {error ? <p className="b2-mock-hoeren-error">{error}</p> : null}
    </div>
  );
};

const HoerenTeil1 = ({ idToken, answers, audioStatus, onChoose, onAudioStatusChange, onFinish }) => {
  const questions = B2_LISTENING.teil1.texts.flatMap((textBlock) => textBlock.questions);
  const answeredCount = questions.filter((question) => Boolean(answers[question.number])).length;

  return (
    <>
      <section className="b2-mock-hoeren-section">
        <p className="b2-mock-section-label">Beispiel · Reisebüro</p>
        <h2>Hören Teil 1</h2>
        <B2MockAudioPlayer
          idToken={idToken}
          part={B2_LISTENING.teil1}
          status={audioStatus}
          onStatusChange={onAudioStatusChange}
        />

        <div className="b2-mock-hoeren-example">
          {B2_LISTENING.teil1.example.map((question) => (
            <article key={question.number} className="b2-mock-hoeren-question">
              <div className="b2-mock-hoeren-question-heading">
                <span>Beispiel {question.number}</span>
                <strong>{question.question}</strong>
              </div>
              <HorenChoiceList
                partId="teil-1"
                question={question}
                value={question.answer}
                onChoose={() => {}}
                example
              />
            </article>
          ))}
        </div>
      </section>

      <section className="b2-mock-hoeren-tasks">
        <div className="b2-mock-task-heading">
          <div>
            <p className="b2-mock-section-label">Aufgaben 1 bis 10 · Hören Teil 1</p>
            <h2>Wählen Sie a, b oder c.</h2>
          </div>
          <strong>{answeredCount}/10 beantwortet</strong>
        </div>

        {B2_LISTENING.teil1.texts.map((textBlock) => (
          <section className="b2-mock-hoeren-text-block" key={textBlock.title}>
            <h3>{textBlock.title}</h3>
            {textBlock.questions.map((question) => (
              <article className="b2-mock-hoeren-question" key={question.number}>
                <strong>{question.number}. {question.question}</strong>
                <HorenChoiceList
                  question={question}
                  value={answers[question.number]}
                  onChoose={onChoose}
                />
              </article>
            ))}
          </section>
        ))}

        <p className="b2-mock-autosave">Automatisch gespeichert</p>
        <button type="button" className="b2-mock-next" onClick={onFinish}>
          Hören Teil 1 abschließen · weiter zu Teil 2
        </button>
      </section>
    </>
  );
};

const HoerenTeil2 = ({ idToken, answers, audioStatus, onChoose, onAudioStatusChange, onFinish }) => {
  const part = B2_LISTENING.teil2;
  const answeredCount = part.questions.filter((question) => Boolean(answers[question.number])).length;

  return (
    <>
      <section className="b2-mock-hoeren-section">
        <p className="b2-mock-section-label">Interview · Meeresbiologie</p>
        <h2>Hören Teil 2</h2>
        <B2MockAudioPlayer
          idToken={idToken}
          part={part}
          status={audioStatus}
          onStatusChange={onAudioStatusChange}
        />
      </section>

      <section className="b2-mock-hoeren-tasks">
        <div className="b2-mock-task-heading">
          <div>
            <p className="b2-mock-section-label">Aufgaben 11 bis 16 · Hören Teil 2</p>
            <h2>Wählen Sie a, b oder c.</h2>
          </div>
          <strong>{answeredCount}/6 beantwortet</strong>
        </div>

        <section className="b2-mock-hoeren-text-block">
          <h3>Interview mit einem Professor für Meeresbiologie</h3>
          {part.questions.map((question) => (
            <article className="b2-mock-hoeren-question" key={question.number}>
              <strong>{question.number}. {question.question}</strong>
              <HorenChoiceList
                partId="teil-2"
                question={question}
                value={answers[question.number]}
                onChoose={onChoose}
              />
            </article>
          ))}
        </section>

        <p className="b2-mock-autosave">Automatisch gespeichert</p>
        <button type="button" className="b2-mock-next" onClick={onFinish}>
          Hören Teil 2 abschließen
        </button>
      </section>
    </>
  );
};

export default function B2FinalMockExamPage() {
  useAssessmentRestriction();
  const { idToken } = useAuth();
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
    const duration = SECTION_DURATIONS[state.stage];
    if (!duration) return null;
    if (!state.started || !state.deadlineMs || state.completed) {
      return duration;
    }
    return Math.max(0, Math.ceil((state.deadlineMs - now) / 1000));
  }, [now, state.completed, state.deadlineMs, state.stage, state.started]);

  const start = () => {
    setState((current) => {
      const stage = current.stage || "teil1";
      const duration = SECTION_DURATIONS[stage];
      return {
        ...current,
        started: true,
        stage,
        deadlineMs:
          duration && current.started && current.deadlineMs
            ? current.deadlineMs
            : duration
              ? Date.now() + duration * 1000
              : null,
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

  const chooseHoeren1 = (number, answer) => {
    if (!state.started) return;
    setState((current) => ({
      ...current,
      hoeren1Answers: { ...current.hoeren1Answers, [number]: answer },
    }));
  };

  const setHoeren1AudioStatus = (audioStatus) => {
    setState((current) => ({
      ...current,
      hoeren1AudioStatus: audioStatus,
    }));
  };

  const chooseHoeren2 = (number, answer) => {
    if (!state.started) return;
    setState((current) => ({
      ...current,
      hoeren2Answers: { ...current.hoeren2Answers, [number]: answer },
    }));
  };

  const setHoeren2AudioStatus = (audioStatus) => {
    setState((current) => ({
      ...current,
      hoeren2AudioStatus: audioStatus,
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

  const continueToTeil4 = () => {
    setState((current) => ({
      ...current,
      teil3Completed: true,
      stage: "teil4",
      started: true,
      deadlineMs: Date.now() + SECTION_DURATIONS.teil4 * 1000,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const continueToHoerenTeil1 = () => {
    setState((current) => ({
      ...current,
      teil4Completed: true,
      stage: "hoeren-teil1",
      started: false,
      completed: false,
      deadlineMs: null,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const continueToHoerenTeil2 = () => {
    setState((current) => ({
      ...current,
      hoeren1Completed: true,
      stage: "hoeren-teil2",
      started: false,
      completed: false,
      deadlineMs: null,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const finishHoerenTeil2 = () => {
    setState((current) => ({
      ...current,
      hoeren2Completed: true,
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
          <p className="b2-mock-kicker">GOETHE-ZERTIFIKAT B2 · MOCK</p>
          <h1>Lesen Teil 1–4 und Hören Teil 1–2 gespeichert</h1>
          <p>
            Ihre Antworten wurden gespeichert. Weitere Hörteile werden diesem B2-Mock Schritt für Schritt hinzugefügt.
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
          <h2>B2 {getStageConfig(state.stage).module} · {getStageConfig(state.stage).title}</h2>
          <p>{getStageConfig(state.stage).intro}</p>
          <button type="button" onClick={start}>{getStageConfig(state.stage).title} starten</button>
        </section>
      ) : state.stage === "hoeren-teil2" ? (
        <HoerenTeil2
          idToken={idToken}
          answers={state.hoeren2Answers}
          audioStatus={state.hoeren2AudioStatus}
          onChoose={chooseHoeren2}
          onAudioStatusChange={setHoeren2AudioStatus}
          onFinish={finishHoerenTeil2}
        />
      ) : state.stage === "hoeren-teil1" ? (
        <HoerenTeil1
          idToken={idToken}
          answers={state.hoeren1Answers}
          audioStatus={state.hoeren1AudioStatus}
          onChoose={chooseHoeren1}
          onAudioStatusChange={setHoeren1AudioStatus}
          onFinish={continueToHoerenTeil2}
        />
      ) : state.stage === "teil4" ? (
        <Teil4
          answers={state.teil4Answers}
          onChoose={chooseTeil4}
          secondsLeft={secondsLeft}
          onFinish={continueToHoerenTeil1}
        />
      ) : state.stage === "teil3" ? (
        <Teil3
          answers={state.teil3Answers}
          onChoose={chooseTeil3}
          secondsLeft={secondsLeft}
          onContinue={continueToTeil4}
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

      {state.started && Number.isFinite(secondsLeft) && secondsLeft <= 0 ? (
        <div className="b2-mock-timeup">
          <strong>Zeit abgelaufen.</strong>
          <span>Ihre bisherigen Antworten bleiben gespeichert. Sie können zum nächsten Teil weitergehen.</span>
        </div>
      ) : null}
    </main>
  );
}
