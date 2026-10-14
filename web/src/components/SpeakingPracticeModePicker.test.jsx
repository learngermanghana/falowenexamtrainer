import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import SpeakingPracticeModePicker from "./SpeakingPracticeModePicker";

test("offers exam feedback and a separate live conversation without crowding a single view", () => {
  const change = jest.fn();
  render(<SpeakingPracticeModePicker value="coach" onChange={change} />);
  const exam = screen.getByRole("button", {name:/Goethe Exam Practice/});
  const voice = screen.getByRole("button", {name:/Live AI Conversation/});
  expect(exam).toHaveAttribute("aria-pressed","true");
  expect(voice).toHaveAttribute("aria-pressed","false");
  expect(screen.getByText(/detailed exam feedback/)).toBeInTheDocument();
  expect(screen.getByText(/Review the transcript/)).toBeInTheDocument();
  fireEvent.click(voice);
  expect(change).toHaveBeenCalledWith("voice");
});

test("disables switching during an existing exam recording", () => {
  const change = jest.fn();
  render(<SpeakingPracticeModePicker value="coach" onChange={change} compact disabled />);
  const voice = screen.getByRole("button", {name:/Live AI Conversation/});
  expect(voice).toBeDisabled();
  fireEvent.click(voice);
  expect(change).not.toHaveBeenCalled();
});
