import fs from "fs";
import path from "path";

const componentRoot = path.resolve(__dirname, "../components");
const readComponent = (fileName) => fs.readFileSync(path.join(componentRoot, fileName), "utf8");

describe("A2 Course Book continuation audit · Days 13–18", () => {
  test("keeps Day 13 focused on Vorstellungsgespräch content", () => {
    const wrapper = readComponent("A2Day13VorstellungsgespraechWorkbookPage.js");

    expect(wrapper).toContain("patchReadingContent");
    expect(wrapper).toContain("Tipps für ein erfolgreiches Vorstellungsgespräch");
    expect(wrapper).toContain("Fragen Sie nach den Arbeitszeiten, den Aufgaben oder den Weiterbildungsmöglichkeiten.");
    expect(wrapper).not.toContain("Kinderbetreuung in Deutschland");
  });

  test("keeps Day 14 grammar and submission locked to 5.14", () => {
    const source = readComponent("A2Day14BerufUndKarriereWorkbookPage.js");

    expect(source).toContain('<A2B1GrammarNotesTab level="A2" day={14} />');
    expect(source).toContain('assignmentKey: "A2-5.14"');
    expect(source).toContain('canonicalAssignmentKey: "A2-5.14"');
  });

  test("moves Day 15 onto the standard shell with canonical chapter 6.15", () => {
    const source = readComponent("A2Day15MeinLieblingssportWorkbookPage.js");

    expect(source).toContain("A2StandardTabbedWorkbookPage");
    expect(source).toContain("day={15}");
    expect(source).toContain('chapter="6.15"');
    expect(source).not.toContain("A2Day15MeinLieblingssportWorkbookPageLegacy");
    expect(source).not.toContain("A2-5.15");
  });

  test("keeps Day 16 on the standard shell with reflexive-verb grammar ownership", () => {
    const source = readComponent("A2Day16WohlbefindenUndEntspannungWorkbookPage.js");

    expect(source).toContain("A2StandardTabbedWorkbookPage");
    expect(source).toContain("day={16}");
    expect(source).toContain('chapter="6.16"');
  });

  test("renders Day 17 grammar after Falowen Radio instead of a blank tab", () => {
    const source = readComponent("A2Day17InDieApothekeGehenWorkbookPage.js");

    expect(source).toContain('radioCompleted ? "grammar" : "sprechen"');
    expect(source).toContain('<A2B1GrammarNotesTab level="A2" day={17} />');
    expect(source).toContain('assignmentKey: "A2-6.17"');
    expect(source).toContain('canonicalAssignmentKey: "A2-6.17"');
  });

  test("keeps Day 18 on the standard shell with canonical chapter 7.18", () => {
    const source = readComponent("A2Day18DieBankAnrufenWorkbookPage.js");

    expect(source).toContain("A2StandardTabbedWorkbookPage");
    expect(source).toContain("day={18}");
    expect(source).toContain('chapter="7.18"');
  });
});
