import React from "react";
import { render, screen } from "@testing-library/react";
import {
  B1_DAY15_MEDIEN_HOMEOFFICE_WORKBOOK_CONFIG,
} from "./B1Day15MedienHomeofficeWorkbookPage";
import B1Day15MedienHomeofficeGrammarNotesPage from "./B1Day15MedienHomeofficeGrammarNotesPage";

describe("B1 Day 15 Medien und Arbeiten im Homeoffice", () => {
  test("contains the complete workbook assignment", () => {
    const config = B1_DAY15_MEDIEN_HOMEOFFICE_WORKBOOK_CONFIG;

    expect(config.day).toBe(15);
    expect(config.chapter).toBe("5.15");
    expect(config.assignmentKey).toBe("B1-5.15");
    expect(config.speaking.question).toContain("Vorteile und Nachteile");
    expect(config.writing.sourceText).toContain("Moderne Medien wie E-Mails");
    expect(config.reading.text.questions).toHaveLength(7);
    expect(config.listening.questions).toHaveLength(5);
    expect(config.listening.embedUrl).toContain(
      "1fQg01JCqIdttaf9bYPGiNlFrb7urCnGU/preview"
    );
    expect(config.submitListening).toBe(true);
  });

  test("teaches passive voice for digital work processes", () => {
    render(<B1Day15MedienHomeofficeGrammarNotesPage />);

    expect(
      screen.getByRole("heading", { name: "Medien und Arbeiten im Homeoffice" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Passiv im Präsens/ })
    ).toBeInTheDocument();
    expect(screen.getByText(/Sichere Passwörter müssen verwendet werden/)).toBeInTheDocument();
    expect(screen.getByText(/Persönliche Daten werden geschützt/)).toBeInTheDocument();
  });
});
