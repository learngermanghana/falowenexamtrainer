import {
  STANDARD_WORKBOOK_TABS,
  getWorkbookTabsWithLegacyGrammar,
} from "./StandardWorkbookComponents";
import { getA2B1WorkbookSectionProfile } from "./a2B1WorkbookSectionProfile";

const tabsFor = (ariaLabel) =>
  getWorkbookTabsWithLegacyGrammar({
    tabs: STANDARD_WORKBOOK_TABS,
    ariaLabel,
  }).tabs;

const tabKeysFor = (ariaLabel) => tabsFor(ariaLabel).map((tab) => tab.key);

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

  test("A2 Day 25 has no listening skill and renders Teil 4 as reading", () => {
    const profile = getA2B1WorkbookSectionProfile("A2", 25);
    const tabs = tabsFor("A2 Day 25 workbook sections");
    const part4 = tabs.find((tab) => tab.key === "hoeren");

    expect(profile.listening).toBe(false);
    expect(profile.part4).toBe("reading");
    expect(profile.grammar).toBe(false);
    expect(tabs.map((tab) => tab.key)).not.toContain("grammar");
    expect(part4).toMatchObject({ label: "Teil 4", description: "Lesen" });
  });

  test("ordinary A2 lessons keep listening by default", () => {
    const profile = getA2B1WorkbookSectionProfile("A2", 13);
    const tabs = tabKeysFor("A2 Day 13 workbook sections");

    expect(profile.listening).toBe(true);
    expect(profile.part4).toBe("listening");
    expect(tabs).toContain("hoeren");
  });

  test("ordinary B1 lessons keep listening by default", () => {
    const profile = getA2B1WorkbookSectionProfile("B1", 1);
    const tabs = tabKeysFor("B1 Day 1 workbook sections");

    expect(profile.listening).toBe(true);
    expect(profile.part4).toBe("listening");
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
