import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import ExamsOverviewPage from "./ExamsOverviewPage";
import { TrialExam } from "../context/TrialCatalogContext";

const mockNavigate = jest.fn();
let mockLevel = "B1";
let mockReadingHistory = [];

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
  loadExamRoomResults: jest.fn(),
}));

describe("simplified Exam Room overview", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLevel = "B1";
    mockReadingHistory = [];
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

    const mock = screen.getByRole("button", { name: "Start or resume a full mock exam" });
    expect(mock).toHaveTextContent("Start Mock Test");
    expect(mock).toHaveTextContent("Choose a mock");
    const progress = screen.getByRole("region", { name: "Exam room progress" });
    expect(mock.compareDocumentPosition(progress) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole("button", { name: "Practise Sprechen" }).compareDocumentPosition(progress) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.queryByText(/Option [12]/)).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Practise individual exam sections" })).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Recent results" })).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Daily warm-up" })).not.toBeInTheDocument();
    expect(screen.queryByText("Not yet practised")).not.toBeInTheDocument();
    fireEvent.click(mock);
    expect(mockNavigate).toHaveBeenLastCalledWith("/exams/mocks");

    [
      ["Lesen", "/exams/lesen"],
      ["Hören", "/exams/horen"],
      ["Schreiben", "/exams/writing"],
      ["Sprechen", "/exams/speaking"],
    ].forEach(([title, path]) => {
      const card = screen.getByRole("button", { name: "Practise " + title });
      expect(card).toHaveTextContent("Practise " + title);
      fireEvent.click(card);
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

  it("keeps the recommendation, latest score and Exam File accessible without a history panel", () => {
    mockLevel = "A2";
    mockReadingHistory = [{
      id: "read-1", level: "A2", score: 8, total: 15,
      completedAt: "2026-10-08T10:00:00Z", title: "A2 Lesen sample",
    }];
    render(<ExamsOverviewPage />);

    expect(screen.queryByText("Warm-up in progress")).not.toBeInTheDocument();
    expect(screen.queryByText(/A2 Lesen sample/)).not.toBeInTheDocument();
    expect(screen.getByText("Latest: 53%")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Practise Lesen" })).toHaveTextContent("Suggested next");

    fireEvent.click(screen.getByRole("button", { name: "Exam File →" }));
    expect(mockNavigate).toHaveBeenLastCalledWith("/exams/file");
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
  const mockEntry = screen.getByRole("button", { name: "Browse available exam practice" });
  expect(mockEntry).toHaveTextContent("Start Mock Test");
  expect(mockEntry).toHaveTextContent("Choose an available mock exam.");
  expect(mockEntry).not.toHaveTextContent("Browse practice");
  fireEvent.click(mockEntry);
  expect(mockNavigate).toHaveBeenLastCalledWith("/exams/mocks");
  fireEvent.click(screen.getByRole("button",{name:"Open trial practice →"}));
  expect(mockNavigate).toHaveBeenLastCalledWith(trial.route);
});


test("locked Exam File shows an explanation and trial overview omits history and warm-up", () => {
  mockLevel = "A2";
  mockNavigate.mockClear();
  render(<TrialExam.Provider value={{locked:true,id:null,level:"A2"}}><ExamsOverviewPage /></TrialExam.Provider>);
  expect(screen.queryByRole("region", { name: "Daily warm-up" })).not.toBeInTheDocument();
  expect(screen.queryByRole("region", { name: "Exam room progress" })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Locked: Lesen" })).toHaveTextContent("Locked");
  fireEvent.click(screen.getByRole("button",{name:"🔒 Exam File"}));
  expect(screen.getByRole("dialog",{name:"Locked: Exam File"})).toBeInTheDocument();
  expect(mockNavigate).not.toHaveBeenCalled();
  expect(screen.getByRole("link",{name:"View plans"})).toHaveAttribute("href","/mock/payment");
});
