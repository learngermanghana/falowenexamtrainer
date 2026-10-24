import { render, screen, fireEvent } from "@testing-library/react";
import WritingFeedbackCard from "./WritingFeedbackCard";

describe("WritingFeedbackCard", () => {
  it("extracts a score from textual feedback and renders the current fallback safely", () => {
    render(
      <WritingFeedbackCard
        level="B1"
        feedback={`### Word and Phrase Corrections\n[wrong]Im gegensatz[/wrong] → [correct]Im Gegensatz[/correct]\n\nScore: 18/25`}
      />,
    );

    expect(screen.getByText(/Score: 18\/25/i)).toBeInTheDocument();
    expect(screen.getByText("Actual mistakes (1)")).toBeInTheDocument();
    expect(screen.getByText("Im gegensatz")).toBeInTheDocument();
    expect(screen.getByText("Im Gegensatz")).toBeInTheDocument();
  });

  it("renders C2 feedback with the advanced rubric", () => {
    render(
      <WritingFeedbackCard
        level="C2"
        structuredFeedback={{
          score: 21,
          maxScore: 25,
          summary: "Strong C2 control with minor precision issues.",
          strengths: ["Nuanced argumentation"],
          mainIssues: ["Use more precise collocations"],
          rubric: { task: 5, coherence: 4, grammar: 4, lexis: 4, overall: 21 },
          corrections: [],
        }}
      />,
    );

    expect(screen.getByText(/Score: 21\/25/i)).toBeInTheDocument();
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

  it.each(["A1", "A2", "B1", "B2", "C1", "C2"])("preserves all corrections with a readable overview at %s", level => {
    const corrections = Array.from({length:12},(_,index)=>({wrong:`Wrong phrase ${index}`,correct:`Correct phrase ${index}`,reason:`Explanation ${index}`}));
    render(<WritingFeedbackCard level={level} structuredFeedback={{score:17,maxScore:25,corrections}}/>);
    expect(screen.getByText("Actual mistakes (12)")).toBeInTheDocument();
    expect(screen.getByText("Wrong phrase 0")).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Show all corrections/));
    expect(screen.getByText("Wrong phrase 11")).toBeVisible();
    expect(screen.getByText("Correct phrase 11")).toBeVisible();
    expect(screen.getByText("Explanation 11")).toBeVisible();
    expect(screen.getByText("Score: 17/25")).toBeInTheDocument();
  });
  it("keeps long corrections and case-only mistakes instead of hiding them", () => {
    const wrong="This is a long example of a student sentence that contains more than eighteen words and must remain visible in the feedback.";
    const reason="This is a detailed explanation of the sentence structure that deliberately contains more than twenty eight words so that an advanced learner can see the complete grammar rule and understand the correction.";
    render(<WritingFeedbackCard structuredFeedback={{corrections:[{wrong,correct:wrong.replace("student","learner"),reason},{wrong:"im gegensatz",correct:"im Gegensatz",reason:"Capitalize the noun Gegensatz."}]}}/>);
    expect(screen.getByText(wrong)).toBeInTheDocument();
    expect(screen.getByText(reason)).toBeInTheDocument();
    expect(screen.getByText("im Gegensatz")).toBeInTheDocument();
  });
  it("separates task points and optional suggestions and collapses the corrected draft", () => {
    render(<WritingFeedbackCard structuredFeedback={{score:20,corrections:[],taskPoints:[{label:"Give a reason",status:"partial",evidence:"Ich kann nicht kommen.",reason:"Explain why you cannot attend."}],optionalImprovements:["A more diplomatic opening is optional."],improvedVersion:"Corrected draft text"}}/>);
    expect(screen.getByText("Actual mistakes (0)")).toBeInTheDocument();
    expect(screen.getByText("Partly answered")).toBeInTheDocument();
    expect(screen.getByText("These are suggestions, not language mistakes.")).toBeInTheDocument();
    expect(screen.getByText("Corrected draft text")).not.toBeVisible();
    fireEvent.click(screen.getByText(/Corrected draft · compare/));
    expect(screen.getByText("Corrected draft text")).toBeVisible();
  });
  it("copies all corrections including ones collapsed on screen", async () => {
    const writeText=jest.fn().mockResolvedValue();
    Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText}});
    const corrections=Array.from({length:8},(_,i)=>({wrong:`wrong ${i}`,correct:`right ${i}`,reason:`reason ${i}`}));
    render(<WritingFeedbackCard structuredFeedback={{score:19,corrections}}/>);
    fireEvent.click(screen.getByText("Copy feedback"));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("You wrote: wrong 7"));
    await screen.findByText("Clean feedback copied.");
  });
