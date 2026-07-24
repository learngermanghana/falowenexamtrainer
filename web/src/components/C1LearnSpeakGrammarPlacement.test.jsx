import React from "react";
import { render, screen } from "@testing-library/react";
import C1KnowledgeChoicePractice from "./C1KnowledgeChoicePractice";
import C1SpeakGrammarGuide from "./C1SpeakGrammarGuide";
import c1Day12FreizeitUndKultur from "../data/selfLearningLessons/c1/day12FreizeitUndKultur";

describe("C1 Learn and Speak grammar placement", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("C1 Day 12 Learn shows the grammar lesson before knowledge questions", () => {
    render(
      <C1KnowledgeChoicePractice
        lesson={c1Day12FreizeitUndKultur}
        completed={false}
        onCompleteChange={() => {}}
      />,
    );

    expect(screen.getByText("Grammar lesson")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Erweiterte Vergleichs- und Bewertungsstrukturen bei Freizeit und Kultur",
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/im Hinblick auf \+ Akkusativ/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Knowledge questions" })).toBeInTheDocument();
    expect(screen.queryByText(/Sprechfrage:/i)).not.toBeInTheDocument();
  });

  test("C1 Day 12 Speak shows speaking guidance without repeating the grammar lesson", () => {
    render(<C1SpeakGrammarGuide lesson={c1Day12FreizeitUndKultur} />);

    expect(screen.queryByText("Grammar lesson")).not.toBeInTheDocument();
    expect(screen.getByText(/Sprechfrage:/i)).toBeInTheDocument();
    expect(screen.getByText("Soziale Teilhabe:")).toBeInTheDocument();
    expect(screen.getByText("Förderung und Prioritäten:")).toBeInTheDocument();
  });
});
