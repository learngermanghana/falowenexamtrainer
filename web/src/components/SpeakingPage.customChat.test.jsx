import React from "react";
import { render, screen, fireEvent, waitFor, act, cleanup } from "@testing-library/react";
import SpeakingPage from "./SpeakingPage";
import { requestCoachSpeech, requestCustomSpeakingChatReply } from "../services/presentationCoachService";

jest.mock("../context/ExamContext", () => ({ useExam: () => ({ level: "B1" }) }));
jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ idToken: "token", user: { uid: "user-1" }, studentProfile: { studentCode: "S1" } }),
}));
jest.mock("../context/ToastContext", () => ({ useToast: () => ({ showToast: jest.fn() }) }));
jest.mock("../services/studyBuddyService", () => ({ logStudentActivity: jest.fn(() => Promise.resolve()) }));
jest.mock("../services/speakingProgressService", () => ({
  loadSpeakingProgress: jest.fn(() => Promise.resolve({})),
  saveSpeakingProgress: jest.fn(() => Promise.resolve()),
}));
jest.mock("../services/interactionFeedback", () => ({ triggerInteractionFeedback: jest.fn() }));
jest.mock("../services/coachService", () => ({ analyzeAudio: jest.fn() }));
jest.mock("../services/presentationCoachService", () => ({
  CUSTOM_SPEAKING_CHAT_SESSION_SECONDS: 600,
  requestCoachSpeech: jest.fn(),
  requestCustomSpeakingChatReply: jest.fn(),
  requestSpeakingTextAnalysis: jest.fn(),
}));

const flushPromises = () => act(async () => {});

const renderCustomChat = () => render(<SpeakingPage mode="course" lockedLevel="B1" />);

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  window.matchMedia = jest.fn(() => ({
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));
});

beforeEach(() => {
  jest.clearAllMocks();
  window.localStorage.clear();
  URL.createObjectURL = jest.fn(() => "blob:coach-audio");
  URL.revokeObjectURL = jest.fn();
  HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
  HTMLMediaElement.prototype.pause = jest.fn();
  requestCustomSpeakingChatReply.mockResolvedValue({ reply: "Natürlich! Wie war dein Tag?" });
  requestCoachSpeech.mockResolvedValue("blob:coach-audio");
});

afterEach(() => cleanup());

test("shows the AI text before coach speech finishes, then attaches audio to that message", async () => {
  let resolveSpeech;
  requestCoachSpeech.mockReturnValue(new Promise((resolve) => { resolveSpeech = resolve; }));
  renderCustomChat();

  fireEvent.change(screen.getByPlaceholderText(/Paste your speaking question/i), { target: { value: "Hallo" } });
  fireEvent.click(screen.getByRole("button", { name: "Send" }));

  expect(await screen.findByText("Natürlich! Wie war dein Tag?")).toBeInTheDocument();
  expect(screen.getByText("🔊 Preparing audio…")).toBeInTheDocument();
  expect(requestCustomSpeakingChatReply).toHaveBeenCalledTimes(1);
  expect(requestCoachSpeech).toHaveBeenCalledTimes(1);

  await act(async () => resolveSpeech("blob:coach-audio"));

  const listenButton = await screen.findByRole("button", { name: /Play German reply/i });
  const coachBubble = listenButton.closest("div");
  expect(coachBubble.querySelector('audio[src="blob:coach-audio"]')).toBeTruthy();
});

test("failed TTS keeps coach text visible and retry only requests speech again", async () => {
  requestCoachSpeech.mockRejectedValueOnce(new Error("TTS down")).mockResolvedValueOnce("blob:retry-audio");
  renderCustomChat();

  fireEvent.change(screen.getByPlaceholderText(/Paste your speaking question/i), { target: { value: "Bitte frag mich etwas" } });
  fireEvent.click(screen.getByRole("button", { name: "Send" }));

  expect(await screen.findByText("Natürlich! Wie war dein Tag?")).toBeInTheDocument();
  const retry = await screen.findByRole("button", { name: /Retry German audio/i });
  fireEvent.click(retry);

  await screen.findByRole("button", { name: /Play German reply/i });
  expect(requestCustomSpeakingChatReply).toHaveBeenCalledTimes(1);
  expect(requestCoachSpeech).toHaveBeenCalledTimes(2);
});

test("turning audio replies off prevents TTS calls", async () => {
  renderCustomChat();
  fireEvent.click(screen.getByRole("button", { name: /Audio replies: On/i }));

  fireEvent.change(screen.getByPlaceholderText(/Paste your speaking question/i), { target: { value: "Ohne Audio bitte" } });
  fireEvent.click(screen.getByRole("button", { name: "Send" }));

  expect(await screen.findByText("Natürlich! Wie war dein Tag?")).toBeInTheDocument();
  await flushPromises();
  expect(requestCustomSpeakingChatReply).toHaveBeenCalledTimes(1);
  expect(requestCoachSpeech).not.toHaveBeenCalled();
  expect(screen.queryByText("🔊 Preparing audio…")).not.toBeInTheDocument();
});

test("autoplay rejection does not break the UI and generated object URLs are revoked on clear", async () => {
  HTMLMediaElement.prototype.play = jest.fn(() => Promise.reject(new Error("blocked")));
  renderCustomChat();

  fireEvent.change(screen.getByPlaceholderText(/Paste your speaking question/i), { target: { value: "Audio testen" } });
  fireEvent.click(screen.getByRole("button", { name: "Send" }));

  expect(await screen.findByText("Natürlich! Wie war dein Tag?")).toBeInTheDocument();
  expect(await screen.findByRole("button", { name: /Play German reply/i })).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /Clear conversation/i }));

  await waitFor(() => expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:coach-audio"));
  expect(screen.getByText(/Custom Sprechen chat cleared/i)).toBeInTheDocument();
});
