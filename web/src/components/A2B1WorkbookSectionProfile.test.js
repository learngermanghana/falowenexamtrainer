import {
  STANDARD_WORKBOOK_TABS,
  getWorkbookTabsWithLegacyGrammar,
} from "./StandardWorkbookComponents";
import { getA2B1WorkbookSectionProfile } from "./a2B1WorkbookSectionProfile";

const tabKeysFor = (ariaLabel) =>
  getWorkbookTabsWithLegacyGrammar({
    tabs: STANDARD_WORKBOOK_TABS,
    ariaLabel,
  }).tabs.map((tab) => tab.key);

describe("A2/B1 workbook section profiles", () => {
  test("A2 Day 14 explicitly omits listening while keeping its grammar section", () => {
    const profile = getA2B1WorkbookSectionProfile("A2", 14);
    const tabs = tabKeysFor("A2 Day 14 workbook sections");

    expect(profile.listening).toBe(false);
    expect(profile.grammar).toBe(true);
    expect(tabs).toContain("grammar");
    expect(tabs).not.toContain("hoeren");
    expect(tabs).toEqual(expect.arrayContaining(["sprechen", "schreiben", "lesen", "references", "submit"]));
  });

  test("ordinary A2 lessons keep listening by default", () => {
    const profile = getA2B1WorkbookSectionProfile("A2", 13);
    const tabs = tabKeysFor("A2 Day 13 workbook sections");

    expect(profile.listening).toBe(true);
    expect(tabs).toContain("hoeren");
  });

  test("ordinary B1 lessons keep listening by default", () => {
    const profile = getA2B1WorkbookSectionProfile("B1", 1);
    const tabs = tabKeysFor("B1 Day 1 workbook sections");

    expect(profile.listening).toBe(true);
    expect(tabs).toContain("hoeren");
  });

  test("unknown tabs are preserved so page-specific extensions remain safe", () => {
    const result = getWorkbookTabsWithLegacyGrammar({
      tabs: [{ key: "custom", label: "Custom" }],
      ariaLabel: "A2 Day 14 workbook sections",
    });

    expect(result.tabs).toEqual([{ key: "custom", label: "Custom" }]);
  });
});
