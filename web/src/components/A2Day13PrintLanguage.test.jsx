import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A2Day13Grammar from "./A2Day13VorstellungsgespraechModalverbenPraeteritumGrammarPage";
import { A2Days12To16ThinkingFirstGrammarGuide } from "./A2Days12To16ThinkingSupport";

test("Day 13 retains word spacing around italic and bold terms in printed explanations", () => {
  render(<MemoryRouter><A2Day13Grammar /></MemoryRouter>);
  const paragraph = screen.getByText(/In job interviews/, {exact:false});
  expect(paragraph.textContent).toContain("wanted to do in the past");
  expect(paragraph.textContent).toContain("musste, and wollte");
  expect(paragraph.textContent).not.toContain("todo");
});

test("Day 13 support distinguishes past ability, obligation and intention", () => {
  render(<A2Days12To16ThinkingFirstGrammarGuide day={13} />);
  expect(screen.getByText(/What were you able to do/)).toHaveTextContent(
    "what did you have to do, and what did you want to do in the past?"
  );
  expect(screen.getByText(/Ich musste am Samstag arbeiten/)).toBeInTheDocument();
});
