import React from "react";
import { render, screen } from "@testing-library/react";
import PublicExamPracticePage from "./PublicExamPracticePage";

describe("PublicExamPracticePage", () => {
  test("shows public A1 and A2 practice without requiring authentication", () => {
    render(<PublicExamPracticePage />);
    expect(screen.getByText("Practise German exam tasks for free")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Try A1 free" })).toHaveAttribute("href", "/exam-practice/a1");
    expect(screen.getByRole("link", { name: "Try A2 free" })).toHaveAttribute("href", "/exam-practice/a2");
    expect(screen.getByText("B1")).toBeInTheDocument();
    expect(screen.getByText("Public practice coming soon")).toBeInTheDocument();
  });
});
