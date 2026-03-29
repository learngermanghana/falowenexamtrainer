import { render, screen } from "@testing-library/react";
import WritingFeedbackCard from "./WritingFeedbackCard";

describe("WritingFeedbackCard", () => {
  it("extracts score from textual feedback and renders corrected/wrong emphasis", () => {
    render(
      <WritingFeedbackCard
        level="B1"
        draft="Das ist ein kurzer Text mit mehreren Sätzen."
        feedback={`### Word and Phrase Corrections\n[wrong]"Im gegensatz"[/wrong] → [correct]"Im Gegensatz"[/correct]\n\nScore: 18/25`}
      />
    );

    expect(screen.getByText(/Score rubric \(18\/25\)/i)).toBeInTheDocument();
    expect(screen.getByText(/❌ Wrong:/i)).toBeInTheDocument();
    expect(screen.getByText(/✅ Correct:/i)).toBeInTheDocument();
  });
});
