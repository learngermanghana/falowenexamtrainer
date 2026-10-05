import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import A1Day11UnderstandingTimeWorkbookPage from "./A1Day11UnderstandingTimeWorkbookPage";
import { getA1TutorDraftProgress } from "../data/a1TutorDraftProfiles";
import { readA1WorkbookDraft } from "../utils/a1WorkbookDraft";

jest.mock("./A1TutorMarkedWorkbookShell", () => {
  const React = require("react");
  const { getA1Assignment } = require("../data/a1AssignmentRegistry");
  const { A1TutorWorkbookDraftProvider } = require("./A1TutorWorkbookDraftContext");
  const Capture = require("./A1TutorDraftSectionCapture").default;
  return function WorkbookShell({ children }) {
    return (
      <A1TutorWorkbookDraftProvider assignment={getA1Assignment("A1-7")}>
        {React.Children.toArray(children).slice(0, 2).map((child, index) => (
          <section key={index} data-testid={`teil-${index + 1}`} data-workbook-section={`teil-${index + 1}`}>
            {child}
            <Capture sectionKey={`teil-${index + 1}`} />
          </section>
        ))}
      </A1TutorWorkbookDraftProvider>
    );
  };
});

beforeEach(() => window.localStorage.clear());

test("Day 11 has seven Lesen and ten Hören questions with one clickable answer set per question", async () => {
  render(<A1Day11UnderstandingTimeWorkbookPage />);
  const reading = within(screen.getByTestId("teil-1"));
  const listening = within(screen.getByTestId("teil-2"));
  await waitFor(() => {
    expect(reading.getAllByRole("radiogroup")).toHaveLength(7);
    expect(listening.getAllByRole("radiogroup")).toHaveLength(10);
    expect(reading.getAllByRole("radio")).toHaveLength(21);
    expect(listening.getAllByRole("radio")).toHaveLength(30);
    expect(screen.queryByText("Assignment draft · Not submitted")).not.toBeInTheDocument();
  });

  expect(reading.getByText(/Maria steht jeden Morgen um Viertel vor sieben auf/)).toBeInTheDocument();
  expect(listening.queryByText(/Paul hat jeden Morgen um neun Uhr Deutschunterricht/)).not.toBeInTheDocument();

  for (const [scope, letters] of [[reading, ["B", "B", "C", "B", "A", "C", "A"]], [listening, ["B", "B", "B", "B", "A", "B", "B", "B", "B", "B"]]]) {
    for (const [index, letter] of letters.entries()) {
      await waitFor(() => {
        const group = scope.getByRole("radiogroup", { name: `Question ${index + 1}` });
        fireEvent.click(within(group).getByRole("radio", { name: new RegExp(`^${letter}\\)`, "i") }));
      });
    }
  }

  await waitFor(() => expect(getA1TutorDraftProgress({
    assignmentKey: "A1-7", draft: readA1WorkbookDraft("A1-7"),
  })).toEqual(expect.objectContaining({ complete: true, completed: 17, total: 17 })));
});
