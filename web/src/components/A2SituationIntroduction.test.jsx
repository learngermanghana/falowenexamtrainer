import React from "react";
import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import A2SituationIntroduction, { A2_SITUATIONS, getA2Situation } from "./A2SituationIntroduction";

describe("A2 situation-first grammar flow", () => {
  test.each(Array.from({ length: 28 }, (_, index) => index + 1))("Day %i has a concise situation and example", (day) => {
    const situation = getA2Situation(day);

    expect(situation).toEqual(expect.objectContaining({
      title: expect.any(String),
      intro: expect.any(String),
      example: expect.any(String),
    }));
    expect(situation.title.length).toBeGreaterThan(3);
    expect(situation.intro.length).toBeGreaterThan(70);
    expect(situation.intro.length).toBeLessThan(360);
    expect(situation.example.length).toBeGreaterThan(25);
  });

  test("covers exactly A2 Days 1–28", () => {
    expect(Object.keys(A2_SITUATIONS).map(Number)).toEqual(
      Array.from({ length: 28 }, (_, index) => index + 1),
    );
  });

  test("keeps the A2 card deliberately lighter than B1 and separates the label from its example", () => {
    render(<A2SituationIntroduction day={20} />);

    expect(screen.getByText("A2 · Situation verstehen")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Eine Reklamation machen" })).toBeVisible();
    expect(screen.getByText("Beispiel")).toBeVisible();
    expect(screen.getByText("Beispiel").parentElement).toHaveStyle({ display: "grid", gap: "4px" });
    expect(screen.getByText(/Kopfhörer funktionieren nicht/)).toBeVisible();
    expect(screen.queryByText("Denkfrage")).not.toBeInTheDocument();
    expect(screen.queryByText("Leitfrage")).not.toBeInTheDocument();
    expect(screen.queryByText("Abwägung")).not.toBeInTheDocument();
  });

  test("uses practical current-course situations for later A2 days", () => {
    expect(getA2Situation(17).title).toBe("In die Apotheke gehen");
    expect(getA2Situation(18).title).toBe("Die Bank anrufen");
    expect(getA2Situation(23).title).toBe("Schul- oder Arbeitsweg");
    expect(getA2Situation(27).title).toBe("Digitale Kommunikation");
    expect(getA2Situation(28).title).toBe("Über die Zukunft sprechen");
  });

  test("orders A2 Learn as situation, thinking support, grammar, second-stage grammar, then collocations", () => {
    const contentSource = fs.readFileSync(
      path.resolve(__dirname, "A2B1WorkbookGrammarNotesContent.js"),
      "utf8",
    );
    const wrapperSource = fs.readFileSync(
      path.resolve(__dirname, "A2B1WorkbookGrammarNotes.js"),
      "utf8",
    );
    const renderStart = contentSource.indexOf('<div style={{ display: "grid", gap: 16 }}>');

    const situationIndex = contentSource.indexOf("<A2SituationIntroduction", renderStart);
    const thinkingIndex = contentSource.indexOf("<A2ThinkingFirstGrammarGuide", renderStart);
    const grammarIndex = contentSource.indexOf("<GrammarNotes />", renderStart);

    expect(situationIndex).toBeGreaterThan(renderStart);
    expect(thinkingIndex).toBeGreaterThan(situationIndex);
    expect(grammarIndex).toBeGreaterThan(thinkingIndex);
    expect(contentSource).not.toContain("<A2TopicCollocationPractice");

    const secondStageIndex = wrapperSource.indexOf("<A2SecondStageGrammarUpgrade");
    const collocationIndex = wrapperSource.indexOf("<A2TopicCollocationPractice");

    expect(secondStageIndex).toBeGreaterThan(-1);
    expect(collocationIndex).toBeGreaterThan(secondStageIndex);
  });

  test("keeps A2 and B1 introductions level-specific", () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, "A2B1WorkbookGrammarNotesContent.js"),
      "utf8",
    );

    expect(source).toContain('const showA2SituationIntro = normalizedLevel === "A2"');
    expect(source).toContain('const showB1TopicIntro = normalizedLevel === "B1"');
    expect(source).toContain("{showA2SituationIntro ? <A2SituationIntroduction");
    expect(source).toContain("{showB1TopicIntro ? <B1TopicIntroduction");
  });
});
