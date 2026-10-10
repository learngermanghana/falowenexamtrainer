import React, { useEffect, useState } from 'react';
import AppBackButton from './navigation/AppBackButton';
import { useAuth } from '../context/AuthContext';
import { A1_MOCK_3_ID, A1_MOCK_3_READING } from '../data/a1FinalMock3Data';
import './A1GoetheReadingMockTeil1Preview.css';
import './A1Mock2.css';
import './A1Mock3Reading.css';

const QUESTIONS = A1_MOCK_3_READING.teil1.questions;
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

export default function A1Mock3Reading() {
  const { user } = useAuth();
  const storageKey = `falowen:a1-mock-03:lesen-teil1:${user?.uid || 'guest'}`;
  const [attempt, setAttempt] = useState(() => loadAttempt(storageKey));
  const { answers, submitted } = attempt;
  const answeredCount = QUESTIONS.filter(({ number }) => Boolean(answers[`t1-${number}`])).length;
  const correctCount = QUESTIONS.filter(({ number, answer }) => answers[`t1-${number}`] === answer).length;

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify({ mockId: A1_MOCK_3_ID, ...attempt }));
  }, [attempt, storageKey]);

  const changeAnswer = (number, value) => {
    if (submitted) return;
    setAttempt((current) => ({
      ...current,
      answers: { ...current.answers, [`t1-${number}`]: value },
    }));
  };

  const submit = () => {
    if (answeredCount !== QUESTIONS.length || submitted) return;
    setAttempt((current) => ({ ...current, submitted: true }));
  };

  return (
    <main className="a1-goethe-mock-shell a1-mock3-reading" lang="de" data-a1-mock3-lesen-teil1>
      <div className="a1-goethe-mock-topbar">
        <AppBackButton label="Back to Mock Exams" fallbackPath="/exams/mocks" />
        <span className="a1-goethe-mock-preview-badge">A1 Mock 3 · Lesen Teil 1</span>
      </div>
      <article className="a1-goethe-mock-exam a1-mock2-reading">
        <header className="a1-goethe-mock-header">
          <p className="a1-goethe-mock-kicker">Goethe-Zertifikat A1 · Mock 3</p>
          <h1>Lesen – Teil 1</h1>
          <p>Lesen Sie die beiden Texte und die Aufgaben 1 bis 5.</p>
          <p><strong>Kreuzen Sie an: Richtig oder Falsch.</strong></p>
          <p className="a1-mock3-note">Teil 1 · 5 Aufgaben. Die Lösungen erscheinen nach der Abgabe.</p>
        </header>
        <section className="a1-final-mock-part">
          {A1_MOCK_3_READING.teil1.texts.map((text) => (
            <React.Fragment key={text.id}>
              <h2 className="a1-mock3-text-title">Text {text.id}</h2>
              <article className="a1-goethe-mock-paper">
                <div className="a1-mock2-email-meta">
                  <p><strong>An:</strong> {text.to}</p>
                  <p><strong>Von:</strong> {text.from}</p>
                  <p><strong>Betreff:</strong> {text.subject}</p>
                </div>
                <div className="a1-goethe-mock-paper-copy">
                  {text.lines.map((line, index) => <p key={index}>{line}</p>)}
                </div>
              </article>
              {QUESTIONS.filter((question) => question.text === text.id).map((question) => {
                const key = `t1-${question.number}`;
                const labelId = `a1-mock3-${key}`;
                const isCorrect = answers[key] === question.answer;
                return (
                  <section className="a1-goethe-mock-question" key={key} aria-labelledby={labelId}>
                    <h3 className="a1-goethe-mock-question-title">Aufgabe {question.number}</h3>
                    <p id={labelId} className="a1-goethe-mock-statement">{question.statement}</p>
                    <div className="a1-goethe-mock-choices" role="radiogroup" aria-labelledby={labelId}>
                      {[
                        ['richtig', 'Richtig'],
                        ['falsch', 'Falsch'],
                      ].map(([value, label]) => (
                        <label className="a1-goethe-mock-choice" key={value}>
                          <input
                            type="radio"
                            name={`a1-mock3-${key}`}
                            value={value}
                            checked={answers[key] === value}
                            onChange={() => changeAnswer(question.number, value)}
                            disabled={submitted}
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                    {submitted && (
                      <div className={`a1-mock3-feedback ${isCorrect ? 'is-correct' : 'is-incorrect'}`}>
                        <strong>{isCorrect ? 'Richtig beantwortet' : 'Nicht richtig'} · Lösung: {question.answer === 'richtig' ? 'Richtig' : 'Falsch'}</strong>
                        <p>{question.explanation}</p>
                      </div>
                    )}
                  </section>
                );
              })}
            </React.Fragment>
          ))}
        </section>
        <footer className="a1-mock3-footer">
          <div>
            <strong>{answeredCount}/5 beantwortet</strong>
            <span>Dies ist Lesen Teil 1, kein vollständiger vierteiliger Mocktest.</span>
          </div>
          {submitted ? (
            <div className="a1-mock3-results" role="status">
              <strong>Ergebnis: {correctCount}/5 · {correctCount * 20}%</strong>
              <button type="button" onClick={() => setAttempt(blankAttempt())}>Noch einmal üben</button>
            </div>
          ) : (
            <button type="button" onClick={submit} disabled={answeredCount !== QUESTIONS.length}>Antworten prüfen</button>
          )}
        </footer>
      </article>
    </main>
  );
}
