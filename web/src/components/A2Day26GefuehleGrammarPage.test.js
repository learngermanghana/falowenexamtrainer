import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("A2 Day 26 Gefuehle grammar notes", () => {
  const source = read("A2Day26GefuehleGrammarPage.js");

  test("teaches the complete reflexive pattern, weil/wenn meaning and verb position", () => {
    expect(source).toContain("ich <strong>fühle mich</strong>");
    expect(source).toContain("du <strong>fühlst dich</strong>");
    expect(source).toContain("wir <strong>fühlen uns</strong>");
    expect(source).toContain("ihr <strong>fühlt euch</strong>");
    expect(source).toContain("conjugated verb goes to the end");
    expect(source).toContain("direc"+"tly after the comma");
    expect(source).toContain("weil = why");
    expect(source).toContain("wenn = when/if");
    expect(source).toContain("Model answer");
    expect(source).toContain("Common mistakes");
  });

  test("shows focused checks instead of hiding the mini learning block", () => {
    expect(source).toContain("<A2MiniLearningBlock");
    expect(source).toContain("essential");
    expect(source).toContain('title="Kurz prüfen · Gefühle"');
    expect((source.match(/stem:/g) || []).length).toBe(3);
  });

  test("embeds into the existing Day 26 grammar tab without a duplicate back button", () => {
    const registry = read("A2B1WorkbookGrammarNotesContent.js");
    const workbook = read("A2Day26GefuehleInVerschiedenenSituationenWorkbookPage.js");
    expect(registry).toContain("26: A2Day26GefuehleGrammarPage");
    expect(registry).toContain("<GrammarNotes embedded />");
    expect(source).toContain("if (embedded) return <GrammarContent />");
    expect(workbook).toContain("A2StandardTabbedWorkbookPage");
    expect(workbook).toContain("day={26}");
  });
});
