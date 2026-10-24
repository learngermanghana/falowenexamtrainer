import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MockExamLibraryPage from "./MockExamLibraryPage";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));
jest.mock("../context/ExamContext", () => ({
  useExam: () => ({ level: "A2" }),
}));

describe("A2 mock library discovery", () => {
  beforeEach(() => mockNavigate.mockClear());

  it("shows existing A2 course mock practice without implying a final score", () => {
    render(<MockExamLibraryPage />);
    expect(screen.getByText("A2 Course Mock")).toBeInTheDocument();
    expect(screen.getByText(/Preview practice does not yet generate one final combined score/i))
      .toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /open practice/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/campus/course/a2-mock-practice-preview");
  });
});
