import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import C1KnowledgeChoicePractice, { getC1KnowledgeItems } from "./C1KnowledgeChoicePractice";

const lesson = {
  level: "C1",
  day: 12,
  grammarLesson: {
    title: "Erweiterte Vergleichsformen",
    knowledgeTest: [
      {
        question: "Welche Formulierung ist korrekt?",
        options: ["deutlich vielfältiger als", "mehr vielfältiger als", "vielfältiger wie"],
        answer: "deutlich vielfältiger als",
        explanation: "Nach dem Komparativ steht als.",
      },
      {
        question: "Welche Struktur drückt Gleichheit aus?",
        options: ["so ... wie", "so ... als", "mehr ... wie"],
        answer: "so ... wie",
        explanation: "so ... wie drückt Gleichheit aus.",
      },
    ],
  },
};

describe("C1KnowledgeChoicePractice", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.scrollTo = jest.fn();
  });

  test("limits the interactive Learn flow to C1 days 1 through 15", () => {
    expect(getC1KnowledgeItems(lesson)).toHaveLength(2);
    expect(getC1KnowledgeItems({ ...lesson, day: 13 })).toHaveLength(2);
    expect(getC1KnowledgeItems({ ...lesson, day: 15 })).toHaveLength(2);
    expect(getC1KnowledgeItems({ ...lesson, day: 16 })).toHaveLength(0);
    expect(getC1KnowledgeItems({ ...lesson, level: "B2" })).toHaveLength(0);
  });

  test("lets the student learn by clicking answers and completes after all are correct", () => {
    const onCompleteChange = jest.fn();
    render(<C1KnowledgeChoicePractice lesson={lesson} onCompleteChange={onCompleteChange} />);

    expect(screen.getByRole("heading", { name: "Knowledge questions" })).toBeInTheDocument();
    expect(screen.getByText("Question 1 of 2")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "mehr vielfältiger als" }));
    expect(screen.getByRole("status")).toHaveTextContent("Not correct yet");

    fireEvent.click(screen.getByRole("button", { name: "deutlich vielfältiger als" }));
    expect(screen.getByRole("status")).toHaveTextContent("Correct.");

    fireEvent.click(screen.getByRole("button", { name: "Next question" }));
    expect(screen.getByText("Question 2 of 2")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "so ... wie" }));
    expect(screen.getByText(/Learn complete/i)).toBeInTheDocument();
    expect(onCompleteChange).toHaveBeenCalledWith(true);
  });
});
