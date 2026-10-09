import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import B1FinalMockExamPage from "./B1FinalMockExamPage";
import { scoreB1MockWriting, saveB1MockAttempt } from "../services/b1FinalMockService";

jest.mock("../hooks/useAssessmentRestriction", () => ({
  useAssessmentRestriction: () => {},
}));
jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ idToken: "test-token", user: { uid: "student-b1" } }),
}));
jest.mock("../services/b1FinalMockService", () => ({
  B1_FINAL_MOCK_ID: "b1-mock-01",
  B1_FINAL_MOCK_STORAGE_KEY: "falowen:b1-final-mock:b1-mock-01",
  scoreB1MockWriting: jest.fn(),
  saveB1MockAttempt: jest.fn(() => Promise.resolve({ ok: true })),
  startB1MockAttempt: jest.fn(),
}));
jest.mock("./navigation/AppBackButton", () => () => null);
jest.mock("./B1FinalMockSpeaking", () => () => <div>Speaking section ready</div>);
jest.mock("./FullMockGuidance", () => ({
  FullMockGuide: () => null,
  FullMockRecovery: () => null,
}));
jest.mock("../services/b1AudioService", () => ({
  fetchB1MockAudioPlaybackUrl: jest.fn(),
}));

const STORAGE_KEY = "falowen:b1-final-mock:b1-mock-01:student-b1";
const savedExpiredAttempt = () => ({
  version: 1,
  mockId: "b1-mock-01",
  stage: "schreiben",
  sectionDeadlineMs: Date.now() - 60000,
  attemptInfo: { attemptId: "existing-attempt", firstAttempt: true, attemptNumber: 1 },
  schreiben: {
    teil1: "Liebe Nina, vielen Dank für deine Nachricht.",
    teil2: "Bargeldloses Bezahlen ist praktisch.",
    teil3: "Sehr geehrte Frau Schneider,",
  },
  sectionScores: { lesen: 12, hoeren: 15 },
  completed: false,
});

describe("B1 expired section automatic submission", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.clear();
    window.scrollTo = jest.fn();
    saveB1MockAttempt.mockClear();
    scoreB1MockWriting.mockReset();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedExpiredAttempt()));
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("submits the saved Schreiben answers on resume at 00:00 and continues to Sprechen", async () => {
    scoreB1MockWriting.mockResolvedValue({ score: 18, maxScore: 25 });
    render(<B1FinalMockExamPage />);
    expect(screen.getByText(/Time is up. Falowen is automatically submitting/)).toBeInTheDocument();

    await act(async () => { await Promise.resolve(); });
    expect(scoreB1MockWriting).toHaveBeenCalledTimes(1);
    expect(scoreB1MockWriting).toHaveBeenCalledWith(expect.objectContaining({
      attemptId: "existing-attempt",
      teil1: "Liebe Nina, vielen Dank für deine Nachricht.",
      teil2: "Bargeldloses Bezahlen ist praktisch.",
    }));
    expect(screen.getByText("Speaking section ready")).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).sectionScores).toMatchObject({
      lesen: 12, hoeren: 15, schreiben: 18,
    });
  });

  it("preserves drafts and retries a transient auto-marking error", async () => {
    scoreB1MockWriting
      .mockRejectedValueOnce(new Error("Temporary 502"))
      .mockResolvedValueOnce({ score: 14, maxScore: 25 });
    render(<B1FinalMockExamPage />);
    await act(async () => { await Promise.resolve(); });

    expect(scoreB1MockWriting).toHaveBeenCalledTimes(1);
    expect(screen.getByDisplayValue("Liebe Nina, vielen Dank für deine Nachricht.")).toBeDisabled();
    expect(screen.getByRole("button", { name: /Retry expired Schreiben submission/ })).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(5000);
      await Promise.resolve();
    });
    expect(scoreB1MockWriting).toHaveBeenCalledTimes(2);
    expect(screen.getByText("Speaking section ready")).toBeInTheDocument();
  });

  it("prevents a duplicate grade request when a student taps Retry during an active submission", async () => {
    let resolveMark;
    scoreB1MockWriting.mockImplementation(() => new Promise((resolve) => { resolveMark = resolve; }));
    render(<B1FinalMockExamPage />);
    expect(scoreB1MockWriting).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /Auto-submitting Schreiben/ })).toBeDisabled();

    await act(async () => { resolveMark({ score: 20, maxScore: 25 }); await Promise.resolve(); });
    expect(scoreB1MockWriting).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Speaking section ready")).toBeInTheDocument();
  });
});
