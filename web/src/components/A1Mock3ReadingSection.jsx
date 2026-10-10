import React from 'react';
import { A1_MOCK_3_READING } from '../data/a1FinalMock3Data';
import './A1GoetheReadingMockTeil1Preview.css';
import './A1GoetheReadingMockTeil3Preview.css';
import './A1Mock2.css';
import './A1Mock3Reading.css';

const Choice = ({ question, part, answers, onChange }) => {
  const key = `t${part}-${question.number}`;
  const values = part === 2 ? [['a', 'Text A'], ['b', 'Text B']] : [['richtig', 'Richtig'], ['falsch', 'Falsch']];
  return (
    <div className="a1-goethe-mock-choices" role="radiogroup" aria-label={`Aufgabe ${question.number}`}>
      {values.map(([value, label]) => (
        <label className="a1-goethe-mock-choice" key={value}>
          <input
            type="radio" name={`a1-mock-03-lesen-${key}`}
            checked={answers[key] === value}
            onChange={() => onChange(key, value)}
          />
          <span>{label}</span>
        </label>
      ))}
    </div>
  );
};

export default function A1Mock3ReadingSection({ answers = {}, onChange }) {
  return (
    <div className="a1-mock2-reading a1-mock3-reading" lang="de" data-a1-mock3-reading-section>
      <section className="a1-final-mock-part">
        <h2>Teil 1</h2>
        <p>Lesen Sie die beiden Texte und die Aufgaben 1 bis 5. <strong>Kreuzen Sie an: Richtig oder Falsch.</strong></p>
        {A1_MOCK_3_READING.teil1.texts.map((text) => (
          <React.Fragment key={text.id}>
            <h3>Text {text.id}</h3>
            <article className="a1-goethe-mock-paper">
              <div className="a1-mock2-email-meta">
                <p><strong>An:</strong> {text.to}</p><p><strong>Von:</strong> {text.from}</p><p><strong>Betreff:</strong> {text.subject}</p>
              </div>
              <div className="a1-goethe-mock-paper-copy">{text.lines.map((line, i) => <p key={i}>{line}</p>)}</div>
            </article>
            {A1_MOCK_3_READING.teil1.questions.filter((q) => q.text === text.id).map((q) => (
              <section className="a1-goethe-mock-question" key={q.number}>
                <h3>Aufgabe {q.number}</h3><p className="a1-goethe-mock-statement">{q.statement}</p>
                <Choice question={q} part={1} answers={answers} onChange={onChange} />
              </section>
            ))}
          </React.Fragment>
        ))}
      </section>
      <section className="a1-final-mock-part">
        <h2>Teil 2</h2>
        <p>Lesen Sie die Situationen und die beiden Internetseiten. <strong>Wählen Sie Website A oder Website B.</strong></p>
        {A1_MOCK_3_READING.teil2.questions.map((q) => (
          <section key={q.number} className="a1-goethe-mock-question">
            <h3>Aufgabe {q.number}</h3>
            <p className="a1-goethe-mock-statement">{q.statement}</p>
            <div className="a1-mock2-sources">
              {q.options.map((option) => (
                <article key={option.id} className="a1-goethe-mock-browser-panel">
                  <div className="a1-goethe-mock-browser-greenbar">Website {option.id.toUpperCase()}</div>
                  <div className="a1-mock2-source-copy"><h3>{option.title}</h3>{option.lines.map((line,i) => <p key={i}>{line}</p>)}</div>
                </article>
              ))}
            </div>
            <Choice question={q} part={2} answers={answers} onChange={onChange} />
          </section>
        ))}
      </section>
      <section className="a1-final-mock-part">
        <h2>Teil 3</h2>
        <p>Lesen Sie die Schilder, Aushänge und Mitteilungen. <strong>Ist die Aussage Richtig oder Falsch?</strong></p>
        {A1_MOCK_3_READING.teil3.questions.map((q) => (
          <section key={q.number} className="a1-goethe-mock-question a1-goethe-mock-teil3-question">
            <h3>Aufgabe {q.number}</h3>
            <p className="a1-goethe-mock-location">{q.location}</p>
            <div className={`a1-goethe-mock-notice-card a1-goethe-mock-notice-${q.notice.kind}`}>
              <div className="a1-goethe-mock-notice-inner">
                <h3>{q.notice.heading}</h3>
                {q.notice.lines.map((line,i) => <p key={i}>{line}</p>)}
              </div>
            </div>
            <p className="a1-goethe-mock-statement">{q.statement}</p>
            <Choice question={q} part={3} answers={answers} onChange={onChange} />
          </section>
        ))}
      </section>
    </div>
  );
}
