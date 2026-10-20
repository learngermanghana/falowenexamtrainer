import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import A1TutorSpeakingCheckpoint from "./A1TutorSpeakingCheckpoint";
import { createSpeakingMediaRecorder } from "../lib/speakingAudio";
import { assessA1TutorSpeaking } from "../services/coachService";

jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ user: { getIdToken: jest.fn() } }) }));
const mockUpdateSectionText = jest.fn();
jest.mock("./A1TutorWorkbookDraftContext", () => ({
  useA1TutorWorkbookDraft: () => ({ draft: { sections: {} }, updateSectionText: mockUpdateSectionText }),
}));
jest.mock("../services/coachService", () => ({ assessA1TutorSpeaking: jest.fn() }));
jest.mock("../lib/speakingAudio", () => ({
  createSpeakingMediaRecorder: jest.fn(() => ({
    state: "inactive",
    start: jest.fn(function start() { this.state = "recording"; }),
    stop: jest.fn(function stop() { this.state = "inactive"; this.onstop?.(); }),
  })),
  buildRecordedAudioBlob: jest.fn(() => new Blob(["audio"])),
  userFacingAudioError: jest.fn(() => "Microphone unavailable"),
}));

const originalMediaDevices = Object.getOwnPropertyDescriptor(navigator, "mediaDevices");
const makeStream = () => {
  const track = { stop: jest.fn() };
  return { media: { getTracks: jest.fn(() => [track]) }, track };
};

beforeEach(() => {
  jest.clearAllMocks();
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: { getUserMedia: jest.fn() },
  });
});

afterEach(() => {
  if (originalMediaDevices) Object.defineProperty(navigator, "mediaDevices", originalMediaDevices);
  else delete navigator.mediaDevices;
});

test.each(["A1-2", "A1-4", "A1-8", "A1-11"])(
  "stops the %s microphone stream if permission resolves after leaving the workbook",
  async (assignmentKey) => {
    let resolvePermission;
    navigator.mediaDevices.getUserMedia.mockReturnValueOnce(
      new Promise(resolve => { resolvePermission = resolve; }),
    );
    const { media, track } = makeStream();
    const view = render(<A1TutorSpeakingCheckpoint assignmentKey={assignmentKey} sectionKey="teil-3" />);

    if (assignmentKey === "A1-11") {
      fireEvent.click(screen.getByRole("button", { name: "Karte ziehen" }));
    }
    fireEvent.click(screen.getByRole("button", { name: "Start recording" }));
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true });

    view.unmount();
    await act(async () => {
      resolvePermission(media);
      await Promise.resolve();
    });

    expect(track.stop).toHaveBeenCalledTimes(1);
    expect(createSpeakingMediaRecorder).not.toHaveBeenCalled();
  },
);

test("prevents repeated permission requests while the first microphone request is pending", async () => {
  let resolvePermission;
  navigator.mediaDevices.getUserMedia.mockReturnValueOnce(
    new Promise(resolve => { resolvePermission = resolve; }),
  );
  const { media, track } = makeStream();
  const view = render(<A1TutorSpeakingCheckpoint assignmentKey="A1-2" sectionKey="teil-3" />);
  const start = screen.getByRole("button", { name: "Start recording" });
  fireEvent.click(start);
  fireEvent.click(start);
  expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledTimes(1);
  view.unmount();
  await act(async () => {
    resolvePermission(media);
    await Promise.resolve();
  });
  expect(track.stop).toHaveBeenCalledTimes(1);
});

test("stops a successfully opened microphone when navigating away during recording", async () => {
  const { media, track } = makeStream();
  navigator.mediaDevices.getUserMedia.mockResolvedValueOnce(media);
  const view = render(<A1TutorSpeakingCheckpoint assignmentKey="A1-2" sectionKey="teil-3" />);
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Start recording" }));
    await Promise.resolve();
  });
  expect(createSpeakingMediaRecorder).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("button", { name: "Stop recording" })).toBeInTheDocument();
  view.unmount();
  expect(track.stop).toHaveBeenCalled();
});

test("A1-11 starts with one face-down Goethe picture card, never three separate tasks", () => {
  const random = jest.spyOn(Math, "random").mockReturnValue(0);
  try {
    render(<A1TutorSpeakingCheckpoint assignmentKey="A1-11" sectionKey="teil-1" />);
    expect(screen.getByText("Verdeckte Bildkarte")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start recording" })).toBeDisabled();
    expect(screen.queryByText("der Stift")).not.toBeInTheDocument();
    expect(screen.queryByText("das Fenster")).not.toBeInTheDocument();
    expect(screen.queryByText("der Stadtplan")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Karte ziehen" }));
    expect(screen.getByRole("img", { name: "der Stift" })).toBeInTheDocument();
    expect(screen.getByText("der Stift")).toBeInTheDocument();
    expect(screen.queryByText("das Fenster")).not.toBeInTheDocument();
    expect(screen.queryByText("der Stadtplan")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start recording" })).toBeEnabled();
    expect(screen.queryByRole("button", { name: "Karte ziehen" })).not.toBeInTheDocument();
    expect(screen.getByText(/one polite request using/i)).toBeVisible();
  } finally {
    random.mockRestore();
  }
});

test.each([
  [0, "der Stift"],
  [0.06, "das Fenster"],
  [0.12, "der Stadtplan"],
])("drawing %s produces only the %s speaking request", (randomValue, label) => {
  const random = jest.spyOn(Math, "random").mockReturnValue(randomValue);
  try {
    render(<A1TutorSpeakingCheckpoint assignmentKey="A1-11" sectionKey="teil-1" />);
    fireEvent.click(screen.getByRole("button", { name: "Karte ziehen" }));
    expect(screen.getByRole("img", { name: label })).toBeInTheDocument();
    expect(screen.getByText(label)).toBeInTheDocument();
  } finally {
    random.mockRestore();
  }
});

test("A1-11 assesses only the drawn card and saves the card name with the score", async () => {
  const random = jest.spyOn(Math, "random").mockReturnValue(0.06);
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;
  URL.createObjectURL = jest.fn(() => "blob:falowen-preview");
  URL.revokeObjectURL = jest.fn();
  try {
    const { media } = makeStream();
    navigator.mediaDevices.getUserMedia.mockResolvedValueOnce(media);
    assessA1TutorSpeaking.mockResolvedValueOnce({
      score: 8.5, maxScore: 10, feedback: "Höfliche Bitte mit Sie und bitte.",
    });
    render(<A1TutorSpeakingCheckpoint assignmentKey="A1-11" sectionKey="teil-1" />);
    fireEvent.click(screen.getByRole("button", { name: "Karte ziehen" }));
    expect(screen.getByText("das Fenster")).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Start recording" }));
      await Promise.resolve();
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Stop recording" }));
      await Promise.resolve();
    });
    expect(screen.getByRole("button", { name: "Assess final recording" })).toBeEnabled();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Assess final recording" }));
      await Promise.resolve();
    });
    await waitFor(() => expect(assessA1TutorSpeaking).toHaveBeenCalledTimes(1));
    expect(assessA1TutorSpeaking).toHaveBeenCalledWith(expect.objectContaining({
      assignmentKey: "A1-11", examPart: 3, cardId:"fenster",
      question: expect.stringContaining("das Fenster"),
    }));
    expect(mockUpdateSectionText).toHaveBeenCalledWith("teil-1",
      expect.stringContaining("Drawn picture card: das Fenster"));
    expect(mockUpdateSectionText.mock.calls[0][1]).toContain("Score: 8.5/10");
    expect(mockUpdateSectionText.mock.calls[0][1]).toContain("Corrected example: Können Sie bitte das Fenster öffnen?");
  } finally {
    random.mockRestore();
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
  }
});

test("optional response practice keeps graded recording and does not call paid AI", async () => {
  const rand = jest.spyOn(Math, "random").mockReturnValue(0);
  const originalCreate = URL.createObjectURL;
  const originalRevoke = URL.revokeObjectURL;
  URL.createObjectURL = jest.fn(() => "blob:local-practice");
  URL.revokeObjectURL = jest.fn();
  try {
    const { media } = makeStream();
    navigator.mediaDevices.getUserMedia.mockResolvedValue(media);
    render(<A1TutorSpeakingCheckpoint assignmentKey="A1-11" sectionKey="teil-1" />);
    fireEvent.click(screen.getByRole("button", { name: "Karte ziehen" }));
    const practiceToggle = screen.getByRole("button", { name: /Zusatzübung: Auf eine Bitte reagieren/ });
    fireEvent.click(practiceToggle);
    expect(screen.getByText(/Können Sie mir bitte den Stadtplan geben/)).toBeVisible();
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Start recording" })); await Promise.resolve(); });
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Stop recording" })); await Promise.resolve(); });
    expect(screen.getByText(/Ja, gern. Hier bitte/)).toBeVisible();
    expect(screen.queryByRole("button", { name: "Assess final recording" })).not.toBeInTheDocument();
    expect(assessA1TutorSpeaking).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /Zurück zur Bildkarte/ }));
    expect(screen.getByRole("button", { name: "Start recording" })).toBeEnabled();
    expect(screen.getByText("der Stift")).toBeVisible();
  } finally {
    rand.mockRestore();
    URL.createObjectURL = originalCreate;
    URL.revokeObjectURL = originalRevoke;
  }
});
