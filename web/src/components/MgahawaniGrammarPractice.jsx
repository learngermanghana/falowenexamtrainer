import React, { useState } from "react";
import { MGAHAWANI_RESTAURANT_CHALLENGE } from "../data/swahili/mgahawaniGrammarPractice";

// All answers are browser-local practice. This component never makes Firestore
// calls or changes the tutor-marked assignments in Teil 1–4 and Submit.
export function GrammarSelfCheck({ item, questionId }) {
  const [answer, setAnswer] = useState(null);
  const [checked, setChecked] = useState(false);
  const correct = answer === item.answer;
  return <section className="mgahawani-grammar__self-check" aria-labelledby={questionId + "-heading"}>
    <div className="mgahawani-grammar__self-check-head">
      <span className="mgahawani-grammar__eyebrow">Quick practice · Mazoezi</span>
      <small>Ungraded</small>
    </div>
    <h4 id={questionId + "-heading"}>{item.question}</h4>
    <div className="mgahawani-grammar__answer-list" role="group" aria-label={item.question}>
      {item.options.map((option, index) => (
        <label className="mgahawani-grammar__answer" key={index}>
          <input type="radio" name={questionId} value={index}
            checked={answer === index}
            onChange={() => { setAnswer(index); setChecked(false); }} />
          <span>{option}</span>
        </label>
      ))}
    </div>
    <div className="swahili-book__row">
      <button type="button" className="swahili-book__button"
        disabled={answer === null} onClick={() => setChecked(true)}>Check answer</button>
      {checked && <button type="button" className="swahili-book__button swahili-book__button--soft"
        onClick={() => { setAnswer(null); setChecked(false); }}>Try again</button>}
    </div>
    {checked && <p role="status" className={correct ? "mgahawani-grammar__answer-result is-correct" : "mgahawani-grammar__answer-result is-incorrect"}>
      <strong>{correct ? "Correct!" : "Not quite."}</strong> {correct ? item.why : "Check the rule and example above, then choose another answer."}
    </p>}
  </section>;
}

export default function MgahawaniRestaurantChallenge() {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const steps = MGAHAWANI_RESTAURANT_CHALLENGE.steps;
  const complete = steps.every(step => Number.isInteger(answers[step.id]));
  const score = steps.filter(step => answers[step.id] === step.answer).length;

  return <section className="mgahawani-grammar__challenge" aria-labelledby="mgahawani-final-challenge">
    <p className="mgahawani-grammar__eyebrow">Final review · Mapitio</p>
    <h3 id="mgahawani-final-challenge">{MGAHAWANI_RESTAURANT_CHALLENGE.title}</h3>
    <p>{MGAHAWANI_RESTAURANT_CHALLENGE.introduction}</p>
    <p className="swahili-book__small">Use the rules from all seven topics. This challenge is optional and never submitted to your teacher.</p>
    <div className="mgahawani-grammar__challenge-steps">
      {steps.map(step => {
        const answered = answers[step.id];
        const correct = answered === step.answer;
        return <fieldset className="mgahawani-grammar__challenge-step" key={step.id}>
          <legend><span>{step.label}</span> {step.question}</legend>
          <div className="mgahawani-grammar__answer-list">
            {step.options.map((option, index) => (
              <label className="mgahawani-grammar__answer" key={index}>
                <input type="radio" name={"mgahawani-challenge-" + step.id}
                  checked={answered === index}
                  onChange={() => {
                    setAnswers(previous => ({ ...previous, [step.id]: index }));
                    setChecked(false);
                  }} />
                <span>{option}</span>
              </label>
            ))}
          </div>
          {checked && <p className={correct ? "mgahawani-grammar__answer-result is-correct" : "mgahawani-grammar__answer-result is-incorrect"}>
            <strong>{correct ? "Correct!" : "Review this choice."}</strong> {step.why}
          </p>}
        </fieldset>;
      })}
    </div>
    <div className="swahili-book__row">
      <button type="button" className="swahili-book__button"
        disabled={!complete} onClick={() => setChecked(true)}>Check restaurant challenge</button>
      <button type="button" className="swahili-book__button swahili-book__button--soft"
        onClick={() => { setAnswers({}); setChecked(false); }}>Reset challenge</button>
    </div>
    {checked && <p className="mgahawani-grammar__challenge-score" role="status">
      {score} / {steps.length} correct · {score === steps.length ? "Great! Now practise your order in Teil 1." : "Review the explanations above, then try again."}
    </p>}
  </section>;
}
