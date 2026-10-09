import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import ExamsOverviewPage from "./ExamsOverviewPage";

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

    fireEvent.click(screen.getByRole("button", { name: "Browse full mock exams" }));
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
      expect(screen.queryByRole("button", { name: "Browse full mock exams" }))
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

  it("shows evidence-only readiness, a seven-day plan and genuine reading part details", () => {
    mockLevel = "A1";
    mockReadingHistory = [{
      id: "reading-7", level: "A1", score: 6, total: 15,
      completedAt: "2026-10-08T10:00:00Z", title: "A1 Lesen sample",
      sectionScores: [
        { label: "Teil 1", score: 4, total: 5 },
        { label: "Teil 2", score: 0, total: 5 },
        { label: "Teil 3", score: 2, total: 5 },
      ],
    }];
    render(<ExamsOverviewPage />);

    expect(screen.getByText("Not assessed")).toBeInTheDocument();
    expect(screen.getByText(/practice coverage alone is not readiness/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText("My personalised 7-day practice plan"));
    expect(screen.getByText(/Start with Teil 2/)).toBeInTheDocument();
    expect(screen.getByText(/Day 7 · Review and recheck/)).toBeInTheDocument();

    fireEvent.click(screen.getByText("A1 Lesen sample"));
    expect(screen.getByText("0/5 · 0%")).toBeInTheDocument();
    expect(screen.getByText("4/5 · 80%")).toBeInTheDocument();
  });

  it("preserves a completed warm-up state without another prominent card", () => {
    mockDaily = { practised: true, hasDraft: false };
    render(<ExamsOverviewPage />);
    expect(screen.getByText("Warm-up completed")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Review →" }));
    expect(mockNavigate).toHaveBeenCalledWith("/exams/question");
  });
});
