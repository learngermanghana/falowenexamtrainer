import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import ExamsOverviewPage from "./ExamsOverviewPage";
import { TrialExam } from "../context/TrialCatalogContext";

const mockNavigate = jest.fn();
let mockLevel = "B1";
let mockReadingHistory = [];
let mockDaily = { practised: false, hasDraft: false };

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("../context/ExamContext", () => ({
  useExam: () => ({ level: mockLevel }),
}));

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: null, idToken: null, studentProfile: null }),
}));

jest.mock("../services/readingPracticeHistory", () => ({
  getReadingPracticeHistory: () => mockReadingHistory,
  getReadingPracticeStudentKey: () => "test-student",
}));

jest.mock("../services/examRoomDashboardService", () => ({
  getLocalDailyWarmup: () => mockDaily,
  loadDailyWarmupProgress: jest.fn(),
  loadExamRoomResults: jest.fn(),
}));

describe("simplified Exam Room overview", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLevel = "B1";
    mockReadingHistory = [];
    mockDaily = { practised: false, hasDraft: false };
  });

  it("keeps real progress metrics and makes the mock and four skills direct choices", () => {
    render(<ExamsOverviewPage />);

    expect(screen.getByRole("heading", { name: "Your B1 exam room" })).toBeInTheDocument();
    expect(screen.getByText("Scored practices")).toBeInTheDocument();
    expect(screen.getByText("Skills practised")).toBeInTheDocument();
    expect(screen.getByText("Latest score")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: /skill practice coverage/i }))
      .toHaveAttribute("aria-valuenow", "0");
    expect(screen.getByText(/Coverage records practice, not an exam pass/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Start or resume a full mock exam" }));
    expect(mockNavigate).toHaveBeenLastCalledWith("/exams/mocks");

    [
      ["Lesen", "/exams/lesen"],
      ["Hören", "/exams/horen"],
      ["Schreiben", "/exams/writing"],
      ["Sprechen", "/exams/speaking"],
    ].forEach(([title, path]) => {
      fireEvent.click(screen.getByRole("button", { name: "Practise " + title }));
      expect(mockNavigate).toHaveBeenLastCalledWith(path);
    });
  });

  it.each(["C1", "C2"])(
    "does not imply an unpublished full %s mock is available",
    (level) => {
      mockLevel = level;
      render(<ExamsOverviewPage />);
      expect(screen.getByRole("button", { name: "Browse available exam practice" }))
        .toHaveTextContent("A complete " + level + " mock is not yet published");
      expect(screen.queryByRole("button", { name: "Start or resume a full mock exam" }))
        .not.toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: "Browse available exam practice" }));
      expect(mockNavigate).toHaveBeenCalledWith("/exams/mocks");
    },
  );

  it("keeps the warm-up, recommendation, reading result and Exam File accessible", () => {
    mockLevel = "A2";
    mockDaily = { practised: false, hasDraft: true };
    mockReadingHistory = [{
      id: "read-1", level: "A2", score: 8, total: 15,
      completedAt: "2026-10-08T10:00:00Z", title: "A2 Lesen sample",
    }];
    render(<ExamsOverviewPage />);

    expect(screen.getByText("Warm-up in progress")).toBeInTheDocument();
    expect(screen.getByText(/A2 Lesen sample/)).toBeInTheDocument();
    expect(screen.getAllByText("53%").length).toBeGreaterThan(0);
    expect(screen.getByText(/Suggested: Lesen/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Continue →" }));
    expect(mockNavigate).toHaveBeenLastCalledWith("/exams/question");
    fireEvent.click(screen.getByRole("button", { name: "Exam File →" }));
    expect(mockNavigate).toHaveBeenLastCalledWith("/exams/file");
  });

  it("preserves a completed warm-up state without another prominent card", () => {
    mockDaily = { practised: true, hasDraft: false };
    render(<ExamsOverviewPage />);
    expect(screen.getByText("Warm-up completed")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Review →" }));
    expect(mockNavigate).toHaveBeenCalledWith("/exams/question");
  });
});


test("locked catalogue does not recommend a paid skill", () => {
  mockLevel = "A2";
  render(<TrialExam.Provider value={{locked:true,id:null,level:"A2"}}><ExamsOverviewPage /></TrialExam.Provider>);
  mockNavigate.mockClear();
  const locked = screen.getByRole("button",{name:"Locked: Lesen"});
  expect(locked).toBeEnabled();
  fireEvent.click(locked);
  expect(screen.getByRole("dialog",{name:"Locked: Lesen"})).toBeInTheDocument();
  expect(mockNavigate).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button",{name:"Keep browsing"}));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.queryByRole("button",{name:"Practise recommended skill →"})).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Browse exams →"}));
  expect(mockNavigate).toHaveBeenLastCalledWith("/exams/mocks");
});
test("trial recommendation opens only the designated mock", () => {
  mockLevel = "A2";
  const trial = {id:"a2-final-01",route:"/campus/course/a2-final-mock-exam"};
  render(<TrialExam.Provider value={trial}><ExamsOverviewPage /></TrialExam.Provider>);
  fireEvent.click(screen.getByRole("button",{name:"Open trial practice →"}));
  expect(mockNavigate).toHaveBeenLastCalledWith(trial.route);
});


test("locked warm-up and Exam File show explanations without navigating", () => {
  mockLevel = "A2";
  mockNavigate.mockClear();
  render(<TrialExam.Provider value={{locked:true,id:null,level:"A2"}}><ExamsOverviewPage /></TrialExam.Provider>);
  fireEvent.click(screen.getByRole("button",{name:"🔒 Locked"}));
  expect(screen.getByRole("dialog",{name:"Locked: Daily warm-up"})).toBeInTheDocument();
  expect(mockNavigate).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button",{name:"Keep browsing"}));
  fireEvent.click(screen.getByRole("button",{name:"🔒 Exam File"}));
  expect(screen.getByRole("dialog",{name:"Locked: Exam File"})).toBeInTheDocument();
  expect(mockNavigate).not.toHaveBeenCalled();
  expect(screen.getByRole("link",{name:"View plans"})).toHaveAttribute("href","/mock/payment");
});
