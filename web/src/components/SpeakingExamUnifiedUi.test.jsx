import React from "react";
import fs from "fs";
import path from "path";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import SpeakingPage from "./SpeakingPage";

jest.mock("../context/ExamContext", () => ({ useExam: () => ({ level: "A1" }) }));
jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ idToken: "test", user: { uid: "learner" }, studentProfile: { studentCode: "S1" } }),
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
jest.mock("./LiveSpeakPage", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: (props) => React.createElement(
      "div",
      { "data-testid": "inline-live-examiner", "data-level": props.initialLevel,
        "data-source": props.practiceSource, "data-task": JSON.stringify(props.examTask) },
      React.createElement("button", { type: "button", onClick: () => props.onActivityChange(true) }, "Simulate live speaking"),
    ),
  };
});

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  window.matchMedia = jest.fn(() => ({
    matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn(),
    addListener: jest.fn(), removeListener: jest.fn(),
  }));
});

afterEach(() => {
  cleanup();
  window.history.replaceState({}, "", "/");
});

test("original Exam Room coach remains visible, with no separate AI/coach or custom-chat tabs", () => {
  window.history.replaceState({}, "", "/exams/speaking");
  render(<SpeakingPage mode="exam" />);
  expect(screen.getByRole("button", { name: /Start voice recording/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Type your German response/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Talk with the live examiner/i })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /Practise with AI Examiner/i })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /^Exam Coach$/i })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /^Custom chat$/i })).not.toBeInTheDocument();
  expect(screen.queryByTestId("inline-live-examiner")).not.toBeInTheDocument();
});

test("same original level, Teil and Question drive spoken examiner; selectors lock during live session", () => {
  window.history.replaceState({}, "", "/exams/speaking");
  render(<SpeakingPage mode="exam" />);
  fireEvent.click(screen.getByRole("button", { name: /Talk with the live examiner/i }));
  const examiner = screen.getByTestId("inline-live-examiner");
  expect(examiner).toHaveAttribute("data-level", "A1");
  expect(examiner).toHaveAttribute("data-source", "exam-speaking-practice");
  expect(JSON.parse(examiner.getAttribute("data-task")).id).toBeTruthy();
  expect(screen.queryByLabelText("Live conversation exam part")).not.toBeInTheDocument();
  expect(screen.queryByLabelText("Live conversation speaking prompt")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Simulate live speaking" }));
  expect(screen.getByRole("button", { name: "Hide live examiner" })).toBeDisabled();
  expect(screen.getAllByRole("combobox").every((select) => select.disabled)).toBe(true);
});

test("mobile Exam Room uses one collapsible section menu; desktop stays unchanged", () => {
  const app = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");
  const css = fs.readFileSync(path.resolve(__dirname, "../App.css"), "utf8");
  expect(app).toContain('className="nav-row exam-nav-row"');
  expect(app).toContain('className="mobile-exam-menu"');
  expect(app).toContain('aria-label="Exam Room sections"');
  expect(app).toContain('aria-current={examSection === tab.key ? "page" : undefined}');
  expect(css).toContain(".exam-nav-row {");
  expect(css).toContain("display: none !important;");
  expect(css).toContain(".mobile-exam-menu__links");
});
