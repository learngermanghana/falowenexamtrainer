import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WritingCheatSheetTabs from "./WritingCheatSheetTabs";

test("C1 Course Book cheat sheet shows the new six-part opinion template", () => {
  render(<WritingCheatSheetTabs level="C1" day={9}><div>Writing task</div></WritingCheatSheetTabs>);
  userEvent.click(screen.getByRole("tab", { name: "Cheat Sheet" }));

  expect(screen.getByText(/Das Thema \[Thema\] gewinnt im öffentlichen Diskurs/)).toBeInTheDocument();
  expect(screen.getByText(/Zunächst lässt sich anführen, dass \[Hauptargument\]/)).toBeInTheDocument();
  expect(screen.getByText(/Als anschauliches Beispiel hierfür lässt sich \[konkretes Beispiel\]/)).toBeInTheDocument();
  expect(screen.getByText(/Demgegenüber muss jedoch eingeräumt werden/)).toBeInTheDocument();
  expect(screen.getByText(/Um dieser Herausforderung wirksam zu begegnen/)).toBeInTheDocument();
  expect(screen.getByText(/Zusammenfassend lässt sich festhalten, dass trotz der Einwände/)).toBeInTheDocument();
  expect(screen.queryByText(/In der heutigen Zeit wird oft über \[Thema\] diskutiert/)).not.toBeInTheDocument();
});

test("C1 Course Book formal email cheat sheet includes subject, polite argument and Konjunktiv II", () => {
  render(<WritingCheatSheetTabs level="C1" day={9}><div>Writing task</div></WritingCheatSheetTabs>);
  userEvent.click(screen.getByRole("tab", { name: "Cheat Sheet" }));
  expect(screen.getByText(/FORMAL EMAIL · C1 Part 2 structure/)).toBeInTheDocument();
  expect(screen.getByText(/mit diesem Schreiben möchte ich mich bezüglich/)).toBeInTheDocument();
  expect(screen.getByText(/Möglicherweise ließe sich die Situation/)).toBeInTheDocument();
  expect(screen.getByText(/Mit freundlichen Grüßen/)).toBeInTheDocument();
});
