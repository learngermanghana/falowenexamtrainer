import React from 'react';
import { A1_MOCK_2_READING } from '../data/a1FinalMock2Data';
import './A1Mock2.css';

export default function A1Mock2Reading({ answers = {}, onChange }) {
  const question = (item, part, notice = null) => {
    const key = `${part}-${item.number}`;
    const options = part === 't2' ? [['a', 'Text A'], ['b', 'Text B']] : [['richtig', 'Richtig'], ['falsch', 'Falsch']];
    return <section className="a1-goethe-mock-question" key={key} aria-labelledby={`mock2-${key}`}>
      <h3>Aufgabe {item.number}</h3>
      {notice}
      <p id={`mock2-${key}`} className="a1-goethe-mock-statement">{item.statement}</p>
      <div className="a1-goethe-mock-choices" role="radiogroup" aria-labelledby={`mock2-${key}`}>
        {options.map(([value, label]) => <label className="a1-goethe-mock-choice" key={value}>
          <input type="radio" name={key} checked={answers[key] === value} onChange={() => onChange(key, value)} />
          <span>{label}</span>
        </label>)}
      </div>
    </section>;
  };
  return <div className="a1-mock2-reading" lang="de">
    <section className="a1-final-mock-part">
      <h2>Teil 1</h2><p>Lesen Sie die beiden Texte und die Aufgaben 1 bis 5. <strong>Kreuzen Sie an: Richtig oder Falsch.</strong></p>
      {A1_MOCK_2_READING.teil1.texts.map(text => <React.Fragment key={text.id}>
        <h3>Text {text.id}</h3>
        <article className="a1-goethe-mock-paper">
          <div className="a1-mock2-email-meta"><p><strong>An:</strong> {text.to}</p><p><strong>Von:</strong> {text.from}</p><p><strong>Betreff:</strong> {text.subject}</p></div>
          <div className="a1-goethe-mock-paper-copy">{text.lines.map((line, i) => <p key={i}>{line}</p>)}</div>
        </article>
        {A1_MOCK_2_READING.teil1.questions.filter(item => item.text === text.id).map(item => question(item, 't1'))}
      </React.Fragment>)}
    </section>
    <section className="a1-final-mock-part">
      <h2>Teil 2</h2><p>Lesen Sie die beiden Texte und die Aufgaben 6 bis 10. Wo finden Sie Informationen? <strong>Kreuzen Sie die richtige Antwort an: Text A oder Text B.</strong></p>
      <div className="a1-mock2-sources">{A1_MOCK_2_READING.teil2.sources.map(source => <article className="a1-goethe-mock-browser-panel" key={source.id}>
        <div className="a1-goethe-mock-browser-greenbar">Text {source.id.toUpperCase()}</div>
        <div className="a1-mock2-source-copy"><h3>{source.title}</h3>{source.lines.map(line => <p key={line}>{line}</p>)}</div>
      </article>)}</div>
      {A1_MOCK_2_READING.teil2.questions.map(item => question(item, 't2'))}
    </section>
    <section className="a1-final-mock-part">
      <h2>Teil 3</h2><p>Lesen Sie die Texte und die Aufgaben 11 bis 15. <strong>Kreuzen Sie an: Richtig oder Falsch.</strong></p>
      {A1_MOCK_2_READING.teil3.questions.map(item => question(item, 't3', <>
        <p className="a1-goethe-mock-location">{item.location}</p>
        <div className={`a1-goethe-mock-notice-card a1-goethe-mock-notice-${item.notice.kind}`}><div className="a1-goethe-mock-notice-inner">
          <h3>{item.notice.heading}</h3>{item.notice.lines.map((line, index) => line ? <p key={index}>{line}</p> : <div className="a1-goethe-mock-notice-gap" key={index} />)}
        </div></div>
      </>))}
    </section>
  </div>;
}
