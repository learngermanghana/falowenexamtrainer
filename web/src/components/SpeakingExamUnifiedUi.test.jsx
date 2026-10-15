import React from "react";
import fs from "fs";
import path from "path";
import { fireEvent, render, screen, cleanup, waitFor } from "@testing-library/react";
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
        "data-source": props.practiceSource, "data-autostart": String(props.autoStart), "data-task": JSON.stringify(props.examTask) },
      React.createElement("button", { type: "button", onClick: () => props.onActivityChange(true) }, "Simulate live speaking"),
      React.createElement("button", { type: "button", onClick: props.onSessionReset }, "Simulate reset complete"),
      React.createElement("button", { type: "button", onClick: () => props.onExamCompleted({taskId:props.examTask.id,level:props.initialLevel,teil:props.examTask.teil,topic:props.examTask.prompt,feedback:"Clear answer. Add a reason.",assessment:{score:7,maxScore:10,percent:70}}) }, "Complete part"),
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

test("one Exam Room examiner replaces coach buttons and shows A1 Teil 1 instructions", async () => {
  window.history.replaceState({}, "", "/exams/speaking");
  render(<SpeakingPage mode="exam" />);
  await waitFor(()=>expect(screen.getByRole("button",{name:/Practise selected part/})).toBeEnabled());
  fireEvent.click(screen.getByRole("button",{name:/Practise selected part/}));
  expect(screen.getByRole("heading", {name:"Goethe Speaking Exam"})).toBeInTheDocument();
  expect(screen.getByLabelText("Speaking exam instructions")).toHaveTextContent("Introduce yourself");
  expect(screen.getByLabelText("Speaking exam instructions")).toHaveTextContent("Spell your surname");
  expect(screen.queryByRole("button", {name:/Talk with the live examiner/i})).not.toBeInTheDocument();
  expect(screen.queryByRole("button", {name:/Start voice recording/i})).not.toBeInTheDocument();
  expect(screen.queryByText(/Hallo! Pick a speaking prompt/i)).not.toBeInTheDocument();
  expect(screen.getByTestId("inline-live-examiner")).toHaveAttribute("data-level","A1");
  expect(screen.queryByLabelText("Choose speaking task")).not.toBeInTheDocument();
});

test("the examination screen has no part or topic selectors",async()=>{
  window.history.replaceState({}, "", "/exams/speaking");
  render(<SpeakingPage mode="exam" />);
  await waitFor(()=>expect(screen.getByRole("button",{name:/Practise selected part/})).toBeEnabled());
  fireEvent.click(screen.getByRole("button",{name:/Teil 2 · Fragen stellen/}));
  fireEvent.click(screen.getByRole("button",{name:/Practise selected part/}));
  expect(screen.getByLabelText("Speaking examination screen")).toBeInTheDocument();
  expect(JSON.parse(screen.getByTestId("inline-live-examiner").getAttribute("data-task")).teil).toBe("Teil 2");
  expect(screen.queryByLabelText("Choose speaking practice")).not.toBeInTheDocument();
  expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Simulate live speaking"}));
  expect(screen.getByRole("button",{name:/Choose practice/})).toBeDisabled();
  fireEvent.click(screen.getByRole("button",{name:"Complete part"}));
  expect(screen.getByLabelText("Speaking practice results")).toBeInTheDocument();
  expect(screen.queryByLabelText("Speaking examination screen")).not.toBeInTheDocument();
  expect(screen.queryByTestId("inline-live-examiner")).not.toBeInTheDocument();
});

test("examiner retains transcript confirmation and uses the dedicated recorder",()=>{
  const voice=fs.readFileSync(path.resolve(__dirname,"./LiveSpeakPage.jsx"),"utf8");
  expect(voice).toContain("<SpeakingRecorder");
  expect(voice).toContain('aria-label={simulation ? "Recognised speech" : "What I said (you can edit this)"}');
  expect(voice).toContain('aria-label="Speaking time"');
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
  expect(voice).toContain("<SpeakingRecorder");
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


test("full exam advances through all parts and combines only the current run's scores", async () => {
  window.history.replaceState({}, "", "/exams/speaking");
  render(<SpeakingPage mode="exam" />);
  expect(screen.queryByTestId("inline-live-examiner")).not.toBeInTheDocument();
  await waitFor(()=>expect(screen.getByRole("button",{name:/Start full speaking exam/})).toBeEnabled());
  fireEvent.click(screen.getByRole("button",{name:/Start full speaking exam/}));
  for (const part of [1,2,3]) {
    await waitFor(()=>expect(JSON.parse(screen.getByTestId("inline-live-examiner").getAttribute("data-task")).teil).toBe(`Teil ${part}`));
    if (part>1) expect(screen.getByTestId("inline-live-examiner")).toHaveAttribute("data-autostart","true");
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button",{name:"Complete part"}));
  }
  expect(screen.getByLabelText("Full speaking exam results")).toBeInTheDocument();
  expect(screen.getByLabelText("Combined speaking practice score")).toHaveTextContent("21 / 30");
  expect(screen.queryByTestId("inline-live-examiner")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Back to speaking practice"}));
  expect(screen.getByLabelText("Choose speaking practice")).toBeInTheDocument();
  expect(screen.getAllByText(/1 tasks practised/)).toHaveLength(3);
});

test("locked Teil practice offers only that part and no full exam", async () => {
  window.history.replaceState({}, "", "/exams/speaking");
  render(<SpeakingPage mode="exam" lockedLevel="A2" lockedTeil="2" />);
  await waitFor(()=>expect(screen.getByRole("button",{name:/Practise selected part/})).toBeEnabled());
  expect(screen.queryByRole("button",{name:/Start full speaking exam/})).not.toBeInTheDocument();
  expect(screen.getByRole("group",{name:"Choose an individual speaking part"}).querySelectorAll("button")).toHaveLength(1);
});

test.each(["B2","C1","C2"])("%s full exam ends after two parts",async(level)=>{
  window.history.replaceState({}, "", "/exams/speaking");
  render(<SpeakingPage mode="exam" lockedLevel={level}/>);
  await waitFor(()=>expect(screen.getByRole("button",{name:/Start full speaking exam/})).toBeEnabled());
  expect(screen.getByRole("group",{name:"Choose an individual speaking part"}).querySelectorAll("button")).toHaveLength(2);
  fireEvent.click(screen.getByRole("button",{name:/Start full speaking exam/}));
  for (const part of [1,2]) {
    await waitFor(()=>expect(JSON.parse(screen.getByTestId("inline-live-examiner").getAttribute("data-task")).teil).toBe(`Teil ${part}`));
    fireEvent.click(screen.getByRole("button",{name:"Complete part"}));
  }
  expect(screen.getByLabelText("Combined speaking practice score")).toHaveTextContent("14 / 20");
  expect(screen.getByLabelText("Full speaking exam results")).not.toHaveTextContent("Teil 3");
});

test("reset from the active full exam returns to selection without carrying stale parts",async()=>{
  window.history.replaceState({}, "", "/exams/speaking");
  render(<SpeakingPage mode="exam" />);
  await waitFor(()=>expect(screen.getByRole("button",{name:/Start full speaking exam/})).toBeEnabled());
  fireEvent.click(screen.getByRole("button",{name:/Start full speaking exam/}));
  fireEvent.click(screen.getByRole("button",{name:"Simulate live speaking"}));
  expect(screen.getByRole("button",{name:/Choose practice/})).toBeDisabled();
  fireEvent.click(screen.getByRole("button",{name:"Simulate reset complete"}));
  expect(screen.getByLabelText("Choose speaking practice")).toBeInTheDocument();
  expect(screen.queryByLabelText("Full speaking exam results")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:/Practise selected part/}));
  expect(screen.getByLabelText("Speaking examination screen")).toBeInTheDocument();
});

