import { render, screen } from "@testing-library/react";
import WritingHistorySection from "./WritingHistorySection";

const entry = {
  id: "attempt-1",
  taskTitle: "C1 Day 4 guided writing",
  originalLetter: "Erfolgreiche Teamarbeit hängt von vielen Faktoren ab.",
  score: 16,
  maxScore: 25,
  submissionDate: "2026-06-21T09:43:48.000Z",
  structuredFeedback: {
    score: 16,
    maxScore: 25,
    summary: "Your letter addresses the importance of teamwork well.",
  },
};

describe("WritingHistorySection", () => {
  it("keeps saved AI feedback collapsed to avoid duplicate feedback after opening an attempt", () => {
    render(<WritingHistorySection entries={[entry]} level="C1" />);

    expect(screen.getByText(/Show saved AI feedback/i)).toBeInTheDocument();
    expect(screen.queryByText(/^AI Feedback$/i)).not.toBeInTheDocument();
  });
});
