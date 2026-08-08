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
  test("shows only the planning box and the shared writing-analysis box", () => {
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
    expect(screen.queryByText(/Mark My Letter/i)).not.toBeInTheDocument();
    expect(screen.getByText(/English is okay in this planning box/i)).toBeVisible();
    expect(screen.queryByText("Nennen Sie Ihre Meinung.")).not.toBeInTheDocument();
  });
});
