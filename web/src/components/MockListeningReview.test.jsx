import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import MockListeningReview, { listeningReviewRow } from "./MockListeningReview";
test("numbered review distinguishes mistakes, skipped answers and correct answers",()=>{
  const rows=[
    listeningReviewRow({number:1,part:1,submitted:"A",expected:"a"}),
    listeningReviewRow({number:2,part:1,submitted:"b",expected:"c"}),
    listeningReviewRow({number:3,part:2,expected:"ja"}),
  ];
  render(<MockListeningReview rows={rows}/>);
  expect(screen.getByLabelText("Question 1: correct")).toBeInTheDocument();
  expect(screen.getByLabelText("Question 2: incorrect")).toBeInTheDocument();
  expect(screen.getByLabelText("Question 3: unanswered")).toBeInTheDocument();
  expect(screen.getByText("Your answer: B")).toBeInTheDocument();
  expect(screen.getByText("Correct answer: C")).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText("Show mistakes only"));
  expect(screen.queryByText(/Aufgabe 1/)).not.toBeInTheDocument();
  expect(screen.getByText(/Aufgabe 2/)).toBeInTheDocument();
  expect(screen.getByText(/Aufgabe 3/)).toBeInTheDocument();
});
test("missing keys never mark the student's answer wrong",()=>{
  expect(listeningReviewRow({number:1,submitted:"a"}).status).toBe("unavailable");
});
test("displayed option letters can differ from canonical IDs without altering correctness",()=>{
  expect(listeningReviewRow({number:1,submitted:"a",expected:"a",display:()=> "C"})).toMatchObject({submitted:"C",expected:"C",status:"correct"});
});
