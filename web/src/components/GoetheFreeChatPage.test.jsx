import fs from "node:fs";
import path from "node:path";
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import GoetheFreeChatPage from "./GoetheFreeChatPage";
import { requestCustomSpeakingChatReply } from "../services/presentationCoachService";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ idToken: "token", user: { uid: "user-1" }, studentProfile: { studentCode: "S1" } }),
}));
jest.mock("../context/ToastContext", () => ({ useToast: () => ({ showToast: jest.fn() }) }));
jest.mock("../services/studyBuddyService", () => ({ logStudentActivity: jest.fn(() => Promise.resolve()) }));
jest.mock("../services/interactionFeedback", () => ({ triggerInteractionFeedback: jest.fn() }));
jest.mock("../services/coachService", () => ({ analyzeAudio: jest.fn() }));
jest.mock("../services/presentationCoachService", () => ({
  requestCustomSpeakingChatReply: jest.fn(),
}));

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

beforeEach(() => {
  jest.clearAllMocks();
  requestCustomSpeakingChatReply.mockResolvedValue({ reply: "Natürlich. Was machst du gern in deiner Freizeit?" });
});

test("keeps Goethe course free chat text-first without coach Listen controls", async () => {
  render(<GoetheFreeChatPage lockedLevel="B2" contextLabel="Freizeit und Kultur" />);

  expect(screen.getByText(/Goethe Free Sprechen Chat · B2/i)).toBeInTheDocument();
  expect(screen.getByText(/Text-first stable chat/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Record voice/i })).toBeInTheDocument();
  expect(screen.queryByText(/Audio replies/i)).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /Play German reply/i })).not.toBeInTheDocument();

  fireEvent.change(screen.getByPlaceholderText(/Write a German message/i), {
    target: { value: "Ich gehe am Wochenende gern ins Kino." },
  });
  fireEvent.click(screen.getByRole("button", { name: "Send" }));

  expect(await screen.findByText("Natürlich. Was machst du gern in deiner Freizeit?")).toBeInTheDocument();
  await waitFor(() => expect(requestCustomSpeakingChatReply).toHaveBeenCalledTimes(1));
  expect(screen.queryByText(/Preparing audio/i)).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /Retry German audio/i })).not.toBeInTheDocument();
});

test("keeps current 10, 20 and 30 minute practice choices", () => {
  render(<GoetheFreeChatPage lockedLevel="C1" />);
  expect(screen.getByRole("button", { name: "10 minutes" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "20 minutes" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "30 minutes" })).toBeInTheDocument();
});

test("stacks the shared Goethe Free Chat on phone-sized screens", () => {
  const css = fs.readFileSync(path.resolve(__dirname, "../goetheFreeChatMobile.css"), "utf8");

  expect(css).toContain('@media (max-width: 720px)');
  expect(css).toContain('[data-goethe-free-chat="text-first"] > div');
  expect(css).toContain('grid-template-columns: minmax(0, 1fr) !important;');
  expect(css).toContain('max-width: 94% !important;');
  expect(css).toContain('overflow-wrap: anywhere;');
  expect(css).toContain('grid-template-columns: minmax(0, 1fr);');
});
