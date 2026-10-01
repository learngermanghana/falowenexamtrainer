import {
  STANDARD_WORKBOOK_TABS,
  getWorkbookTabsWithLegacyGrammar,
} from "./StandardWorkbookComponents";
import {
  getA2B1WorkbookIncludedSectionLabels,
  getA2B1WorkbookSectionProfile,
} from "./a2B1WorkbookSectionProfile";

const tabsFor = (ariaLabel) =>
  getWorkbookTabsWithLegacyGrammar({
    tabs: STANDARD_WORKBOOK_TABS,
    ariaLabel,
  }).tabs;

const tabKeysFor = (ariaLabel) => tabsFor(ariaLabel).map((tab) => tab.key);

describe("A2/B1 workbook section profiles", () => {
  test("A2 Day 14 omits Teil 4 while keeping Grammar", () => {
    const profile = getA2B1WorkbookSectionProfile("A2", 14);
    const tabs = tabKeysFor("A2 Day 14 workbook sections");

    expect(profile.listening).toBe(false);
    expect(profile.part4).toBeNull();
    expect(profile.part4Submission).toBe("none");
    expect(profile.grammar).toBe(true);
    expect(tabs).toContain("grammar");
    expect(tabs).not.toContain("hoeren");
  });

  test("A2 Day 25 follows its canonical no-listening lesson data", () => {
    const profile = getA2B1WorkbookSectionProfile("A2", 25);
    const tabs = tabKeysFor("A2 Day 25 workbook sections");

    expect(profile.listening).toBe(false);
    expect(profile.part4).toBeNull();
    expect(profile.part4Submission).toBe("none");
    expect(tabs).not.toContain("hoeren");
    expect(tabs).toEqual(expect.arrayContaining(["grammar", "sprechen", "lesen", "references", "submit"]));
  });

  test("A2 self-check and graded listening semantics come from lesson data", () => {
    const day21 = getA2B1WorkbookSectionProfile("A2", 21);
    const day24 = getA2B1WorkbookSectionProfile("A2", 24);

    expect(day21).toMatchObject({
      listening: true,
      part4: "listening",
      part4Submission: "self-check",
    });
    expect(day24).toMatchObject({
      listening: true,
      part4: "listening",
      part4Submission: "submit",
    });
  });

  test("B1 Day 22 exposes preserved Teil 4 as Lesen", () => {
    const profile = getA2B1WorkbookSectionProfile("B1", 22);
    const tabs = tabsFor("B1 Day 22 workbook sections");
    const part4 = tabs.find((tab) => tab.key === "hoeren");

    expect(profile.listening).toBe(false);
    expect(profile.part4).toBe("reading");
    expect(profile.part4Submission).toBe("submit");
    expect(part4).toMatchObject({ label: "Teil 4", description: "Lesen" });
  });

  test("B1 Day 23 has no Teil 4", () => {
    const profile = getA2B1WorkbookSectionProfile("B1", 23);
    const tabs = tabKeysFor("B1 Day 23 workbook sections");

    expect(profile.part4).toBeNull();
    expect(profile.part4Submission).toBe("none");
    expect(tabs).not.toContain("hoeren");
  });

  test("shows the actual included skills for A2 and B1 Course Book day cards", () => {
    expect(getA2B1WorkbookIncludedSectionLabels("A2", 7)).toEqual([
      "Grammar",
      "Sprechen",
      "Schreiben",
      "Lesen",
      "Hören",
    ]);

    expect(getA2B1WorkbookIncludedSectionLabels("A2", 14)).toEqual([
      "Grammar",
      "Sprechen",
      "Lesen",
    ]);

    expect(getA2B1WorkbookIncludedSectionLabels("B1", 22)).toEqual([
      "Grammar",
      "Sprechen",
      "Lesen",
    ]);

    expect(getA2B1WorkbookIncludedSectionLabels("B1", 23)).toEqual([
      "Grammar",
      "Sprechen",
      "Schreiben",
      "Lesen",
    ]);
  });

  test("unknown tabs are preserved so page-specific extensions remain safe", () => {
    const result = getWorkbookTabsWithLegacyGrammar({
      tabs: [{ key: "custom", label: "Custom" }],
      ariaLabel: "A2 Day 14 workbook sections",
    });

    expect(result.tabs).toEqual([{ key: "custom", label: "Custom" }]);
  });
});
