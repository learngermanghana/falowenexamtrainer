import React from "react";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import A1Day21WeatherWorkbookPage from "./A1Day21WeatherWorkbookPage";
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
        <A1TutorWorkbookDraftProvider assignment={getA1Assignment("A1-13")}>
          {React.Children.toArray(children).slice(1).map((child, index) => (
            <section key={index} data-testid={`teil-${index + 1}`} data-workbook-section={`teil-${index + 1}`}>
              {child}
              {index !== 2 && <Capture sectionKey={`teil-${index + 1}`} />}
            </section>
          ))}
        </A1TutorWorkbookDraftProvider>
      );
    },
  };
});

beforeEach(() => window.localStorage.clear());
afterEach(cleanup);

test("Day 21 captures five weather choices, five R/F answers and six listening answers once", async () => {
  render(<A1Day21WeatherWorkbookPage />);
  const reading = within(screen.getByTestId("teil-1"));
  const appointment = within(screen.getByTestId("teil-2"));
  const listening = within(screen.getByTestId("teil-4"));
  await waitFor(() => {
    expect(reading.getAllByRole("radiogroup")).toHaveLength(5);
    expect(reading.getAllByRole("radio")).toHaveLength(10);
    expect(appointment.getAllByRole("radiogroup")).toHaveLength(5);
    expect(appointment.getAllByRole("radio")).toHaveLength(10);
    expect(listening.getAllByRole("radiogroup")).toHaveLength(6);
  });
  expect(reading.getByText(/100 % wasserdicht/)).toBeTruthy();
  expect(appointment.getByText("Radio ND2 – Der Wetterbericht für das Wochenende")).toBeTruthy();
  expect(appointment.getByText(/Ab Montag wird es wieder richtig kalt/)).toBeTruthy();
  for (const [scope, answers] of [
    [reading, ["B", "A", "A", "A", "B"]],
    [appointment, ["Richtig", "Falsch", "Falsch", "Richtig", "Falsch"]],
    [listening, ["B", "A", "B", "A", "B", "C"]],
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
    const draft = readA1WorkbookDraft("A1-13");
    expect(Object.values(draft.sections["teil-1"].answers)).toEqual(["B", "A", "A", "A", "B"]);
    expect(Object.values(draft.sections["teil-2"].answers)).toEqual(["Richtig", "Falsch", "Falsch", "Richtig", "Falsch"]);
    expect(draft.sections["teil-2"].text).toBeUndefined();
    expect(Object.values(draft.sections["teil-4"].answers)).toEqual(["B", "A", "B", "A", "B", "C"]);
  });
});
