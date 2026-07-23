jest.mock("./WritingPage", () => {
  const React = require("react");
  return function MockWritingPage(props) {
    return React.createElement(
      "div",
      {
        "data-testid": "mark-my-letter-ui",
        "data-initial-tab": props.initialTab,
        "data-enabled-tabs": (props.enabledTabs || []).join(","),
      },
      "Mark My Letter UI",
    );
  };
});

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import B1WritingWorkspace from "./B1WritingWorkspace";

describe("B1WritingWorkspace", () => {
  test("shows planning, Schreiben, three fast templates and Mark My Letter in order", () => {
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
    const draft = screen.getByLabelText("B1 writing draft");
    const marker = screen.getByTestId("mark-my-letter-ui");

    expect(planning).toBeVisible();
    expect(draft).toBeVisible();
    expect(marker).toBeVisible();
    expect(planning.compareDocumentPosition(draft) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(draft.compareDocumentPosition(marker) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    expect(screen.getByRole("tab", { name: "Opinion / Forum" })).toBeVisible();
    expect(screen.getByRole("tab", { name: "Formal letter" })).toBeVisible();
    expect(screen.getByRole("tab", { name: "Informal letter" })).toBeVisible();
    expect(screen.getByText("Nennen Sie Ihre Meinung.")).toBeVisible();
  });

  test("inserts the selected formal or informal structure into the Schreiben box", () => {
    render(<B1WritingWorkspace writingContext={{ level: "B1", day: 2 }} />);

    fireEvent.click(screen.getByRole("tab", { name: "Formal letter" }));
    fireEvent.click(screen.getByRole("button", { name: /Insert Formal letter template into Schreiben/i }));
    expect(screen.getByLabelText("B1 writing draft")).toHaveValue(expect.stringContaining("Sehr geehrte Damen und Herren"));

    fireEvent.change(screen.getByLabelText("B1 writing draft"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("tab", { name: "Informal letter" }));
    fireEvent.click(screen.getByRole("button", { name: /Insert Informal letter template into Schreiben/i }));
    expect(screen.getByLabelText("B1 writing draft")).toHaveValue(expect.stringContaining("Liebe/r [Name]"));
  });
});
