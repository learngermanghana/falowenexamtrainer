import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import A1Day8ListeningPractice, { A1_DAY8_LISTENING_QUESTIONS } from "./A1Day8ListeningPractice";
import { useA1TutorWorkbookDraft } from "./A1TutorWorkbookDraftContext";

jest.mock("./A1ProtectedAudioPlayer", () => () => <audio aria-label="Test A1 Hören" controls />);
jest.mock("./A1TutorWorkbookDraftContext", () => ({ useA1TutorWorkbookDraft: jest.fn() }));

test("A1 Day 8 presents five distinct questions and saves the selected letters to Teil 3", () => {
  const updateAnswer = jest.fn();
  useA1TutorWorkbookDraft.mockReturnValue({
    draft: { sections: { "teil-3": { answers: {} } } },
    updateAnswer,
    saveState: "saved",
  });
  render(<A1Day8ListeningPractice />);
  expect(A1_DAY8_LISTENING_QUESTIONS).toHaveLength(5);
  expect(screen.getAllByRole("group")).toHaveLength(5);
  expect(screen.getAllByRole("radio")).toHaveLength(15);
  fireEvent.click(screen.getByRole("radio", { name: /Frage 1: A\)/ }));
  expect(updateAnswer).toHaveBeenCalledWith("teil-3", 1, "A");
  expect(screen.getByText("0 von 5 beantwortet")).toBeInTheDocument();
  expect(screen.queryByText(/Richtige Antwort/)).not.toBeInTheDocument();
});
