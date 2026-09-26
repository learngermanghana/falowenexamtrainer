import fs from "fs";
import path from "path";
import { getA2GrammarRoute } from "./a2GrammarRoutes";
import { A2_LISTENING_MODES, A2_LISTENING_TASKS } from "./a2ListeningTasks";

const componentRoot = path.resolve(__dirname, "../components");
const readComponent = (fileName) => fs.readFileSync(path.join(componentRoot, fileName), "utf8");

const batchChapters = Object.freeze({
  13: "5.13",
  14: "5.14",
  15: "6.15",
  16: "6.16",
  17: "6.17",
  18: "7.18",
});

describe("A2 Course Book continuation audit · Days 13–18", () => {
  test("keeps every Day 13–18 grammar destination inside Falowen", () => {
    Object.entries(batchChapters).forEach(([dayKey, chapter]) => {
      const route = getA2GrammarRoute({ day: Number(dayKey), chapter });
      expect(route).toMatch(/^\/campus\/course\//);
      expect(route).not.toMatch(/drive\.google\.com|docs\.google\.com/i);
    });
  });

  test("keeps Day 13 focused on Vorstellungsgespräch through the shared shell", () => {
    const source = readComponent("A2Day13VorstellungsgespraechWorkbookPage.js");

    expect(source).toContain("A2StandardTabbedWorkbookPage");
    expect(source).toContain("day={13}");
    expect(source).toContain('chapter="5.13"');
    expect(source).toContain('title="Ein Vorstellungsgespräch"');
    expect(A2_LISTENING_TASKS[13].audioUrl).toBe("https://youtu.be/kr9Rj2j-ghw");
    expect(source).not.toMatch(/patchReadingContent|WorkbookPageLegacy|MutationObserver/);
  });

  test("keeps Day 14 on the shared shell and intentionally without Hören", () => {
    const source = readComponent("A2Day14BerufUndKarriereWorkbookPage.js");

    expect(source).toContain("A2StandardTabbedWorkbookPage");
    expect(source).toContain("day={14}");
    expect(source).toContain('chapter="5.14"');
    expect(source).toContain('workbookId="A2Day14BerufUndKarriere"');
    expect(A2_LISTENING_TASKS[14].mode).toBe(A2_LISTENING_MODES.NONE);
  });

  test("moves Day 15 onto the standard shell with canonical chapter 6.15", () => {
    const source = readComponent("A2Day15MeinLieblingssportWorkbookPage.js");

    expect(source).toContain("A2StandardTabbedWorkbookPage");
    expect(source).toContain("day={15}");
    expect(source).toContain('chapter="6.15"');
    expect(source).not.toContain("A2Day15MeinLieblingssportWorkbookPageLegacy");
    expect(source).not.toContain("A2-5.15");
  });

  test("keeps Day 16 on the standard shell with reflexive-verb grammar ownership", () => {
    const source = readComponent("A2Day16WohlbefindenUndEntspannungWorkbookPage.js");

    expect(source).toContain("A2StandardTabbedWorkbookPage");
    expect(source).toContain("day={16}");
    expect(source).toContain('chapter="6.16"');
  });

  test("keeps Day 17 on the normal shared workbook opening flow", () => {
    const source = readComponent("A2Day17InDieApothekeGehenWorkbookPage.js");
    const shared = readComponent("A2StandardTabbedWorkbookPage.js");

    expect(source).toContain("A2StandardTabbedWorkbookPage");
    expect(source).toContain("day={17}");
    expect(source).toContain('chapter="6.17"');
    expect(source).not.toContain("openGrammarAfterRadio");
    expect(shared).toContain('useState("sprechen")');
    expect(shared).not.toContain("radioCompleted");
  });

  test("keeps Day 18 on the standard shell with canonical chapter 7.18", () => {
    const source = readComponent("A2Day18DieBankAnrufenWorkbookPage.js");

    expect(source).toContain("A2StandardTabbedWorkbookPage");
    expect(source).toContain("day={18}");
    expect(source).toContain('chapter="7.18"');
  });
});
