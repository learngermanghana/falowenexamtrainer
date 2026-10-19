import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import A1TutorSpeakingCheckpoint from "./A1TutorSpeakingCheckpoint";
import { createSpeakingMediaRecorder } from "../lib/speakingAudio";

jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ user: { getIdToken: jest.fn() } }) }));
jest.mock("./A1TutorWorkbookDraftContext", () => ({
  useA1TutorWorkbookDraft: () => ({ draft: { sections: {} }, updateSectionText: jest.fn() }),
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
