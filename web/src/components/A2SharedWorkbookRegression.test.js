import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

const standardShell = read("A2StandardTabbedWorkbookPage.js");
const day16 = read("A2Day16WohlbefindenUndEntspannungWorkbookPage.js");
const day18 = read("A2Day18DieBankAnrufenWorkbookPage.js");
const day19 = read("A2Day19EinkaufenWoUndWieWorkbookPage.js");
const day20 = read("A2Day20TypischeReklamationssituationenWorkbookPage.js");
const day21 = read("A2Day21EinWochenendePlanenWorkbookPage.js");
const day26 = read("A2Day26GefuehleInVerschiedenenSituationenWorkbookPage.js");
const routeServices = read("RouteScopedAppServices.js");

describe("shared A2 workbook regression", () => {
  it("keeps affected A2 days on the shared workbook shell from 8dfa9f7", () => {
    [day16, day18, day19, day20, day21].forEach((source) => {
      expect(source).toContain("A2StandardTabbedWorkbookPage");
      expect(source).not.toContain("useNavigate");
    });
  });

  it("keeps the shared Teil 1 speaking experience", () => {
    expect(standardShell).toContain("SpeakingMindMap");
    expect(standardShell).toContain("SpeakingPracticeTimerCard");
    expect(standardShell).toContain('<CourseInlinePracticePanel type="speaking" />');
    expect(standardShell).toContain('activeTab === "sprechen"');
    expect(day26).toContain("SpeakingMindMap");
    expect(day26).toContain('type="speaking"');
  });

  it("keeps Ref and Submit in the shared A2 shell", () => {
    expect(standardShell).toContain("STANDARD_WORKBOOK_TABS");
    expect(standardShell).toContain('activeTab === "references"');
    expect(standardShell).toContain('activeTab === "submit"');
    expect(standardShell).toContain("WorkbookReferenceAnswers");
    expect(standardShell).toContain("ContextualAssignmentSubmissionPage");
  });

  it("keeps lesson-specific content and the approved YouTube Hören source", () => {
    expect(day16).toContain('title="Wohlbefinden und Entspannung"');
    expect(day18).toContain('hoerenAudioUrl="https://youtu.be/cHKVQOLWv7c"');
    expect(day19).toContain('title="Einkaufen? Wo und wie?"');
    expect(day19).toContain("Wo kaufst du lieber ein: online, im Supermarkt oder auf dem Markt?");
    expect(day20).toContain('title="Typische Reklamationssituationen üben"');
    expect(day21).toContain('title="Ein Wochenende planen"');
  });

  it("does not remount the rejected legacy A2 completion injector", () => {
    expect(routeServices).not.toContain("A2LegacyWorkbookCompletionTabs");
  });
});
