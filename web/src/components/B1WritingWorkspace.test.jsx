jest.mock("./B1InlineWritingAnalyser", () => {
  const React = require("react");
  return function MockWritingAnalyser(props) {
    return React.createElement(
      "button",
      {
        "data-testid": "analyse-text",
        "data-text": props.text,
      },
      "Analyse my text",
    );
  };
});

import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import B1WritingWorkspace from "./B1WritingWorkspace";

describe("B1WritingWorkspace", () => {
  test("shows the B1 cheat sheet on every B1 writing workspace", () => {
    render(
      <B1WritingWorkspace
        writingContext={{
          level: "B1",
          day: 3,
          taskTitle: "Schreiben Sie an Ihre Sprachkursleiterin Frau Wolmer.",
        }}
      />,
    );

    expect(screen.getByText("B1 Writing Cheat Sheet")).toBeVisible();
    expect(screen.getByRole("button", { name: "Insert Opinion Essay Template" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Insert Formal Letter Template" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Insert Informal Letter Template" })).toBeVisible();
  });

  test("keeps B1 Day 4 opinion structure inside the writing cheat sheet", () => {
    render(
      <B1WritingWorkspace
        writingContext={{
          level: "B1",
          day: 4,
          taskTitle: "Sind persönliche Kontakte bei der Wohnungssuche hilfreicher als Online-Portale?",
        }}
      />,
    );

    const day4CheatSheet = screen.getByTestId("b1-day4-writing-cheat-sheet");
    expect(day4CheatSheet).toBeVisible();
    expect(within(day4CheatSheet).getByText("Day 4 · Wohnung suchen")).toBeVisible();
    expect(within(day4CheatSheet).getByText(/sowohl Online-Portale als auch persönliche Kontakte/)).toBeVisible();
    expect(within(day4CheatSheet).getByText(/Online-Portale bieten zwar viele Anzeigen/)).toBeVisible();
    expect(within(day4CheatSheet).getByText(/Use at least two different paired connectors/)).toBeVisible();
    expect(screen.queryByTestId("b1-day5-writing-cheat-sheet")).not.toBeInTheDocument();
  });

  test("keeps B1 Day 5 landlord-email guidance inside the writing cheat sheet", () => {
    render(
      <B1WritingWorkspace
        writingContext={{
          level: "B1",
          day: 5,
          taskTitle: "Schreiben Sie eine höfliche E-Mail an den Vermieter.",
        }}
      />,
    );

    const day5CheatSheet = screen.getByTestId("b1-day5-writing-cheat-sheet");
    expect(day5CheatSheet).toBeVisible();
    expect(within(day5CheatSheet).getByText("Day 5 · Der Besichtigungstermin")).toBeVisible();
    expect(within(day5CheatSheet).getByText(/Anfrage wegen eines Besichtigungstermins/)).toBeVisible();
    expect(within(day5CheatSheet).getAllByText(/Wäre Samstag um 14 Uhr möglich/).length).toBeGreaterThan(0);
    expect(within(day5CheatSheet).getAllByText(/Sie erreichen mich unter/).length).toBeGreaterThan(0);
    expect(within(day5CheatSheet).getByText("Final check")).toBeVisible();
    expect(screen.queryByTestId("b1-day4-writing-cheat-sheet")).not.toBeInTheDocument();
  });

  test("does not show Day 4 or Day 5-specific writing guidance on another B1 day", () => {
    render(<B1WritingWorkspace writingContext={{ level: "B1", day: 3 }} />);
    expect(screen.queryByTestId("b1-day4-writing-cheat-sheet")).not.toBeInTheDocument();
    expect(screen.queryByTestId("b1-day5-writing-cheat-sheet")).not.toBeInTheDocument();
  });

  test("inserts a selected B1 template directly into the German text box", () => {
    render(<B1WritingWorkspace writingContext={{ level: "B1", day: 3 }} />);

    const germanDraft = screen.getByLabelText("B1 German writing draft");
    fireEvent.click(screen.getByRole("button", { name: "Insert Formal Letter Template" }));

    expect(germanDraft.value).toContain("Anrede:");
    expect(germanDraft.value).toContain("Sehr geehrte Damen und Herren");
    expect(germanDraft.value).toContain("Mit freundlichen Grüßen");
    expect(screen.getByTestId("analyse-text")).toHaveAttribute("data-text", expect.stringContaining("Sehr geehrte Damen und Herren"));
  });

  test("keeps existing German text and appends a template instead of overwriting it", () => {
    render(<B1WritingWorkspace writingContext={{ level: "B1", day: 3 }} />);

    const germanDraft = screen.getByLabelText("B1 German writing draft");
    fireEvent.change(germanDraft, { target: { value: "Mein eigener Anfang." } });
    fireEvent.click(screen.getByRole("button", { name: "Insert Informal Letter Template" }));

    expect(germanDraft.value).toMatch(/^Mein eigener Anfang\.\n\nAnrede:/);
    expect(germanDraft.value).toContain("Liebe Grüße");
  });

  test("keeps A2 free of B1-only template controls", () => {
    render(<B1WritingWorkspace writingContext={{ level: "A2", day: 3 }} />);

    expect(screen.queryByText("B1 Writing Cheat Sheet")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Insert Formal Letter Template" })).not.toBeInTheDocument();
  });

  test("keeps the planning box and shared writing analyser connected to the draft", () => {
    render(
      <B1WritingWorkspace
        writingContext={{
          level: "B1",
          day: 1,
          taskTitle: "Schreiben Sie einen Meinungsbeitrag.",
          taskPoints: [
            "Nennen Sie Ihre Meinung.",
            "Nennen Sie einen Vorteil.",
            "Nennen Sie einen Nachteil.",
          ],
        }}
      />,
    );

    const planning = screen.getByLabelText("B1 planning points");
    const germanDraft = screen.getByLabelText("B1 German writing draft");
    const analyser = screen.getByTestId("analyse-text");

    expect(planning).toBeVisible();
    expect(germanDraft).toBeVisible();
    expect(analyser).toBeVisible();
    expect(planning.compareDocumentPosition(germanDraft) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(germanDraft.compareDocumentPosition(analyser) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    fireEvent.change(germanDraft, { target: { value: "Das ist mein Text." } });
    expect(screen.getByTestId("analyse-text")).toHaveAttribute("data-text", "Das ist mein Text.");
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
    expect(screen.getByText(/English is okay in this planning box/i)).toBeVisible();
  });
});
