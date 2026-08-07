jest.mock("./WritingPage", () => {
  const React = require("react");
  return function MockWritingPage(props) {
    return React.createElement(
      "div",
      {
        "data-testid": "mark-my-letter-ui",
        "data-initial-tab": props.initialTab,
        "data-enabled-tabs": (props.enabledTabs || []).join(","),
        "data-submit-label": props.submitLabel,
        "data-draft-label": props.draftLabel,
        "data-draft-placeholder": props.draftPlaceholder,
      },
      "Mark My Letter UI",
    );
  };
});

import React from "react";
import { render, screen } from "@testing-library/react";
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
    const marker = screen.getByTestId("mark-my-letter-ui");

    expect(screen.getByText("Schreiben Sie einen Meinungsbeitrag.")).toBeVisible();
    expect(planning).toBeVisible();
    expect(marker).toBeVisible();
    expect(marker).toHaveAttribute("data-submit-label", "Mark My Letter");
    expect(marker).toHaveAttribute("data-draft-label", "Your complete German letter");
    expect(marker).toHaveAttribute("data-draft-placeholder", "Write your complete German letter here...");
    expect(planning.compareDocumentPosition(marker) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.queryByLabelText("B1 writing draft")).not.toBeInTheDocument();
    expect(screen.getByText(/same text there/i)).toBeVisible();
    expect(screen.getByText(/English is okay in this planning box/i)).toBeVisible();
    expect(screen.getByText("Nennen Sie Ihre Meinung.")).toBeVisible();
  });
});
