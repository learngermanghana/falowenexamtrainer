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
import { fireEvent, render, screen } from "@testing-library/react";
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
