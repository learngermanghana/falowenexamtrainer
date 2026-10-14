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

test("one Exam Room examiner replaces coach buttons and shows A1 Teil 1 instructions", () => {
  window.history.replaceState({}, "", "/exams/speaking");
  render(<SpeakingPage mode="exam" />);
  expect(screen.getByRole("heading", {name:"Goethe Speaking Exam"})).toBeInTheDocument();
  expect(screen.getByLabelText("Speaking exam instructions")).toHaveTextContent("Introduce yourself");
  expect(screen.getByLabelText("Speaking exam instructions")).toHaveTextContent("Spell your surname");
  expect(screen.queryByRole("button", {name:/Talk with the live examiner/i})).not.toBeInTheDocument();
  expect(screen.queryByRole("button", {name:/Start voice recording/i})).not.toBeInTheDocument();
  expect(screen.queryByText(/Hallo! Pick a speaking prompt/i)).not.toBeInTheDocument();
  expect(screen.getByTestId("inline-live-examiner")).toHaveAttribute("data-level","A1");
  expect(screen.queryByLabelText("Choose speaking task")).not.toBeInTheDocument();
});

test("Falowen assigns Teil 2 cards by default, with targeted topic choice and locked selectors", () => {
  window.history.replaceState({}, "", "/exams/speaking");
  render(<SpeakingPage mode="exam" />);
  const part=screen.getByLabelText("Choose speaking exam part");
  fireEvent.change(part,{target:{value:"2"}});
  expect(screen.getByRole("button",{name:"Random task"})).toHaveAttribute("aria-pressed","true");
  expect(screen.getByRole("button",{name:"Another random task"})).toBeInTheDocument();
  const examiner=screen.getByTestId("inline-live-examiner");
  expect(JSON.parse(examiner.getAttribute("data-task")).teil).toBe("Teil 2");
  fireEvent.click(screen.getByRole("button",{name:"Another random task"}));
  fireEvent.click(screen.getByRole("button",{name:"Choose topic"}));
  const picker=screen.getByLabelText("Choose speaking task");
  expect(picker).toBeInTheDocument();
  expect(picker.options.length).toBeGreaterThan(1);
  fireEvent.change(picker,{target:{value:picker.options[0].value}});
  fireEvent.click(screen.getByRole("button",{name:"Simulate live speaking"}));
  expect(part).toBeDisabled();
  expect(screen.getByRole("button",{name:"Choose topic"})).toBeDisabled();
  expect(picker).toBeDisabled();
  expect(screen.queryByRole("button",{name:/Hide live examiner/i})).not.toBeInTheDocument();
});

test("speaking session has a red recorder beside recognized words and preserves the timing and feedback controls", () => {
  const voice=fs.readFileSync(path.resolve(__dirname,"./LiveSpeakPage.jsx"),"utf8");
  expect(voice).toContain('aria-label={recording ? "Stop and send recording" : "Record German answer"}');
  expect(voice).toContain('background:recording?"#991b1b":"#dc2626"');
  expect(voice).toContain('aria-label={simulation ? "Recognised speech" : "What I said (you can edit this)"}');
  expect(voice).toContain('aria-label="Speaking time"');
  expect(voice).toContain("Session time left");
  expect(voice).toContain("recordingTimeLabel");
  expect(voice).toContain("onClick={confirmTranscript}");
});
test("mobile Exam Room uses one collapsible section menu; desktop stays unchanged", () => {
  const app = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");
  const css = fs.readFileSync(path.resolve(__dirname, "../App.css"), "utf8");
  expect(app).toContain('className="nav-row exam-nav-row"');
  expect(app).toContain('className="mobile-exam-menu"');
  expect(app).toContain("Exam Room Menu");
  expect(app).toContain('aria-label="Exam Room sections"');
  expect(app).toContain('aria-current={examSection === tab.key ? "page" : undefined}');
  expect(css).toContain(".exam-nav-row {");
  expect(css).toContain("display: none !important;");
  expect(css).toContain(".mobile-exam-menu__links");
  expect(css).toContain("falowen-speaking-session-active");
});

test("iPhone and Android exam layout keeps microphone, task and menu usable at narrow widths", () => {
  const app = fs.readFileSync(path.resolve(__dirname, "../App.css"), "utf8");
  const page = fs.readFileSync(path.resolve(__dirname, "./SpeakingPage.js"), "utf8");
  const voice = fs.readFileSync(path.resolve(__dirname, "./LiveSpeakPage.jsx"), "utf8");
  const cards = fs.readFileSync(path.resolve(__dirname, "./GoetheExamTaskCard.jsx"), "utf8");
  expect(page).toContain('"speaking-exam-grid is-live"');
  expect(page).toContain('className="speaking-exam-sidebar"');
  expect(page).toContain('className="speaking-exam-voice"');
  expect(cards).toContain('className="speaking-exam-task-card"');
  expect(voice).toContain('className="speaking-exam-recorder-row"');
  expect(voice).toContain('className="speaking-exam-session__answer"');
  expect(app).toContain('@media (max-width: 900px)');
  expect(app).toContain('@media (max-width: 640px)');
  expect(app).toContain('@media (max-width: 360px)');
  expect(app).toContain('grid-template-columns: minmax(0, 1fr) 52px 44px;');
  expect(app).toContain('font-size: 16px !important; /* prevent Safari zoom on focus */');
  expect(app).toContain('env(safe-area-inset-bottom, 0px)');
  expect(app).toContain('max-height: min(34dvh, 300px)');
  expect(app).toContain('.speaking-exam-page button:focus-visible');
  expect(app).toContain('.mobile-exam-menu summary strong');
});
