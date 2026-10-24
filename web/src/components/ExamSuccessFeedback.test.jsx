import React from "react";
import { act, render, screen } from "@testing-library/react";
import { ToastProvider } from "../context/ToastContext";
import { announceExamSuccess, playFeedbackSound } from "../services/interactionFeedback";

jest.mock("../services/interactionFeedback", () => ({
  ...jest.requireActual("../services/interactionFeedback"),
  playFeedbackSound: jest.fn(() => Promise.resolve(true)),
}));

describe("Exams Room confirmation feedback", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    act(() => jest.runOnlyPendingTimers());
    jest.useRealTimers();
  });

  it("shows a success toast and chime for the real navigation event, then dismisses it", () => {
    render(<ToastProvider><div>Exam Room</div></ToastProvider>);

    act(() => {
      expect(announceExamSuccess("Mock Exams opened successfully.")).toBe(true);
    });

    expect(screen.getByText("Mock Exams opened successfully.")).toBeTruthy();
    expect(playFeedbackSound).toHaveBeenCalledTimes(1);
    expect(playFeedbackSound).toHaveBeenCalledWith("success");

    act(() => jest.advanceTimersByTime(3200));
    expect(screen.queryByText("Mock Exams opened successfully.")).toBeNull();
  });

  it("deduplicates rapid duplicate events but keeps sounds for subsequent distinct events", () => {
    render(<ToastProvider><div>Exam Room</div></ToastProvider>);
    act(() => {
      announceExamSuccess("Lesen completed successfully.");
      announceExamSuccess("Lesen completed successfully.");
      announceExamSuccess("Hören completed successfully.");
    });

    expect(screen.getAllByText("Lesen completed successfully.")).toHaveLength(1);
    expect(screen.getByText("Hören completed successfully.")).toBeTruthy();
    expect(playFeedbackSound).toHaveBeenCalledTimes(2);
  });

  it("does not create a toast for an empty event", () => {
    render(<ToastProvider><div>Exam Room</div></ToastProvider>);
    act(() => {
      expect(announceExamSuccess("")).toBe(false);
    });
    expect(playFeedbackSound).not.toHaveBeenCalled();
  });
});
