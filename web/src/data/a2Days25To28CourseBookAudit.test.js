import fs from "fs";
import path from "path";
import { getA2GrammarRoute } from "./a2GrammarRoutes";

const componentRoot = path.resolve(__dirname, "../components");
const readComponent = (fileName) => fs.readFileSync(path.join(componentRoot, fileName), "utf8");

describe("A2 Course Book final audit · Days 25–28", () => {
  test("keeps late-A2 workbooks on their canonical chapters", () => {
    const expectations = [
      ["A2Day25TagesablaufWorkbookPage.js", 25, "9.25"],
      ["A2Day26GefuehleInVerschiedenenSituationenWorkbookPage.js", 26, "10.26"],
      ["A2Day27DigitaleKommunikationWorkbookPage.js", 27, "10.27"],
      ["A2Day28UeberDieZukunftSprechenWorkbookPage.js", 28, "10.28"],
    ];

    expectations.forEach(([fileName, day, chapter]) => {
      const source = readComponent(fileName);
      expect(source).toContain("A2StandardTabbedWorkbookPage");
      expect(source).toContain(`day={${day}}`);
      expect(source).toContain(`chapter=\"${chapter}\"`);
    });
  });

  test("restores Day 25 Hören and removes unrelated Swiss-hotel reading", () => {
    const source = readComponent("A2Day25TagesablaufWorkbookPage.js");
    expect(source).toContain("Annas Tagesablauf");
    expect(source).toContain("m7nP2qE9gNg");
    expect(source).not.toMatch(/Familie Meyer|Berghotel|Schweiz aus dem Zug/i);
    expect(source).not.toContain("There is no Hören assignment");
  });

  test("keeps Day 26 fully focused on feelings", () => {
    const source = readComponent("A2Day26GefuehleInVerschiedenenSituationenWorkbookPage.js");
    expect(source).toContain("Gefühle im Alltag");
    expect(source).toContain("9OVfA1B-nuU");
    expect(source).not.toMatch(/Schwangerschaft|Mutterschutz|Elterngeld|Kinderarzt/i);
  });

  test("preserves the already-clean Day 27 digital communication workbook", () => {
    const source = readComponent("A2Day27DigitaleKommunikationWorkbookPage.js");
    expect(source).toContain("Digitale Kommunikation");
    expect(source).toContain("Telefonieren und Internet in Deutschland");
    expect(source).toContain("A2Days26To28LearningUpgrade");
  });

  test("moves Day 28 to the standard shell with future-focused reading and grammar", () => {
    const source = readComponent("A2Day28UeberDieZukunftSprechenWorkbookPage.js");
    expect(source).toContain("Meine Pläne für die nächsten Jahre");
    expect(source).toContain("Teuu287XY_M");
    expect(source).not.toMatch(/Pass und Visum|Ausländerbehörde|Aufenthaltstitel/i);

    const grammarRoute = getA2GrammarRoute({ day: 28, chapter: "10.28" });
    expect(grammarRoute).toMatch(/^\/campus\/course\//);
    expect(grammarRoute).not.toMatch(/drive\.google\.com|docs\.google\.com/i);
  });

  test("keeps late-A2 shared thinking support available for Days 25–28", () => {
    const grammarSource = readComponent("A2B1WorkbookGrammarNotesContent.js");
    expect(grammarSource).toContain("numericDay >= 22 && numericDay <= 28");
    expect(grammarSource).toContain("A2Days22To28ThinkingFirstGrammarGuide");
    expect(grammarSource).toContain("A2TopicCollocationPractice");
  });
});
