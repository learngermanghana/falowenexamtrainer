import React from "react";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import A1Day22HealthBodyPartsWorkbookPage from "./A1Day22HealthBodyPartsWorkbookPage";
import { readA1WorkbookDraft } from "../utils/a1WorkbookDraft";

jest.mock("../services/a1AudioService", () => ({ fetchA1AudioPlaybackUrl: jest.fn() }));
jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ idToken: "" }) }));
jest.mock("./A1CourseBookLetterPracticePanel", () => () => null);
jest.mock("./A1TutorMarkedWorkbookShell", () => {
  const React = require("react");
  const { getA1Assignment } = require("../data/a1AssignmentRegistry");
  const { A1TutorWorkbookDraftProvider } = require("./A1TutorWorkbookDraftContext");
  const Capture = require("./A1TutorDraftSectionCapture").default;
  return {
    WorkbookSection: ({ children }) => children,
    default: function WorkbookShell({ children }) {
      return (
        <A1TutorWorkbookDraftProvider assignment={getA1Assignment("A1-14.1")}>
          {React.Children.toArray(children).slice(1).map((child, index) => (
            <section key={index} data-testid={`teil-${index + 1}`} data-workbook-section={`teil-${index + 1}`}>
              {child}
              <Capture sectionKey={`teil-${index + 1}`} />
            </section>
          ))}
        </A1TutorWorkbookDraftProvider>
      );
    },
  };
});

beforeEach(() => window.localStorage.clear());
afterEach(cleanup);

test("Day 22 captures five Anzeige choices, five R/F answers and six listening answers once", async () => {
  render(<A1Day22HealthBodyPartsWorkbookPage />);
  const reading = within(screen.getByTestId("teil-1"));
  const appointment = within(screen.getByTestId("teil-2"));
  const listening = within(screen.getByTestId("teil-3"));
  await waitFor(() => {
    expect(reading.getAllByRole("radiogroup")).toHaveLength(5);
    expect(reading.getAllByRole("radio")).toHaveLength(10);
    expect(appointment.getAllByRole("radiogroup")).toHaveLength(5);
    expect(appointment.getAllByRole("radio")).toHaveLength(10);
    expect(listening.getAllByRole("radiogroup")).toHaveLength(6);
  });
  expect(reading.getByText("Notfall-Zahnarzt Berlin")).toBeTruthy();
  expect(appointment.getByText("Betreff: Ihr Termin")).toBeTruthy();
  expect(appointment.getByText(/Ihr Termin bei Dr. Schmidt ist am Dienstag, 12. Oktober um 10:30 Uhr/)).toBeTruthy();
  for (const [scope, answers] of [
    [reading, ["B", "B", "A", "A", "B"]],
    [appointment, ["Richtig", "Richtig", "Richtig", "Richtig", "Falsch"]],
    [listening, ["A", "B", "A", "A", "B", "A"]],
  ]) {
    for (const [index, answer] of answers.entries()) {
      await waitFor(() => {
        const group = scope.getByRole("radiogroup", { name: `Question ${index + 1}` });
        const name = answer.length === 1 ? new RegExp(`^${answer}[).]`, "i") : answer;
        fireEvent.click(within(group).getByRole("radio", { name }));
      });
    }
  }
  await waitFor(() => {
    const draft = readA1WorkbookDraft("A1-14.1");
    expect(Object.values(draft.sections["teil-1"].answers)).toEqual(["B", "B", "A", "A", "B"]);
    expect(Object.values(draft.sections["teil-2"].answers)).toEqual(["Richtig", "Richtig", "Richtig", "Richtig", "Falsch"]);
    expect(draft.sections["teil-2"].text).toBeUndefined();
    expect(Object.values(draft.sections["teil-3"].answers)).toEqual(["A", "B", "A", "A", "B", "A"]);
  });
});
