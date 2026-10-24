import {
  filterA2B1WorkbookTabsByProfile,
  getA2B1WorkbookSectionProfile,
} from "./a2B1WorkbookSectionProfile";
import { A2_B1_WORKBOOK_TABS_WITH_GRAMMAR } from "./StandardWorkbookComponents";

describe("A2/B1 workbook profile writing cadence", () => {
  test("A2 Day 2 hides Schreiben at the shared tab-profile layer", () => {
    const profile = getA2B1WorkbookSectionProfile("A2", 2);
    expect(profile.writing).toBe(false);
    const tabs = filterA2B1WorkbookTabsByProfile(A2_B1_WORKBOOK_TABS_WITH_GRAMMAR, profile);
    expect(tabs.map((tab) => tab.key)).toEqual([
      "grammar", "sprechen", "lesen", "hoeren", "references", "submit",
    ]);
  });

  test("A2 Day 3 still keeps Schreiben", () => {
    expect(getA2B1WorkbookSectionProfile("A2", 3).writing).toBe(true);
  });

  test("B1 cadence is also enforced by the shared profile", () => {
    expect(getA2B1WorkbookSectionProfile("B1", 2).writing).toBe(false);
    expect(getA2B1WorkbookSectionProfile("B1", 3).writing).toBe(true);
  });
});
