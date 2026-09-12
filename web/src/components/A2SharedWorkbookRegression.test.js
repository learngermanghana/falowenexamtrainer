import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

const standardShell = read("A2StandardTabbedWorkbookPage.js");
const day16 = read("A2Day16WohlbefindenUndEntspannungWorkbookPage.js");
const day18 = read("A2Day18DieBankAnrufenWorkbookPage.js");
const day19 = read("A2Day19EinkaufenWoUndWieWorkbookPage.js");
const day20 = read("A2Day20TypischeReklamationssituationenWorkbookPage.js");
const day21 = read("A2Day21EinWochenendePlanenWorkbookPage.js");
const day22 = read("A2Day22DieWochePlanungWorkbookPage.js");
const day23 = read("A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage.js");
const day24 = read("A2Day24EinenUrlaubPlanenWorkbookPage.js");
const day25 = read("A2Day25TagesablaufWorkbookPage.js");
const day26 = read("A2Day26GefuehleInVerschiedenenSituationenWorkbookPage.js");
const day27 = read("A2Day27DigitaleKommunikationWorkbookPage.js");
const day28 = read("A2Day28UeberDieZukunftSprechenWorkbookPage.js");

const cleanedLateA2Days = [day20, day21, day22, day23, day24, day25, day26, day27, day28];

describe("shared A2 workbook regression", () => {
  it("keeps the shared workbook shell complete", () => {
    expect(standardShell).toContain("A2_B1_WORKBOOK_TABS_WITH_GRAMMAR");
    expect(standardShell).toContain('activeTab === "grammar"');
    expect(standardShell).toContain('activeTab === "sprechen"');
    expect(standardShell).toContain('activeTab === "schreiben"');
    expect(standardShell).toContain('activeTab === "lesen"');
    expect(standardShell).toContain('activeTab === "hoeren"');
    expect(standardShell).toContain('activeTab === "references"');
    expect(standardShell).toContain('activeTab === "submit"');
    expect(standardShell).toContain("SpeakingMindMap");
    expect(standardShell).toContain("SpeakingPracticeTimerCard");
    expect(standardShell).toContain("WorkbookReferenceAnswers");
    expect(standardShell).toContain("ContextualAssignmentSubmissionPage");
  });

  it("keeps React-owned cleanup nodes connected when presentation hides them", () => {
    const oldFinalSubmission = document.createElement("div");
    document.body.appendChild(oldFinalSubmission);
    oldFinalSubmission.hidden = true;
    oldFinalSubmission.style.display = "none";
    expect(oldFinalSubmission.isConnected).toBe(true);
    expect(oldFinalSubmission.hidden).toBe(true);
    oldFinalSubmission.remove();
  });

  it("keeps the previously cleaned Days 16, 18 and 19 on the standard shell", () => {
    [day16, day18, day19].forEach((source) => {
      expect(source).toContain("A2StandardTabbedWorkbookPage");
      expect(source).not.toContain("useNavigate");
    });
  });

  it("uses the standard workbook shell throughout cleaned Days 20–28", () => {
    cleanedLateA2Days.forEach((source) => {
      expect(source).toContain("A2StandardTabbedWorkbookPage");
    });
  });

  it("keeps Day 20 Radio-first and complaint-specific", () => {
    expect(day20).toContain('<RadioFirstWorkbookGate level="A2" day={20}>');
    expect(day20).toContain('chapter="7.20"');
    expect(day20).toContain("Reklamation im Elektrogeschäft");
    expect(day20).toContain("https://youtu.be/pH1X3E7vOao");
    expect(day20).toContain("Warum bringt Laura den Wasserkocher zurück?");
    expect(day20).toContain("Was bittet Laura den Kundenservice zu schicken?");
    expect(day20).not.toMatch(/Frauensachen|Berufswahl|vor 50 Jahren/i);
    expect(day20).not.toMatch(/1BWtDeohvS8Qekv0ZLsexBxqNqFhlwtf3|1OfbZTKr9ePe5OqV9GNgE7D3tfoMAPOAD/);
  });

  it("keeps Day 21 weekend-focused while preserving its historical Teil 2 prompt", () => {
    expect(day21).toContain('title="Ein Wochenende planen"');
    expect(day21).toContain('chapter="8.21"');
    expect(day21).toContain("Unser Wochenende in Köln");
    expect(day21).toContain("Schreiben Sie einen Brief an einen Freund oder eine Freundin");
    expect(day21).toContain("Beschreiben Sie Ihre Wochenendpläne und erklären Sie, warum sie besonders sind");
    expect(day21).toContain("Erklären Sie, was die Person mitbringen sollte oder was sie erwarten kann");
    expect(day21).toContain("LlXsNA1a8lc");
    expect(day21).not.toMatch(/TV-Koch|Stefan Berger|Bremer Lokal/i);
  });

  it("keeps Day 22 focused on weekly planning with contextual Submit", () => {
    expect(day22).toContain('chapter="8.22"');
    expect(day22).toContain("Eine volle Woche");
    expect(day22).toContain("KR2oT-mujmI");
    expect(day22).not.toMatch(/Gülcan|Willkommensführung|Literaturkurs/i);
    expect(day22).not.toContain("Go to Submission Area");
  });

  it("keeps Day 23 commuting tabs and content coherent", () => {
    expect(day23).toContain('chapter="9.23"');
    expect(day23).toContain("Mein Arbeitsweg");
    expect(day23).toContain("LtARwiCljLY");
    expect(day23).not.toMatch(/key:\s*"teil[1-4]"/i);
  });

  it("keeps Day 24 focused on vacation planning", () => {
    expect(day24).toContain('chapter="9.24"');
    expect(day24).toContain("Urlaub in Salzburg");
    expect(day24).toContain("iPScKV6JWaA");
    expect(day24).not.toMatch(/Park-Café|Kindergeburtstag|Weinhaus/i);
  });

  it("keeps Day 25 aligned with canonical Lesen & Hören", () => {
    expect(day25).toContain('chapter="9.25"');
    expect(day25).toContain("Annas Tagesablauf");
    expect(day25).toContain("m7nP2qE9gNg");
    expect(day25).not.toMatch(/Familie Meyer|Berghotel|Schweiz aus dem Zug/i);
    expect(day25).not.toContain("There is no Hören assignment in this workbook");
  });

  it("keeps Day 26 focused on feelings", () => {
    expect(day26).toContain('chapter="10.26"');
    expect(day26).toContain("Gefühle im Alltag");
    expect(day26).toContain("9OVfA1B-nuU");
    expect(day26).toContain("A2Days26To28LearningUpgrade");
    expect(day26).toContain("SpeakingMindMap");
    expect(day26).not.toMatch(/Schwangerschaft|Mutterschutz|Elterngeld|Kinderarzt/i);
  });

  it("preserves the already-clean Day 27 digital communication lesson", () => {
    expect(day27).toContain('chapter="10.27"');
    expect(day27).toContain("Digitale Kommunikation");
    expect(day27).toContain("Telefonieren und Internet in Deutschland");
    expect(day27).toContain("A2Days26To28LearningUpgrade");
    expect(day27).toContain("JEJZypJfrD8");
  });

  it("keeps Day 28 future-focused with standard Grammar and Submit ownership", () => {
    expect(day28).toContain('chapter="10.28"');
    expect(day28).toContain("Meine Pläne für die nächsten Jahre");
    expect(day28).toContain("A2Days26To28LearningUpgrade");
    expect(day28).toContain("Teuu287XY_M");
    expect(day28).not.toMatch(/Pass und Visum|Ausländerbehörde|Aufenthaltstitel/i);
  });
});