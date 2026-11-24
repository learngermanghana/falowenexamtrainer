import React from "react";
import { ReadingQuestionGrid } from "./ReadingExamLayout";

export const allObjectiveQuestionsAnswered = (questions, answers = {}) =>
  questions.every(({ id, choices }) => choices.includes(answers?.[id]));

export default function SwahiliObjectiveQuestions({ questions, answers = {}, onAnswer, groupName }) {
  const count = questions.filter(({ id, choices }) => choices.includes(answers[id])).length;
  return <section aria-label="Maswali ya kuchagua" className="swahili-book__quiz">
    <p>Chagua jibu moja (A, B au C) kwa kila swali.</p>
    <p role="status" className="swahili-book__small">{count} / {questions.length} · Yamejibiwa</p>
    <ReadingQuestionGrid>
      {questions.map(({ id, prompt, english, choices }, index) => (
        <fieldset key={id} className="swahili-book__exercise" style={{ minWidth: 0 }}>
          <legend>{index + 1}. {prompt}</legend>
          {english && <p className="swahili-book__small" lang="en">{english}</p>}
          {choices.map((choice, optionIndex) => (
            <label className="swahili-book__choice" key={choice} style={{ alignItems: "flex-start" }}>
              <input type="radio" name={groupName + "-" + id} value={choice}
                checked={answers[id] === choice} onChange={() => onAnswer(id, choice)} />
              <strong>{String.fromCharCode(65 + optionIndex)}.</strong>
              <span>{choice}</span>
            </label>
          ))}
          {answers[id] && !choices.includes(answers[id]) && <p className="swahili-book__small">
            Jibu la awali: {answers[id]}. Chagua jibu moja ili kusasisha kazi yako.
          </p>}
        </fieldset>
      ))}
    </ReadingQuestionGrid>
  </section>;
}
