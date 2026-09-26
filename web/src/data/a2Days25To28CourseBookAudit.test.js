import fs from "fs";
import path from "path";
import { getA2GrammarRoute } from "./a2GrammarRoutes";
import { A2_READING_TASKS } from "./a2ReadingTasks";
import { A2_LISTENING_MODES, A2_LISTENING_TASKS } from "./a2ListeningTasks";

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

  test("keeps Day 25 on canonical Lesen with no Hören assignment", () => {
    const source = readComponent("A2Day25TagesablaufWorkbookPage.js");
    expect(A2_READING_TASKS[25].title).toBe("Annas Arbeitstag");
    expect(A2_LISTENING_TASKS[25].mode).toBe(A2_LISTENING_MODES.NONE);
    expect(source).not.toMatch(/Familie Meyer|Berghotel|Schweiz aus dem Zug/i);
    expect(A2_LISTENING_TASKS[25].audioUrl).toBe("");
  });

  test("keeps Day 26 fully focused on feelings", () => {
    const source = readComponent("A2Day26GefuehleInVerschiedenenSituationenWorkbookPage.js");
    expect(A2_READING_TASKS[26].title).toBe("Ein Tag mit verschiedenen Gefühlen");
    expect(A2_LISTENING_TASKS[26].audioUrl).toContain("JEJZypJfrD8");
    expect(A2_LISTENING_TASKS[26].mode).toBe(A2_LISTENING_MODES.SELF_CHECK);
    expect(source).not.toMatch(/Schwangerschaft|Mutterschutz|Elterngeld|Kinderarzt/i);
  });

  test("preserves the already-clean Day 27 digital communication workbook", () => {
    const source = readComponent("A2Day27DigitaleKommunikationWorkbookPage.js");
    expect(source).toContain("Digitale Kommunikation");
    expect(A2_READING_TASKS[27].title).toBe("Sicher kommunizieren");
    expect(source).toContain("A2Days26To28LearningUpgrade");
  });

  test("moves Day 28 to the standard shell with future-focused reading and grammar", () => {
    const source = readComponent("A2Day28UeberDieZukunftSprechenWorkbookPage.js");
    expect(A2_READING_TASKS[28].title).toBe("Meine Pläne für die nächsten Jahre");
    expect(A2_LISTENING_TASKS[28].audioUrl).toContain("Teuu287XY_M");
    expect(A2_LISTENING_TASKS[28].mode).toBe(A2_LISTENING_MODES.GRADED);
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
