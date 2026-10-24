import { getA2B1WorkbookSectionProfile } from "./a2B1WorkbookSectionProfile";
import {
  STANDARD_WORKBOOK_TABS,
  getWorkbookTabsWithLegacyGrammar,
} from "./StandardWorkbookComponents";

describe("A2 Day 25 canonical navigation", () => {
  test("the canonical lesson profile has no Teil 4", () => {
    const profile = getA2B1WorkbookSectionProfile("A2", 25);
    expect(profile).toMatchObject({
      listening: false,
      part4: null,
      part4Submission: "none",
    });
  });

  test("shared navigation therefore hides the old Hören/second-reading slot", () => {
    const tabs = getWorkbookTabsWithLegacyGrammar({
      tabs: STANDARD_WORKBOOK_TABS,
      ariaLabel: "A2 Day 25 workbook sections",
    }).tabs;

    expect(tabs.map((tab) => tab.key)).not.toContain("hoeren");
    expect(tabs.map((tab) => tab.key)).toEqual(
      expect.arrayContaining(["grammar", "sprechen", "lesen", "references", "submit"]),
    );
  });
});
