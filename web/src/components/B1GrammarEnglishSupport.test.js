import fs from "fs";
import path from "path";
import { getB1GrammarEnglishSupport } from "./B1GrammarEnglishSupport";

const B1_GRAMMAR_NOTE_FILES = [
  "B1Day1TraumweltGrammarNotesPage.js",
  "B1Day2FreundeFuersLebenGrammarNotesPage.js",
  "B1Day3ErfolgsgeschichtenGrammarNotesPage.js",
  "B1Day4WohnungSuchenGrammarNotesPage.js",
  "B1Day5BesichtigungsterminGrammarNotesPage.js",
  "B1Day6StadtOderLandGrammarNotesPage.js",
  "B1Day7FastFoodHausmannskostGrammarNotesPage.js",
  "B1Day8AllesFuerDieGesundheitGrammarNotesPage.js",
  "B1Day9WorkLifeBalanceGrammarNotesPage.js",
  "B1Day10DigitaleAuszeitGrammarNotesPage.js",
  "B1Day11TeamspieleGrammarNotesPage.js",
  "B1Day12AbenteuerInDerNaturGrammarNotesPage.js",
  "B1Day13EigeneFilmkritikGrammarNotesPage.js",
  "B1Day14TraditionellesDigitalesLernenGrammarNotesPage.js",
  "B1Day15MedienHomeofficeGrammarNotesPage.js",
  "B1Day16PruefungsangstStressbewaeltigungGrammarNotesPage.js",
  "B1Day17WieLerntManAmBestenGrammarNotesPage.js",
  "B1Day18WegeZumWunschberufGrammarNotesPage.js",
  "B1Day19VorstellungsgespraechGrammarNotesPage.js",
  "B1Day20BerufKennenGrammarNotesPage.js",
  "B1Day21LebensformenHeuteGrammarNotesPage.js",
  "B1Day22BeziehungWichtigGrammarNotesPage.js",
  "B1Day23ErstesDateGrammarNotesPage.js",
  "B1Day24KonsumNachhaltigkeitGrammarNotesPage.js",
  "B1Day25OnlineShoppingRightsRisksGrammarNotesPage.js",
  "B1Day26ReiseproblemeGrammarNotesPage.js",
  "B1Day27UmweltfreundlichAlltagGrammarNotesPage.js",
  "B1Day28KlimafreundlichLebenGrammarNotesPage.js",
];

describe("B1 grammar English support", () => {
  test("covers every B1 grammar-note day from 1 to 28 with substantial support", () => {
    for (let day = 1; day <= 28; day += 1) {
      const support = getB1GrammarEnglishSupport(day);
      expect(support).toBeTruthy();
      expect(support.terms.length).toBeGreaterThan(10);
      expect(support.rule.length).toBeGreaterThan(30);
      expect(support.structure.length).toBeGreaterThan(25);
      expect(support.use.length).toBeGreaterThan(25);
      expect(support.watchOut.length).toBeGreaterThan(25);
      expect(support.example.length).toBeGreaterThan(10);
    }
  });


  test("Day 15 explains the passive clearly in English", () => {
    const day15 = getB1GrammarEnglishSupport(15);
    expect(day15.terms).toContain("Passiv");
    expect(day15.rule).toContain("modal verb");
    expect(day15.structure).toContain("müssen geschützt werden");
    expect(day15.use).toContain("processes");
    expect(day15.watchOut).toContain("müssen werden geschützt");
  });

  test("renders the support inside every B1 grammar page so workbook and standalone routes both show it", () => {
    B1_GRAMMAR_NOTE_FILES.forEach((fileName, index) => {
      const source = fs.readFileSync(path.resolve(__dirname, fileName), "utf8");
      const day = index + 1;
      expect(source).toContain('import B1GrammarEnglishSupport from "./B1GrammarEnglishSupport"');
      expect(source).toContain(`<B1GrammarEnglishSupport day={${day}} />`);
    });
  });

  test("the workbook wrapper does not duplicate the per-page English support", () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, "A2B1WorkbookGrammarNotesContent.js"),
      "utf8",
    );
    expect(source).not.toContain("<B1GrammarEnglishSupport");
  });

  test("the support is visually obvious and broken into learner-friendly English sections", () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, "B1GrammarEnglishSupport.js"),
      "utf8",
    );
    expect(source).toContain("English support · Read this before the German grammar notes");
    expect(source).toContain("What the rule means");
    expect(source).toContain("Sentence structure");
    expect(source).toContain("When to use it");
    expect(source).toContain("Common mistake to avoid");
  });
});
