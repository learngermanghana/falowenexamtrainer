import React from "react";
import { A1_KOMBI_STRUCTURED_READING } from "../data/a1KombiStructuredReading";
import "./A1GoetheReadingMockTeil1Preview.css";
import "./A1GoetheReadingMockTeil3Preview.css";
import "./A1Mock2.css";
import "./A1Mock3Reading.css";

// Reuse the same cards, radio controls, source panels and responsive styles as A1 Mock 3.
// Answer keys remain on the backend; these components receive learner answers only.
const Choices = ({ number, part, answers, onChange, mockNumber }) => {
  const key = `t${part}-${number}`;
  const choices = part === 2 ? [["a", "Text A"], ["b", "Text B"]] :
    [["richtig", "Richtig"], ["falsch", "Falsch"]];
  return (
    <div className="a1-goethe-mock-choices" role="radiogroup" aria-label={`Aufgabe ${number}`}>
      {choices.map(([value,label]) => (
        <label className="a1-goethe-mock-choice" key={value}>
          <input
            type="radio"
            name={`a1-mock-${mockNumber}-lesen-${key}`}
            value={value}
            checked={answers[key] === value}
            onChange={() => onChange(key,value)}
          />
          <span>{label}</span>
        </label>
      ))}
    </div>
  );
};

export default function A1KombiReadingSection({ mockNumber, answers = {}, onChange }) {
  const paper = A1_KOMBI_STRUCTURED_READING[mockNumber];
  if (!paper) return <p role="alert">Reading paper not available.</p>;

  return (
    <div className="a1-mock2-reading a1-mock3-reading a1-kombi-reading" lang="de" data-a1-kombi-reading-section>
      <section className="a1-final-mock-part" aria-labelledby={`kombi-${mockNumber}-part-1`}>
        <h2 id={`kombi-${mockNumber}-part-1`}>Teil 1</h2>
        <p>Lesen Sie die beiden Texte und die Aufgaben 1 bis 5. <strong>Kreuzen Sie an: Richtig oder Falsch.</strong></p>
        {paper.texts.map(text => (
          <React.Fragment key={text.id}>
            <h3>Text {text.id}</h3>
            <article className="a1-goethe-mock-paper">
              <div className="a1-mock2-email-meta"><strong>{text.title}</strong></div>
              <div className="a1-goethe-mock-paper-copy"><p>{text.body.replace(text.title, "").trim()}</p></div>
            </article>
            {paper.teil1.filter(question => question.text === text.id).map(question => (
              <section className="a1-goethe-mock-question" key={question.number}>
                <h3>Aufgabe {question.number}</h3>
                <p className="a1-goethe-mock-statement">{question.statement}</p>
                <Choices number={question.number} part={1} mockNumber={mockNumber} answers={answers} onChange={onChange} />
              </section>
            ))}
          </React.Fragment>
        ))}
      </section>

      <section className="a1-final-mock-part" aria-labelledby={`kombi-${mockNumber}-part-2`}>
        <h2 id={`kombi-${mockNumber}-part-2`}>Teil 2</h2>
        <p>Lesen Sie die Situation und beide Websites. <strong>Wählen Sie Text A oder Text B.</strong></p>
        {paper.teil2.map(question => (
          <section className="a1-goethe-mock-question" key={question.number}>
            <h3>Aufgabe {question.number}</h3>
            <p className="a1-goethe-mock-statement">{question.statement}</p>
            <div className="a1-mock2-sources">
              {question.options.map(option => (
                <article key={option.id} className="a1-goethe-mock-browser-panel">
                  <div className="a1-goethe-mock-browser-greenbar">Website {option.id.toUpperCase()}</div>
                  <div className="a1-mock2-source-copy"><p>{option.body}</p></div>
                </article>
              ))}
            </div>
            <Choices number={question.number} part={2} mockNumber={mockNumber} answers={answers} onChange={onChange} />
          </section>
        ))}
      </section>

      <section className="a1-final-mock-part" aria-labelledby={`kombi-${mockNumber}-part-3`}>
        <h2 id={`kombi-${mockNumber}-part-3`}>Teil 3</h2>
        <p>Lesen Sie die Schilder und Aushänge. <strong>Kreuzen Sie an: Richtig oder Falsch.</strong></p>
        {paper.teil3.map(question => (
          <section className="a1-goethe-mock-question a1-goethe-mock-teil3-question" key={question.number}>
            <h3>Aufgabe {question.number}</h3>
            <div className="a1-goethe-mock-notice-card">
              <div className="a1-goethe-mock-notice-inner">
                <h3>{question.heading}</h3>
                <p>{question.notice}</p>
              </div>
            </div>
            <p className="a1-goethe-mock-statement">{question.statement}</p>
            <Choices number={question.number} part={3} mockNumber={mockNumber} answers={answers} onChange={onChange} />
          </section>
        ))}
      </section>
    </div>
  );
}
