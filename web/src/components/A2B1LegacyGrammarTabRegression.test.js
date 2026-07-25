import fs from "fs";
import path from "path";
import {
  A2_B1_WORKBOOK_TABS_WITH_GRAMMAR,
  STANDARD_WORKBOOK_TABS,
  getWorkbookTabsWithLegacyGrammar,
} from "./StandardWorkbookComponents";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

const expectedTabOrder = [
  "grammar",
  "sprechen",
  "schreiben",
  "lesen",
  "hoeren",
  "references",
  "submit",
];

describe("A2/B1 legacy workbook grammar-tab regression", () => {
  it("keeps Grammar first for legacy A2 and B1 workbook navigation", () => {
    ["A2 Day 22 workbook sections", "B1 Day 3 workbook sections"].forEach((ariaLabel) => {
      const resolved = getWorkbookTabsWithLegacyGrammar({
        tabs: STANDARD_WORKBOOK_TABS,
        ariaLabel,
      });

      expect(resolved.integratesLegacyGrammar).toBe(true);
      expect(resolved.tabs.map((tab) => tab.key)).toEqual(expectedTabOrder);
    });
  });

  it("does not double-integrate grammar on newer A2/B1 workbook pages", () => {
    const resolved = getWorkbookTabsWithLegacyGrammar({
      tabs: A2_B1_WORKBOOK_TABS_WITH_GRAMMAR,
      ariaLabel: "B1 Day 8 workbook sections",
    });

    expect(resolved.integratesLegacyGrammar).toBe(false);
    expect(resolved.tabs).toBe(A2_B1_WORKBOOK_TABS_WITH_GRAMMAR);
    expect(resolved.tabs.map((tab) => tab.key)).toEqual(expectedTabOrder);
  });

  it("keeps the legacy A2 adapter on the shared Grammar notes registry", () => {
    const source = read("A2LegacyStandardWorkbookNavigationImpl.js");

    expect(source).toContain('tabKey === "grammar"');
    expect(source).toContain('renderLegacyGrammarPanel={false}');
    expect(source).toContain('<A2B1GrammarNotesTab level="A2" day={config.day} />');
  });

  it("keeps B1 Day 3 Teil 4 on the requested Hören video only", () => {
    const source = read("B1Day3ErfolgsgeschichtenWorkbookPageLegacy.js");

    expect(source).toContain("https://youtu.be/h6-k4YGP3OU");
    expect(source).toContain("https://www.youtube.com/embed/h6-k4YGP3OU?rel=0");
    expect(source).not.toContain("bINimMVUjCc");
  });
});
