import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import A1Day11UnderstandingTimeWorkbookPage from "./A1Day11UnderstandingTimeWorkbookPage";
import { getA1TutorDraftProgress } from "../data/a1TutorDraftProfiles";
import { readA1WorkbookDraft } from "../utils/a1WorkbookDraft";

jest.mock("./A1ProtectedAudioPlayer", () => () => <div>Protected Day 11 audio</div>);

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

test("A1 Day 11 displays five current Hören questions with clickable A/B/C answers", async () => {
  render(<A1Day11UnderstandingTimeWorkbookPage />);
  const listening = within(screen.getByTestId("teil-2"));
  const reading = within(screen.getByTestId("teil-1"));

  expect(reading.getByText(/Schild 1: Arztpraxis Dr. Weber/)).toBeInTheDocument();
  expect(listening.getByText(/Wann fängt der Deutschkurs an/)).toBeInTheDocument();
  expect(listening.getByText(/Wann schließt der Supermarkt nach dem Kurs/)).toBeInTheDocument();
  expect(listening.queryByText(/Es ist Viertel nach drei/)).not.toBeInTheDocument();
  expect(listening.getByText("Protected Day 11 audio")).toBeInTheDocument();

  await waitFor(() => {
    expect(listening.getAllByRole("radiogroup")).toHaveLength(5);
    expect(listening.getAllByRole("radio")).toHaveLength(15);
  });

  const answers = ["b", "b", "c", "b", "a"];
  for (const [index, answer] of answers.entries()) {
    await waitFor(() => {
      expect(listening.getByRole("radiogroup", { name: `Question ${index + 1}` })).toBeInTheDocument();
    });
    const group = listening.getByRole("radiogroup", { name: `Question ${index + 1}` });
    fireEvent.click(within(group).getByRole("radio", { name: new RegExp(`^${answer}\\)`, "i") }));
    await waitFor(() => {
      expect(readA1WorkbookDraft("A1-7").sections?.["teil-2"]?.answers?.[index + 1]).toBe(answer.toUpperCase());
    });
  }

  await waitFor(() => {
    const draft = readA1WorkbookDraft("A1-7");
    expect(draft.sections["teil-2"].answers).toEqual({1:"B",2:"B",3:"C",4:"B",5:"A"});
  });
});
