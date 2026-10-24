import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import A1FamilyRecording from "./A1FamilyRecording";
import { analyzeAudio } from "../services/coachService";
jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ user: { uid: "student", getIdToken: async () => "token" } }) }));
jest.mock("../services/coachService", () => ({ analyzeAudio: jest.fn() }));
jest.mock("../lib/speakingAudio", () => ({
  createSpeakingMediaRecorder: () => ({ state: "inactive", start() { this.state = "recording"; }, stop() { this.state = "inactive"; this.ondataavailable({ data: new Blob(["voice"]) }); this.onstop(); } }),
  buildRecordedAudioBlob: () => new Blob(["voice"]), userFacingAudioError: (err) => err.message,
}));
beforeEach(() => {
  Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: { getUserMedia: jest.fn(async () => ({ getTracks: () => [{ stop: jest.fn() }] })) } });
  URL.createObjectURL = jest.fn(() => "blob:preview"); URL.revokeObjectURL = jest.fn();
});
async function record() {
  fireEvent.click(screen.getByRole("button", { name: "Record family answer" }));
  await screen.findByRole("button", { name: "Stop recording" });
  fireEvent.click(screen.getByRole("button", { name: "Stop recording" }));
  fireEvent.click(await screen.findByRole("button", { name: "Save recording" }));
}
test("transcribes and saves transcript, durable audio in the workbook", async () => {
  analyzeAudio.mockResolvedValue({ transcript: "Meine Mutter heißt Anna.", audioUrl: "https://example.com/saved.webm" });
  const onMarked = jest.fn(); render(<A1FamilyRecording onMarked={onMarked} />);
  await record();
  await waitFor(() => expect(onMarked).toHaveBeenCalledWith(expect.objectContaining({ transcript: "Meine Mutter heißt Anna.", audioUrl: "https://example.com/saved.webm" })));
});
test("failed saving retains the recording for retry without saving a completed answer", async () => {
  analyzeAudio.mockRejectedValue(new Error("Please try again."));
  const onMarked = jest.fn(); render(<A1FamilyRecording onMarked={onMarked} />);
  await record();
  expect(await screen.findByRole("alert")).toHaveTextContent("Please try again.");
  expect(onMarked).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Save recording" })).toBeEnabled();
});

test("a multipart result without durable audio stays incomplete and can be retried", async () => {
  analyzeAudio.mockResolvedValue({ transcript: "Meine Familie ist klein.", feedback: "8/10" });
  const onMarked = jest.fn(); render(<A1FamilyRecording onMarked={onMarked} />);
  await record();
  expect(await screen.findByRole("alert")).toHaveTextContent("could not be saved online");
  expect(onMarked).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Save recording" })).toBeEnabled();
});
