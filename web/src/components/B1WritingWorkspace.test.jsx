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
    expect(planning.compareDocumentPosition(marker) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.queryByLabelText("B1 writing draft")).not.toBeInTheDocument();
    expect(screen.getByText(/same text there/i)).toBeVisible();
    expect(screen.getByText("Nennen Sie Ihre Meinung.")).toBeVisible();
  });
});
