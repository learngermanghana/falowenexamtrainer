import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

const navigation = read("A2LegacyStandardWorkbookNavigation.js");
const routeServices = read("RouteScopedAppServices.js");

const workbooks = [
  {
    day: 21,
    file: "A2Day21EinWochenendePlanenWorkbookPage.js",
    marker: "Hauptzweig 5: Ausdrücke und Fragen",
    route: "/campus/course/a2-day-21-ein-wochenende-planen-workbook",
  },
  {
    day: 22,
    file: "A2Day22DieWochePlanungWorkbookPage.js",
    marker: "Arbeits- und Schulzeiten",
    route: "/campus/course/a2-day-22-die-woche-planung-workbook",
  },
  {
    day: 23,
    file: "A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage.js",
    marker: "Verschiedene Transportmittel",
    route: "/campus/course/a2-day-23-wie-kommst-du-zur-schule-oder-zur-arbeit-workbook",
  },
  {
    day: 24,
    file: "A2Day24EinenUrlaubPlanenWorkbookPage.js",
    marker: "Reiseziel und Zeitraum",
    route: "/campus/course/a2-day-24-einen-urlaub-planen-workbook",
  },
  {
    day: 25,
    file: "A2Day25TagesablaufWorkbookPage.js",
    marker: "Morgenroutine",
    route: "/campus/course/a2-day-25-tagesablauf-workbook",
  },
  {
    day: 26,
    file: "A2Day26GefuehleInVerschiedenenSituationenWorkbookPage.js",
    marker: "Positive Gefühle",
    route: "/campus/course/a2-day-26-gefuehle-in-verschiedenen-situationen-workbook",
  },
];

describe("A2 Days 21–26 standard workbook navigation", () => {
  it("uses the shared six-tab navigation for every affected route", () => {
    expect(navigation).toContain("STANDARD_WORKBOOK_TABS");
    expect(navigation).toContain("WorkbookTabNav");
    expect(navigation).toContain("WorkbookReferenceAnswers");
    expect(navigation).toContain("ContextualAssignmentSubmissionPage");

    workbooks.forEach(({ route }) => {
      expect(navigation).toContain(route);
    });

    expect(routeServices).toContain('import A2LegacyStandardWorkbookNavigation from "./A2LegacyStandardWorkbookNavigation"');
    expect(routeServices).toContain("<A2LegacyStandardWorkbookNavigation />");
  });

  it("preserves the complete lesson-specific workbook content", () => {
    workbooks.forEach(({ file, marker }) => {
      const source = read(file);
      expect(source).toContain(marker);
      expect(source).not.toContain("A2StandardTabbedWorkbookPage");
      expect(source.length).toBeGreaterThan(5000);
    });
  });
});
