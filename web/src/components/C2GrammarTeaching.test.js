import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import C2GrammarTeaching from "./C2GrammarTeaching";
import { C2_GRAMMAR_TEACHING } from "../data/c2GrammarTeaching";

test("all 28 days explain a concept, teach its structure and provide an unambiguous guided check", () => {
 expect(Object.keys(C2_GRAMMAR_TEACHING)).toHaveLength(28);
 for (const lesson of Object.values(C2_GRAMMAR_TEACHING)) {
  for (const field of ["definitionDe", "supportEn", "structureDe", "workedExample", "explanationDe", "independentTask"]) expect(lesson[field].length).toBeGreaterThan(25);
  expect(new Set(lesson.check.options).size).toBe(lesson.check.options.length);
  expect(lesson.check.options[lesson.check.answerIndex]).toBeTruthy();
 }
});
test("Day 5 teaches modal meanings before selection and explains both wrong and right answers", () => {
 render(<C2GrammarTeaching day={5}/>);
 expect(screen.getByText(/Subjektive Modalität zeigt/)).toBeTruthy();
 expect(screen.getByText(/Vergangenheit: Partizip II/)).toBeTruthy();
 expect(screen.queryByRole("status")).toBeNull();
 fireEvent.click(screen.getByRole("button", {name:/A\. Die Maßnahme muss/}));
 expect(screen.getByRole("status").textContent).toContain("Noch nicht richtig.");
 expect(screen.getByRole("status").textContent).toContain("dürfte = wahrscheinlich");
 fireEvent.click(screen.getByRole("button", {name:/B\. Die Maßnahme dürfte/}));
 expect(screen.getByRole("status").textContent).toContain("Richtig!");
});
test("changing day clears the previous answer", () => {
 const {rerender}=render(<C2GrammarTeaching day={5}/>);
 fireEvent.click(screen.getByRole("button", {name:/B\. Die Maßnahme dürfte/}));
 rerender(<C2GrammarTeaching day={6}/>);
 expect(screen.queryByRole("status")).toBeNull();
});
test.each(Array.from({length:28},(_,index)=>index+1))("Day %i renders teaching and its correct answer is clickable", day => {
 const lesson=C2_GRAMMAR_TEACHING[day];
 render(<C2GrammarTeaching day={day}/>);
 expect(screen.getByText(lesson.definitionDe)).toBeTruthy();
 const answers=screen.getAllByRole("button");
 fireEvent.click(answers[lesson.check.answerIndex]);
 expect(screen.getByRole("status").textContent).toContain("Richtig!");
});
test("projector mode shows one teaching step at a time before guided practice", () => {
 render(<C2GrammarTeaching day={5} compact/>);
 expect(screen.getByRole("heading",{name:/1\. Verstehen/})).toBeTruthy();
 expect(screen.queryByRole("heading",{name:/3\. Gemeinsam/})).toBeNull();
 fireEvent.click(screen.getByRole("button",{name:"2. Satz bauen"}));
 expect(screen.getByRole("heading",{name:/2\. Satz bauen/})).toBeTruthy();
 fireEvent.click(screen.getByRole("button",{name:"3. Gemeinsam prüfen"}));
 fireEvent.click(screen.getByRole("button",{name:/B\. Die Maßnahme dürfte/}));
 expect(screen.getByRole("status").textContent).toContain("Richtig!");
});
