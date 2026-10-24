import fs from "fs";
import path from "path";

const read = (file) => fs.readFileSync(path.join(__dirname, file), "utf8");

describe("A2 Days 6-10 learning upgrade", () => {
  test("Days 6-9 keep guided clickable learning block content", () => {
    const guide = read("A2Days6To9LearningGuide.jsx");
    expect(guide).toContain("Wo? oder Wohin? bei Möbeln und Räumen");
    expect(guide).toContain("Relativsätze: die Wohnung genauer beschreiben");
    expect(guide).toContain("Imperativ: ein Rezept Schritt für Schritt erklären");
    expect(guide).toContain("Perfekt: über den letzten Urlaub sprechen");
    expect((guide.match(/questions:/g) || []).length).toBe(4);
    expect(guide).toContain("answer:");
    expect(guide).toContain("explanation:");
  });

  test("standard workbook exposes the speaking mini-guide only on Days 6-8", () => {
    const page = read("A2StandardTabbedWorkbookPage.js");
    expect(page).toContain("A2Days6To9LearningGuide");
    expect(page).toContain("Number(day) >= 6 && Number(day) <= 8");
    expect(page).not.toContain("Number(day) >= 6 && Number(day) <= 9");
  });

  test("Day 9 Perfekt remains available in the Grammar tab", () => {
    const grammar = read("A2B1WorkbookGrammarNotes.js");
    expect(grammar).toContain("9: A2Day9PerfektGrammarPage");
  });

  test("Day 10 keeps a concise Präteritum lesson with clickable checks", () => {
    const page = read("A2Day10PraeteritumGrammarPage.js");
    expect(page).toContain("Grammar focus: Präteritum");
    expect(page).toContain("Letztes Jahr war ich in München.");
    expect(page).toContain("Wir hatten viel Zeit für das Fest.");
    expect(page).toContain("gehen ist unregelmäßig: ging");
    expect(page).toContain("A2MiniLearningBlock");
  });
});
