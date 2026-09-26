import fs from "fs";
import path from "path";
import { getA2B1GrammarNotesComponent } from "./A2B1WorkbookGrammarNotesContent";
import A2Day17InDieApothekeModalverbenFragenGrammarPage from "./A2Day17InDieApothekeModalverbenFragenGrammarPage";
import { getWorkbookTabsWithLegacyGrammar } from "./StandardWorkbookComponents";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("A2 Day 17 standard workbook flow", () => {
  test("Day 17 still exposes the shared Grammar tab", () => {
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

  test("Day 17 opens like every normal A2 workbook even after radio completion", () => {
    const day17 = read("A2Day17InDieApothekeGehenWorkbookPage.js");
    const shared = read("A2StandardTabbedWorkbookPage.js");

    expect(day17).toContain("A2StandardTabbedWorkbookPage");
    expect(day17).not.toContain("openGrammarAfterRadio");
    expect(shared).toContain('useState("sprechen")');
    expect(shared).not.toContain('get("radio") === "done"');
    expect(shared).not.toContain("radioCompleted");
  });
});
