import React from "react";
import { render, screen } from "@testing-library/react";
import { SpeakingBuilder } from "./C1Day8To10GuidedLessonPage";
import c1Day9KonsumUndWerbung from "../data/selfLearningLessons/c1/day9KonsumUndWerbung";

describe("C1 Day 8 to 10 speaking brain map", () => {
  test("shows the complete C1 Day 9 answer points before speaking practice", () => {
    render(<SpeakingBuilder lesson={c1Day9KonsumUndWerbung} />);

    expect(screen.getByText("Punkte für deine Antwort")).toBeInTheDocument();
    expect(screen.getByText(/Wie stark beeinflusst Werbung unser Konsumverhalten/)).toBeInTheDocument();

    [
      "Werbestrategien:",
      "Personalisierte Werbung:",
      "Wirkung auf Kaufentscheidungen:",
      "Verantwortung der Unternehmen:",
      "Verantwortung der Verbraucher:",
      "Regulierung und Schutz:",
    ].forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    expect(screen.getByText(/Emotionen, Rabatte, Influencer, Markenimage, Knappheit/)).toBeInTheDocument();
    expect(screen.getByText(/Datenschutz, Werbeverbote, Altersgrenzen, Kontrolle, Beschwerden/)).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(6);
  });
});
