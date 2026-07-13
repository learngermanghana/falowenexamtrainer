import fs from "fs";
import path from "path";
import { cleanA2GoetheListeningOnlyWorkbook } from "./a2GoetheListeningOnlyCleanup";

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
const legacyNavigation = read("A2LegacyStandardWorkbookNavigation.js");
const legacyNavigationImpl = read("A2LegacyStandardWorkbookNavigationImpl.js");
const routeServices = read("RouteScopedAppServices.js");

const countQuestions = (source) => (source.match(/\bstem\s*:/g) || []).length;

const legacyDays22To26 = [
  {
    day: 22,
    source: day22,
    route: "/campus/course/a2-day-22-die-woche-planung-workbook",
    marker: "Wochentage (Days of the Week)",
  },
  {
    day: 23,
    source: day23,
    route: "/campus/course/a2-day-23-wie-kommst-du-zur-schule-oder-zur-arbeit-workbook",
    marker: "Wie kommst du zur Schule oder zur Arbeit?",
  },
  {
    day: 24,
    source: day24,
    route: "/campus/course/a2-day-24-einen-urlaub-planen-workbook",
    marker: "Anzeigen (a–f)",
  },
  {
    day: 25,
    source: day25,
    route: "/campus/course/a2-day-25-tagesablauf-workbook",
    marker: "Ich bin Anna, 16 Jahre alt und Schülerin",
  },
  {
    day: 26,
    source: day26,
    route: "/campus/course/a2-day-26-gefuehle-in-verschiedenen-situationen-workbook",
    marker: "Gefühle in verschiedenen Situationen",
  },
];

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

  it("keeps the full Day 16 lesson content", () => {
    expect(day16).toContain('title="Wohlbefinden und Entspannung"');
    expect(day16).toContain("Körperliches Wohlbefinden");
    expect(day16).toContain("Mentales Wohlbefinden");
    expect(day16).toContain("Anzeige A: Yoga-Kurs für Anfänger");
    expect(day16).toContain("Anzeige F: Laufgruppe im Stadtpark");
    expect(day16).toContain("1xexwu1sM-Prp_2iyhBbY7UP-91gJ1S5G");
    expect(countQuestions(day16)).toBe(10);
  });

  it("keeps the full Day 19 lesson content", () => {
    expect(day19).toContain('title="Einkaufen? Wo und wie?"');
    expect(day19).toContain("Konsumverhalten");
    expect(day19).toContain("Einkaufsmöglichkeiten");
    expect(day19).toContain("Einladung zum Einkaufen");
    expect(day19).toContain("Konsumverhalten in der modernen Gesellschaft");
    expect(day19).toContain("1OsT5j6Y7a-rMdB0HlRJJ98gTgSvxm_LB");
    expect(countQuestions(day19)).toBe(12);
  });

  it("keeps the complete Day 21 lesson and original assignment identity", () => {
    expect(day21).toContain('title="Ein Wochenende planen"');
    expect(day21).toContain('chapter="8.21"');
    expect(day21).toContain("Hauptzweig 5: Ausdrücke und Fragen");
    expect(day21).toContain("Der TV-Koch Stefan Berger");
    expect(day21).toContain("Qg0tQFveI0M");
    expect(countQuestions(day21)).toBe(5);
  });

  it("keeps all original lesson content for Days 22 to 26", () => {
    legacyDays22To26.forEach(({ source, marker }) => {
      expect(source.length).toBeGreaterThan(5000);
      expect(source).not.toContain("A2StandardTabbedWorkbookPage");
      expect(source).toContain(marker);
      [1, 2, 3, 4].forEach((teil) => {
        expect(source).toMatch(new RegExp(`Teil\\s*${teil}\\b`, "i"));
      });
    });
  });

  it("adds working standard six-tab navigation only to Days 22 to 26", () => {
    expect(legacyNavigation).toContain("A2_DAYS_22_TO_26_PATHS");
    expect(legacyNavigation).toContain('button.type = "button"');
    expect(legacyNavigation).not.toContain("a2-day-21-ein-wochenende-planen-workbook");

    legacyDays22To26.forEach(({ route }) => {
      expect(legacyNavigation).toContain(route);
      expect(legacyNavigationImpl).toContain(route);
    });

    expect(legacyNavigationImpl).toContain("STANDARD_WORKBOOK_TABS");
    expect(legacyNavigationImpl).toContain("WorkbookTabNav");
    expect(legacyNavigationImpl).toContain("WorkbookReferenceAnswers");
    expect(legacyNavigationImpl).toContain("ContextualAssignmentSubmissionPage");
    expect(routeServices).toContain("A2LegacyStandardWorkbookNavigation");
    expect(routeServices).toContain("<A2LegacyStandardWorkbookNavigation />");
  });

  it("leaves Days 27 and 28 on their native working standard navigation", () => {
    [day27, day28].forEach((source) => {
      expect(source).toContain("STANDARD_WORKBOOK_TABS");
      expect(source).toContain("WorkbookTabNav");
      expect(source).toContain('activeTab === "submit"');
    });
  });

  it("shows Day 27 Goethe Hören without separate workbook questions or listening submission", () => {
    document.body.innerHTML = `
      <main class="layout-main">
        <header><p>Select Teil 1–4, Ref or Submit. Teil 1 is group practice; submit Teil 2, Teil 3 and Teil 4.</p></header>
        <details><p>Teil 2 · Schreiben, Teil 3 · Lesen and Teil 4 · Hören: complete the tasks and send only your final answers through the Submit tab.</p></details>
        <section id="day27-hoeren">
          <h2>Teil 4 · Hören (Assignment)</h2>
          <div id="day27-task">Hören Sie den Beitrag und beantworten Sie alle vier Fragen.</div>
          <img alt="Listening practice" />
          <div id="day27-questions">Was hat Miriam gestern verloren?</div>
          <p>Recommended video</p>
          <iframe title="Digitale Kommunikation (A2)"></iframe>
          <div role="note">Reminder: submit your final answers.</div>
        </section>
        <section id="day27-submit">
          <h2>Submit Workbook · Day 27 · Kapitel 10.27</h2>
          <div><h3>Submit Teil 2, Teil 3 and Teil 4.</h3><ul><li>Teil 4 · Hören: Paste your four listening answer letters.</li></ul></div>
        </section>
      </main>
    `;

    expect(
      cleanA2GoetheListeningOnlyWorkbook(
        document,
        "/campus/course/a2-day-27-digitale-kommunikation-workbook",
      ),
    ).toBe(true);
    expect(document.querySelector("#day27-task")).toBeNull();
    expect(document.querySelector("#day27-questions")).toBeNull();
    expect(document.querySelector("#day27-hoeren [role='note']")).toBeNull();
    expect(document.querySelector("#day27-hoeren iframe")).not.toBeNull();
    expect(document.querySelector("#day27-submit").textContent).not.toContain("four listening answer letters");
    expect(document.body.textContent).toContain("no separate workbook questions to submit");
  });

  it("shows Day 28 Goethe Hören without separate workbook questions or listening submission", () => {
    document.body.innerHTML = `
      <main class="layout-main">
        <details><p>Teil 2 · Schreiben, Teil 3 · Lesen and Teil 4 · Hören: complete the tasks and send only your final answers through the Submit tab.</p></details>
        <div id="day28-hoeren">
          <h2>Teil 4 (Hören)</h2>
          <p>Goethe-standard listening practice.</p>
          <iframe title="A2 Zukunftspläne listening practice"></iframe>
          <h3>Fragen zum Hören</h3>
          <div>1. Worum geht es im Video / Audio?</div>
          <div>2. Welche Zeitform passt oft zu Zukunftsplänen?</div>
          <div>3. Was sollst du nach dem Hören machen?</div>
          <p>Teil 4 is for self-check listening practice.</p>
        </div>
        <div id="day28-submit">
          <h2>Submit Workbook</h2>
          <p>Submit your required answers for A2 Day 28 here. Include your writing text and your reading/listening answer letters if required by your tutor.</p>
        </div>
      </main>
    `;

    expect(
      cleanA2GoetheListeningOnlyWorkbook(
        document,
        "/campus/course/a2-day-28-ueber-die-zukunft-sprechen-workbook",
      ),
    ).toBe(true);
    expect(document.querySelector("#day28-hoeren iframe")).not.toBeNull();
    expect(document.querySelector("#day28-hoeren").textContent).not.toContain("Fragen zum Hören");
    expect(document.querySelector("#day28-hoeren").textContent).not.toContain("Welche Zeitform passt");
    expect(document.querySelector("#day28-submit").textContent).not.toContain("reading/listening");
    expect(document.body.textContent).toContain("no separate Hören questions are provided");
  });

  it("keeps lesson-specific content and the approved YouTube Hören source", () => {
    expect(day18).toContain('hoerenAudioUrl="https://youtu.be/cHKVQOLWv7c"');
    expect(day20).toContain('title="Typische Reklamationssituationen üben"');
  });

  it("does not remount the rejected legacy A2 completion injector", () => {
    expect(routeServices).not.toContain("A2LegacyWorkbookCompletionTabs");
  });
});
