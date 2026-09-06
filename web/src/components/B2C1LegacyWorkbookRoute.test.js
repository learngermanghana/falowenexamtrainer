import { __TESTING__ as b2Day1 } from "./B2Day1PersoenlicheIdentitaetWorkbookPage";
import { __TESTING__ as c1Day1 } from "./C1Day1WillkommenSelbstlernstartWorkbookPage";
import { __TESTING__ as c1Day10 } from "./C1Day10IntegrationUndGesellschaftWorkbookPage";
import { __TESTING__ as c1Day11 } from "./C1Day11EngagementUndEhrenamtWorkbookPage";
import { __TESTING__ as c1Day12 } from "./C1Day12FreizeitUndKulturWorkbookPage";
import { __TESTING__ as c1Day13 } from "./C1Day13MehrsprachigkeitWorkbookPage";
import { __TESTING__ as c1Day14 } from "./C1Day14InnovationUndZukunftWorkbookPage";
import { __TESTING__ as c1Day15 } from "./C1Day15BildungUndLebenslangesLernenWorkbookPage";
import { __TESTING__ as c1Day16 } from "./C1Day16TechnologieImAlltagWorkbookPage";
import { getWorkbookTabsForLevel } from "./StandardWorkbookComponents";

const legacyRoutes = [
  ["B2", 1, b2Day1.B2_DAY1_WORKBOOK_ROUTE],
  ["C1", 1, c1Day1.C1_DAY1_WORKBOOK_ROUTE],
  ["C1", 10, c1Day10.C1_DAY10_WORKBOOK_ROUTE],
  ["C1", 11, c1Day11.C1_DAY11_WORKBOOK_ROUTE],
  ["C1", 12, c1Day12.C1_DAY12_WORKBOOK_ROUTE],
  ["C1", 13, c1Day13.C1_DAY13_WORKBOOK_ROUTE],
  ["C1", 14, c1Day14.C1_DAY14_WORKBOOK_ROUTE],
  ["C1", 15, c1Day15.C1_DAY15_WORKBOOK_ROUTE],
  ["C1", 16, c1Day16.C1_DAY16_WORKBOOK_ROUTE],
];

describe("B2/C1 legacy workbook routes", () => {
  test.each(legacyRoutes)("%s Day %s uses the canonical self-learning lesson", (level, day, route) => {
    const url = new URL(route, "https://www.falowen.app");

    expect(url.pathname).toBe(`/campus/course/lesson/${level}/${day}`);
    expect(url.searchParams.get("view")).toBe("workbook");
    expect(route.toLowerCase()).not.toContain("hoeren");
    expect(route.toLowerCase()).not.toContain("hören");
  });

  test.each(["B2", "C1"])("%s shared workbook tabs do not expose Hören", (level) => {
    const tabKeys = getWorkbookTabsForLevel(level).map((tab) => String(tab.key).toLowerCase());
    const tabLabels = getWorkbookTabsForLevel(level).map((tab) => String(tab.label).toLowerCase());

    expect(tabKeys).not.toContain("hoeren");
    expect(tabKeys).not.toContain("hören");
    expect(tabLabels).not.toContain("hoeren");
    expect(tabLabels).not.toContain("hören");
  });
});
