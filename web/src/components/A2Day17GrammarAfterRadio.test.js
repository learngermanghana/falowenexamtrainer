import fs from "fs";
import path from "path";
import { getA2B1GrammarNotesComponent } from "./A2B1WorkbookGrammarNotesContent";
import A2Day17InDieApothekeModalverbenFragenGrammarPage from "./A2Day17InDieApothekeModalverbenFragenGrammarPage";
import { getWorkbookTabsWithLegacyGrammar } from "./StandardWorkbookComponents";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("A2 Day 17 grammar after Falowen Radio", () => {
  test("Day 17 workbook exposes Grammar before the standard workbook sections", () => {
    const result = getWorkbookTabsWithLegacyGrammar({
      ariaLabel: "A2 Day 17 workbook sections",
    });

    expect(result.tabs[0]?.key).toBe("grammar");
    expect(result.integratesLegacyGrammar).toBe(true);
  });

  test("Day 17 resolves to the improved pharmacy modal-verb grammar page", () => {
    expect(getA2B1GrammarNotesComponent("A2", 17)).toBe(
      A2Day17InDieApothekeModalverbenFragenGrammarPage,
    );
  });

  test("radio-complete workbook opens Grammar first instead of hiding the updated notes in Teil 1", () => {
    const source = read("A2Day17InDieApothekeGehenWorkbookPage.js");
    expect(source).toContain('get("radio") === "done"');
    expect(source).toContain('useState(() => (radioCompleted ? "grammar" : "sprechen"))');
    expect(source).toContain('if (radioCompleted) setActiveTab("grammar")');
    expect(source).toContain("Falowen Radio complete — start with the Grammar notes");
  });
});
