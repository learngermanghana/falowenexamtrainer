import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ConjunctionNotesPage from "./ConjunctionNotesPage";
import { alignA1CurriculumEntry } from "../data/a1RouteAlignment";

describe("A1 5.10 weil and useful phrases", () => {
  test("keeps weil as the productive A1 connector and moves deshalb to A2", () => {
    render(
      <MemoryRouter>
        <ConjunctionNotesPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: /Gründe geben mit weil + nützliche A1-Redemittel/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Ich kann nicht kommen, weil ich krank bin/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Deshalb starts in A2/i })).toBeInTheDocument();
    expect(screen.getByText(/recognise und, aber, oder and denn/i)).toBeInTheDocument();
  });

  test("covers the practical A1 message phrases", () => {
    render(
      <MemoryRouter>
        <ConjunctionNotesPage />
      </MemoryRouter>,
    );

    [
      /Leider muss ich den Termin absagen/i,
      /Ich möchte mich für den Deutschkurs anmelden/i,
      /Herzlichen Glückwunsch zum Geburtstag/i,
      /Wie viel kostet der Kurs/i,
      /Können wir einen anderen Termin vereinbaren/i,
      /Können Sie mir bitte mehr Informationen über den Kurs geben/i,
    ].forEach((pattern) => {
      expect(screen.getByText(pattern)).toBeInTheDocument();
    });
  });

  test("renames the Course Book lesson at runtime", () => {
    expect(
      alignA1CurriculumEntry({
        level: "A1",
        day: 24,
        chapter: "5.10",
        title: "Conjunctions",
        topic: "Conjunctions",
      }),
    ).toEqual(
      expect.objectContaining({
        title: "Reasons with weil and Useful A1 Phrases",
        topic: "Reasons with weil and Useful A1 Phrases",
      }),
    );
  });
});
