import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AppBackButton from './navigation/AppBackButton';
import { useAuth } from '../context/AuthContext';
import { A1_MOCK_3_ID, A1_MOCK_3_READING } from '../data/a1FinalMock3Data';
import './A1GoetheReadingMockTeil1Preview.css';
import './A1GoetheReadingMockTeil3Preview.css';
import './A1Mock2.css';
import './A1Mock3Reading.css';

const PART_KEYS = ['teil1', 'teil2', 'teil3'];
const QUESTIONS = PART_KEYS.flatMap((part, index) =>
  A1_MOCK_3_READING[part].questions.map((question) => ({
    ...question, key: `t${index + 1}-${question.number}`,
  }))
);
const blankAttempt = () => ({ answers: {}, submitted: false });
const loadAttempt = (key) => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(key) || 'null');
    if (stored?.mockId !== A1_MOCK_3_ID || !stored.answers || typeof stored.answers !== 'object') {
      return blankAttempt();
    }
    return { answers: stored.answers, submitted: Boolean(stored.submitted) };
  } catch (_error) {
    return blankAttempt();
  }
};

function AnswerChoices({ question, answers, submitted, onChange, part }) {
  const key = `t${part}-${question.number}`;
  const id = `a1-mock3-${key}`;
  const choices = part === 2
    ? [['a', 'Text A'], ['b', 'Text B']]
    : [['richtig', 'Richtig'], ['falsch', 'Falsch']];
  const isCorrect = answers[key] === question.answer;
  return (
    <section className="a1-goethe-mock-question" aria-labelledby={id}>
      <h3 className="a1-goethe-mock-question-title">Aufgabe {question.number}</h3>
      {part === 3 ? (
        <>
          <p className="a1-goethe-mock-location">{question.location}</p>
          <article className={`a1-goethe-mock-notice-card a1-goethe-mock-notice-${question.notice.kind}`}>
            <div className="a1-goethe-mock-notice-inner">
              <h3>{question.notice.heading}</h3>
              {question.notice.lines.map((line, i) => <p key={i}>{line}</p>)}
            </div>
          </article>
        </>
      ) : null}
      <p id={id} className="a1-goethe-mock-statement">{question.statement}</p>
      {part === 2 ? (
        <div className="a1-mock2-sources">
          {question.options.map((option) => (
            <article key={option.id} className="a1-goethe-mock-browser-panel" aria-label={`Website ${option.id.toUpperCase()}`}>
              <div className="a1-goethe-mock-browser-greenbar">Website {option.id.toUpperCase()}</div>
              <div className="a1-mock2-source-copy">
                <h3>{option.title}</h3>
                {option.lines.map((line, index) => <p key={index}>{line}</p>)}
              </div>
            </article>
          ))}
        </div>
      ) : null}
      <div className="a1-goethe-mock-choices" role="radiogroup" aria-labelledby={id}>
        {choices.map(([value, label]) => (
          <label className="a1-goethe-mock-choice" key={value}>
            <input
              type="radio"
              name={`a1-mock3-${key}`}
              value={value}
              checked={answers[key] === value}
              onChange={() => onChange(key, value)}
              disabled={submitted}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
      {submitted && (
        <div className={`a1-mock3-feedback ${isCorrect ? 'is-correct' : 'is-incorrect'}`}>
          <strong>{isCorrect ? 'Richtig beantwortet' : 'Nicht richtig'} · Lösung: {part === 2 ? question.answer.toUpperCase() : question.answer === 'richtig' ? 'Richtig' : 'Falsch'}</strong>
          <p>{question.explanation}</p>
        </div>
      )}
    </section>
  );
}

export default function A1Mock3Reading() {
  const { user } = useAuth();
  const storageKey = `falowen:a1-mock-03:lesen:${user?.uid || 'guest'}`;
  const [attempt, setAttempt] = useState(() => loadAttempt(storageKey));
  const [partKey, setPartKey] = useState('teil1');
  const { answers, submitted } = attempt;
  const answeredCount = QUESTIONS.filter(({ key }) => Boolean(answers[key])).length;
  const correctCount = QUESTIONS.filter(({ key, answer }) => answers[key] === answer).length;
  const sectionScores = useMemo(() => PART_KEYS.map((part, index) => {
    const list = A1_MOCK_3_READING[part].questions;
    return {
      part,
      number: index + 1,
      answered: list.filter((q) => answers[`t${index + 1}-${q.number}`]).length,
      score: list.filter((q) => answers[`t${index + 1}-${q.number}`] === q.answer).length,
    };
  }), [answers]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify({ mockId: A1_MOCK_3_ID, ...attempt }));
  }, [attempt, storageKey]);

  const changeAnswer = (key, value) => {
    if (submitted) return;
    setAttempt((current) => ({ ...current, answers: { ...current.answers, [key]: value } }));
  };

  const submit = () => {
    if (answeredCount !== QUESTIONS.length || submitted) return;
    setAttempt((current) => ({ ...current, submitted: true }));
  };

  const partNumber = PART_KEYS.indexOf(partKey) + 1;

  return (
    <main className="a1-goethe-mock-shell a1-mock3-reading" lang="de" data-a1-mock3-lesen>
      <div className="a1-goethe-mock-topbar">
        <AppBackButton label="Back to Mock Exams" fallbackPath="/exams/mocks" />
        <span className="a1-goethe-mock-preview-badge">A1 Mock 3 · Lesen</span>
      </div>
      <article className="a1-goethe-mock-exam a1-mock2-reading">
        <header className="a1-goethe-mock-header">
          <p className="a1-goethe-mock-kicker">Goethe-Zertifikat A1 · Mock 3</p>
          <h1>Lesen – Teil 1–3</h1>
          <p>Bearbeiten Sie alle 15 Aufgaben.</p>
          <p className="a1-mock3-note">Die Lösungen erscheinen nach der Abgabe. Hören Sample 3 ist als zweites Modul verknüpft.</p>
          <div className="a1-mock3-modules" aria-label="Mock 3 modules">
            <span aria-current="page">Lesen · 15 Aufgaben</span>
            <Link to="/campus/course/a1-final-mock-3-hoeren">Hören · Sample 3 →</Link>
          </div>
        </header>

        <nav className="a1-mock3-parts" aria-label="Lesen parts">
          {sectionScores.map((item) => (
            <button
              type="button"
              key={item.part}
              className={partKey === item.part ? 'is-active' : ''}
              aria-current={partKey === item.part ? 'step' : undefined}
              onClick={() => setPartKey(item.part)}
            >
              Teil {item.number}
              <small>{item.answered}/5 answered</small>
            </button>
          ))}
        </nav>

        {partKey === 'teil1' && (
          <section className="a1-final-mock-part">
            <h2>Teil 1</h2>
            <p>Lesen Sie die beiden Texte und die Aufgaben 1 bis 5. <strong>Kreuzen Sie an: Richtig oder Falsch.</strong></p>
            {A1_MOCK_3_READING.teil1.texts.map((text) => (
              <React.Fragment key={text.id}>
                <h3 className="a1-mock3-text-title">Text {text.id}</h3>
                <article className="a1-goethe-mock-paper">
                  <div className="a1-mock2-email-meta">
                    <p><strong>An:</strong> {text.to}</p>
                    <p><strong>Von:</strong> {text.from}</p>
                    <p><strong>Betreff:</strong> {text.subject}</p>
                  </div>
                  <div className="a1-goethe-mock-paper-copy">
                    {text.lines.map((line, i) => <p key={i}>{line}</p>)}
                  </div>
                </article>
                {A1_MOCK_3_READING.teil1.questions.filter((q) => q.text === text.id).map((q) => (
                  <AnswerChoices key={q.number} question={q} part={1} answers={answers} submitted={submitted} onChange={changeAnswer} />
                ))}
              </React.Fragment>
            ))}
          </section>
        )}

        {partKey === 'teil2' && (
          <section className="a1-final-mock-part">
            <h2>Teil 2</h2>
            <p>Lesen Sie die Situationen und die beiden Internetseiten. Wo finden Sie die passende Information? <strong>Kreuzen Sie an: Text A oder Text B.</strong></p>
            {A1_MOCK_3_READING.teil2.questions.map((q) => (
              <AnswerChoices key={q.number} question={q} part={2} answers={answers} submitted={submitted} onChange={changeAnswer} />
            ))}
          </section>
        )}

        {partKey === 'teil3' && (
          <section className="a1-final-mock-part">
            <h2>Teil 3</h2>
            <p>Lesen Sie die Schilder, Aushänge und Mitteilungen. <strong>Kreuzen Sie an: Richtig oder Falsch.</strong></p>
            {A1_MOCK_3_READING.teil3.questions.map((q) => (
              <AnswerChoices key={q.number} question={q} part={3} answers={answers} submitted={submitted} onChange={changeAnswer} />
            ))}
          </section>
        )}

        <footer className="a1-mock3-footer">
          <div>
            <strong>{answeredCount}/15 beantwortet</strong>
            <span>Lesen ist ein eigenständiges Modul. Ein vollständiger Mock enthält auch Hören, Schreiben und Sprechen.</span>
          </div>
          {submitted ? (
            <div className="a1-mock3-results" role="status">
              <strong>Ergebnis: {correctCount}/15 · {Math.round(correctCount / 15 * 100)}%</strong>
              <div className="a1-mock3-section-scores">
                {sectionScores.map((s) => <span key={s.part}>Teil {s.number}: {s.score}/5</span>)}
              </div>
              <button type="button" onClick={() => { setAttempt(blankAttempt()); setPartKey('teil1'); }}>Noch einmal üben</button>
              <Link to="/campus/course/a1-final-mock-3-hoeren">Weiter zu Hören →</Link>
            </div>
          ) : (
            <div className="a1-mock3-footer-actions">
              {partNumber < 3 ? (
                <button type="button" onClick={() => setPartKey(PART_KEYS[partNumber])}>Nächster Teil →</button>
              ) : null}
              <button type="button" onClick={submit} disabled={answeredCount !== QUESTIONS.length}>Antworten prüfen</button>
            </div>
          )}
        </footer>
      </article>
    </main>
  );
}
