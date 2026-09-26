import fs from "fs";
import path from "path";
import { getA2GrammarRoute } from "./a2GrammarRoutes";
import { A2_READING_TASKS } from "./a2ReadingTasks";
import { A2_LISTENING_MODES, A2_LISTENING_TASKS } from "./a2ListeningTasks";

const componentRoot = path.resolve(__dirname, "../components");
const readComponent = (fileName) => fs.readFileSync(path.join(componentRoot, fileName), "utf8");

const batchChapters = Object.freeze({
  19: "7.19",
  20: "7.20",
  21: "8.21",
  22: "8.22",
  23: "9.23",
  24: "9.24",
});

describe("A2 Course Book continuation audit · Days 19–24", () => {
  test("keeps every Day 19–24 grammar destination inside Falowen", () => {
    Object.entries(batchChapters).forEach(([dayKey, chapter]) => {
      const route = getA2GrammarRoute({ day: Number(dayKey), chapter });
      expect(route).toMatch(/^\/campus\/course\//);
      expect(route).not.toMatch(/drive\.google\.com|docs\.google\.com/i);
    });
  });

  test("keeps Day 19 on the standard shell with canonical chapter 7.19", () => {
    const source = readComponent("A2Day19EinkaufenWoUndWieWorkbookPage.js");
    expect(source).toContain("A2StandardTabbedWorkbookPage");
    expect(source).toContain("day={19}");
    expect(source).toContain('chapter="7.19"');
  });

  test("keeps Day 20 complaint content coherent and Radio-first", () => {
    const source = readComponent("A2Day20TypischeReklamationssituationenWorkbookPage.js");
    expect(source).toContain("A2StandardTabbedWorkbookPage");
    expect(source).toContain('chapter="7.20"');
    expect(source).toContain('<RadioFirstWorkbookGate level="A2" day={20}>');
    expect(A2_READING_TASKS[20].title).toBe("Der neue Wasserkocher funktioniert nicht");
    expect(source).not.toMatch(/Frauensachen|Berufswahl|vor 50 Jahren/i);
  });

  test("keeps Day 21 fully focused on weekend planning with a separate Teil 4 Hören", () => {
    const source = readComponent("A2Day21EinWochenendePlanenWorkbookPage.js");
    expect(source).toContain("A2StandardTabbedWorkbookPage");
    expect(source).toContain('chapter="8.21"');
    expect(A2_READING_TASKS[21].title).toBe("Unser Wochenende in Köln");
    expect(A2_LISTENING_TASKS[21].audioUrl).toBe("https://youtu.be/Qg0tQFveI0M");
    expect(A2_LISTENING_TASKS[21].mode).toBe(A2_LISTENING_MODES.SELF_CHECK);
    expect(A2_LISTENING_TASKS[21].audioUrl).not.toContain("LlXsNA1a8lc");
    expect(source).not.toMatch(/TV-Koch|Stefan Berger|Bremer Lokal/i);
  });

  test("keeps Day 22 on weekly planning with the shared Submit flow", () => {
    const source = readComponent("A2Day22DieWochePlanungWorkbookPage.js");
    expect(source).toContain("A2StandardTabbedWorkbookPage");
    expect(source).toContain('chapter="8.22"');
    expect(A2_READING_TASKS[22].title).toBe("Eine volle Woche");
    expect(source).not.toMatch(/Gülcan|Willkommensführung|Literaturkurs/i);
    expect(source).not.toContain("Go to Submission Area");
  });

  test("fixes Day 23 tab ownership by using the standard workbook shell", () => {
    const source = readComponent("A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage.js");
    expect(source).toContain("A2StandardTabbedWorkbookPage");
    expect(source).toContain('chapter="9.23"');
    expect(A2_READING_TASKS[23].title).toBe("Drei Wege zur Arbeit");
    expect(source).toContain('ariaLabel="A2 Day 23 workbook sections"');
    expect(source).toContain('data-a2-day23-native-guidance="true"');
    expect(A2_LISTENING_TASKS[23].audioUrl).toBe("https://youtu.be/6DA1dYfqEZo?list=PLg78ckjpHfZzy9rvr_CmY73BLJiPTiaXL");
    expect(A2_LISTENING_TASKS[23].mode).toBe(A2_LISTENING_MODES.SELF_CHECK);
    expect(A2_LISTENING_TASKS[23].questions).toHaveLength(0);
    expect(source).not.toMatch(/key:\s*"teil[1-4]"/i);
  });

  test("keeps Day 24 reading and submission focused on vacation planning", () => {
    const source = readComponent("A2Day24EinenUrlaubPlanenWorkbookPage.js");
    expect(source).toContain("A2StandardTabbedWorkbookPage");
    expect(source).toContain('chapter="9.24"');
    expect(A2_READING_TASKS[24].title).toBe("Welches Angebot passt?");
    expect(source).not.toMatch(/Park-Café|Kindergeburtstag|Weinhaus/i);
    expect(source).not.toContain("Go to submission area");
  });
});
