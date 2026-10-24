import React, { StrictMode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { AssessmentRulesNotice, AssessmentStudySupport } from "./AssessmentSupport";
import SharedTimedAssignment, { TimedAssignmentPanel } from "./SharedTimedAssignment";
import { useAssessmentRestriction } from "../hooks/useAssessmentRestriction";
import { isMockAssessmentRoute } from "../utils/assessmentRestrictions";

jest.mock("../firebase", () => ({ auth: null, db: null, doc: jest.fn(), onSnapshot: jest.fn(), serverTimestamp: jest.fn(), setDoc: jest.fn() }));
jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ studentProfile: null, user: null }) }));
let mockProgress = {};
jest.mock("../hooks/useLessonProgress", () => ({ useLessonProgress: () => ({ progressByAssignmentId: mockProgress, loading: false }) }));
jest.mock("../services/interactionFeedback", () => ({ triggerInteractionFeedback: jest.fn() }));
const MockAssessment = () => { useAssessmentRestriction(); return <div>Mock questions</div>; };
const Tools = ({ restricted = false }) => <><AssessmentRulesNotice restricted={restricted} /><AssessmentStudySupport restricted={restricted}><button>Open StudyBuddy</button></AssessmentStudySupport></>;
beforeEach(() => { window.localStorage.clear(); mockProgress = {}; });

test("ordinary study shows StudyBuddy and no assessment notice", () => {
  render(<Tools />);
  expect(screen.getByRole("button", { name: "Open StudyBuddy" })).toBeInTheDocument();
  expect(screen.queryByRole("region", { name: "Assessment rules" })).not.toBeInTheDocument();
});
test.each(["A1-12.3", "A2-8.21", "B1-6.18"])("%s hides StudyBuddy before and during the timed attempt", (assignmentKey) => {
  render(<><SharedTimedAssignment assignmentKey={assignmentKey}><TimedAssignmentPanel /></SharedTimedAssignment><Tools /></>);
  expect(screen.queryByRole("button", { name: "Open StudyBuddy" })).not.toBeInTheDocument();
  expect(screen.getByRole("region", { name: "Assessment rules" })).toHaveTextContent("translators, dictionaries and outside help are not allowed");
  const start = screen.getByRole("button", { name: /^Start \d+-minute/ });
  expect(start).toBeDisabled();
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(start);
  expect(document.querySelector("[data-timed-assignment-state]")).toHaveAttribute("data-timed-assignment-state", "active");
  expect(screen.queryByRole("button", { name: "Open StudyBuddy" })).not.toBeInTheDocument();
});
test("leaving the assessment restores study tools under StrictMode", () => {
  const { rerender } = render(<StrictMode><MockAssessment /><Tools /></StrictMode>);
  expect(screen.queryByRole("button", { name: "Open StudyBuddy" })).not.toBeInTheDocument();
  rerender(<StrictMode><Tools /></StrictMode>);
  expect(screen.getByRole("button", { name: "Open StudyBuddy" })).toBeInTheDocument();
  expect(screen.queryByRole("region", { name: "Assessment rules" })).not.toBeInTheDocument();
});
test("unmounting one of two assessments does not restore tools early", () => {
  const { rerender } = render(<><MockAssessment key="first" /><MockAssessment key="second" /><Tools /></>);
  rerender(<><MockAssessment key="second" /><Tools /></>);
  expect(screen.queryByRole("button", { name: "Open StudyBuddy" })).not.toBeInTheDocument();
});
test.each(["/campus/course/a1-final-mock-exam", "/campus/course/a2-mock-hoeren-teil-1-preview", "/campus/course/b1-mock-practice-preview", "/campus/course/b2-mock-practice-preview", "/campus/course/conjunctions-5-10", "/campus/course/a2-day-29-goethe-exam-orientation"])("%s immediately hides the launcher and shows rules", (path) => {
  expect(isMockAssessmentRoute(path)).toBe(true);
  render(<Tools restricted={isMockAssessmentRoute(path)} />);
  expect(screen.queryByRole("button", { name: "Open StudyBuddy" })).not.toBeInTheDocument();
  expect(screen.getByRole("region", { name: "Assessment rules" })).toBeInTheDocument();
});
test("ordinary lessons and the mock library remain study pages", () => {
  expect(isMockAssessmentRoute("/campus/course/lesson/A1/3.5")).toBe(false);
  expect(isMockAssessmentRoute("/exams/mocks")).toBe(false);
});

test("passed timed work restores StudyBuddy for review", () => {
  mockProgress = { "A1-12.3": { passed: true, status: "passed" } };
  render(<><SharedTimedAssignment assignmentKey="A1-12.3"><TimedAssignmentPanel /></SharedTimedAssignment><Tools /></>);
  expect(screen.getByRole("button", { name: "Open StudyBuddy" })).toBeInTheDocument();
  expect(screen.getByText("Passed · review unlocked")).toBeInTheDocument();
  expect(screen.queryByRole("region", { name: "Assessment rules" })).not.toBeInTheDocument();
});
