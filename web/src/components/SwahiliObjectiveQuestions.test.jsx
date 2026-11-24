import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import SwahiliObjectiveQuestions, { allObjectiveQuestionsAnswered } from "./SwahiliObjectiveQuestions";
import * as day26 from "../data/swahili/b1Day26";
import * as day27 from "../data/swahili/b1Day27";
import { readingQuestions as r28 } from "./SwahiliB1Day28Reading";
import { listeningQuestions as l28 } from "./SwahiliB1Day28Listening";
jest.mock("../context/AuthContext", () => ({ useAuth: () => ({user:null}) }));
const sections=[day26.readingQuestions,day26.listeningQuestions,day27.readingQuestions,day27.listeningQuestions,r28,l28];
test.each(sections.map((q,i)=>[i,q]))("objective section %i has five selectable questions and no exposed answer flags",(_,questions)=>{
 expect(questions).toHaveLength(5);
 for(const q of questions) {
  expect(new Set(q.choices).size).toBe(3);
  expect(q).not.toHaveProperty("answer");
 }
 expect(allObjectiveQuestionsAnswered(questions,{})).toBe(false);
 expect(allObjectiveQuestionsAnswered(questions,Object.fromEntries(questions.map(q=>[q.id,"legacy free text"])))).toBe(false);
 expect(allObjectiveQuestionsAnswered(questions,Object.fromEntries(questions.map(q=>[q.id,q.choices[0]])))).toBe(true);
 const update=jest.fn();
 render(<SwahiliObjectiveQuestions questions={questions} answers={{}} onAnswer={update} groupName="test" />);
 expect(screen.getAllByRole("radio")).toHaveLength(15);
 expect(screen.queryByRole("textbox")).toBeNull();
 fireEvent.click(screen.getAllByRole("radio")[1]);
 expect(update).toHaveBeenCalledWith(questions[0].id,questions[0].choices[1]);
});
