// Deployment trigger for A2 Days 12-16 thinking-flow production release.
import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("A2 Days 12-16 thinking flow", () => {
  test("grammar tab adds thinking-first support for Days 12-16 after the video", () => {
    const source = read("A2B1WorkbookGrammarNotes.js");
    expect(source).toContain("A2Days12To16ThinkingFirstGrammarGuide");
    expect(source).toContain('numericDay >= 12 && numericDay <= 16');
    expect(source.indexOf("A2B1GrammarVideoCard")).toBeLessThan(source.indexOf("A2Days12To16ThinkingFirstGrammarGuide day={numericDay}"));
  });

  test("support contains real speaking ideas for all five lessons", () => {
    const source = read("A2Days12To16ThinkingSupport.js");
    [
      "More speaking help: Mein Traumberuf",
      "More speaking help: Vorstellungsgespräch",
      "More speaking help: Beruf und Karriere",
      "More speaking help: Mein Lieblingssport",
      "More speaking help: Wohlbefinden und Entspannung",
    ].forEach((marker) => expect(source).toContain(marker));
    expect(source).toContain("Idea → decision → German sentence");
    expect(source).toContain("modelAnswer");
  });

  test("shared SpeakingMindMap enriches A2 Days 12-16", () => {
    const source = read("SpeakingMindMap.js");
    expect(source).toContain("getA2Days12To16SpeakingConfig");
    expect(source).toContain("day >= 12 && day <= 16");
  });

  test("Day 13 replaces the vague writing bullet with a concrete question", () => {
    const source = read("A2Day13VorstellungsgespraechWorkbookPage.js");
    expect(source).toContain("Fragen Sie nach den Arbeitszeiten, den Aufgaben oder den Weiterbildungsmöglichkeiten.");
    expect(source).toContain("patchWritingPrompt");
  });

  test("Day 13 keeps the speaking task in one mind map instead of repeating it below", () => {
    const page = read("A2Day13VorstellungsgespraechWorkbookPageLegacy.js");
    const mindMaps = fs.readFileSync(path.resolve(__dirname, "../data/speakingMindMaps/a2/index.js"), "utf8");

    expect(page).toContain("The mind map contains the complete");
    expect(page).toContain("<SpeakingMindMap config={getA2SpeakingMindMap(13)} />");
    expect(page).not.toContain("Zentrales Thema: „Mein Beruf und ich“");
    expect(page).not.toContain("<h3 style={sectionTitle}>Hauptfrage</h3>");
    expect(page).not.toContain("Sprechen wie bei einer Mini-Präsentation");
    ["Vorstellung", "Ausbildung", "Berufserfahrung", "Fähigkeiten", "Motivation"].forEach((branchLabel) => {
      expect(mindMaps).toContain(`\"${branchLabel}\"`);
    });
  });

  test.each([
    ["A2Day14BerufUndKarriereWorkbookPage.js", "A2-Mindmap: „Mein Beruf und meine Zukunft“"],
    ["A2Day15MeinLieblingssportWorkbookPageLegacy.js", "Zentrales Thema: „Mein Lieblingssport“"],
  ])("%s keeps its complete speaking task in one mind map", (file, removedDuplicateHeading) => {
    const page = read(file);
    expect((page.match(/<SpeakingMindMap /g) || [])).toHaveLength(1);
    expect(page).toContain("The mind map contains the complete task");
    expect(page).not.toContain(removedDuplicateHeading);
    expect(page).not.toContain("Sprechen wie bei einer Mini-Präsentation");
  });

  test.each([
    ["A2Day12MeinTraumberufWorkbookPageLegacy.js", "Fragen, ob es noch offene Stellen in der Firma gibt.", "Ihre Fähigkeiten und Fertigkeiten beschreiben"],
    ["A2Day14BerufUndKarriereWorkbookPage.js", "Bedanken Sie sich für den Vorschlag.", "Fragen Sie nach weiteren Details: Inhalt, Termine und Kosten."],
    ["A2Day15MeinLieblingssportWorkbookPageLegacy.js", "Fragen, ob es noch freie Plätze im Sportkurs gibt.", "Nach Trainingszeiten und Kosten fragen."],
    ["A2Day16WohlbefindenUndEntspannungWorkbookPage.js", "Fragen Sie nach einem Termin", "Fragen Sie nach den Kosten oder ob Ihre Versicherung die Behandlung abdeckt."],
  ])("%s keeps a clear Teil 2 situation with visible bullet points", (file, firstBullet, secondBullet) => {
    const source = read(file);
    expect(source).toContain(firstBullet);
    expect(source).toContain(secondBullet);
  });
});
