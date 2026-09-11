import fs from "fs";
import path from "path";
import { getCanonicalA1TeacherVideoResource } from "../data/a1TeacherVideoResources";

const readComponent = (filename) =>
  fs.readFileSync(path.join(__dirname, filename), "utf8");

describe("A1 Course Book Day 2 through Day 7 audit guardrails", () => {
  test("Day 3 Kapitel 1.1 uses the canonical teacher lecture and teaches its declared focus", () => {
    const source = readComponent("A1Day3SchreibenSprechenKapitel11WorkbookPage.js");
    const teacher = getCanonicalA1TeacherVideoResource(3, "1.1");

    expect(teacher?.url).toBe("https://youtu.be/Ygbpt6yC_f4");
    expect(source).toContain("teacherVideo={A1_DAY3_KAPITEL_11_TEACHER_VIDEO}");
    expect(source).not.toContain("No teacher lecture is currently configured for this page");
    expect(source).toContain("Personal information");
    expect(source).toContain("Articles: der · die · das");
    expect(source).toContain("Simple adjectives");
    expect(source).toContain("W-questions");
  });

  test("Day 3 Kapitel 1.1 deliberately removes stale Day 1/Day 2 review blocks", () => {
    const source = readComponent("A1Day3SchreibenSprechenKapitel11WorkbookPage.js");

    expect(source).toContain('removeSectionByText(root, "h1, h2, h3, h4", "Spelling Practice")');
    expect(source).toContain('removeSectionByText(root, "h1, h2, h3, h4", "Basic Vocabulary for A1 German Class")');
  });

  test("Day 3 Kapitel 1.2 uses correct heißen spelling and the canonical workbook identity", () => {
    const source = readComponent("A1Day3PronounsIntroducingYourselfWorkbookPage.js");

    expect(source).toContain("Present-Tense Verb Conjugation Practice");
    expect(source).toContain("heißen");
    expect(source).not.toContain("heiBen");
  });

  test("Day 4 keeps one real two-part workbook structure and the canonical lesson identity", () => {
    const source = readComponent("A1Day4NumbersForBeginnersWorkbookPage.js");

    expect(source).toContain("A1 · Day 4 Workbook · Numbers, Phone Numbers and Addresses");
    expect(source).toContain("They all belong to this one Teil 2 section");
    expect(source).not.toContain("Teil 1: Zahlen erkennen und benennen");
  });

  test("Day 5 uses the canonical self-introduction identity and correct heißen spelling", () => {
    const source = readComponent("A1Day5IntroducingYourselfArticlesWorkbookPage.js");

    expect(source).toContain("Self-Introduction Practice with Articles");
    expect(source).toContain('"heiße, ich, Anna (Statement)"');
    expect(source).not.toContain('"heisse, ich, Anna (Statement)"');
  });

  test("Day 7 explains its review sections and models gern naturally", () => {
    const workbook = readComponent("A1Chapter3AskingAboutPricesWorkbookPage.js");
    const grammar = readComponent("A1Day7PricesPreferencesGrammarPage.js");

    expect(workbook).toContain("Teil 2 and Teil 3 deliberately review family and hobbies");
    expect(workbook).toContain("Ich lese gern Bücher.");
    expect(workbook).toContain("Sie malt gern.");
    expect(workbook).not.toContain("Ich mag Bücher lesen.");
    expect(workbook).not.toContain("Sie genießt Malen.");
    expect(grammar).toContain("Plural short answer:</strong> Sie kosten 10 Euro.");
  });
});
