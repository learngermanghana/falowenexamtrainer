import fs from "fs";
import path from "path";
import { resolveA2B1WorkbookDayFromLocation } from "./A2B1WorkbookGuidance";
import A2StarterConjunctionsPage from "./A2StarterConjunctionsPage";
import { getA2B1GrammarNotesComponent } from "./A2B1WorkbookGrammarNotes";
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

  it("only shows Grammar when that workbook day has grammar notes", () => {
    [
      ["A2 Day 25 workbook sections", "A2"],
      ["A2 Day 26 workbook sections", "A2"],
      ["A2 Day 27 workbook sections", "A2"],
      ["B1 Day 17 workbook sections", "B1"],
      ["B1 Day 20 workbook sections", "B1"],
    ].forEach(([ariaLabel]) => {
      const resolved = getWorkbookTabsWithLegacyGrammar({
        tabs: A2_B1_WORKBOOK_TABS_WITH_GRAMMAR,
        ariaLabel,
      });

      expect(resolved.tabs.map((tab) => tab.key)).not.toContain("grammar");
    });

    expect(getWorkbookTabsWithLegacyGrammar({
      tabs: STANDARD_WORKBOOK_TABS,
      ariaLabel: "A2 Day 28 workbook sections",
    }).tabs[0].key).toBe("grammar");
  });

  it("resolves workbook days from both legacy A2 slugs and B1 lesson routes", () => {
    expect(
      resolveA2B1WorkbookDayFromLocation(
        "A2",
        "/campus/course/a2-day-10-tourismus-und-traditionelle-feste-workbook",
      ),
    ).toBe(10);
    expect(resolveA2B1WorkbookDayFromLocation("B1", "/campus/course/lesson/B1/8?view=workbook")).toBe(8);
  });

  it("connects the Small Talk workbook to its already-created A2 Day 1 grammar notes", () => {
    const smallTalkWorkbook = read("A2Day2SmallTalkWorkbookEnhancedPage.js");
    const existingGrammarPage = read("A2StarterConjunctionsPage.js");

    expect(smallTalkWorkbook).toContain("day={1}");
    expect(smallTalkWorkbook).toContain('chapter="1.1"');
    expect(smallTalkWorkbook).toContain('workbookId="A2Day1SmallTalk"');
    expect(smallTalkWorkbook).toContain('<RadioFirstWorkbookGate level="A2" day={1}>');

    expect(existingGrammarPage).toContain("Topic: Small talk • Day 1 • Chapter 1.1");
    expect(existingGrammarPage).toContain("A2 Starter Grammar Note: weil, deshalb, denn");
    expect(getA2B1GrammarNotesComponent("A2", 1)).toBe(A2StarterConjunctionsPage);
    expect(getA2B1GrammarNotesComponent("A2", 2)).not.toBe(A2StarterConjunctionsPage);
  });

  it("explains that Personen beschreiben Teil 1 prepares the Teil 2 letter", () => {
    const source = read("A2Day2PersonenBeschreibenWorkbookPage.js");

    expect(source).toContain('eyebrow="Teil 1 · Practice and class discussion"');
    expect(source).toContain("Teil 1 is for speaking practice and class discussion.");
    expect(source).toContain("Then use the ideas and vocabulary from this discussion in Teil 2 to write the letter about your boss.");
    expect(source).not.toContain("invite you to write a brief essay about yourself");
    expect(source).not.toContain("In this chapter, we’ll engage in group exercises discussing these topics");
  });

  it("keeps the forced A2 fallback on the same Grammar-first shared tab contract", () => {
    const guidance = read("A2B1WorkbookGuidance.js");
    const day10 = read("A2Day10TourismusTraditionelleFesteWorkbookPage.js");

    expect(guidance).toContain('{ key: "grammar", legacyKey: "grammar"');
    expect(guidance).toContain('useState("sprechen")');
    expect(guidance).toContain('`A2 Day ${workbookDay} workbook sections`');
    expect(guidance).toContain("Grammar, Teil 1, Teil 2, Teil 3, Teil 4, Ref and Submit");
    expect(day10).toContain("<A2B1WorkbookGuidance />");
  });

  it("keeps A2 Day 23 on native shared tabs so Teil 2 and Teil 3 open directly", () => {
    const source = read("A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage.js");
    const legacyWrapper = read("A2LegacyStandardWorkbookNavigation.js");

    expect(source).toContain("A2_B1_WORKBOOK_TABS_WITH_GRAMMAR");
    expect(source).toContain('useState("grammar")');
    expect(source).toContain('ariaLabel="A2 Day 23 workbook sections"');
    expect(source).toContain('activeTab === "schreiben"');
    expect(source).toContain('activeTab === "lesen"');
    expect(source).toContain('activeTab === "references"');
    expect(source).toContain('activeTab === "submit"');
    expect(source).not.toContain('activeTab === "teil2"');
    expect(source).not.toContain('activeTab === "teil3"');
    expect(legacyWrapper).toContain("const isNativeDay23 = normalizedPath === A2_DAY23_PATH");
    expect(legacyWrapper).toContain("A2_LEGACY_STANDARD_NAV_PATHS.has(normalizedPath) && !isNativeDay23");
    expect(legacyWrapper).toContain("!isNativeDay23 &&");
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
