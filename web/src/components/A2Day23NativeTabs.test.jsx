import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage from "./A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage";

jest.mock("./navigation/AppBackButton", () => () => <div>Back</div>);
jest.mock("./CourseInlinePracticePanel", () => ({ type }) => <div>Practice {type}</div>);
jest.mock("./A2B1WorkbookGuidance", () => ({
  A2B1WorkbookGuidance: () => <div>Guidance</div>,
  WorkbookSubmissionReminder: () => <div>Reminder</div>,
}));
jest.mock("./A2B1WorkbookGrammarNotes", () => ({
  A2B1GrammarNotesTab: () => <div>Day 23 grammar notes</div>,
}));
jest.mock("./SpeakingMindMap", () => () => <div>Speaking mind map</div>);
jest.mock("../data/speakingMindMaps/a2", () => ({
  getA2SpeakingMindMap: () => ({}),
}));
jest.mock("./WorkbookReferenceAnswers", () => () => <div>References</div>);
jest.mock("./ContextualAssignmentSubmissionPage", () => () => <div>Submission form</div>);

describe("A2 Day 23 native workbook tabs", () => {
  test("opens Teil 2 Schreiben and Teil 3 Lesen from the shared navigation", () => {
    render(<A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage />);

    expect(screen.getByText("Day 23 grammar notes")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Teil 2" }));
    expect(screen.getByRole("heading", { name: /Teil 2 \(Schreiben\) · Assignment/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Teil 3" }));
    expect(screen.getByRole("heading", { name: /Teil 3 \(Lesen\) · Exercise/i })).toBeInTheDocument();
  });

  test("keeps the seven-tab A2 order and opens Ref and Submit", () => {
    render(<A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage />);

    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((tab) => tab.getAttribute("aria-label"))).toEqual([
      "Grammar",
      "Teil 1",
      "Teil 2",
      "Teil 3",
      "Teil 4",
      "Ref",
      "Submit",
    ]);

    fireEvent.click(screen.getByRole("tab", { name: "Ref" }));
    expect(screen.getByText("References")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Submit" }));
    expect(screen.getByText("Submission form")).toBeInTheDocument();
  });
});
