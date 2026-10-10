import React from "react";
import { render, screen } from "@testing-library/react";
import PublicExamPracticePage from "./PublicExamPracticePage";

describe("PublicExamPracticePage", () => {
  test("shows the current catalog, free reading samples and protected mocks", () => {
    render(<PublicExamPracticePage />);
    expect(screen.getByText("Find your exam level")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Try free A1 reading/ })).toHaveAttribute("href", "/exam-practice/a1");
    expect(screen.getByRole("link", { name: /Try free A2 reading/ })).toHaveAttribute("href", "/exam-practice/a2");
    expect(screen.getByText("Goethe-style B1 practice")).toBeInTheDocument();
    expect(screen.getByText("Goethe-style B2 practice")).toBeInTheDocument();
    expect(screen.getByText("Goethe-style C1 practice")).toBeInTheDocument();
    expect(screen.getByText("Goethe-style C2 practice")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Access full mocks/ })).toHaveAttribute("href", "/campus/course/a1-final-mock-exam");
    expect(document.title).toBe("Goethe Exam Practice A1–C2 | Falowen Mocks");
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", expect.stringMatching(/\/exam-practice$/));
  });

  test("uses level-specific metadata for the public A1 reading sample", () => {
    render(<PublicExamPracticePage level="A1" />);
    expect(document.title).toBe("Free Goethe A1 Exam Practice – Lesen | Falowen");
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", expect.stringMatching(/\/exam-practice\/a1$/));
  });

  test("B1 shows the available mock and keeps its protected route", () => {
    render(<PublicExamPracticePage level="B1" />);
    expect(screen.getByText("Goethe-style B1 practice")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Access full mocks/ })).toHaveAttribute("href", "/campus/course/b1-final-mock-exam");
    expect(document.title).toBe("Goethe B1 Exam Preparation and Mock Tests | Falowen");
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", expect.stringMatching(/\/exam-practice\/b1$/));
  });
});
