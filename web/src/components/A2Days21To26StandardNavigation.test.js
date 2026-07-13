import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

const navigation = read("A2LegacyStandardWorkbookNavigation.js");
const routeServices = read("RouteScopedAppServices.js");

const workbooks = [
  {
    day: 21,
    file: "A2Day21EinWochenendePlanenWorkbookPage.js",
    route: "/campus/course/a2-day-21-ein-wochenende-planen-workbook",
  },
  {
    day: 22,
    file: "A2Day22DieWochePlanungWorkbookPage.js",
    route: "/campus/course/a2-day-22-die-woche-planung-workbook",
  },
  {
    day: 23,
    file: "A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage.js",
    route: "/campus/course/a2-day-23-wie-kommst-du-zur-schule-oder-zur-arbeit-workbook",
  },
  {
    day: 24,
    file: "A2Day24EinenUrlaubPlanenWorkbookPage.js",
    route: "/campus/course/a2-day-24-einen-urlaub-planen-workbook",
  },
  {
    day: 25,
    file: "A2Day25TagesablaufWorkbookPage.js",
    route: "/campus/course/a2-day-25-tagesablauf-workbook",
  },
  {
    day: 26,
    file: "A2Day26GefuehleInVerschiedenenSituationenWorkbookPage.js",
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

    expect(routeServices).toContain("A2LegacyStandardWorkbookNavigation");
    expect(routeServices).toContain("<A2LegacyStandardWorkbookNavigation />");
  });

  it("preserves full lesson pages instead of reduced standard-shell wrappers", () => {
    workbooks.forEach(({ file }) => {
      const source = read(file);

      expect(source).not.toContain("A2StandardTabbedWorkbookPage");
      expect(source.length).toBeGreaterThan(2000);
      [1, 2, 3, 4].forEach((teil) => {
        expect(source).toMatch(new RegExp(`Teil\\s*${teil}\\b`, "i"));
      });
    });
  });
});
