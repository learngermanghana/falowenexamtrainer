import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import SpeechTrainerPage from "./SpeechTrainerPage";
import {
  loadPresentationSessions,
  savePresentationSession,
  updatePresentationSession,
  deletePresentationSession,
  deleteAllPresentationSessions,
  requestPresentationCoachReply,
  requestPresentationUpgrade,
} from "../services/presentationCoachService";
import { sendSpeechTrainerAttempt } from "../services/speechTrainerService";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    idToken: "token",
    studentProfile: { firstName: "Student", level: "B1" },
  }),
}));

const showToastMock = jest.fn();
jest.mock("../context/ToastContext", () => ({
  useToast: () => ({ showToast: showToastMock }),
}));

let inlineSpeechTrainerState = { hasAudio: false, audioBlob: null, clearAudio: jest.fn() };

jest.mock("../components/speechTrainer/InlineSpeechTrainer", () => {
  const React = require("react");
  return ({ onAudioStateChange }) => {
    React.useEffect(() => {
      if (onAudioStateChange) onAudioStateChange(inlineSpeechTrainerState);
    }, [onAudioStateChange]);
    return <div data-testid="inline-speech-trainer" />;
  };
});

jest.mock("../services/presentationCoachService", () => ({
  loadPresentationSessions: jest.fn(),
  savePresentationSession: jest.fn(),
  updatePresentationSession: jest.fn(),
  deletePresentationSession: jest.fn(),
  deleteAllPresentationSessions: jest.fn(),
  requestPresentationCoachReply: jest.fn(),
  requestPresentationUpgrade: jest.fn(),
}));

jest.mock("../services/speechTrainerService", () => ({
  sendSpeechTrainerAttempt: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, options = {}) => {
      if (options.returnObjects) {
        if (key === "speechTrainer.topicPresets") return ["Job interview"];
        if (key === "speechTrainer.flowSteps.default") return ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5", "Step 6"];
        if (key === "speechTrainer.flowSteps.a1a2") return ["Step A", "Step B", "Step C", "Step D", "Step E", "Step F"];
        if (key === "speechTrainer.upgradeOptions") return [{ mode: "clarity", label: "Clarity", description: "Desc" }];
      }
      if (key === "speechTrainer.levelBadge") return `Level ${options.level || ""}`;
      if (key === "speechTrainer.progress") return `Progress ${options.answersDone || 0}/${options.turnLimit || 0}`;
      if (key === "speechTrainer.charCounter") return `${options.charsCount || 0}/${options.minLength || 0}`;
      if (key === "speechTrainer.status") return `Status ${options.status || ""}`;
      if (key === "speechTrainer.finalScript") return options.finalScript || "";
      if (key === "speechTrainer.rubricHistory") return "rubric";
      return key;
    },
  }),
}));

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  loadPresentationSessions.mockResolvedValue({ sessions: [], hasMore: false, nextCursor: "" });
  savePresentationSession.mockResolvedValue({ id: "new-session" });
  updatePresentationSession.mockResolvedValue({ ok: true });
  deletePresentationSession.mockResolvedValue({ ok: true });
  deleteAllPresentationSessions.mockResolvedValue({ ok: true });
  requestPresentationCoachReply.mockResolvedValue({ reply: "<question_de>next</question_de>", answersDone: 1, completed: false });
  requestPresentationUpgrade.mockResolvedValue({ reply: "<upgrade_de>better</upgrade_de>" });
  sendSpeechTrainerAttempt.mockResolvedValue({ transcript: "Hallo" });
  inlineSpeechTrainerState = { hasAudio: false, audioBlob: null, clearAudio: jest.fn() };
  window.confirm = jest.fn(() => true);
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test("does not auto-save a session when only initial assistant message exists", async () => {
  render(<SpeechTrainerPage />);

  await waitFor(() => expect(loadPresentationSessions).toHaveBeenCalled());

  act(() => {
    jest.advanceTimersByTime(1200);
  });

  expect(savePresentationSession).not.toHaveBeenCalled();
  expect(updatePresentationSession).not.toHaveBeenCalled();
});

test("deleting a session removes it from history and does not repopulate immediately", async () => {
  loadPresentationSessions.mockResolvedValueOnce({
    sessions: [
      {
        id: "session-1",
        topic: "Campus intro",
        level: "B1",
        completionStatus: "in_progress",
        chatHistory: [{ role: "assistant", content: "Hello" }],
        createdAt: { _seconds: 1710000000 },
      },
    ],
    hasMore: false,
    nextCursor: "",
  });

  render(<SpeechTrainerPage />);
  await screen.findByText(/Campus intro/i);

  fireEvent.click(screen.getByRole("button", { name: "speechTrainer.deleteSession" }));

  await waitFor(() => {
    expect(screen.queryByText(/Campus intro/i)).not.toBeInTheDocument();
  });

  act(() => {
    jest.advanceTimersByTime(2000);
  });

  expect(savePresentationSession).not.toHaveBeenCalled();
});

test("renders user bubbles right-aligned and coach bubbles left-aligned", async () => {
  loadPresentationSessions.mockResolvedValueOnce({
    sessions: [
      {
        id: "session-2",
        topic: "Alignment check",
        level: "B1",
        completionStatus: "in_progress",
        answersDone: 1,
        chatHistory: [
          { role: "assistant", content: "Coach message" },
          { role: "user", content: "Student answer" },
        ],
        createdAt: { _seconds: 1710000000 },
      },
    ],
    hasMore: false,
    nextCursor: "",
  });

  render(<SpeechTrainerPage />);

  const userText = await screen.findByText("Student answer");
  const coachText = await screen.findByText("Coach message");

  const userRow = userText.closest("div")?.parentElement;
  const coachRow = coachText.closest("div")?.parentElement;

  expect(userRow).toHaveStyle({ justifyItems: "end" });
  expect(coachRow).toHaveStyle({ justifyItems: "start" });
});


test("renders a single main answer textbox and hero banner", async () => {
  render(<SpeechTrainerPage />);

  await waitFor(() => expect(loadPresentationSessions).toHaveBeenCalled());

  expect(screen.getByRole("img", { name: "Speech practice hero banner" })).toBeInTheDocument();
  expect(screen.getAllByRole("textbox")).toHaveLength(1);
});

test("reset keeps chat cleared instead of auto-restoring previous open session", async () => {
  loadPresentationSessions.mockResolvedValueOnce({
    sessions: [
      {
        id: "session-3",
        topic: "Campus speech",
        level: "B1",
        completionStatus: "in_progress",
        answersDone: 1,
        chatHistory: [
          { role: "assistant", content: "Coach old message" },
          { role: "user", content: "Student old answer" },
        ],
        createdAt: { _seconds: 1710000000 },
      },
    ],
    hasMore: false,
    nextCursor: "",
  });

  render(<SpeechTrainerPage />);

  await screen.findByText("Coach old message");
  fireEvent.click(screen.getByRole("button", { name: "speechTrainer.resetAria" }));

  await waitFor(() => {
    expect(screen.queryByText("Coach old message")).not.toBeInTheDocument();
    expect(screen.queryByText("Student old answer")).not.toBeInTheDocument();
  });

  act(() => {
    jest.advanceTimersByTime(2000);
  });

  expect(screen.queryByText("Coach old message")).not.toBeInTheDocument();
});


test("recording submission continues chat when text is present", async () => {
  inlineSpeechTrainerState = {
    hasAudio: true,
    audioBlob: new Blob(["audio"], { type: "audio/webm" }),
    clearAudio: jest.fn(),
  };
  sendSpeechTrainerAttempt.mockResolvedValueOnce({ transcript: "Short transcript" });

  render(<SpeechTrainerPage />);

  await waitFor(() => expect(loadPresentationSessions).toHaveBeenCalled());

  fireEvent.change(screen.getByRole("textbox"), { target: { value: "This text is long enough to pass minimum length." } });

  expect(screen.getByText("speechTrainer.composerSendTextAndRecording")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "speechTrainer.sendAria" }));

  await waitFor(() => {
    expect(sendSpeechTrainerAttempt).toHaveBeenCalledTimes(1);
    expect(requestPresentationCoachReply).toHaveBeenCalledTimes(1);
    expect(requestPresentationCoachReply).toHaveBeenCalledWith(expect.objectContaining({
      message: "This text is long enough to pass minimum length.",
    }));
  });
});

test("shows recording-priority status when audio is ready", async () => {
  inlineSpeechTrainerState = {
    hasAudio: true,
    audioBlob: new Blob(["audio"], { type: "audio/webm" }),
    clearAudio: jest.fn(),
  };

  render(<SpeechTrainerPage />);

  await waitFor(() => expect(loadPresentationSessions).toHaveBeenCalled());

  expect(screen.getByText("speechTrainer.composerStatusHintRecordingPriority")).toBeInTheDocument();
});


test("recording-only submission continues chat before completion", async () => {
  inlineSpeechTrainerState = {
    hasAudio: true,
    audioBlob: new Blob(["audio"], { type: "audio/webm" }),
    clearAudio: jest.fn(),
  };
  sendSpeechTrainerAttempt.mockResolvedValueOnce({ transcript: "short" });

  render(<SpeechTrainerPage />);

  await waitFor(() => expect(loadPresentationSessions).toHaveBeenCalled());

  fireEvent.click(screen.getByRole("button", { name: "speechTrainer.sendAria" }));

  await waitFor(() => {
    expect(sendSpeechTrainerAttempt).toHaveBeenCalledTimes(1);
    expect(requestPresentationCoachReply).toHaveBeenCalledTimes(1);
    expect(requestPresentationCoachReply).toHaveBeenCalledWith(expect.objectContaining({
      message: "short",
    }));
  });
});

test("after completion, recording sends presentation assessment without reopening chat turns", async () => {
  loadPresentationSessions.mockResolvedValueOnce({
    sessions: [
      {
        id: "session-complete",
        topic: "Campus speech",
        level: "B1",
        completionStatus: "completed",
        answersDone: 6,
        chatHistory: [{ role: "assistant", content: "Done" }],
        createdAt: { _seconds: 1710000000 },
      },
    ],
    hasMore: false,
    nextCursor: "",
  });

  inlineSpeechTrainerState = {
    hasAudio: true,
    audioBlob: new Blob(["audio"], { type: "audio/webm" }),
    clearAudio: jest.fn(),
  };
  sendSpeechTrainerAttempt.mockResolvedValueOnce({ transcript: "full presentation", feedback: "Great flow" });

  render(<SpeechTrainerPage />);

  await screen.findByText("Done");
  expect(screen.getByText("speechTrainer.composerStatusHintRecordingAssessment")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "speechTrainer.sendAria" }));

  await waitFor(() => {
    expect(sendSpeechTrainerAttempt).toHaveBeenCalledTimes(1);
    expect(requestPresentationCoachReply).not.toHaveBeenCalled();
  });

  expect(screen.getByText(/speechTrainer.audioTranscriptLabel: full presentation/)).toBeInTheDocument();
});
