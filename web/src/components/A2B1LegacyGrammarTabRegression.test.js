import fs from "fs";
import path from "path";
import { resolveA2B1WorkbookDayFromLocation } from "./A2B1WorkbookGuidance";
import A2StarterConjunctionsPage from "./A2StarterConjunctionsPage";
import { getA2B1GrammarNotesComponent } from "./A2B1WorkbookGrammarNotesContent";
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
      "A2 Day 25 workbook sections",
      "A2 Day 26 workbook sections",
      "A2 Day 27 workbook sections",
      "B1 Day 24 workbook sections",
    ].forEach((ariaLabel) => {
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

  it("keeps Personen beschreiben speaking practice separate from the Teil 2 boss letter", () => {
    const source = read("A2Day2PersonenBeschreibenWorkbookPage.js");

    expect(source).toContain('eyebrow="Group practice"');
    expect(source).toContain('title="Teil 1 · Sprechen"');
    expect(source).toContain('title="Brief an Felix: Mein Chef / Meine Chefin"');
    expect(source).toContain("Beschreibe das Aussehen deines Chefs / deiner Chefin.");
    expect(source).not.toContain("invite you to write a brief essay about yourself");
  });

  it("keeps A2 Days 10 and 11 on the standard isolated tab shell", () => {
    const day9 = read("A2Day9UrlaubWorkbookPage.js");
    const day10 = read("A2Day10TourismusTraditionelleFesteWorkbookPage.js");
    const day11 = read("A2Day11UnterwegsVerkehrsmittelWorkbookPage.js");
    const standard = read("A2StandardTabbedWorkbookPage.js");

    [day9, day10, day11].forEach((source) => expect(source).toContain("A2StandardTabbedWorkbookPage"));
    [day10, day11].forEach((source) => expect(source).toContain("showWorkbookGuidance={false}"));
    expect(standard).toContain('activeTab === "grammar"');
    expect(standard).toContain('activeTab === "sprechen"');
    expect(standard).toContain("showWorkbookGuidance ? <A2B1WorkbookGuidance /> : null");
    expect(day11).not.toContain('useState("sprechen")');
  });

  it("keeps A2 Days 12-16 grammar available without the old workbook guidance panel", () => {
    [12, 13, 14, 15, 16].forEach((day) => {
      expect(getA2B1GrammarNotesComponent("A2", day)).not.toBeNull();
    });

    const sources = [
      read("A2Day12MeinTraumberufWorkbookPageLegacy.js"),
      read("A2Day13VorstellungsgespraechWorkbookPageLegacy.js"),
      read("A2Day14BerufUndKarriereWorkbookPage.js"),
      read("A2Day15MeinLieblingssportWorkbookPageLegacy.js"),
      read("A2Day16WohlbefindenUndEntspannungWorkbookPage.js"),
    ];
    sources.forEach((source) => expect(source).not.toContain("<A2B1WorkbookGuidance"));
  });

  it("keeps late A2 grammar availability aligned with the shared registry", () => {
    [17, 18, 19, 20, 21, 22, 23, 24, 28].forEach((day) => {
      expect(getA2B1GrammarNotesComponent("A2", day)).not.toBeNull();
    });
    [25, 26, 27].forEach((day) => {
      expect(getA2B1GrammarNotesComponent("A2", day)).toBeNull();
    });

    expect(read("A2LegacyStandardWorkbookNavigationImpl.js")).toContain('return "grammar"');
  });

  it("keeps Day 10 grammar content separate from Teil 1 speaking content", () => {
    const day10 = read("A2Day10TourismusTraditionelleFesteWorkbookPage.js");
    const grammar = read("A2Day10PraeteritumGrammarPage.js");

    expect(day10).toContain('eyebrow="Group practice"');
    expect(day10).toContain('title="Teil 1 · Sprechen"');
    expect(grammar).toContain("Präteritum und Perfekt: Was ist der Unterschied?");
    expect(grammar).toContain("Regelmäßige Verben: Stamm + -te");
    expect(grammar).toContain("Die wichtigsten Formen: sein und haben");
    expect(grammar).not.toContain('title="Teil 1 · Sprechen"');
  });

  it("does not double-integrate grammar on newer A2/B1 workbook pages", () => {
    const resolved = getWorkbookTabsWithLegacyGrammar({
      tabs: A2_B1_WORKBOOK_TABS_WITH_GRAMMAR,
      ariaLabel: "B1 Day 8 workbook sections",
    });

    expect(resolved.integratesLegacyGrammar).toBe(false);
    expect(resolved.tabs).toEqual(A2_B1_WORKBOOK_TABS_WITH_GRAMMAR);
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
