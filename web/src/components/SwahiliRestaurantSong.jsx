import React, { useState } from "react";
import questions from "../../public/music/swahili-day-06-questions.json";
import "./SwahiliRestaurantSong.css";

export default function SwahiliRestaurantSongQuestions() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [choice, setChoice] = useState(null);
  const question = questions[questionIndex];
  const moveQuestion = offset => {
    setQuestionIndex(index => index + offset);
    setChoice(null);
  };
  return <details>
    <summary>Song questions · Optional practice</summary>
    <div className="restaurant-song__questions">
        <small>Question {questionIndex + 1} of {questions.length}</small>
        <h3>{question.prompt}</h3>
        <div className="restaurant-song__options">
          {question.options.map((option, index) => <button type="button" key={option} aria-pressed={choice === index} onClick={() => setChoice(index)}>{option}</button>)}
        </div>
        {choice !== null && <p role="status"><strong>{choice === question.answer ? "Correct." : "Answer: " + question.options[question.answer] + "."}</strong> <span lang="sw">{question.evidence}</span></p>}
        <div className="restaurant-song__options">
          <button type="button" disabled={questionIndex === 0} onClick={() => moveQuestion(-1)}>Previous question</button>
          <button type="button" disabled={questionIndex === questions.length - 1} onClick={() => moveQuestion(1)}>Next question</button>
        </div>
    </div>
  </details>;
}
