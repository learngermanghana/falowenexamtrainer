import fs from "fs";
import path from "path";

const source = fs.readFileSync(
  path.resolve(__dirname, "A2Day20TypischeReklamationssituationenHoeflicheBittenUndBegruendungenGrammarPage.js"),
  "utf8",
);
const workbook = fs.readFileSync(
  path.resolve(__dirname, "A2Day20TypischeReklamationssituationenWorkbookPage.js"),
  "utf8",
);

describe("A2 Day 20 complaint grammar notes with English translations", () => {
  test("retains its workbook and knowledge test without replacing the learner's exercises", () => {
    expect(workbook).toContain("A2StandardTabbedWorkbookPage");
    expect(workbook).toContain('day={20}');
    expect(workbook).toContain('chapter="7.20"');
    expect(source).toContain("Knowledge Test · Reklamieren");
    expect(source).toContain("outputPrompt=");
    expect(source).toContain("A2MiniLearningBlock");
    expect(source).toContain("AppBackButton");
  });

  test("explains each step of a polite complaint with line-by-line English meaning", () => {
    expect(source).toContain("Eine Reklamation in vier Schritten");
    expect(source).toContain("Produkt und Kauf");
    expect(source).toContain("Höfliche Bitte");
    expect(source).toContain("A useful complaint has four parts");
    expect(source).toContain("I bought this jacket yesterday.");
    expect(source).toContain("Unfortunately, the zip is broken.");
    expect(source).toContain("Could you please give me another jacket?");
  });

  test("contrasts weil verb-final with denn subject + verb using translated examples", () => {
    expect(source).toContain("weil oder denn? Die Wortstellung");
    expect(source).toContain("conjugated verb at the end");
    expect(source).toContain("normal statement order");
    expect(source).toContain("weil sie zu klein ist");
    expect(source).toContain("denn sie ist zu klein");
    expect(source).toContain("weil ich das Gerät nicht benutzen kann");
    expect(source).toContain("denn ich kann das Gerät nicht benutzen");
  });

  test("teaches polite requests, consumer vocabulary, model dialogue and formal writing", () => {
    expect(source).toContain("Könnten Sie die Jacke bitte umtauschen?");
    expect(source).toContain("Would a repair be possible?");
    expect(source).toContain("to refund the money / the refund");
    expect(source).toContain("Haben Sie den Kassenbon dabei?");
    expect(source).toContain("Sehr geehrte Damen und Herren,");
    expect(source).toContain("Dear Sir or Madam,");
    expect(source).toContain("Mit freundlichen Grüßen");
    expect(source).toContain("Häufige Fehler korrigieren");
  });

  test("pairs German sample text with English, without duplicate generic grammar layers", () => {
    expect(source).toMatch(/<strong lang="de">\{de\}<\/strong>/);
    expect(source).toMatch(/<span lang="en" style=\{english\}>\{en\}<\/span>/);
    expect((source.match(/<Section title=/g) || []).length).toBe(7);
    expect((source.match(/<Example de=/g) || []).length).toBeGreaterThanOrEqual(25);
    expect(source).not.toContain("A2SecondStageGrammarUpgrade");
  });
});
