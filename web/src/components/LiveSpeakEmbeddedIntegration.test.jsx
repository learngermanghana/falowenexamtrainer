import React from "react";
import fs from "fs";
import path from "path";
import { fireEvent, render, screen } from "@testing-library/react";
import LiveSpeakInlinePractice from "./LiveSpeakInlinePractice";

jest.mock("./LiveSpeakPage", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: ({ embedded, initialLevel, practiceTopic, practiceSource }) =>
      React.createElement("div", { "data-testid":"voice-tutor" },
        [String(embedded), initialLevel, practiceTopic, practiceSource].join("|")),
  };
});

const root = path.resolve(__dirname, "../../..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("voice tutor stays closed until learner asks to speak and inherits current workbook topic", () => {
  render(<LiveSpeakInlinePractice level="A2" topic="Im Restaurant" source="course-workbook" />);
  expect(screen.queryByTestId("voice-tutor")).not.toBeInTheDocument();
  expect(screen.getByRole("button",{name:/Practise speaking with AI/})).toBeInTheDocument();
  expect(screen.queryByText(/free Live Speak allowance|No payment required|Optional, ungraded practice/)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Practise speaking with AI/ }));
  expect(screen.getByTestId("voice-tutor")).toHaveTextContent("true|A2|Im Restaurant|course-workbook");
  fireEvent.click(screen.getByRole("button", { name: "Close voice practice" }));
  expect(screen.queryByTestId("voice-tutor")).not.toBeInTheDocument();
});

test("workbook and exam room reuse the same embedded voice component and existing practice UI", () => {
  const workbookChat=read("web/src/components/GoetheFreeChatPage.js");
  const exam=read("web/src/components/SpeakingPage.js");
  const b2=read("web/src/components/B2UnifiedGuidedWorkbookPage.js");
  const c1=read("web/src/components/C1SelfLearningCourse.js");
  const c2=read("web/src/components/C2UnifiedGuidedWorkbookPage.js");
  expect(workbookChat).toContain('source="course-workbook"');
  expect(workbookChat).toContain('data-goethe-free-chat="text-first"');
  expect(exam).toContain('import LiveSpeakPage from "./LiveSpeakPage"');
  expect(exam).toMatch(/<LiveSpeakPage\s+key=\{selectedLevel/);
  expect(exam).toContain('practiceSource="exam-speaking-practice"');
  expect(exam).toContain("selectedQuestion.topicPrompt");
  expect(exam).toContain("examTask={{");
  expect(exam).not.toContain("SpeakingPracticeModePicker");
  expect(exam).not.toContain("ExamLiveSpeakPanel");
  expect(exam).not.toContain("liveConversationSelected");
  expect(b2).toContain('source="b2-workbook"');
  expect(c1).toContain('source="c1-workbook"');
  expect(c2).toContain('source="c2-workbook"');
});

test("the existing voice session API and quotas are reused without a payment flow", () => {
  const voice=read("web/src/components/LiveSpeakPage.jsx");
  const server=read("functions/functionz/liveSpeak.js");
  expect(voice).toContain('data-live-speak-context={embedded ? "embedded-practice" : "standalone"}');
  expect(voice).toContain('topic:practiceTopic, source:practiceSource');
  expect(server).toContain('const topic = cleanPracticeTopic(req.body?.topic)');
  expect(server).toContain('const source = cleanPracticeSource(req.body?.source)');
  expect(server).toContain('const MAX_TURNS = 10;');
  expect(server).toContain('const PILOT_SESSIONS = 2;');
  expect(server).toContain('process.env.LIVE_SPEAK_MONTHLY_TURN_CAP');
  expect(server).not.toMatch(/\/live-speak\/checkout|paystack|subscriptions/i);
});

test("graded mock pages do not import or launch Live Speak", () => {
  ["A1","A2","B1","B2","C1"].forEach(level=>{
    const source=read(`web/src/components/${level}FinalMockExamPage.jsx`);
    expect(source).not.toContain("LiveSpeakInlinePractice");
    expect(source).not.toContain("LiveSpeakPage");
  });
});
