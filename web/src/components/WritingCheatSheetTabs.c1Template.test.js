import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WritingCheatSheetTabs from "./WritingCheatSheetTabs";

test("C1 cheat sheet shows the same revised concise opinion scaffold as the writing box", () => {
  render(
    <WritingCheatSheetTabs level="C1" day={9}>
      <div>Writing task</div>
    </WritingCheatSheetTabs>,
  );

  userEvent.click(screen.getByRole("tab", { name: "Cheat Sheet" }));

  expect(
    screen.getByText(/In der heutigen Zeit wird oft über \[Thema\] diskutiert/),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Dieses Thema ist von großer Bedeutung, da es sowohl \[Bereich 1\] als auch \[Bereich 2\] betrifft/),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Ich vertrete die Ansicht, dass \[eigene Meinung\]/),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Zunächst ist festzustellen, dass \[Grund \/ Hauptargument\]/),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Andererseits sollte berücksichtigt werden, dass \[Gegenargument \/ Nachteil\]/),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Eine mögliche Lösung oder Alternative wäre, dass \[Vorschlag \/ Alternative\]/),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Zusammenfassend lässt sich festhalten, dass \[kurzes Fazit\]/),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Ich bin der Auffassung, dass \[eigene Position\]/),
  ).toBeInTheDocument();
});
