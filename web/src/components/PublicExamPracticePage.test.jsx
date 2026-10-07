import React from "react";
import { render, screen } from "@testing-library/react";
import PublicExamPracticePage from "./PublicExamPracticePage";

describe("PublicExamPracticePage", () => {
  test("shows public A1 and A2 practice without requiring authentication", () => {
    render(<PublicExamPracticePage />);
    expect(screen.getByText("Free Goethe A1 & A2 exam practice")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Try A1 free" })).toHaveAttribute("href", "/exam-practice/a1");
    expect(screen.getByRole("link", { name: "Try A2 free" })).toHaveAttribute("href", "/exam-practice/a2");
    expect(screen.getByText("B1")).toBeInTheDocument();
    expect(screen.getByText("Public practice coming soon")).toBeInTheDocument();
    expect(document.title).toBe("Free Goethe Exam Practice A1 & A2 | Falowen");
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      expect.stringMatching(/\/exam-practice$/),
    );
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      expect.stringContaining("A1 and A2"),
    );
  });

  test("uses level-specific metadata for A1", () => {
    render(<PublicExamPracticePage level="A1" />);
    expect(document.title).toBe("Free Goethe A1 Exam Practice – Lesen | Falowen");
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      expect.stringMatching(/\/exam-practice\/a1$/),
    );
  });

  test("does not advertise B1 as available", () => {
    render(<PublicExamPracticePage level="B1" />);
    expect(screen.getByText("Goethe B1 public exam practice is coming soon")).toBeInTheDocument();
    expect(document.title).toBe("Goethe B1 Exam Practice Coming Soon | Falowen");
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      expect.stringMatching(/\/exam-practice\/b1$/),
    );
    expect(screen.queryByText(/Free B1 German Exam Practice/i)).not.toBeInTheDocument();
  });
});
