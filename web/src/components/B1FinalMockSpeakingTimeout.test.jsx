import React from "react";
import { act, render, screen } from "@testing-library/react";
import B1FinalMockSpeaking from "./B1FinalMockSpeaking";
import { scoreB1MockSpeaking } from "../services/coachService";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ idToken: "test-token", user: { uid: "student-b1" } }),
}));
jest.mock("../services/coachService", () => ({
  TIMED_MOCK_SPEAKING_ANALYZE_TIMEOUT_MS: 30000,
  analyzeAudio: jest.fn(),
  scoreB1MockSpeaking: jest.fn(),
}));
jest.mock("../services/b1AudioService", () => ({
  fetchB1MockAudioPlaybackUrl: jest.fn(),
}));
jest.mock("../lib/speakingAudio", () => ({
  SPEAKING_AUDIO_MIN_SECONDS: 3,
  buildRecordedAudioBlob: jest.fn(),
  createSpeakingMediaRecorder: jest.fn(),
  revokeObjectUrl: jest.fn(),
  userFacingAudioError: (_error, message) => message,
}));

describe("B1 Sprechen expires and finalises automatically", () => {
  const onComplete = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
    onComplete.mockClear();
    scoreB1MockSpeaking.mockReset();
  });
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("auto-submits three answer slots at 00:00, even when some were unanswered", async () => {
    scoreB1MockSpeaking.mockResolvedValue({ score: 8, maxScore: 25 });
    render(<B1FinalMockSpeaking externalSecondsLeft={0} attemptId="b1-test" onComplete={onComplete} />);
    await act(async () => { await Promise.resolve(); });

    expect(scoreB1MockSpeaking).toHaveBeenCalledTimes(1);
    expect(scoreB1MockSpeaking).toHaveBeenCalledWith(expect.objectContaining({
      attemptId: "b1-test",
      attempts: expect.arrayContaining([
        expect.objectContaining({ id: "teil1", transcript: "" }),
        expect.objectContaining({ id: "teil2", transcript: "" }),
        expect.objectContaining({ id: "teil3", transcript: "" }),
      ]),
    }));
    expect(onComplete).toHaveBeenCalledWith(expect.objectContaining({ score: 8 }));
  });

  it("retries an expired speaking grade after a transient failure", async () => {
    scoreB1MockSpeaking.mockRejectedValueOnce(new Error("Temporary marking failure"))
      .mockResolvedValueOnce({ score: 11, maxScore: 25 });
    render(<B1FinalMockSpeaking externalSecondsLeft={0} attemptId="b1-retry" onComplete={onComplete} />);
    await act(async () => { await Promise.resolve(); });
    expect(scoreB1MockSpeaking).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Retry automatic Sprechen submission" })).toBeInTheDocument();
    await act(async () => { jest.advanceTimersByTime(5000); await Promise.resolve(); });
    expect(scoreB1MockSpeaking).toHaveBeenCalledTimes(2);
    expect(onComplete).toHaveBeenCalledWith(expect.objectContaining({ score: 11 }));
  });

  it("does not mark over an unsent recording after an upload failure", () => {
    render(<B1FinalMockSpeaking
      externalSecondsLeft={0}
      initialAttempts={{ teil1: { audioBlob: new Blob(["test"], { type: "audio/webm" }), timeoutSubmissionFailed: true } }}
      attemptId="pending-audio" onComplete={onComplete}
    />);
    expect(scoreB1MockSpeaking).not.toHaveBeenCalled();
    expect(screen.getByText(/A recording still needs to be sent/)).toBeInTheDocument();
  });
});
