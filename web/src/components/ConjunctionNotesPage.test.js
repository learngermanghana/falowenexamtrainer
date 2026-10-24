import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ConjunctionNotesPage from "./ConjunctionNotesPage";
import { alignA1CurriculumEntry } from "../data/a1RouteAlignment";

describe("A1 5.10 interactive weil workbook", () => {
  const renderPage = () =>
    render(
      <MemoryRouter>
        <ConjunctionNotesPage />
      </MemoryRouter>,
    );

  test("renders the complete interactive workbook progression", () => {
    renderPage();

    expect(screen.getByText(/A1 · Kapitel 5.10 · Interactive Workbook/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Weil & nützliche A1-Redemittel/i })).toBeInTheDocument();

    [
      /Learn the rule/i,
      /Choose · Which sentence is correct/i,
      /Build · Put the words in order/i,
      /Match · Choose the reason that fits/i,
      /Formal or informal/i,
      /Repair the message/i,
      /Apply · Build your own useful sentence/i,
      /Recognise the other connectors/i,
      /Final transfer challenge/i,
    ].forEach((pattern) => {
      expect(screen.getByRole("heading", { name: pattern })).toBeInTheDocument();
    });
  });

  test("keeps weil productive and other A1 connectors recognition-only", () => {
    renderPage();

    expect(screen.getAllByText(/weil ich krank bin/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Recognise und, aber, oder and denn/i)).toBeInTheDocument();
    expect(screen.getByText(/deshalb starts properly in A2/i)).toBeInTheDocument();
  });

  test("gives immediate feedback for a weil word-order choice", () => {
    renderPage();

    fireEvent.click(screen.getByLabelText("weil ich krank bin"));
    expect(screen.getAllByText("Correct.").length).toBeGreaterThan(0);
  });

  test("sentence builder requires the verb at the end", () => {
    renderPage();

    const buildSection = screen.getByTestId("sentence-builder");
    fireEvent.click(withinButton(buildSection, "weil", 0));
    fireEvent.click(withinButton(buildSection, "ich", 0));
    fireEvent.click(withinButton(buildSection, "krank", 0));
    fireEvent.click(withinButton(buildSection, "bin", 0));

    expect(screen.getByText("Correct sentence.")).toBeInTheDocument();
  });

  test("repairs the broken weil clause and appointment sentence", () => {
    renderPage();

    fireEvent.change(screen.getByLabelText("Repair weil word order"), {
      target: { value: "Ich kann nicht kommen, weil ich krank bin." },
    });
    fireEvent.change(screen.getByLabelText("Repair appointment sentence"), {
      target: { value: "Können wir uns am Mittwoch treffen?" },
    });

    expect(screen.getAllByText("Correct.").length).toBeGreaterThanOrEqual(2);
  });

  test("final transfer challenge checks the core message parts", () => {
    renderPage();

    fireEvent.change(screen.getByLabelText("Final A1 transfer message"), {
      target: {
        value:
          "Liebe Anna,\n\nich kann am Dienstag nicht kommen, weil ich arbeiten muss. Können wir uns am Mittwoch treffen?\n\nLiebe Grüße\nFelix",
      },
    });

    expect(screen.getByText(/✓ Greeting/)).toBeInTheDocument();
    expect(screen.getByText(/✓ One practical request\/question/)).toBeInTheDocument();
    expect(screen.getByText(/✓ Reason with weil/)).toBeInTheDocument();
    expect(screen.getByText(/✓ Verb appears at the end of the weil-clause/)).toBeInTheDocument();
    expect(screen.getByText(/✓ Closing/)).toBeInTheDocument();
  });

  test("renames the Course Book lesson as an interactive workbook", () => {
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
        title: "Weil & Useful A1 Phrases · Interactive Workbook",
        topic: "Weil & Useful A1 Phrases · Interactive Workbook",
      }),
    );
  });
});

function withinButton(container, name, occurrence) {
  const buttons = Array.from(container.querySelectorAll("button")).filter(
    (button) => button.textContent === name && !button.disabled,
  );
  return buttons[occurrence] || buttons[0];
}


test("build guard markers match the interactive Day 24 workbook", () => {
  const source = require("node:fs").readFileSync(
    require("node:path").join(process.cwd(), "src/components/ConjunctionNotesPage.js"),
    "utf8",
  );

  [
    'data-a1-5-10-interactive-workbook="true"',
    "A1 · Kapitel 5.10 · Interactive Workbook",
    "Weil & nützliche A1-Redemittel",
    "weil + verb at the end",
    'testId="quick-check"',
    'testId="sentence-builder"',
    'testId="reason-matching"',
    'testId="register-check"',
    'testId="repair-message"',
    'testId="apply"',
    'testId="connector-recognition"',
    'testId="final-transfer"',
  ].forEach((marker) => expect(source).toContain(marker));
});
