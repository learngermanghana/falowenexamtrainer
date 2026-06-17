import { render, screen } from "@testing-library/react";
import WritingFeedbackCard from "./WritingFeedbackCard";

describe("WritingFeedbackCard", () => {
  it("extracts a score from textual feedback and renders corrections", () => {
    render(
      <WritingFeedbackCard
        level="B1"
        feedback={`### Word and Phrase Corrections\n[wrong]Im gegensatz[/wrong] → [correct]Im Gegensatz[/correct]\n\nScore: 18/25`}
      />,
    );

    expect(screen.getByText(/Score: 18\/25/i)).toBeInTheDocument();
    expect(screen.getByText(/❌ Needs fix:/i)).toBeInTheDocument();
    expect(screen.getByText(/✅ Better:/i)).toBeInTheDocument();
  });

  it("renders normalized rubric objects without NaN or object text", () => {
    const { container } = render(
      <WritingFeedbackCard
        level="B2"
        structuredFeedback={{
          score: 16,
          maxScore: 20,
          summary: "The response is clear and logically organised.",
          strengths: ["Clear position"],
          areasToImprove: ["Use a wider range of connectors"],
          rubric: {
            task: { score: 4, maxScore: 5, feedback: "All points covered" },
            coherence: { score: 4, maxScore: 5, feedback: "Logical flow" },
            grammar: { score: 3, maxScore: 5, feedback: "Review cases" },
            lexis: { score: 5, maxScore: 5, feedback: "Strong range" },
          },
          corrections: [],
        }}
      />,
    );

    expect(screen.getByText(/Score: 16\/20/i)).toBeInTheDocument();
    expect(screen.getAllByText("4/5")).toHaveLength(2);
    expect(screen.getByText("3/5")).toBeInTheDocument();
    expect(screen.getByText("5/5")).toBeInTheDocument();
    expect(container.textContent).not.toContain("NaN");
    expect(container.textContent).not.toContain("[object Object]");
    expect(container.textContent).not.toContain("```json");
  });
});
